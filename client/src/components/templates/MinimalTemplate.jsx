
import { Github, FolderOpen } from "lucide-react";
import { getProjectTechMeta } from "../projectTechCatalog";
import { getProjectTechMetaFromValue } from "../projectTechCatalog";

const MinimalTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 font-light">
            {/* Header */}
            <header className="mb-10">
                <h1 className="text-4xl font-thin mb-4 tracking-wide">
                    {data.personal_info?.full_name || "Your Name"}
                </h1>

                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    {data.personal_info?.email && <span>{data.personal_info.email}</span>}
                    {data.personal_info?.phone && <span>{data.personal_info.phone}</span>}
                    {data.personal_info?.location && <span>{data.personal_info.location}</span>}
                    {data.personal_info?.linkedin && (
                        <span className="break-all">{data.personal_info.linkedin}</span>
                    )}
                    {data.personal_info?.github && (
                        <a href={data.personal_info.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 break-all">
                            <Github className="size-4" />
                            <span>{data.personal_info.github}</span>
                        </a>
                    )}
                    {(data.personal_info?.portfolio || data.personal_info?.website) && (
                        <a href={data.personal_info.portfolio || data.personal_info.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 break-all">
                            <FolderOpen className="size-4" />
                            <span>{data.personal_info.portfolio || data.personal_info.website}</span>
                        </a>
                    )}
                </div>
            </header>

            {/* Professional Summary */}
            {data.professional_summary && (
                <section className="mb-10">
                    <p className=" text-gray-700">
                        {data.professional_summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Experience
                    </h2>

                    <div className="space-y-6">
                        {data.experience.map((exp, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-lg font-medium">{exp.position}</h3>
                                    <span className="text-sm text-gray-500">
                                        {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-2">{exp.company}</p>
                                {exp.description && (
                                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {exp.description}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {data.project && data.project.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Projects
                    </h2>

                    <div className="space-y-4">
                        {data.project.map((proj, index) => (
                            <div key={index} className="flex flex-col gap-2 justify-between items-baseline">
                                <h3 className="text-lg font-medium ">{proj.name}</h3>
                                {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {proj.technologies.map((techKey) => {
                                            const techMeta = getProjectTechMeta(techKey);
                                            const Icon = techMeta.Icon;
                                            return (
                                                <span
                                                    key={`${index}-${techKey}`}
                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-700"
                                                >
                                                    <Icon className="size-3" />
                                                    {techMeta.label}
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}
                                <p className="text-gray-600">{proj.description}</p>
                                {(proj.github || proj.portfolio) && (
                                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-600">
                                        {proj.github && (
                                            <a href={proj.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
                                                <Github className="size-3.5" />
                                                <span>GitHub</span>
                                            </a>
                                        )}
                                        {proj.portfolio && (
                                            <a href={proj.portfolio} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
                                                <FolderOpen className="size-3.5" />
                                                <span>Portfolio</span>
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Education
                    </h2>

                    <div className="space-y-4">
                        {data.education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-baseline">
                                <div>
                                    <h3 className="font-medium">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                    </h3>
                                    <p className="text-gray-600">{edu.institution}</p>
                                    {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                                </div>
                                <span className="text-sm text-gray-500">
                                    {formatDate(edu.graduation_date)}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <section>
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Skills
                    </h2>

                    <div className="flex flex-wrap gap-2 text-gray-700">
                        {data.skills.map((skill, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-gray-100 text-sm"
                            >
                                {(() => {
                                    const meta = getProjectTechMetaFromValue(skill);
                                    const Icon = meta.Icon;
                                    return <Icon className="size-3.5" />;
                                })()}
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default MinimalTemplate;