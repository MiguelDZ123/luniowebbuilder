import React, { useState, useMemo } from "react";
import { Monitor, Tablet, Smartphone, Code2, Eye, ExternalLink, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const DEVICES = {
  desktop: { icon: Monitor, width: "100%", label: "Desktop" },
  tablet: { icon: Tablet, width: "820px", label: "Tablet" },
  mobile: { icon: Smartphone, width: "390px", label: "Mobile" },
};

export default function PreviewFrame({ html, isGenerating }) {
  const [device, setDevice] = useState("desktop");
  const [view, setView] = useState("preview");
  const [copied, setCopied] = useState(false);

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
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="flex-1 flex flex-col bg-muted/40 h-full min-w-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setView("preview")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all",
              view === "preview" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>
          <button
            onClick={() => setView("code")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all",
              view === "code" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Code2 className="h-3.5 w-3.5" />
            Code
          </button>
        </div>

        {view === "preview" && (
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            {Object.entries(DEVICES).map(([key, { icon: Icon, label }]) => (
              <button
                key={key}
                onClick={() => setDevice(key)}
                title={label}
                className={cn(
                  "h-7 w-7 rounded-md flex items-center justify-center transition-all",
                  device === key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={!html}
            className="h-8 text-xs gap-1.5"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpen}
            disabled={!html}
            className="h-8 text-xs gap-1.5"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open
          </Button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden relative">
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
                  srcDoc={html}
                  title="Website preview"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />
              ) : (
                <EmptyState isGenerating={isGenerating} />
              )}
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto">
            <pre className="font-mono text-xs leading-relaxed p-6 text-foreground/80 whitespace-pre-wrap break-all">
              {html || "// No code yet"}
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