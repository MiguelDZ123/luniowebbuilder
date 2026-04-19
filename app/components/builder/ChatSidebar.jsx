"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Sparkles, Loader2, ArrowLeft } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { toast } from "sonner";

export default function ChatSidebar({ project, onSendMessage, isGenerating }) {
  const [input, setInput] = useState("");
  const scrollRef = useRef();

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === "Enter" && e.shiftKey) {
      // Allow new line with Shift+Enter
      setInput((prev) => prev + "\n");
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [project?.messages, isGenerating]);

  const messages = project?.messages || [];

  return (
    <aside className="w-full md:w-95 lg:w-105 shrink-0 border-r text-white border-[#ffffff12] bg-[#090b10] flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#ffffff12] flex items-center gap-3">
        <Link
          href="/"
          className="h-8 w-8 rounded-lg flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="text-xs text-white font-medium uppercase tracking-wider">
            Project
          </div>
          <div className="font-serif text-white truncate">
            {project?.title || "Untitled"}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {messages.length === 0 && (
          <div className="text-sm text-muted-foreground text-center mt-8">
            Start the conversation to refine your site.
          </div>
        )}

        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}

        {isGenerating && (
          <div className="flex gap-3 animate-fade-in">
            <div className="h-7 w-7 rounded-full bg-accent/10 text-accent border border-accent/20 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Crafting your site…
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="p-4 border-t bg-[#090b10] border border-[#ffffff12]">
        <div className="relative rounded-2xl border border-[#ffffff12] bg-[#090b10] shadow-sm focus-within:border-foreground/30 focus-within:shadow transition-all">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe a change…"
            rows={2}
            disabled={isGenerating}
            className="resize-none border-0 border-[#ffffff12]  focus-visible:ring-0 focus-visible:ring-offset-0 px-4 pt-3 pb-10 text-sm min-h-21"
          />

          <div className="absolute bottom-2 right-2">
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isGenerating}
              className="h-8 w-8 rounded-xl"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground mt-2 px-1">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </aside>
  );
}