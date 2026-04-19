import Link from "next/link";
import PromptInput from "./components/home/PromptInput";
import RecentProjects from "./components/home/RecentProjects";
import AnimatedBackground from "./components/AnimatedBackground";

export default function Home() {
  return (
    <div className="min-h-screen font-mono relative overflow-x-hidden">
      <AnimatedBackground />

      {/* Top bar */}
      <header className="relative z-10 px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex font-roboto font-medium items-center gap-2">
          <span className="text-xl">LUNIO AI</span>
        </div>
        <nav className="text-sm text-muted-foreground hidden sm:flex items-center gap-6">
          <span className="hover:text-foreground transition-colors cursor-default">Community</span>
          <span className="hover:text-foreground transition-colors cursor-default">Docs</span>
          <span className="hover:text-foreground transition-colors cursor-default">Pricing</span>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 px-6 pt-20 pb-24">
        <div className="max-w-5xl font-roboto font-bold mx-auto text-center mb-12">
          <h1 className="text-5xl md:text-6xl lg:text-8xl tracking-tight leading-[1.05]">
            <span className="text-white">BUILD WEBSITES</span><br /> <span className="text-[#02e4fe]">IN SECONDS</span><br /><span className="text-[#606980]">NOT SPRINTS</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Describe your idea and let the power of AI make it a reality. Just type a prompt in the textbox below and just let the machine do the rest.
          </p>
        </div>

        <PromptInput />
        <RecentProjects />
      </main>

      <footer className="relative z-10 border-t border-[#ffffff12] mt-10 py-6 px-6 text-xs text-muted-foreground text-center">
        Built with ❤️ by <Link href="https://www.luniostudios.com/" target="_blank" rel="noopener noreferrer" className="underline">LUNIO Studios</Link>. All rights reserved.
      </footer>
    </div>
  );
}