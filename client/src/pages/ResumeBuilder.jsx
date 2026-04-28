import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";
import {
  ArrowLeftIcon,
  Briefcase,
  FileText,
  FolderIcon,
  GraduationCap,
  Sparkles,
  User,
  ChevronLeft,
  ChevronRight,
  Share2Icon,
  EyeIcon,
  EyeOffIcon,
  DownloadIcon,
} from "lucide-react";
import PersonnalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/resumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsForm";

const normalizeResume = (resume) => {
  const { project, projects, ...rest } = resume || {};

  return {
    ...rest,
    professional_summary: resume?.professional_summary || "",
    projects: project || projects || [],
    experience: resume?.experience || [],
    education: resume?.education || [],
    skills: resume?.skills || [],
  };
};

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    projects: [],
    skills: [],
    template: "classic",
    accent_color: "#3b82f6",
    public: false,
  });

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzingJob, setIsAnalyzingJob] = useState(false);
  const [jobMatchResult, setJobMatchResult] = useState(null);

  const savedSnapshotRef = useRef("");
  const hasInitializedRef = useRef(false);
  const autosaveTimeoutRef = useRef(null);
  const saveInFlightRef = useRef(false);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];

  const loadExistingResume = async () => {
    try {
      const { data } = await api.get(`/api/resumes/get/${resumeId}`, {
        headers: { Authorization: token },
      });

      const normalizedResume = normalizeResume(data.resume);
      setResumeData((prev) => ({ ...prev, ...normalizedResume }));

      savedSnapshotRef.current = JSON.stringify(normalizedResume);
      hasInitializedRef.current = true;
      setHasUnsavedChanges(false);
      setLastSavedAt(new Date());
      document.title = normalizedResume.title || "Resume Builder";
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load resume");
    }
  };

  const saveResume = async ({ silent = false } = {}) => {
    if (!token) return;
    if (saveInFlightRef.current) return;

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
      autosaveTimeoutRef.current = null;
    }

    saveInFlightRef.current = true;
    if (!silent) setIsSaving(true);
    try {
      const updatedResumeData = structuredClone(resumeData);

      // Keep API payload aligned with schema: server persists `project`, not `projects`.
      updatedResumeData.project = updatedResumeData.projects || [];
      delete updatedResumeData.projects;

      if (typeof resumeData.personal_info?.image === "object") {
        delete updatedResumeData.personal_info.image;
      }

      const formData = new FormData();
      formData.append("resumeData", JSON.stringify(updatedResumeData));
      if (removeBackground) formData.append("removeBackground", "yes");
      if (typeof resumeData.personal_info?.image === "object") {
        formData.append("image", resumeData.personal_info.image);
      }

      const { data } = await api.put(`/api/resumes/update/${resumeId}`, formData, {
        headers: { Authorization: token },
      });

      const normalizedResume = normalizeResume(data.resume);
      setResumeData((prev) => ({ ...prev, ...normalizedResume }));

      savedSnapshotRef.current = JSON.stringify(normalizedResume);
      setHasUnsavedChanges(false);
      setLastSavedAt(new Date());

      if (!silent) {
        toast.success(data.message || "Resume saved successfully");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || (silent ? "Autosave failed" : "Failed to save resume")
      );
    } finally {
      saveInFlightRef.current = false;
      if (!silent) setIsSaving(false);
    }
  };

  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData();
      formData.append("resumeData", JSON.stringify({ public: !resumeData.public }));

      const { data } = await api.put(`/api/resumes/update/${resumeId}`, formData, {
        headers: { Authorization: token },
      });

      const normalizedResume = normalizeResume(data.resume);
      setResumeData((prev) => ({ ...prev, ...normalizedResume }));

      savedSnapshotRef.current = JSON.stringify(normalizedResume);
      setHasUnsavedChanges(false);
      setLastSavedAt(new Date());
      toast.success(data.message || "Visibility updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update visibility");
    }
  };

  const handleShare = () => {
    const frontendUrl = window.location.href.split("/app/")[0];
    const resumeUrl = `${frontendUrl}/view/${resumeData._id}`;

    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: "My Resume" });
      return;
    }

    navigator.clipboard
      .writeText(resumeUrl)
      .then(() => toast.success("Link copied to clipboard"))
      .catch(() => toast.error("Unable to copy link"));
  };

  const downloadResume = () => {
    const resumeEl = document.getElementById("resume-preview");
    if (!resumeEl) return;

    let allStyles = "";
    Array.from(document.styleSheets).forEach((sheet) => {
      try {
        Array.from(sheet.cssRules).forEach((rule) => {
          allStyles += rule.cssText + "\n";
        });
      } catch (_) {}
    });

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>${allStyles}</style>
  <style>
    @page { size: letter; margin: 0; }
    html, body { margin: 0; padding: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  </style>
</head>
<body>${resumeEl.outerHTML}</body>
</html>`;

    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 300);
  };

  const analyzeJobMatch = async () => {
    if (!jobDescription.trim()) {
      toast.error("Paste a job description first");
      return;
    }

    setIsAnalyzingJob(true);
    try {
      const payload = {
        ...resumeData,
        project: resumeData.projects,
      };

      const { data } = await api.post(
        "/api/ai/job-match",
        { resumeData: payload, jobDescription },
        { headers: { Authorization: token } }
      );

      setJobMatchResult(data);
      toast.success("Job match analyzed");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to analyze job match");
    } finally {
      setIsAnalyzingJob(false);
    }
  };

  const applyMissingKeywordsToSkills = () => {
    if (!jobMatchResult?.missingKeywords?.length) return;

    const existing = new Set((resumeData.skills || []).map((s) => String(s).toLowerCase()));
    const additions = jobMatchResult.missingKeywords.filter((k) => !existing.has(String(k).toLowerCase()));

    if (!additions.length) {
      toast("All suggested keywords are already in your skills");
      return;
    }

    setResumeData((prev) => ({ ...prev, skills: [...(prev.skills || []), ...additions.slice(0, 8)] }));
    toast.success("Added suggested keywords to skills");
  };

  useEffect(() => {
    const run = async () => {
      setIsLoadingResume(true);
      await loadExistingResume();
      setIsLoadingResume(false);
    };

    if (token) {
      run();
    }
  }, [resumeId, token]);

  useEffect(() => {
    if (!hasInitializedRef.current) return;

    const currentSnapshot = JSON.stringify(resumeData);
    setHasUnsavedChanges(currentSnapshot !== savedSnapshotRef.current);
  }, [resumeData]);

  useEffect(() => {
    if (!hasUnsavedChanges || isSaving || saveInFlightRef.current) return;

    autosaveTimeoutRef.current = setTimeout(() => {
      saveResume({ silent: true });
    }, 1800);

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
        autosaveTimeoutRef.current = null;
      }
    };
  }, [hasUnsavedChanges, isSaving, resumeData, removeBackground]);

  if (isLoadingResume) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-slate-500">Loading resume...</div>;
  }

  return (
    <div>
      <div className="max-w-7xl mx-4 py-6">
        <Link
          to="/app"
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeftIcon className="size-4" /> back to dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 pt-1">
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
              <hr
                className="absolute top-0 left-0 h-1 bg-linear-to-r from-green-600 border-none transition-all duration-2000"
                style={{ width: `${(activeSectionIndex * 100) / (sections.length - 1)}%` }}
              />

              <div className="flex justify-between items-center mb-6 border-b border-gray-200 py-1">
                <div className="flex items-center gap-2">
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={(template) => setResumeData((prev) => ({ ...prev, template }))}
                  />
                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={(color) => setResumeData((prev) => ({ ...prev, accent_color: color }))}
                  />
                  {/* Autosave is intentionally silent in UI. */}
                </div>

                <div className="flex items-center">
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() => setActiveSectionIndex((prevIndex) => Math.max(prevIndex - 1, 0))}
                      className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                      disabled={activeSectionIndex === 0}
                    >
                      <ChevronLeft className="size-4" /> Previous
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setActiveSectionIndex((prevIndex) => Math.min(prevIndex + 1, sections.length - 1))
                    }
                    className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${
                      activeSectionIndex === sections.length - 1 && "opacity-50"
                    }`}
                    disabled={activeSectionIndex === sections.length - 1}
                  >
                    Next <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {activeSection.id === "personal" && (
                  <PersonnalInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, personal_info: data }))}
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}
                {activeSection.id === "summary" && (
                  <ProfessionalSummaryForm
                    data={resumeData.professional_summary}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        professional_summary: data,
                      }))
                    }
                  />
                )}
                {activeSection.id === "experience" && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, experience: data }))}
                  />
                )}
                {activeSection.id === "education" && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, education: data }))}
                  />
                )}
                {activeSection.id === "projects" && (
                  <ProjectForm
                    data={resumeData.projects}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, projects: data }))}
                  />
                )}
                {activeSection.id === "skills" && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, skills: data }))}
                  />
                )}
              </div>

              <button
                disabled={isSaving}
                onClick={() => saveResume()}
                className="bg-linear-to-br from-red-100 to-red-200 ring-red-300 text-red-600 ring hover:ring-red-400 transition-all rounded-md px-6 py-2 mt-6 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save changes"}
              </button>

              <div className="mt-6 rounded-lg border border-slate-200 p-4 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-800">Job Match Analyzer</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Paste a job description to see how well this resume matches and what to improve.
                </p>

                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste job description here..."
                  className="mt-3 w-full min-h-28 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                />

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={analyzeJobMatch}
                    disabled={isAnalyzingJob}
                    className="px-3 py-2 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isAnalyzingJob ? "Analyzing..." : "Analyze Match"}
                  </button>

                  {jobMatchResult && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        jobMatchResult.score >= 75
                          ? "bg-emerald-100 text-emerald-700"
                          : jobMatchResult.score >= 50
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      Match Score: {jobMatchResult.score}%
                    </span>
                  )}
                </div>

                {jobMatchResult && (
                  <div className="mt-4 space-y-3 text-sm">
                    <div>
                      <p className="font-medium text-slate-700">Matched Keywords</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {jobMatchResult.matchedKeywords?.length ? (
                          jobMatchResult.matchedKeywords.map((keyword) => (
                            <span key={keyword} className="text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-700">
                              {keyword}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500">No strong matches yet.</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-slate-700">Missing Keywords</p>
                        <button
                          onClick={applyMissingKeywordsToSkills}
                          className="text-xs px-2 py-1 rounded border border-slate-300 hover:bg-white"
                        >
                          Add to Skills
                        </button>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {jobMatchResult.missingKeywords?.length ? (
                          jobMatchResult.missingKeywords.map((keyword) => (
                            <span key={keyword} className="text-xs px-2 py-1 rounded bg-rose-100 text-rose-700">
                              {keyword}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500">Great match. No critical missing keywords found.</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-slate-700">Recommendations</p>
                      <ul className="mt-1 list-disc list-inside text-slate-600 space-y-1">
                        {(jobMatchResult.recommendations || []).map((tip) => (
                          <li key={tip}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="relative w-full">
              <ResumePreview
                data={{ ...resumeData, project: resumeData.projects || [] }}
                template={resumeData.template}
                accentColor={resumeData.accent_color}
              />
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2">
                {resumeData.public && (
                  <button
                    onClick={handleShare}
                    className="flex items-center p-2 px-4 gap-2 text-xs bg-linear-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring ring-blue-300 hover:ring-blue-400 transition-colors"
                  >
                    <Share2Icon className="size-4" />
                  </button>
                )}
                <button
                  onClick={changeResumeVisibility}
                  className="flex items-center p-2 px-4 gap-2 text-xs bg-linear-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring ring-blue-300 hover:ring-blue-400 transition-colors"
                >
                  {resumeData.public ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
                  {resumeData.public ? "Public" : "Private"}
                </button>
                <button
                  onClick={downloadResume}
                  className="flex items-center p-2 px-4 gap-2 text-xs bg-linear-to-br from-gray-100 to-gray-200 text-gray-600 rounded-lg ring ring-gray-300 hover:ring-gray-400 transition-colors"
                >
                  <DownloadIcon className="size-4" /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
