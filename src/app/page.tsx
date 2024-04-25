"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import JishoAPI from "unofficial-jisho-api";
import { z } from "zod";

import { KanjiSheet } from "@/components/kanji-sheet";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { kanjiToCode } from "@/lib/utils";

const SVG_ROOT =
  "https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/";
const PROXY = process.env.NEXT_PUBLIC_CORS_PROXY;

const FormSchema = z.object({
  kanjiList: z.string(),
});

export default function Home() {
  const ref = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => ref.current!,
  });

  const jisho = new JishoAPI();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      kanjiList: "一二三四五六七八九十",
    },
  });

  const [kanji, setKanji] = useState<Kanji[]>([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    const newKanji: Kanji[] = [];

    const kanjiList = Array.from(new Set(data.kanjiList.trim().split("")));
    for (const char of kanjiList) {
      const url = PROXY + jisho.getUriForKanjiSearch(char);

      const res = await fetch(url);
      const data = jisho.parseKanjiPageHtml(await res.text(), char);

      if (data.found) {
        const svg = await fetch(`${SVG_ROOT}${kanjiToCode(char)}.svg`);
        newKanji.push({
          kanji: char,
          meaning: data.meaning,
          onyomi: data.onyomi,
          kunyomi: data.kunyomi,
          svg: await svg.text(),
        } as Kanji);
      }
    }

    setKanji(newKanji);
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between space-y-4 p-12">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center gap-2"
        >
          <FormField
            control={form.control}
            name="kanjiList"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Kanji" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          {!loading ? (
            <Button type="submit">Generate</Button>
          ) : (
            <Button type="submit" disabled>
              Generating
            </Button>
          )}

          {!loading && kanji.length ? (
            <Button onClick={handlePrint}>Print</Button>
          ) : (
            <Button disabled>Print</Button>
          )}
        </form>
      </Form>

      <KanjiSheet ref={ref} kanji={kanji} />
    </main>
  );
}
