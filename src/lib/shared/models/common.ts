import type { MessageId } from "../constants/constants";

export const languages = [
  { label: "JavaScript", id: 0, altLabel: "JS" },
  { label: "Typescript", id: 1, altLabel: "TS" },
  { label: "Python", id: 2, altLabel: "" },
  { label: "Java", id: 3, altLabel: "" },
  { label: "C#", id: 4, altLabel: "" },
  { label: "C++", id: 5, altLabel: "CPlusPlus" },
  { label: "Ruby", id: 6, altLabel: "" },
  { label: "Swift", id: 7, altLabel: "" },
  { label: "Go", id: 8, altLabel: "" },
  { label: "PHP", id: 9, altLabel: "" },
  { label: "HTML", id: 10, altLabel: "" },
  { label: "CSS", id: 11, altLabel: "" },
  { label: "React.JS", id: 12, altLabel: "React" },
  { label: "Angular.JS", id: 13, altLabel: "Angular" },
  { label: "Vue.JS", id: 14, altLabel: "Vue" },
  { label: "Node.JS", id: 15, altLabel: "Node" },
  { label: "Django", id: 16, altLabel: "" },
  { label: "Flask", id: 17, altLabel: "" },
  { label: "Spring", id: 18, altLabel: "" },
  { label: "dotNet", id: 19, altLabel: ".Net" },
  { label: "Laravel", id: 20, altLabel: "" },
  { label: "Rust", id: 21, altLabel: "" },
  { label: "Kotlin", id: 22, altLabel: "" },
  { label: "Scala", id: 23, altLabel: "" },
  { label: "Perl", id: 24, altLabel: "" },
  { label: "MATLAB", id: 25, altLabel: "" },
  { label: "R", id: 26, altLabel: "" },
  { label: "Elixir", id: 27, altLabel: "" },
  { label: "Svelte", id: 28, altLabel: "" },
  { label: "Ember.JS", id: 29, altLabel: "Ember" },
  { label: "Backbone.JS", id: 30, altLabel: "Backbone" },
  { label: "jQuery", id: 31, altLabel: "" },
  { label: "Bootstrap", id: 32, altLabel: "" },
  { label: "Tailwind CSS", id: 33, altLabel: "Tailwind" },
  { label: "GraphQL", id: 34, altLabel: "GQL" },
  { label: "Redux", id: 35, altLabel: "" },
  { label: "Electron", id: 36, altLabel: "" },
  { label: "TensorFlow", id: 37, altLabel: "TF" },
  { label: "PyTorch", id: 38, altLabel: "" },
  { label: "FastAPI", id: 39, altLabel: "" },
  { label: "Express", id: 40, altLabel: "" },
  { label: "Flutter", id: 41, altLabel: "" },
  { label: "Apache Spark", id: 42, altLabel: "Spark" },
  { label: "Hadoop", id: 43, altLabel: "" },
  { label: "Terraform", id: 44, altLabel: "" },
  { label: "Ansible", id: 45, altLabel: "" },
  { label: "Puppet", id: 47, altLabel: "" },
  { label: "Kubernetes", id: 48, altLabel: "K8s" },
  { label: "Docker", id: 49, altLabel: "" },
  { label: "Redis", id: 50, altLabel: "" },
  { label: "MongoDB", id: 51, altLabel: "" },
  { label: "SQL", id: 52, altLabel: "" },
  { label: "PostgreSQL", id: 52, altLabel: "Postgres" },
  { label: "MySQL", id: 53, altLabel: "" },
  { label: "Oracle", id: 54, altLabel: "" },
  { label: "SQLite", id: 55, altLabel: "" }
];

export type Message = {
  title: string;
  description: string;
  variant?: "success" | "warning" | "destructive" | "default";
  id?: MessageId;
  data: any;
};

export enum ExternalErrorCodes {
  InvalidInputSyntax = "22P02",
  ContainsZeroRows = "PGRST116",
  FileTooLargeStorageError = "413",
  DuplicateKeyConstraintViolation = "23505",
  SyntaxError = "42601"
} 