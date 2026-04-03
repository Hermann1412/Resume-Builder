import { Plus, Sparkles, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { PROJECT_TECH_OPTIONS, getProjectTechMetaFromValue } from "./projectTechCatalog";

const SkillsForm = ({ data = [], onChange }) => {
  const [skillInput, setSkillInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const skills = Array.isArray(data) ? data : [];

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value) return;

    const alreadyExists = skills.some(
      (skill) => skill.toLowerCase() === value.toLowerCase(),
    );
    if (alreadyExists) {
      setSkillInput("");
      return;
    }

    onChange?.([...skills, value]);
    setSkillInput("");
  };

  const removeSkill = (index) => {
    const updated = skills.filter((_, i) => i !== index);
    onChange?.(updated);
  };

  const isOptionSelected = (option) => {
    const optionKey = String(option.key).toLowerCase();
    const optionLabel = String(option.label).toLowerCase();
    return skills.some((skill) => {
      const normalized = String(skill || "").trim().toLowerCase();
      return normalized === optionKey || normalized === optionLabel;
    });
  };

  const toggleOption = (option) => {
    const optionKey = String(option.key).toLowerCase();
    const optionLabel = String(option.label).toLowerCase();
    const exists = isOptionSelected(option);

    if (exists) {
      onChange?.(
        skills.filter((skill) => {
          const normalized = String(skill || "").trim().toLowerCase();
          return normalized !== optionKey && normalized !== optionLabel;
        }),
      );
      return;
    }

    onChange?.([...skills, option.label]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Skills
          </h3>
          <p className="text-sm text-gray-500">
            Add your core technical and professional skills.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="w-full px-3 py-2 text-left text-sm rounded-lg border border-gray-200 bg-white hover:border-gray-300"
          >
            Select from tech icons ({skills.length} selected)
          </button>

          {isDropdownOpen && (
            <div className="absolute z-20 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg p-2 max-h-56 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {PROJECT_TECH_OPTIONS.map((option) => {
                  const checked = isOptionSelected(option);
                  const Icon = option.Icon;
                  return (
                    <label
                      key={option.key}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-sm ${
                        checked ? "bg-red-50 text-red-700" : "hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOption(option)}
                      />
                      <Icon className="size-4" />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Type a skill and press Enter"
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={addSkill}
            disabled={!skillInput.trim()}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <Plus className="size-4" />
            Add
          </button>
        </div>

        {skills.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No skills added yet.</p>
            <p className="text-sm">Add your first skill above.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-full border border-gray-200 bg-gray-50"
              >
                {(() => {
                  const meta = getProjectTechMetaFromValue(skill);
                  const Icon = meta.Icon;
                  return <Icon className="size-3.5" />;
                })()}
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  aria-label={`Remove ${skill}`}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsForm;
