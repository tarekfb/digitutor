import type { MessageId } from "../constants/constants";

export enum Subjects {
  JavaScript = 1,
  Python = 2,
  Java = 3,
  CSharp = 4,
  CPlusPlus = 5,
  Ruby = 6,
  Swift = 7,
  Go = 8,
  PHP = 9,
  TypeScript = 10,
  HTML_CSS = 11,
  ReactJS = 12,
  AngularJS = 13,
  VueJS = 14,
  NodeJS = 15,
  Django = 16,
  Flask = 17,
  Spring = 18,
  dotNet = 19,
  Laravel = 20,
}

export const languages = [
  { label: "JavaScript", id: 1 },
  { label: "Python", id: 2 },
  { label: "Java", id: 3 },
  { label: "CSharp", id: 4 },
  { label: "CPlusPlus", id: 5 },
  { label: "Ruby", id: 6 },
  { label: "Swift", id: 7 },
  { label: "Go", id: 8 },
  { label: "PHP", id: 9 },
  { label: "TypeScript", id: 10 },
  { label: "HTML_CSS", id: 11 },
  { label: "ReactJS", id: 12 },
  { label: "AngularJS", id: 13 },
  { label: "VueJS", id: 14 },
  { label: "NodeJS", id: 15 },
  { label: "Django", id: 16 },
  { label: "Flask", id: 17 },
  { label: "Spring", id: 18 },
  { label: "dotNet", id: 19 },
  { label: "Laravel", id: 20 },
];

export type Message = {
  title: string;
  description: string;
  variant?: "success" | "warning" | "destructive" | "info";
  id?: MessageId;
  data: any;
};