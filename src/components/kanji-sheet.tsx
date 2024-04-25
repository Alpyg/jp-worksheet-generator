import Image from "next/image";
import React, { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface KanjiSheetProps extends React.HTMLAttributes<HTMLElement> {
  kanji: Kanji[];
}

const KanjiGrid = ({ kanji }: { kanji: Kanji }) => {
  const [kanjiWithoutStoke, setKanjiWithoutStroke] = useState<string>("");

  useEffect(() => {
    setKanjiWithoutStroke(
      kanji.svg
        .split("\n")
        .filter((line) => !line.includes("text transform"))
        .join("\n"),
    );
  }, [kanji]);

  const arr = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div>
      <div className="grid break-inside-avoid grid-cols-12 grid-rows-3 border border-gray-400 print:mt-8">
        <p className="col-span-4 border border-gray-400 p-1 text-[0.6rem]">
          {kanji.meaning}
        </p>
        <p className="col-span-4 border border-gray-400 p-1 text-[0.6rem]">
          {kanji.onyomi.join(", ")}
        </p>
        <p className="col-span-4 border border-gray-400 p-1 text-[0.6rem]">
          {kanji.kunyomi.join(", ")}
        </p>
        <div className="col-span-2 row-span-2 border border-gray-400">
          <Image
            src={`data:image/svg+xml;utf8,${encodeURIComponent(kanji.svg)}`}
            alt={kanji.kanji}
            width={256}
            height={256}
            unoptimized
          />
        </div>
        {arr.map((j) => (
          <div
            key={j}
            className="relative grid grid-cols-2 grid-rows-2 border border-gray-400"
          >
            {j < 10 && (
              <Image
                className="absolute opacity-35"
                src={`data:image/svg+xml;utf8,${encodeURIComponent(kanjiWithoutStoke)}`}
                alt={kanji.kanji}
                width={256}
                height={256}
                unoptimized
              />
            )}
            <div className="border-b border-r border-gray-100" />
            <div className="border-b border-l border-gray-100" />
            <div className="border-r border-t border-gray-100" />
            <div className="border-l border-t border-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
};

const KanjiSheet = React.forwardRef<HTMLDivElement, KanjiSheetProps>(
  ({ className, kanji, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex max-w-2xl flex-col gap-4 print:mx-8 print:max-w-full print:gap-0",
          className,
        )}
        {...props}
      >
        {kanji.map((kanji, i) => (
          <KanjiGrid key={i} kanji={kanji} />
        ))}
      </div>
    );
  },
);
KanjiSheet.displayName = "KanjiSheet";

export { KanjiSheet };
