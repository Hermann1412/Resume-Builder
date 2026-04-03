import {
  FaAws,
  FaCloud,
  FaCode,
  FaCss3Alt,
  FaDatabase,
  FaDocker,
  FaGitAlt,
  FaGithub,
  FaGoogle,
  FaHtml5,
  FaJava,
  FaJs,
  FaMicrosoft,
  FaNodeJs,
  FaPython,
  FaReact,
} from "react-icons/fa";

export const PROJECT_TECH_OPTIONS = [
  { key: "vscode", label: "VS Code", Icon: FaCode },
  { key: "github", label: "GitHub", Icon: FaGithub },
  { key: "git", label: "Git", Icon: FaGitAlt },
  { key: "javascript", label: "JavaScript", Icon: FaJs },
  { key: "typescript", label: "TypeScript", Icon: FaCode },
  { key: "react", label: "React", Icon: FaReact },
  { key: "redux", label: "Redux", Icon: FaCode },
  { key: "nextjs", label: "Next.js", Icon: FaCode },
  { key: "vite", label: "Vite", Icon: FaCloud },
  { key: "nodejs", label: "Node.js", Icon: FaNodeJs },
  { key: "express", label: "Express", Icon: FaNodeJs },
  { key: "python", label: "Python", Icon: FaPython },
  { key: "java", label: "Java", Icon: FaJava },
  { key: "dotnet", label: ".NET", Icon: FaMicrosoft },
  { key: "mysql", label: "MySQL", Icon: FaDatabase },
  { key: "postgresql", label: "PostgreSQL", Icon: FaDatabase },
  { key: "mongodb", label: "MongoDB", Icon: FaDatabase },
  { key: "firebase", label: "Firebase", Icon: FaCloud },
  { key: "docker", label: "Docker", Icon: FaDocker },
  { key: "kubernetes", label: "Kubernetes", Icon: FaCloud },
  { key: "aws", label: "AWS", Icon: FaAws },
  { key: "azure", label: "Azure", Icon: FaMicrosoft },
  { key: "gcp", label: "Google Cloud", Icon: FaGoogle },
  { key: "html", label: "HTML5", Icon: FaHtml5 },
  { key: "css", label: "CSS3", Icon: FaCss3Alt },
  { key: "tailwind", label: "Tailwind", Icon: FaCode },
];

const optionMap = new Map(PROJECT_TECH_OPTIONS.map((item) => [item.key, item]));
const optionLabelMap = new Map(
  PROJECT_TECH_OPTIONS.map((item) => [String(item.label).toLowerCase(), item]),
);

export const getProjectTechMeta = (techKey = "") => {
  if (optionMap.has(techKey)) return optionMap.get(techKey);

  return {
    key: techKey,
    label: techKey,
    Icon: FaCode,
  };
};

export const getProjectTechMetaFromValue = (value = "") => {
  const normalized = String(value || "").trim();
  if (!normalized) {
    return {
      key: "",
      label: "",
      Icon: FaCode,
    };
  }

  if (optionMap.has(normalized)) return optionMap.get(normalized);

  const byLabel = optionLabelMap.get(normalized.toLowerCase());
  if (byLabel) return byLabel;

  return {
    key: normalized,
    label: normalized,
    Icon: FaCode,
  };
};
