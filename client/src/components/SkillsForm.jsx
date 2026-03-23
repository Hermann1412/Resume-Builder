import { Plus, Sparkles, Trash2 } from "lucide-react";
import React, { useState } from "react";

const SkillsForm = ({ data = [], onChange }) => {
  const [skillInput, setSkillInput] = useState("");
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
