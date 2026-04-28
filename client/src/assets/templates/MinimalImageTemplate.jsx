import { Mail, Phone, MapPin, Github, Globe } from "lucide-react";

const MinimalImageTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
        });
    };

    const sidebarWidth = "33%";
    const mainWidth = "67%";

    return (
        <div style={{ maxWidth: "900px", margin: "0 auto", background: "white", color: "#27272a", fontFamily: "sans-serif" }}>

            {/* Header row - flex, avoid page break */}
            <div style={{ display: "flex", pageBreakInside: "avoid", breakInside: "avoid" }}>
                <div style={{ width: sidebarWidth, padding: "40px 0", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {data.personal_info?.image && typeof data.personal_info.image === "string" ? (
                        <img src={data.personal_info.image} alt="Profile"
                            style={{ width: "128px", height: "128px", objectFit: "cover", borderRadius: "50%", background: accentColor + "70" }} />
                    ) : data.personal_info?.image && typeof data.personal_info.image === "object" ? (
                        <img src={URL.createObjectURL(data.personal_info.image)} alt="Profile"
                            style={{ width: "128px", height: "128px", objectFit: "cover", borderRadius: "50%" }} />
                    ) : null}
                </div>
                <div style={{ width: mainWidth, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 32px" }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#3f3f46", letterSpacing: "0.1em", margin: 0 }}>
                        {data.personal_info?.full_name || "Your Name"}
                    </h1>
                    <p style={{ textTransform: "uppercase", color: "#52525b", fontWeight: "500", fontSize: "0.75rem", letterSpacing: "0.1em", margin: "6px 0 0" }}>
                        {data.personal_info?.profession || "Profession"}
                    </p>
                </div>
            </div>

            {/* Content row - flex for proper multi-page print */}
            <div style={{ display: "flex", alignItems: "flex-start" }}>

                {/* Left Sidebar */}
                <aside style={{ width: sidebarWidth, borderRight: "1px solid #a1a1aa", padding: "0 24px 32px", boxSizing: "border-box", overflow: "hidden", minWidth: 0 }}>

                    {/* Contact */}
                    <section style={{ marginBottom: "32px" }}>
                        <h2 style={{ fontSize: "0.7rem", fontWeight: "600", letterSpacing: "0.1em", color: "#52525b", marginBottom: "12px" }}>
                            CONTACT
                        </h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.8rem" }}>
                            {data.personal_info?.phone && (
                                <a href={`tel:${data.personal_info.phone}`} style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", color: "inherit" }}>
                                    <Phone size={13} style={{ color: accentColor, flexShrink: 0 }} />
                                    <span>{data.personal_info.phone}</span>
                                </a>
                            )}
                            {data.personal_info?.email && (
                                <a href={`mailto:${data.personal_info.email}`} style={{ display: "flex", alignItems: "flex-start", gap: "8px", textDecoration: "none", color: "inherit" }}>
                                    <Mail size={13} style={{ color: accentColor, flexShrink: 0, marginTop: "2px" }} />
                                    <span style={{ wordBreak: "break-all", overflowWrap: "break-word", minWidth: 0 }}>{data.personal_info.email}</span>
                                </a>
                            )}
                            {data.personal_info?.location && (
                                <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                                    <MapPin size={13} style={{ color: accentColor, flexShrink: 0, marginTop: "2px" }} />
                                    <span style={{ wordBreak: "break-word" }}>{data.personal_info.location}</span>
                                </div>
                            )}
                            {data.personal_info?.github && (
                                <a href={data.personal_info.github} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "flex-start", gap: "8px", textDecoration: "none", color: "inherit" }}>
                                    <Github size={13} style={{ color: accentColor, flexShrink: 0, marginTop: "2px" }} />
                                    <span style={{ wordBreak: "break-all", overflowWrap: "break-word", minWidth: 0 }}>{data.personal_info.github.replace("https://", "")}</span>
                                </a>
                            )}
                            {(data.personal_info?.portfolio || data.personal_info?.website) && (
                                <a href={data.personal_info.portfolio || data.personal_info.website} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "flex-start", gap: "8px", textDecoration: "none", color: "inherit" }}>
                                    <Globe size={13} style={{ color: accentColor, flexShrink: 0, marginTop: "2px" }} />
                                    <span style={{ wordBreak: "break-all", overflowWrap: "break-word", minWidth: 0 }}>
                                        {(data.personal_info.portfolio || data.personal_info.website).replace("https://", "")}
                                    </span>
                                </a>
                            )}
                        </div>
                    </section>

                    {/* Education */}
                    {data.education && data.education.length > 0 && (
                        <section style={{ marginBottom: "32px" }}>
                            <h2 style={{ fontSize: "0.7rem", fontWeight: "600", letterSpacing: "0.1em", color: "#52525b", marginBottom: "12px" }}>
                                EDUCATION
                            </h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.8rem" }}>
                                {data.education.map((edu, index) => (
                                    <div key={index}>
                                        <p style={{ fontWeight: "600", textTransform: "uppercase", margin: 0 }}>{edu.degree}</p>
                                        <p style={{ color: "#52525b", margin: "2px 0" }}>{edu.institution}</p>
                                        <p style={{ fontSize: "0.7rem", color: "#71717a", margin: 0 }}>{formatDate(edu.graduation_date)}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {data.skills && data.skills.length > 0 && (
                        <section>
                            <h2 style={{ fontSize: "0.7rem", fontWeight: "600", letterSpacing: "0.1em", color: "#52525b", marginBottom: "12px" }}>
                                SKILLS
                            </h2>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.8rem" }}>
                                {data.skills.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))}
                            </ul>
                        </section>
                    )}
                </aside>

                {/* Right Content */}
                <main style={{ width: mainWidth, padding: "0 32px 32px", boxSizing: "border-box" }}>

                    {/* Summary */}
                    {data.professional_summary && (
                        <section style={{ marginBottom: "32px" }}>
                            <h2 style={{ fontSize: "0.7rem", fontWeight: "600", letterSpacing: "0.1em", color: accentColor, marginBottom: "12px" }}>
                                SUMMARY
                            </h2>
                            <p style={{ color: "#3f3f46", lineHeight: "1.6", fontSize: "0.85rem", margin: 0 }}>
                                {data.professional_summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {data.experience && data.experience.length > 0 && (
                        <section style={{ marginBottom: "32px" }}>
                            <h2 style={{ fontSize: "0.7rem", fontWeight: "600", letterSpacing: "0.1em", color: accentColor, marginBottom: "16px" }}>
                                EXPERIENCE
                            </h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                {data.experience.map((exp, index) => (
                                    <div key={index}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <h3 style={{ fontWeight: "600", color: "#18181b", margin: 0, fontSize: "0.875rem" }}>{exp.position}</h3>
                                            <span style={{ fontSize: "0.7rem", color: "#71717a" }}>
                                                {formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: "0.8rem", color: accentColor, margin: "4px 0 8px" }}>{exp.company}</p>
                                        {exp.description && (
                                            <ul style={{ paddingLeft: "16px", margin: 0, fontSize: "0.8rem", color: "#3f3f46", lineHeight: "1.6" }}>
                                                {exp.description.split("\n").map((line, i) => (
                                                    <li key={i}>{line}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {data.project && data.project.length > 0 && (
                        <section>
                            <h2 style={{ fontSize: "0.7rem", fontWeight: "600", letterSpacing: "0.1em", color: accentColor, marginBottom: "12px" }}>
                                PROJECTS
                            </h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                {data.project.map((project, index) => (
                                    <div key={index}>
                                        <h3 style={{ fontWeight: "500", color: "#27272a", margin: "0 0 4px", fontSize: "0.875rem" }}>{project.name}</h3>
                                        <p style={{ fontSize: "0.8rem", color: accentColor, margin: "0 0 4px" }}>{project.type}</p>
                                        {project.description && (
                                            <ul style={{ paddingLeft: "16px", margin: 0, fontSize: "0.8rem", color: "#3f3f46", lineHeight: "1.6" }}>
                                                {project.description.split("\n").map((line, i) => (
                                                    <li key={i}>{line}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}

export default MinimalImageTemplate;
