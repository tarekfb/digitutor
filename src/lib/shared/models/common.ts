import type { MessageId } from "../constants/constants.ts";
import { type Subject } from "./subject.ts";

export const languages: Subject[] = [
  { title: "JavaScript", id: 1, altTitle: "JS" },
  { title: "Python", id: 3, altTitle: "" },
  { title: "Java", id: 4, altTitle: "" },
  { title: "React.JS", id: 13, altTitle: "React" },
  { title: "C#", id: 5, altTitle: "CSharp" },
  { title: "Typescript", id: 2, altTitle: "TS" },
  { title: "C++", id: 6, altTitle: "CPlusPlus" },
  { title: "Ruby", id: 7, altTitle: "" },
  { title: "Swift", id: 8, altTitle: "" },
  { title: "Go", id: 9, altTitle: "" },
  { title: "PHP", id: 10, altTitle: "" },
  { title: "HTML", id: 11, altTitle: "" },
  { title: "CSS", id: 12, altTitle: "Cascading Style Sheets" },
  { title: "Angular.JS", id: 14, altTitle: "Angular" },
  { title: "Vue.JS", id: 15, altTitle: "Vue" },
  { title: "Node.JS", id: 16, altTitle: "Node" },
  { title: "Django", id: 17, altTitle: "" },
  { title: "Flask", id: 18, altTitle: "" },
  { title: "Spring", id: 19, altTitle: "" },
  { title: "dotNet", id: 20, altTitle: ".Net" },
  { title: "Laravel", id: 21, altTitle: "" },
  { title: "Rust", id: 22, altTitle: "" },
  { title: "Kotlin", id: 23, altTitle: "" },
  { title: "Scala", id: 24, altTitle: "" },
  { title: "Perl", id: 25, altTitle: "" },
  { title: "MATLAB", id: 26, altTitle: "" },
  { title: "R", id: 27, altTitle: "" },
  { title: "Elixir", id: 28, altTitle: "" },
  { title: "Svelte", id: 29, altTitle: "" },
  { title: "Ember.JS", id: 30, altTitle: "Ember" },
  { title: "Backbone.JS", id: 31, altTitle: "Backbone" },
  { title: "jQuery", id: 32, altTitle: "" },
  { title: "Bootstrap", id: 33, altTitle: "" },
  { title: "Tailwind CSS", id: 34, altTitle: "Tailwind" },
  { title: "GraphQL", id: 35, altTitle: "GQL" },
  { title: "Redux", id: 36, altTitle: "" },
  { title: "Electron", id: 37, altTitle: "" },
  { title: "TensorFlow", id: 38, altTitle: "TF" },
  { title: "PyTorch", id: 39, altTitle: "" },
  { title: "FastAPI", id: 40, altTitle: "" },
  { title: "Express", id: 41, altTitle: "" },
  { title: "Flutter", id: 42, altTitle: "" },
  { title: "Apache Spark", id: 43, altTitle: "Spark" },

];

export type Message = {
  title: string;
  description: string;
  variant?: "success" | "warning" | "destructive" | "default";
  id?: MessageId;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

export enum ExternalErrorCodes {
  InvalidInputSyntax = "22P02",
  ContainsZeroRows = "PGRST116",
  FileTooLargeStorageError = "413", // cf worker
  DuplicateKeyConstraintViolation = "23505",
  SyntaxError = "42601",
  NewPasswordNotDifferent = "422",
}
export enum SupabaseErrorMessages {
  NewPasswordNotDifferent = "New password should be different from the old password.", // no useful information is returned from supabase besides this and error name
}
