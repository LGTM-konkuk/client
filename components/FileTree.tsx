"use client";

import { useState } from "react";
import { FileNode } from "@/types";
import { Button } from "@/components/ui/button";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FileTreeProps {
  fileSystem: FileNode;
  selectedPath?: string;
  onFileSelect: (path: string) => void;
  className?: string;
}

interface FileTreeNodeProps {
  node: FileNode;
  level: number;
  selectedPath?: string;
  onFileSelect: (path: string) => void;
  expandedPaths: Set<string>;
  onToggleExpand: (path: string) => void;
}

function FileTreeNode({
  node,
  level,
  selectedPath,
  onFileSelect,
  expandedPaths,
  onToggleExpand,
}: FileTreeNodeProps) {
  const isExpanded = expandedPaths.has(node.path);
  const isSelected = selectedPath === node.path;
  const isDirectory = node.type === "DIRECTORY";
  const hasChildren = node.children && node.children.length > 0;

  const handleClick = () => {
    if (isDirectory) {
      onToggleExpand(node.path);
    } else {
      onFileSelect(node.path);
    }
  };

  const getIcon = () => {
    if (isDirectory) {
      return isExpanded ? FolderOpenIcon : FolderIcon;
    }
    return FileIcon;
  };

  const Icon = getIcon();

  return (
    <div>
      <Button
        variant='ghost'
        className={cn(
          "w-full justify-start text-left p-1 h-auto font-normal",
          isSelected && "bg-accent",
          "hover:bg-accent/50",
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        <div className='flex items-center gap-1 min-w-0'>
          {isDirectory &&
            hasChildren &&
            (isExpanded ? (
              <ChevronDownIcon className='h-3 w-3 shrink-0' />
            ) : (
              <ChevronRightIcon className='h-3 w-3 shrink-0' />
            ))}
          {isDirectory && !hasChildren && <div className='h-3 w-3 shrink-0' />}
          <Icon className='h-4 w-4 shrink-0 text-muted-foreground' />
          <span className='truncate text-sm'>{node.name}</span>
          {node.size && (
            <span className='text-xs text-muted-foreground ml-auto shrink-0'>
              {formatFileSize(node.size)}
            </span>
          )}
        </div>
      </Button>

      {isDirectory && hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              level={level + 1}
              selectedPath={selectedPath}
              onFileSelect={onFileSelect}
              expandedPaths={expandedPaths}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function FileTree({
  fileSystem,
  selectedPath,
  onFileSelect,
  className,
}: FileTreeProps) {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(
    new Set([fileSystem.path]),
  );

  const handleToggleExpand = (path: string) => {
    setExpandedPaths((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  return (
    <div className={cn("text-sm", className)}>
      <div className='space-y-0.5'>
        {fileSystem.children?.map((child) => (
          <FileTreeNode
            key={child.path}
            node={child}
            level={0}
            selectedPath={selectedPath}
            onFileSelect={onFileSelect}
            expandedPaths={expandedPaths}
            onToggleExpand={handleToggleExpand}
          />
        ))}
      </div>
    </div>
  );
}
