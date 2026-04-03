import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import Loader from "../components/Loader";
import ResumePreview from "../components/resumePreview";
import api from "../configs/api";

const Preview = () => {

  const { resumeId } = useParams()

  const [isLoading, setIsLoading] = useState(true)

  const [resumeData, setResumeData] = useState(null)

  const loadResume = async () => {
    try {
      const {data} = await api.get(`/api/resumes/public/` + resumeId);
      setResumeData(data.resume);
    }catch (error) {
      console.log(error.message);
    }finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
   loadResume() 
  }, [resumeId])
  return resumeData ? (
    <div className='bg-slate-100'>
      <div className="max-w-3xl mx-auto py-10">
        <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} className="py-4 bg-white"/>
      </div>
    </div>
  ) : (
    <div>
      {isLoading ? <Loader/> : (
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-center text-6xl text-slate-400 font-medium">Resume not found</p>
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-all">
            <ArrowLeftIcon className="mr-2 size-4"/>
            go to home page
          </Link>
        </div>
      )}
    </div>
  )
}

export default Preview;