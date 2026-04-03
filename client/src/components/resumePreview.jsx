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
          @page {
            size: letter;
            margin: 0;
          }
          @media print {
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              height: auto !important;
              overflow: visible !important;
              background: #fff !important;
            }

            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            body * {
              visibility: hidden !important;
            }

            #resume-preview,
            #resume-preview * {
              visibility: visible !important;
            }

            #resume-preview {
              position: fixed !important;
              inset: 0 !important;
              width: 100% !important;
              height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
              border: none !important;
              box-shadow: none !important;
              background: #fff !important;
            }
          }
        `}
      </style>
    </div>
  )
}

export default ResumePreview