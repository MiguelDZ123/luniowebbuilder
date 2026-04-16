"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../utils/supabase";
import { generateWebsite } from "../lib/generateSite";
import ChatSidebar from "././../components/builder/ChatSidebar";
import PreviewFrame from "./../components/builder/PreviewFrame";
import { toast } from "sonner";

export default function Builder() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const projectId = searchParams.get("id");
  const autogen = searchParams.get("autogen") === "1";
  const autogenRan = useRef(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select()
        .eq("id", projectId)
        .single();
      if (error) throw error;
      return data;
    }
  });

  const updateProject = useMutation({
    mutationFn: async ({ id, data }) => {
      const { data: updated, error } = await supabase.from("projects")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return updated;
    },
  });

  const runGeneration = async (userPrompt, baseProject) => {
    setIsGenerating(true);
    try {
      const html = await generateWebsite({
        prompt: userPrompt,
        currentHtml: baseProject?.html || "",
        history: baseProject?.messages || [],
      });

      const assistantMsg = {
        role: "assistant",
        content: baseProject?.html
          ? "Updated the site based on your feedback."
          : "Here's your site. Let me know what you'd like to refine.",
        timestamp: new Date().toISOString(),
      };

      const newMessages = [...(baseProject?.messages || []), assistantMsg];

      await updateProject.mutateAsync({
        id: baseProject.id,
        data: { html, messages: newMessages },
      });
    } catch (e) {
      toast.error("Something went wrong while generating. Please try again.");
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-run generation
  useEffect(() => {
    if (autogen && project && !autogenRan.current) {
      autogenRan.current = true;
      runGeneration(project.initial_prompt, project);
    }
  }, [autogen, project]);

  const handleSendMessage = async (content) => {
    if (!project) return;

    const userMsg = {
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...(project.messages || []), userMsg];

    // Optimistic update
    queryClient.setQueryData(["project", projectId], {
      ...project,
      messages: newMessages,
    });

    await updateProject.mutateAsync({
      id: project.id,
      data: { messages: newMessages },
    });

    const fresh = { ...project, messages: newMessages };
    await runGeneration(content, fresh);
  };

  // Redirect if no projectId
  useEffect(() => {
    if (!projectId) router.push("/");
  }, [projectId, router]);

  if (!projectId) return null;

  if (projectLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-7 h-7 border-2 border-border border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-3 bg-background">
        <p className="font-serif text-xl">Project not found</p>
        <button
          onClick={() => router.push("/")}
          className="text-sm text-accent hover:underline"
        >
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex bg-background overflow-hidden">
      <ChatSidebar
        project={project}
        onSendMessage={handleSendMessage}
        isGenerating={isGenerating}
      />
      <PreviewFrame html={project.html} isGenerating={isGenerating} />
    </div>
  );
}