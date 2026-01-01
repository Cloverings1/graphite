"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Upload, Cloud } from "lucide-react";

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // In a real app, this would handle the file upload
    const files = Array.from(e.dataTransfer.files);
    console.log("Dropped files:", files);
  }, []);

  const handleClick = useCallback(() => {
    // In a real app, this would open a file picker
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      console.log("Selected files:", files);
    };
    input.click();
  }, []);

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all",
        isDragging
          ? "border-accent bg-accent/10"
          : "border-border bg-card hover:border-muted-foreground hover:bg-card/80"
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className={cn(
            "rounded-full p-4 transition-colors",
            isDragging ? "bg-accent/20" : "bg-card"
          )}
        >
          {isDragging ? (
            <Cloud className="h-8 w-8 text-accent" />
          ) : (
            <Upload className="h-8 w-8 text-muted" />
          )}
        </div>
        <div>
          <p className="text-lg font-medium">
            {isDragging ? "Drop files here" : "Drag files here"}
          </p>
          <p className="mt-1 text-sm text-muted">or click to browse</p>
        </div>
      </div>
    </div>
  );
}
