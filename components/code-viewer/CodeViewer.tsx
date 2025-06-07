"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquareIcon, PlusIcon } from "lucide-react";
import { CommentSection } from "./CommentSection";
import { getLanguageFromPath, highlightCode } from "@/lib/code-highlighter";
import type { CodeViewerProps } from "@/types/code-viewer";

export function CodeViewer({
  fileContent,
  comments,
  onAddComment,
  onReply,
  className,
}: CodeViewerProps) {
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [highlightedCode, setHighlightedCode] = useState<string>("");

  const lines = fileContent.content.split("\n");
  const language = getLanguageFromPath(fileContent.path);

  useEffect(() => {
    let isCancelled = false;

    const highlight = async () => {
      const codeToHighlight = fileContent.content || "";
      if (language === "text" || !codeToHighlight) {
        setHighlightedCode(codeToHighlight);
        return;
      }

      try {
        const result = await highlightCode(codeToHighlight, language);
        if (!isCancelled) {
          setHighlightedCode(result);
        }
      } catch (error) {
        console.error("Code highlighting with Shiki failed:", error);
        if (!isCancelled) {
          // Fallback to non-highlighted code
          setHighlightedCode(codeToHighlight);
        }
      }
    };

    highlight();

    return () => {
      isCancelled = true;
    };
  }, [fileContent.content, language]);

  const handleLineClick = (lineNumber: number) => {
    setSelectedLine((prev) => (prev === lineNumber ? null : lineNumber));
  };

  const getLineCommentCount = (lineNumber: number) => {
    return comments.filter(
      (comment) =>
        comment.lineNumber === lineNumber && !comment.parentCommentId,
    ).length;
  };

  return (
    <div
      className={cn("border rounded-lg overflow-hidden code-viewer", className)}
    >
      <div className='bg-gray-100 px-4 py-2 border-b text-sm'>
        <div className='flex items-center justify-between'>
          <h3 className='font-mono font-semibold'>{fileContent.path}</h3>
          <div className='flex items-center gap-3 text-xs text-muted-foreground'>
            <span>{lines.length} lines</span>
            <span>{(fileContent.size / 1024).toFixed(2)} KB</span>
            <Badge variant='outline' className='text-xs'>
              {language}
            </Badge>
          </div>
        </div>
      </div>

      <div className='relative bg-gray-900 font-mono text-sm'>
        <div className='overflow-x-auto'>
          <div className='absolute inset-0 pointer-events-none'>
            <pre
              aria-hidden='true'
              className='shiki-container m-0 ml-20 p-0 bg-transparent'
            >
              <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
            </pre>
          </div>

          <table className='w-full relative z-10 text-transparent select-none'>
            <tbody className='select-text'>
              {lines.map((line, index) => {
                const lineNumber = index + 1;
                const commentCount = getLineCommentCount(lineNumber);
                const hasComments = commentCount > 0;
                const isSelected = selectedLine === lineNumber;

                return (
                  <tr
                    key={lineNumber}
                    className={cn("flex flex-row items-center", {
                      "bg-blue-900/30": isSelected,
                      "hover:bg-blue-900/20": !isSelected,
                    })}
                    onClick={() => handleLineClick(lineNumber)}
                  >
                    <td className='w-16 px-2 text-right text-gray-500 border-r border-gray-700 bg-gray-800/50'>
                      <div className='flex items-center justify-end gap-2 h-full'>
                        {hasComments && (
                          <div className='flex items-center gap-1 text-blue-400'>
                            <MessageSquareIcon className='h-3.5 w-3.5' />
                            <span className='text-xs'>{commentCount}</span>
                          </div>
                        )}
                        <span className='w-6'>{lineNumber}</span>
                        <Button
                          size='icon'
                          variant='ghost'
                          className={cn(
                            "h-5 w-5 p-0 text-gray-400 hover:cursor-pointer",
                          )}
                        >
                          <PlusIcon className='h-4 w-4' />
                        </Button>
                      </div>
                    </td>
                    <td className='px-4 whitespace-pre'>{line || " "}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLine && (
        <CommentSection
          lineNumber={selectedLine}
          comments={comments}
          onAddComment={onAddComment}
          onReply={onReply}
        />
      )}
    </div>
  );
}
