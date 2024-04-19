import Image from "next/image";
import { useEffect, useState } from "react";

const PracticeGrid = ({ kanji }: { kanji: Kanji }) => {
  const [kanjiWithoutStoke, setKanjiWithoutStroke] = useState(kanji.svg);

  useEffect(() => {
    setKanjiWithoutStroke(
      kanji.svg
        .split("\n")
        .filter((line) => !line.includes("text transform"))
        .join("\n"),
    );
  }, [kanjiWithoutStoke, kanji.svg]);

  const arr = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="grid grid-cols-12 grid-rows-3 border-2 border-black/30">
      <div className="col-span-4 row-span-1 aspect-[4/1] h-full w-full border-2 border-black/30">
        <p className="p-1 text-sm">{kanji.meaning}</p>
      </div>
      <div className="col-span-4 row-span-1 aspect-[4/1] h-full w-full border-2 border-black/30">
        <p className="p-1 text-sm">{kanji.onyomi.join(", ")}</p>
      </div>
      <div className="col-span-4 row-span-1 aspect-[4/1] h-full w-full border-2 border-black/30">
        <p className="p-1 text-sm">{kanji.kunyomi.join(", ")}</p>
      </div>
      <div className="relative col-span-2 row-span-2 aspect-square border-2 border-black/30">
        <Image
          className="h-full w-full"
          src={`data:image/svg+xml;utf8,${encodeURIComponent(kanji.svg)}`}
          alt={kanji.kanji}
          width={128}
          height={128}
          unoptimized
        />
      </div>
      {arr.map((i) => (
        <div
          key={i}
          className="relative aspect-square border-2 border-black/30"
        >
          <Image
            className="h-full w-full text-transparent opacity-30"
            src={`data:image/svg+xml;utf8,${encodeURIComponent(kanjiWithoutStoke)}`}
            alt={kanji.kanji}
            width={128}
            height={128}
            unoptimized
          />
        </div>
      ))}
      {arr.map((i) => (
        <div
          key={i}
          className="relative aspect-square border-2 border-black/30"
        ></div>
      ))}
      <div className="hidden" />
    </div>
  );
};

export { PracticeGrid };
