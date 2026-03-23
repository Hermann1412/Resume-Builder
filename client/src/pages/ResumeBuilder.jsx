import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
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


const ResumeBuilder = () => {

  const {resumeId} = useParams()


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

  const loadExistingResume = async () => {
    const resume = dummyResumeData.find((item) => item._id === resumeId);
    if (resume) {
      setResumeData((prev) => ({
        ...prev,
        ...resume,
        professional_summary:
          resume.professional_summary || resume.professonal_summary || "",
        projects: resume.projects || resume.project || [],
        experience: resume.experience || [],
        education: resume.education || [],
        skills: resume.skills || [],
      }));
      document.title = resume.title;
    }
  };

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];

  useEffect(() => {
    loadExistingResume();
  }, [resumeId]);

  const changeResumeVisibiliy = async () => {
    setResumeData ({...resumeData, public: !resumeData.public})
  }

  const handleShare = () => {
    const frontendUrl = window.location.href.split('/app/')[0];
    const resumeUrl = frontendUrl + '/view/' + resumeData._id;

    if (navigator.share) {
      navigator.share({url: resumeUrl, text: "My Resume", })
    }else {
      alert('share not suported on this browser.')
    }
  }

  const downloadResume = () => {
    window.print();
  }

  return (
    <div>

      <div className="max-w-7xl mx-4 py-6">
        <Link to={'/app'} className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all">
          <ArrowLeftIcon className="size-4"/> back to dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Panel - Form*/}
          <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 pt-1">
              {/*progress bar using activeSectionIndex*/}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200"/>
              <hr className="absolute top-0 left-0 h-1 bg-linear-to-r from-green-600 border-none transition-all duration-2000" style={{width: `${activeSectionIndex * 100 / (sections.length - 1)}%`}}/>

              {/* Section Navigation*/}
              <div className="flex justify-between items-center mb-6 border-b border-gray-200 py-1">
                <div className="flex items-center gap-2">
                  <TemplateSelector selectedTemplate={resumeData.template} onChange={(template)=> setResumeData(prev => ({...prev, template}))}/>
                  <ColorPicker selectedColor={resumeData.accent_color} onChange={(color)=>setResumeData(prev =>({...prev, accent_color:color}))}/>
                </div>

                <div className="flex items-center">
                  {activeSectionIndex !== 0 && (
                    <button onClick={()=> setActiveSectionIndex((prevIndex)=> Math.max(prevIndex - 1, 0))} className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all" disabled={activeSectionIndex === 0}>
                      <ChevronLeft className="size-4"/> Previous

                    </button>
                  )}

                  <button onClick={()=> setActiveSectionIndex((prevIndex)=> Math.min(prevIndex + 1, sections.length - 1))} className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 && 'opacity-50'}`} disabled={activeSectionIndex === sections.length - 1}>
                      Next <ChevronRight className="size-4"/>

                    </button>

                </div>

              </div>
              {/* form Content*/}
              <div className='space-y-6'>
                {activeSection.id === "personal" && (
                  <PersonnalInfoForm data={resumeData.personal_info} onChange={(data) => setResumeData(prev => ({...prev,personal_info: data}))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground}/>
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
                  <ExperienceForm data={resumeData.experience} onChange={(data) => setResumeData(prev => ({...prev, experience: data}))}/>
                )}
                 {activeSection.id === "education" && (
                  <EducationForm data={resumeData.education} onChange={(data) => setResumeData(prev => ({...prev, education: data}))}/>
                )}
                {activeSection.id === "projects" && (
                  <ProjectForm data={resumeData.projects} onChange={(data) => setResumeData(prev => ({...prev, projects: data}))}/>
                )}
                {activeSection.id === "skills" && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(data) =>
                      setResumeData((prev) => ({ ...prev, skills: data }))
                    }
                  />
                )}
              </div>
                <button className="bg-linear-to-br from-red-100 to red-red-200 ring-red-300 text-red-600 ring hover:ring-red-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm">
                  Save changes
                </button>
            </div>
            
          </div>

          {/*Right Panel - Preview */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="relative w-full">
              <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color}/>
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2">
                {resumeData.public && (
                  <button onClick={handleShare} className="flex items-center p-2 px-4 gap-2 text-xs bg-linear-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring ring-blue-300 hover:ring-blue-400 transition-colors">
                    <Share2Icon className="size-4"/>
                  </button>
                )}
                <button onClick={changeResumeVisibiliy} className="flex items-center p-2 px-4 gap-2 text-xs bg-linear-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring ring-blue-300 hover:ring-blue-400 transition-colors">
                  {resumeData.public ? <EyeIcon className="size-4"/> : <EyeOffIcon className="size-4"/>}
                  {resumeData.public ? 'Public' : 'Private'}
                </button>
                <button onClick={downloadResume} className="flex items-center p-2 px-4 gap-2 text-xs bg-linear-to-br from-gray-100 to-gray-200 text-gray-600 rounded-lg ring ring-gray-300 hover:ring-gray-400 transition-colors">
                  <DownloadIcon className="size-4"/> Download
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default ResumeBuilder;

