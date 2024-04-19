"use client";

export const kanjiToCode = (kanji: string) => {
  return kanji.charCodeAt(0).toString(16).padStart(5, "0");
};

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
