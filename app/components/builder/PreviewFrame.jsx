import React, { useState, useMemo } from "react";
import { Monitor, Tablet, Smartphone, Code2, Eye, ExternalLink, Copy, Check, Loader2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Editor from "@monaco-editor/react";
import { supabase } from "../../../utils/supabase";

const DEVICES = {
  desktop: { icon: Monitor, width: "100%", label: "Desktop" },
  tablet: { icon: Tablet, width: "820px", label: "Tablet" },
  mobile: { icon: Smartphone, width: "390px", label: "Mobile" },
};

export default function PreviewFrame({ html, isGenerating }) {
  const [device, setDevice] = useState("desktop");
  const [view, setView] = useState("preview");
  const [copied, setCopied] = useState(false);
  const [editedHtml, setEditedHtml] = useState(html);
  const projectId = new URLSearchParams(window.location.search).get("id");

  const iframeSrc = useMemo(() => {
    if (!html) return "";
    return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
  }, [html]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(html || "");
    setCopied(true);
    toast.success("HTML copied to clipboard");
    setTimeout(() => setCopied(false), 1800);
  };

  const handleOpen = () => {
    const blob = new Blob([editedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const Edited = (value) => {
    setEditedHtml(value);
  };

  // Implement the auto-save functionality with a debounce
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (editedHtml !== html) {
        save();
      }
    }, 2000); // Save after 2 seconds of inactivity

    return () => clearTimeout(timeout);
  }, [editedHtml]);


  const save = async () => {
    //implement save changes from editor to database
    // Example implementation (replace with actual database save logic):
    await supabase.from("projects").update({ html: editedHtml }).eq("id", projectId);
    toast.success("Changes saved successfully");
  };

  return (
    <div className="flex-1 flex flex-col bg-[#090b10] h-full min-w-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#ffffff12] bg-[#090b10]  backdrop-blur-sm">
        <div className="flex items-center gap-1 p-1 bg-[#090b10] rounded-lg border border-[#ffffff12]">
          <button
            onClick={() => setView("preview")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all",
              view === "preview" ? "text-white bg-[#353535] shadow-sm" : "text-white"
            )}
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>
          <button
            onClick={() => setView("code")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all",
              view === "code" ? "bg-[#353535] text-white shadow-sm" : "text-white"
            )}
          >
            <Code2 className="h-3.5 w-3.5" />
            Code
          </button>
        </div>

        {view === "preview" && (
          <div className="flex items-center gap-1 p-1  rounded-lg">
            {Object.entries(DEVICES).map(([key, { icon: Icon, label }]) => (
              <button
                key={key}
                onClick={() => setDevice(key)}
                title={label}
                className={cn(
                  "h-7 w-7 rounded-md flex items-center justify-center transition-all",
                  device === key ? " text-white border border-[#ffffff12] shadow-sm" : "text-white"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleCopy}
            disabled={!html}
            className="h-8 text-xs gap-1.5 border border-[#ffffff12]"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpen}
            disabled={!html}
            className="h-8 text-xs gap-1.5 border border-[#ffffff12]"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open
          </Button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden relative bg-[#1e1e1e]">
        {view === "preview" ? (
          <div className="h-full w-full flex items-start justify-center p-4 md:p-8 overflow-auto">
            <div
              className="bg-white rounded-xl shadow-2xl shadow-black/10 overflow-hidden border border-border transition-all duration-300 ease-out h-full"
              style={{
                width: DEVICES[device].width,
                maxWidth: "100%",
                minHeight: "100%",
              }}
            >
              {html ? (
                <iframe
                  key={html.length}
                  srcDoc={editedHtml}
                  title="Website preview"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-sandbox allow-images allow-links allow-images-srcset"
                />
              ) : (
                <EmptyState isGenerating={isGenerating} />
              )}
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto">
            <pre className="font-mono text-xs leading-relaxed p-6 text-foreground/80 whitespace-pre-wrap break-all">
              <Editor value={editedHtml || "// No code yet"} onChange={Edited} className="h-full" height="90vh" theme="vs-dark" language="html"/>
            </pre>
          </div>
        )}

        {isGenerating && html && (
          <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
            <div className="bg-card border border-border rounded-full px-4 py-2 shadow-lg flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-accent" />
              Regenerating…
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ isGenerating }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-10 text-center">
      {isGenerating ? (
        <>
          <Loader2 className="h-8 w-8 animate-spin text-accent mb-4" />
          <p className="font-serif text-xl text-foreground mb-1">Building your site</p>
          <p className="text-sm text-muted-foreground">This usually takes 15–30 seconds</p>
        </>
      ) : (
        <>
          <div className="h-12 w-12 rounded-2xl bg-muted border border-border flex items-center justify-center mb-4">
            <Eye className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="font-serif text-xl text-foreground mb-1">Nothing to preview</p>
          <p className="text-sm text-muted-foreground">Send a message to generate your site</p>
        </>
      )}
    </div>
  );
}