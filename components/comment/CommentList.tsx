"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CommentFilterOptions,
  CommentFormData,
  ReadReviewCommentResponse,
} from "@/types";
import { Filter, MessageSquare, Plus, RefreshCw, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  comments: ReadReviewCommentResponse[];
  currentUserId?: number;
  onCreateComment: (data: CommentFormData) => Promise<void>;
  onEditComment: (commentId: string, content: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onReplyComment: (parentCommentId: string, content: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  isLoading?: boolean;
}

type ActiveTab = "all" | "general" | "file" | "line";

export function CommentList({
  comments,
  currentUserId,
  onCreateComment,
  onEditComment,
  onDeleteComment,
  onReplyComment,
  onRefresh,
  isLoading = false,
}: CommentListProps) {
  const [filteredComments, setFilteredComments] = useState<
    ReadReviewCommentResponse[]
  >([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [filters] = useState<CommentFilterOptions>({});
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let filtered = [...comments];

    if (activeTab !== "all") {
      filtered = filtered.filter((comment) => {
        switch (activeTab) {
          case "general":
            return !comment.filePath && !comment.parentCommentId;
          case "file":
            return false;
          case "line":
            return (
              !!comment.filePath &&
              !!comment.lineNumber &&
              !comment.parentCommentId
            );
          default:
            return true;
        }
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (comment) =>
          comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          comment.author.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (comment.filePath &&
            comment.filePath.toLowerCase().includes(searchTerm.toLowerCase())),
      );
    }

    if (filters.filePath) {
      filtered = filtered.filter(
        (comment) => comment.filePath === filters.filePath,
      );
    }

    if (filters.lineNumber) {
      filtered = filtered.filter(
        (comment) => comment.lineNumber === filters.lineNumber,
      );
    }

    setFilteredComments(filtered);
  }, [comments, activeTab, searchTerm, filters]);

  const handleCreateComment = async (data: CommentFormData) => {
    await onCreateComment(data);
    setIsFormVisible(false);
  };

  const getCommentStats = () => {
    const total = comments.length;
    const general = comments.filter(
      (c) => !c.filePath && !c.parentCommentId,
    ).length;
    const file = 0;
    const line = comments.filter(
      (c) => c.filePath && c.lineNumber && !c.parentCommentId,
    ).length;
    const replies = comments.filter((c) => !!c.parentCommentId).length;

    return { total, general, file, line, replies };
  };

  const stats = getCommentStats();

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <h2 className='text-xl font-semibold flex items-center gap-2'>
            <MessageSquare className='w-5 h-5' />
            댓글 ({stats.total})
          </h2>
          <div className='flex gap-2'>
            <Badge variant='outline'>일반 {stats.general}</Badge>
            <Badge variant='outline'>파일 {stats.file}</Badge>
            <Badge variant='outline'>라인 {stats.line}</Badge>
            <Badge variant='outline'>답글 {stats.replies}</Badge>
          </div>
        </div>

        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            새로고침
          </Button>
          <Button size='sm' onClick={() => setIsFormVisible(!isFormVisible)}>
            <Plus className='w-4 h-4 mr-2' />새 댓글 작성
          </Button>
        </div>
      </div>

      {isFormVisible && (
        <Card>
          <CardHeader>
            <CardTitle>새 댓글 작성</CardTitle>
          </CardHeader>
          <CardContent>
            <CommentForm onSubmit={handleCreateComment} isLoading={isLoading} />
          </CardContent>
        </Card>
      )}

      <div className='flex items-center justify-between gap-4 p-3 bg-muted/50 rounded-lg'>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as ActiveTab)}
        >
          <TabsList>
            <TabsTrigger value='all'>모두 ({comments.length})</TabsTrigger>
            <TabsTrigger value='general'>일반 ({stats.general})</TabsTrigger>
            <TabsTrigger value='file'>파일 ({stats.file})</TabsTrigger>
            <TabsTrigger value='line'>라인 ({stats.line})</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className='flex gap-2 items-center'>
          <div className='relative'>
            <Search className='absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
            <Input
              placeholder='내용, 작성자, 파일명 검색...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-8 w-64'
            />
          </div>
          <Button variant='outline' size='icon' disabled>
            <Filter className='w-4 h-4' />
          </Button>
        </div>
      </div>

      <div className='space-y-4'>
        {isLoading && filteredComments.length === 0 ? (
          <p className='text-center text-muted-foreground'>댓글 로딩 중...</p>
        ) : filteredComments.length === 0 ? (
          <p className='text-center text-muted-foreground'>
            표시할 댓글이 없습니다.
          </p>
        ) : (
          filteredComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onEdit={onEditComment}
              onDelete={onDeleteComment}
              onReply={onReplyComment}
            />
          ))
        )}
      </div>
    </div>
  );
}
