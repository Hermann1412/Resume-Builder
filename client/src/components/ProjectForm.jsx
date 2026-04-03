import { FolderGit2, Plus, Trash2 } from "lucide-react";
import React from "react";
import { PROJECT_TECH_OPTIONS, getProjectTechMeta } from "./projectTechCatalog";

const ProjectForm = ({ data, onChange }) => {
const [openDropdownIndex, setOpenDropdownIndex] = React.useState(null);

const addProject = () => {
  const newProject = {
      name: "",
      type: "",
      description: "",
      technologies: [],
      github: "",
      portfolio: "",
    };
    onChange([...data, newProject]);
  };

const removeProject = (index) => {
  const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

const updateProject = (index, field, value) => {
  const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

const toggleTechnology = (index, techKey) => {
  const project = data[index] || {};
  const selectedTech = Array.isArray(project.technologies) ? project.technologies : [];
  const exists = selectedTech.includes(techKey);
  const next = exists
    ? selectedTech.filter((item) => item !== techKey)
    : [...selectedTech, techKey];

  updateProject(index, "technologies", next);
};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Projects
          </h3>
          <p className="text-sm text-gray-500">
            Showcase your personal or professional projects, including key
            technologies and links.
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          onClick={addProject}
        >
          <Plus className="size-4" />
          Add Project
        </button>
      </div>

        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FolderGit2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No projects added yet.</p>
            <p className="text-sm">Click "Add Project" to get started.</p>
          </div>
        )}

        <div className="space-y-4">
          {data.map((project, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4>Project #{index + 1}</h4>
                <button
                  onClick={() => removeProject(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  value={project.name || ""}
                  onChange={(e) => updateProject(index, "name", e.target.value)}
                  type="text"
                  placeholder="Project Name"
                  className="px-3 py-2 text-sm rounded-lg border border-gray-200"
                />

                <input
                  value={project.type || ""}
                  onChange={(e) => updateProject(index, "type", e.target.value)}
                  type="text"
                  placeholder="Project Type (e.g., Web App, Mobile)"
                  className="px-3 py-2 text-sm rounded-lg border border-gray-200"
                />

                <textarea
                value={project.description || ""}
                onChange={(e) =>
                  updateProject(index, "description", e.target.value)
                }
                rows={4}
                placeholder="Describe the project, your role, and key achievements..."
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 resize-none"
              />

                <input
                  value={project.github || ""}
                  onChange={(e) => updateProject(index, "github", e.target.value)}
                  type="url"
                  placeholder="GitHub Link (https://github.com/your-repo)"
                  className="px-3 py-2 text-sm rounded-lg border border-gray-200"
                />

                <input
                  value={project.portfolio || ""}
                  onChange={(e) => updateProject(index, "portfolio", e.target.value)}
                  type="url"
                  placeholder="Portfolio / Live Demo Link"
                  className="px-3 py-2 text-sm rounded-lg border border-gray-200"
                />

                <div className="md:col-span-2 relative">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDropdownIndex((prev) => (prev === index ? null : index))
                    }
                    className="w-full px-3 py-2 text-left text-sm rounded-lg border border-gray-200 bg-white hover:border-gray-300"
                  >
                    Technology used ({(project.technologies || []).length} selected)
                  </button>

                  {openDropdownIndex === index && (
                    <div className="absolute z-20 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg p-2 max-h-56 overflow-y-auto">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                        {PROJECT_TECH_OPTIONS.map((tech) => {
                          const Icon = tech.Icon;
                          const checked = (project.technologies || []).includes(tech.key);
                          return (
                            <label
                              key={tech.key}
                              className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-sm ${
                                checked ? "bg-red-50 text-red-700" : "hover:bg-gray-50"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleTechnology(index, tech.key)}
                              />
                              <Icon className="size-4" />
                              <span>{tech.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {(project.technologies || []).length > 0 && (
                  <div className="md:col-span-2 flex flex-wrap gap-2">
                    {project.technologies.map((techKey) => {
                      const techMeta = getProjectTechMeta(techKey);
                      const Icon = techMeta.Icon;
                      return (
                        <span
                          key={`${index}-${techKey}`}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs"
                        >
                          <Icon className="size-3.5" />
                          {techMeta.label}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              
            </div>
          ))}
        </div>
    </div>
  );
};

export default ProjectForm;
