"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { ReadReviewCommentResponse } from "@/types/comment";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Edit,
  Trash2,
  Reply,
  User,
  FileText,
  Hash,
} from "lucide-react";

interface CommentItemProps {
  comment: ReadReviewCommentResponse;
  currentUserId?: number;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  onReply?: (parentCommentId: string, content: string) => void;
  isReply?: boolean; // 답글인지 여부
}

export function CommentItem({
  comment,
  currentUserId,
  onEdit,
  onDelete,
  onReply,
  isReply = false,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [replyContent, setReplyContent] = useState("");

  const isOwner = currentUserId === comment.author.id;
  const hasReplies = comment.replies && comment.replies.length > 0;

  // 댓글 유형 판단
  const getCommentType = () => {
    if (comment.parentCommentId) return "reply";
    if (comment.filePath && comment.lineNumber) return "line";
    if (comment.filePath) return "file";
    return "general";
  };

  const commentType = getCommentType();

  // 댓글 유형별 배지 렌더링
  const renderTypeBadge = () => {
    switch (commentType) {
      case "line":
        return (
          <Badge variant='outline' className='text-xs'>
            <Hash className='w-3 h-3 mr-1' />
            {comment.filePath}:{comment.lineNumber}
          </Badge>
        );
      case "file":
        return (
          <Badge variant='outline' className='text-xs'>
            <FileText className='w-3 h-3 mr-1' />
            {comment.filePath}
          </Badge>
        );
      case "reply":
        return (
          <Badge variant='secondary' className='text-xs'>
            <Reply className='w-3 h-3 mr-1' />
            답글
          </Badge>
        );
      default:
        return (
          <Badge variant='default' className='text-xs'>
            <MessageSquare className='w-3 h-3 mr-1' />
            일반 댓글
          </Badge>
        );
    }
  };

  // 수정 처리
  const handleEdit = () => {
    if (onEdit && editContent.trim()) {
      onEdit(comment.id, editContent);
      setIsEditing(false);
    }
  };

  // 답글 작성 처리
  const handleReply = () => {
    if (onReply && replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent("");
      setIsReplying(false);
    }
  };

  return (
    <Card className={`${isReply ? "ml-8 border-l-4 border-l-blue-200" : ""}`}>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-2'>
              <User className='w-4 h-4' />
              <span className='font-medium'>{comment.author.name}</span>
            </div>
            {renderTypeBadge()}
            {comment.isEdited && (
              <Badge variant='outline' className='text-xs text-gray-500'>
                수정됨
              </Badge>
            )}
          </div>

          <div className='flex items-center gap-2 text-sm text-gray-500'>
            <span>
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
                locale: ko,
              })}
            </span>

            {isOwner && (
              <div className='flex gap-1'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className='w-4 h-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => onDelete?.(comment.id)}
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <div className='space-y-3'>
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder='댓글을 수정하세요...'
              className='min-h-[80px]'
            />
            <div className='flex gap-2'>
              <Button onClick={handleEdit} size='sm'>
                저장
              </Button>
              <Button
                variant='outline'
                onClick={() => setIsEditing(false)}
                size='sm'
              >
                취소
              </Button>
            </div>
          </div>
        ) : (
          <div className='space-y-3'>
            <p className='whitespace-pre-wrap'>{comment.content}</p>

            {!isReply && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsReplying(!isReplying)}
                className='text-blue-600 hover:text-blue-700'
              >
                <Reply className='w-4 h-4 mr-1' />
                답글
              </Button>
            )}
          </div>
        )}

        {/* 답글 작성 폼 */}
        {isReplying && (
          <div className='mt-4 space-y-3 border-t pt-3'>
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder='답글을 작성하세요...'
              className='min-h-[60px]'
            />
            <div className='flex gap-2'>
              <Button onClick={handleReply} size='sm'>
                답글 작성
              </Button>
              <Button
                variant='outline'
                onClick={() => setIsReplying(false)}
                size='sm'
              >
                취소
              </Button>
            </div>
          </div>
        )}

        {/* 답글 목록 */}
        {hasReplies && (
          <div className='mt-4 space-y-3'>
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                currentUserId={currentUserId}
                onEdit={onEdit}
                onDelete={onDelete}
                onReply={onReply}
                isReply={true}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
