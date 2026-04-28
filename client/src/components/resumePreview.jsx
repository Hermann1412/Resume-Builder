import React from 'react'
import ModernTemplate from './templates/ModernTemplate'
import ClassicTemplate from './templates/ClassicTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'

const ResumePreview = ({data, template, accentColor, classes = ""}) => {

    const renderTemplate = () => {
        switch(template){
            case "modern":
              return <ModernTemplate data={data} accentColor={accentColor} />;
            case "minimal":
              return <MinimalTemplate data={data} accentColor={accentColor} />;
            case "minimal-image":
              return <MinimalImageTemplate data={data} accentColor={accentColor} removeImage={true} />;
            
            default:
              return <ClassicTemplate data={data} accentColor={accentColor} />;
        }
    }

  return (
    <div className='w-full bg-gray-100'>
      <div id="resume-preview" className={'border border-gray-200 print:shadow-none print:border-none' + classes}>
        {renderTemplate()}
      </div>
      
      <style>
        {`
          @page { size: letter; margin: 0; }
          @media print {
            html, body {
              margin: 0;
              padding: 0;
              background: #fff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        `}
      </style>
    </div>
  )
}

export default ResumePreview