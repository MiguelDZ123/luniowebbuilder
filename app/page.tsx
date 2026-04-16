import React from "react";
import { Sparkles } from "lucide-react";
import PromptInput from "./components/home/PromptInput";
import RecentProjects from "./components/home/RecentProjects";

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent/5 blur-3xl rounded-full" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-accent/5 blur-3xl rounded-full" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="font-serif text-lg">Atelier</span>
        </div>
        <nav className="text-sm text-muted-foreground hidden sm:flex items-center gap-6">
          <span className="hover:text-foreground transition-colors cursor-default">Gallery</span>
          <span className="hover:text-foreground transition-colors cursor-default">Docs</span>
          <span className="hover:text-foreground transition-colors cursor-default">Pricing</span>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 px-6 pt-20 pb-24">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            AI Website Builder
          </div>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl tracking-tight text-foreground leading-[1.05]">
            Craft a website,
            <br />
            <span className="italic text-accent">in a single breath.</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Describe what you need. Our AI designs, writes, and builds a fully responsive site in seconds — then refines it with you in chat.
          </p>
        </div>

        <PromptInput />
        <RecentProjects />
      </main>

      <footer className="relative z-10 border-t border-border mt-10 py-6 px-6 text-xs text-muted-foreground text-center">
        Built with care · Atelier AI
      </footer>
    </div>
  );
}