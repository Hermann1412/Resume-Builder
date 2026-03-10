import { Layout } from "lucide-react";
import React, { useState } from "react";

const TemplateSelector = ({ selectedTemplate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const templates = [
    {
      id: "classic",
      name: "Classic",
      preview:
        "A clean, traditional resume format with clear sections and professional typography",
    },
    {
      id: "modern",
      name: "Modern",
      preview:
        "A sleek, contemporary resume format with bold design elements and creative layouts",
    },
    {
      id: "minimal",
      name: "Minimal",
      preview:
        "A simple, elegant resume format with ample white space and a focus on content",
    },
    {
      id: "minimal-image",
      name: "Minimal with Image",
      preview:
        "A minimalist resume format that includes a profile picture for a personal touch",
    },
  ];
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-gray-600 bg-gradient-to-br from-blue-50 to-blue-100 ring-blue-300 hover:text-blue-900 transition-all px-3 oy-2 rounded-lg"
      >
        <Layout size={14} /> <span className="max-sm:hidden">Template</span>
      </button>
      {isOpen && (
        <div className="absolute top-full w-xs p-3 mt-2 space-y-3 z-10 bg-white rounded-mf border border-blue-200 shadow">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                onChange(template.id);
                setIsOpen(false);
              }}
              className={`relative p-3 border rounded-md cursor-pointer hover:bg-blue-100 ${selectedTemplate === template.id ? "border-blue-400 bg-blue-100" : "border-gray-200 hover:border-gray-400 hover:bg-gray-100"}`}
            >
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2">
                  <div className="size-5 bg-blue-400 rounded-full flex items-center justify-center">
                    <check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <h4 className="font-medium text-gray-800">{template.name}</h4>
                <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-gray-500 italic">
                  {template.preview}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
