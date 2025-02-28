import { MessageId } from "../../constants/constants.ts";
import type { Message } from "../../models/common.ts";

export const detectSocials = (text: string): "email" | "phone" | "url" | void => {
  if (!text) return;

  if (containsEmail(text)) {
    return "email";
  } else if (containsPhoneNumber(text)) {
    return "phone";
  } else if (containsUrl(text)) {
    return "url";
  }
};

const getReadableSocial = (social: "email" | "phone" | "url"): "e-postadress" | "telefonnummer" | "länk" => {
  switch (social) {
    case "email":
      return "e-postadress";
    case "phone":
      return "telefonnummer";
    case "url":
      return "länk";
  }
}

export const getFormMessageForSocial = (social: "email" | "phone" | "url"): Message => {
  const title = "Otillåtet innehåll";
  const description = `Vi hittade otillåtet innehåll i din text: ${getReadableSocial(social)}. Stämmer inte detta?`
  const variant = "warning";

  return { title, description, variant, id: MessageId.ContactUs, data: undefined };
}

export const containsEmail = (text: string): boolean => {
  // Matches: username@domain.tld
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  return emailPattern.test(text);
};

export const containsPhoneNumber = (text: string): boolean => {
  // Matches formats like:
  // (123) 456-7890
  // 123-456-7890
  // 123.456.7890
  // +1 123 456 7890
  // 1234567890
  const phonePattern = /(?:\+\d{1,3}\s?)?(?:\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/;
  return phonePattern.test(text);
};

export const containsUrl = (text: string): boolean => {
  // Matches URLs with or without protocol
  // Examples: https://example.com, www.example.com, example.com/path
  const urlPattern = /(?:https?:\/\/(?:www\.)?|(?:www\.))?(?!.*@)[-a-zA-Z0-9:%._+~#=]{1,256}(?:\.[a-zA-Z0-9()]{1,6}|:[0-9]{1,5})\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
  return urlPattern.test(text);
};