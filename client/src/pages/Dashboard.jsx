import {
  FilePenIcon,
  LoaderCircle,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloud,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../configs/api";
import pdfToText from 'react-pdftotext';

const Dashboard = () => {

  const {user, token} = useSelector(state => state.auth);

  const colors = [
    "#997afc",
    "#fca5a5",
    "#6ee7b7",
    "#fcd34d",
    "#38bdf8",
    "#f9a8d4",
  ];

  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
  const [isFetchingResumes, setIsFetchingResumes] = useState(true);
  const navigate = useNavigate();

  const loadAllResumes = async () => {
    if (!token) {
      setIsFetchingResumes(false);
      return;
    }

    setIsFetchingResumes(true);
    try {
      const { data } = await api.get('/api/users/resumes', {
        headers: { Authorization: token },
      });
      const sortedResumes = [...data.resumes].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setAllResumes(sortedResumes);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load resumes');
    } finally {
      setIsFetchingResumes(false);
    }
  };

  const createResume = async (event) => {
    event.preventDefault();

    const cleanTitle = title.trim();
    if (!cleanTitle) {
      toast.error("Please enter a resume title");
      return;
    }

    setIsCreating(true);
    try {
      const {data} = await api.post('/api/resumes/create', {title: cleanTitle}, {headers: {Authorization: token}});
      setAllResumes(prev => [...prev, data.resume]);
      setTitle("");
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`);
    }catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create resume")
    } finally {
      setIsCreating(false);
    }
  };

  const uploadResume = async (event) => {
    event.preventDefault();

    if (!resume) {
      toast.error("Please select a PDF file first");
      return;
    }

    setIsUploading(true);
    try {
      const resumeText = await pdfToText(resume);
      const {data} = await api.post('/api/ai/upload-resume', {title, resumeText}, {headers: {Authorization: token}});
      const targetResumeId = data.resumeId || data.resume?._id;

      if (!targetResumeId) {
        throw new Error("Resume ID not returned from server");
      }

      setTitle('');
      setResume(null);
      setShowUploadResume(false);
      navigate(`/app/builder/${targetResumeId}`);
    }catch (error) {
      toast.error(error?.response?.data?.message || "Failed to upload resume");
    } finally {
      setIsUploading(false);
    }
  };

  const editTitle = async (event) => {
    event.preventDefault();
    setIsUpdatingTitle(true);
    try {
      const { data } = await api.put(
        `/api/resumes/update/${editResumeId}`,
        { resumeData: JSON.stringify({ title }) },
        { headers: { Authorization: token } }
      );
      setAllResumes(prev =>
        prev.map(r => (r._id === editResumeId ? { ...r, title: data.resume.title } : r))
      );
      setEditResumeId('');
      setTitle('');
      toast.success('Title updated');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update title');
    } finally {
      setIsUpdatingTitle(false);
    }
  };

  const deleteResume = async (resumeId) => {
    const confirm = window.confirm('Are you sure want to delete this resume?');
    if (confirm) {
      const previousResumes = allResumes;
      setAllResumes(prev => prev.filter((resume) => resume._id !== resumeId));

      try {
        await api.delete(`/api/resumes/delete/${resumeId}`, {
          headers: { Authorization: token },
        });
        toast.success('Resume deleted');
      } catch (error) {
        setAllResumes(previousResumes);
        toast.error(error?.response?.data?.message || 'Failed to delete resume');
      }
    }
  };

  useEffect(() => {
    loadAllResumes();
  }, [token]);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-2xl font-medium mb-6 bg-linear-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
          Welcome, {user?.name}
        </p>

        {/* Primary actions */}
        <div className="flex gap-4">
          <button
            onClick={() => setShowCreateResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-red-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <PlusIcon className="size-11 p-2.5 bg-linear-to-br from-red-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-red-600 transition-all duration-300">
              Create Resume
            </p>
          </button>

          <button
            onClick={() => setShowUploadResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-orange-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <UploadCloudIcon className="size-11 p-2.5 bg-linear-to-br from-orange-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-orange-600 transition-all duration-300">
              Upload Existing Resume
            </p>
          </button>
        </div>

        <hr className="border-slate-300 my-6" />

        {/* Resume Cards */}
        {isFetchingResumes ? (
          <div className="grid grid-cols-2 sm:flex flex-wrap gap-4 py-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="w-full sm:max-w-36 h-48 rounded-lg border border-slate-200 bg-slate-100/70 animate-pulse"
              />
            ))}
          </div>
        ) : (
        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {allResumes.map((resume, index) => {
            const baseColor = colors[index % colors.length];

            return (
              <button
                key={resume._id}
                onClick={() => navigate(`/app/builder/${resume._id}`)}
                className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                  borderColor: baseColor + "40",
                }}
              >
                <FilePenIcon
                  className="size-7 group-hover:scale-105 transition-all"
                  style={{ color: baseColor }}
                />

                <p
                  className="text-sm group-hover:scale-105 transition-all px-2 text-center"
                  style={{ color: baseColor }}
                >
                  {resume.title}
                </p>

                <p
                  className="absolute bottom-1 text-[11px] px-2 text-center"
                  style={{ color: baseColor + "90" }}
                >
                  Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                </p>

                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-1 right-1 group-hover:flex items-center hidden"
                >
                  <TrashIcon
                    onClick={() => deleteResume(resume._id)}
                    className="size-7 p-1.5 hover:bg-white/50 rounded transition-colors"
                    style={{ color: baseColor + "90" }}
                  />
                  <PencilIcon
                    onClick={() => {
                      setEditResumeId(resume._id);
                      setTitle(resume.title);
                    }}
                    className="size-7 p-1.5 hover:bg-white/50 rounded transition-colors"
                    style={{ color: baseColor + "90" }}
                  />
                </div>
              </button>
            );
          })}
        </div>
        )}

        {showCreateResume && (
          <form
            onSubmit={createResume}
            onClick={() => setShowCreateResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 rounded-md w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Create a Resume</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py mb focus:border-green-600 ring-green-600"
                required
              />

              <button disabled={isCreating} className="w-full py-2 bg-green-600 text-white rounded hover:text-slate-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                {isCreating ? "Creating..." : "Create Resume"}
              </button>
              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowCreateResume(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}

        {showUploadResume && (
          <form
            onSubmit={uploadResume}
            onClick={() => setShowUploadResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 rounded-md w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Upload Resume</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py mb focus:border-green-600 ring-green-600"
                required
              />
              <div>
                <label
                  htmlFor="resume-input"
                  className="block text-sm text-slate-700"
                >
                  select resume file
                  <div className="flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-red-500 hover:text-red-700 cursor-pointer transition-colors">
                    {resume ? (
                      <p className="text-red-700">{resume.name}</p>
                    ) : (
                      <>
                        <UploadCloud className="size-14 stroke-1" />
                        <p>Upload resume</p>
                      </>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id="resume-input"
                  accept=".pdf"
                  hidden
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </div>
              <button disabled={isUploading} className="w-full py-2 bg-green-600 text-white rounded hover:text-slate-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                {isUploading && <LoaderCircle className="size-4 mr-2 animate-spin" />}
                {isUploading ? "Uploading..." : "Upload resume"}
              </button>
              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowUploadResume(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}

        {editResumeId && (
          <form
            onSubmit={editTitle}
            onClick={() => setEditResumeId("")}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 rounded-md w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py mb focus:border-green-600 ring-green-600"
                required
              />

              <button disabled={isUpdatingTitle} className="w-full py-2 bg-green-600 text-white rounded hover:text-slate-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                {isUpdatingTitle ? "Updating..." : "Update"}
              </button>
              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setEditResumeId("");
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
