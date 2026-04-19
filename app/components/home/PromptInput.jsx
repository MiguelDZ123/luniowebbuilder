"use client"

import React, { useState } from "react";
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Loader2 } from "lucide-react";
import { generateTitle } from "../../lib/generateSite";
import { supabase } from "../../../utils/supabase";

const SUGGESTIONS = [
  "A minimalist portfolio for a product designer",
  "Landing page for an AI meditation app",
  "Restaurant site for a modern Japanese izakaya",
  "Agency site for a boutique branding studio",
];

export default function PromptInput() {
  const [prompt, setPrompt] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const router = useRouter();

  const startProject = async (text) => {
    const finalPrompt = (text || prompt).trim();
    if (!finalPrompt || isStarting) return;
    setIsStarting(true);
    const title = await generateTitle(finalPrompt).catch(() => "Untitled Site");
    const { data: project } = await supabase.from("projects").insert({
      title: title,
      initial_prompt: finalPrompt,
      html: "",
      messages: [
        {
          role: "user",
          content: finalPrompt,
          timestamp: new Date().toISOString(),
        },
      ],
    }).select().single();
    router.push(`/builder?id=${project.id}&autogen=1`);
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      startProject();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative rounded-2xl border border-[#ffffff12]">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the website you want to build…"
          rows={3}
          disabled={isStarting}
          className="resize-none rounded-2xl border-0 bg-[#0e1219] focus-visible:ring-0 focus-visible:ring-offset-0 px-5 pt-5 pb-14 text-white min-h-40 placeholder:text-white/50"
        />
        <div className="absolute bottom-3 right-3">
          <Button
            onClick={() => startProject()}
            disabled={!prompt.trim() || isStarting}
            className="h-10 rounded-xl gap-2 px-4 bg-[#02e4fe] text-black hover:bg-[#02e4fe]/90 font-bold focus-visible:bg-[#02e4fe]/90"
          >
            {isStarting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating
              </>
            ) : (
              <>
                Generate
                <ArrowUp className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-5 justify-center">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setPrompt(s)}
            disabled={isStarting}
            className="text-xs text-muted-foreground bg-[#0e1219]  hover:text-white border border-[#ffffff12] rounded-full px-3.5 py-1.5"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}