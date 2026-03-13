import React, {useEffect, useState} from "react";
import { Link, useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import { ArrowLeftIcon, Briefcase, FileText, FolderIcon, GraduationCap, Icon, Sparkle, User, ChevronLeft, ChevronRight } from "lucide-react";
import PersonnalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/resumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";



const ResumeBuilder = () => {

  const {resumeId} = useParams()


  const [resumeData, setResumeData] = useState({
    _id:'',
    title: '',
    personal_info: {},
    professonal_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color:"#3b82f6",
    public: false,
  })

  const loadExistingResume = async () => {
    const resume = dummyResumeData.find(resume => resume._id === resumeId)
    if(resume){
      setResumeData(resume)
      document.title = resume.title
    }
  }

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)

  const sections = [
    {id: "personal", name: "Personal Info", icon: User},
    {id: "summary", name: "Summary", icon: FileText},
    {id: "experience", name: "Experience", icon: Briefcase},
    {id: "education", name: "Education", icon: GraduationCap},
    {id: "project", name: "Projects", icon: FolderIcon},
    {id: "skills", name: "Skills", icon: Sparkle},
  ]

  const activeSection = sections[activeSectionIndex]

  useEffect(() => {
    loadExistingResume()
  },[])

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
              <hr className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-600 border-none transition-all duration-2000" style={{width: `${activeSectionIndex * 100 / (sections.length - 1)}%`}}/>

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
                  <ProfessionalSummaryForm data={resumeData.professonal_summary} onChange={(data) => setResumeData(prev => ({...prev, professonal_summary: data}))}/>
                )}
                {/* other sections like experience, education, projects, skills would go here */}
              </div>

            </div>
            
          </div>

          {/*Right Panel - Preview */}
          <div className="lg:col-span-7 max-lg:mt-6 flex justify-center">
            <div>
              {/* ---buttons --- */}
            </div>

            <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color}/>

          </div>
        </div>

      </div>

    </div>
  )
}

export default ResumeBuilder;

