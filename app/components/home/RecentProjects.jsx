"use client"


import { useState, useEffect } from 'react'
import Link from 'next/link';
import isLoading from "react-loading-skeleton";
import { supabase, Project } from "../../../utils/supabase";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight, FileText } from "lucide-react";

export default function RecentProjects() {

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      fetchItems();
    }, []);
  
    const fetchItems = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('projects')
          .select('*')
          .order('created_date', { ascending: false });
  
        const { data, error } = await query;
  
        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching items:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="w-full max-w-5xl mx-auto mt-20 px-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl text-white">Community Projects</h2>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          {projects.length} {projects.length === 1 ? "site" : "sites"}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/builder?id=${p.id}`}
            className="group relative bg-[#0e1219] text-white rounded-2xl border border-transparent p-5 hover:border-[#ffffff12] hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted border border-border flex items-center justify-center">
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-lg mt-4 truncate">
              {p.title || "Untitled"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {p.initial_prompt}
            </p>
            <div className="text-[11px] text-muted-foreground mt-4 uppercase tracking-wider">
              {formatDistanceToNow(new Date(p.updated_date || p.created_date), { addSuffix: true })}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}