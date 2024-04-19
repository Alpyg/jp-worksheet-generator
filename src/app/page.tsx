"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import JishoAPI from "unofficial-jisho-api";
import { z } from "zod";

import { PracticeGrid } from "@/components/practice-grid";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { kanjiToCode } from "@/utils";

const SVG_ROOT =
  "https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/";
const PROXY = process.env.NEXT_PUBLIC_CORS_PROXY;

const FormSchema = z.object({
  kanjiList: z.string(),
});

export default function Home() {
  const jisho = new JishoAPI();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      kanjiList: "",
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-end gap-2"
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
        </form>
      </Form>

      <div className="flex flex-col items-stretch justify-start gap-2">
        {kanji.map((kanji, idx) => (
          <PracticeGrid key={idx} kanji={kanji} />
        ))}
      </div>
    </main>
  );
}
