import Link from "next/link";
import PromptInput from "./components/home/PromptInput";
import RecentProjects from "./components/home/RecentProjects";
import AnimatedBackground from "./components/AnimatedBackground";
import Header from "./components/home/Header";


export default function Home() {
  return (
    <div className="min-h-screen font-mono relative overflow-x-hidden">
      <AnimatedBackground />

      {/* Top bar */}
      <Header />

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
      </main>

      <footer className="relative z-10 border-t border-[#ffffff12] mt-10 py-6 px-6 text-xs text-muted-foreground text-center">
        Built with ❤️ by <Link href="https://www.luniostudios.com/" target="_blank" rel="noopener noreferrer" className="underline">LUNIO Studios</Link>. All rights reserved.
      </footer>
    </div>
  );
}