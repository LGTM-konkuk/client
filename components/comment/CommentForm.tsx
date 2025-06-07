"use client";

import { useState } from "react";
import { CommentFormData, CommentType } from "@/types/comment";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, FileText, Hash, Send, X } from "lucide-react";

interface CommentFormProps {
  submissionId?: number;
  onSubmit: (data: CommentFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<CommentFormData>;
  isLoading?: boolean;
}

export function CommentForm({
  submissionId,
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: CommentFormProps) {
  const [formData, setFormData] = useState<CommentFormData>({
    content: initialData?.content || "",
    type: initialData?.type || "general",
    filePath: initialData?.filePath || "",
    lineNumber: initialData?.lineNumber || undefined,
    parentCommentId: initialData?.parentCommentId,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 폼 검증
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.content.trim()) {
      newErrors.content = "댓글 내용을 입력해주세요.";
    }

    if (formData.type === "file" && !formData.filePath.trim()) {
      newErrors.filePath = "파일 경로를 입력해주세요.";
    }

    if (formData.type === "line") {
      if (!formData.filePath.trim()) {
        newErrors.filePath = "파일 경로를 입력해주세요.";
      }
      if (!formData.lineNumber || formData.lineNumber < 1) {
        newErrors.lineNumber = "유효한 라인 번호를 입력해주세요.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 처리
  const handleSubmit = () => {
    if (!validateForm()) return;

    // 댓글 타입에 따른 데이터 정리
    const submitData: CommentFormData = {
      content: formData.content.trim(),
      type: formData.type,
      parentCommentId: formData.parentCommentId,
    };

    // 파일별 댓글인 경우
    if (formData.type === "file" || formData.type === "line") {
      submitData.filePath = formData.filePath.trim();
    }

    // 라인별 댓글인 경우
    if (formData.type === "line") {
      submitData.lineNumber = formData.lineNumber;
    }

    onSubmit(submitData);
  };

  // 댓글 타입 변경 처리
  const handleTypeChange = (type: CommentType) => {
    setFormData((prev) => ({
      ...prev,
      type,
      // 타입이 변경되면 관련 필드 초기화
      filePath: type === "general" || type === "reply" ? "" : prev.filePath,
      lineNumber: type === "line" ? prev.lineNumber : undefined,
    }));
    setErrors({});
  };

  // 댓글 타입별 아이콘 및 라벨
  const getTypeInfo = (type: CommentType) => {
    switch (type) {
      case "general":
        return {
          icon: MessageSquare,
          label: "일반 댓글",
          description: "리뷰 전체에 대한 의견",
        };
      case "file":
        return {
          icon: FileText,
          label: "파일별 댓글",
          description: "특정 파일에 대한 의견",
        };
      case "line":
        return {
          icon: Hash,
          label: "라인별 댓글",
          description: "특정 라인에 대한 의견",
        };
      case "reply":
        return {
          icon: MessageSquare,
          label: "답글",
          description: "기존 댓글에 대한 답변",
        };
    }
  };

  const isReply = formData.type === "reply" || formData.parentCommentId;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <MessageSquare className='w-5 h-5' />
          {isReply ? "답글 작성" : "댓글 작성"}
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* 댓글 타입 선택 (답글이 아닌 경우만) */}
        {!isReply && (
          <div className='space-y-2'>
            <Label>댓글 유형</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleTypeChange(value as CommentType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["general", "file", "line"] as CommentType[]).map((type) => {
                  const { icon: Icon, label, description } = getTypeInfo(type);
                  return (
                    <SelectItem key={type} value={type}>
                      <div className='flex items-center gap-2'>
                        <Icon className='w-4 h-4' />
                        <div>
                          <div className='font-medium'>{label}</div>
                          <div className='text-xs text-gray-500'>
                            {description}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 현재 댓글 타입 표시 */}
        {formData.type && (
          <div className='flex items-center gap-2'>
            <Badge variant='outline'>
              {(() => {
                const { icon: Icon, label } = getTypeInfo(formData.type);
                return (
                  <>
                    <Icon className='w-3 h-3 mr-1' />
                    {label}
                  </>
                );
              })()}
            </Badge>
          </div>
        )}

        {/* 파일 경로 입력 (파일별/라인별 댓글인 경우) */}
        {(formData.type === "file" || formData.type === "line") && (
          <div className='space-y-2'>
            <Label htmlFor='filePath'>
              파일 경로 <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='filePath'
              value={formData.filePath}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, filePath: e.target.value }))
              }
              placeholder='예: src/main/java/UserService.java'
              className={errors.filePath ? "border-red-500" : ""}
            />
            {errors.filePath && (
              <p className='text-sm text-red-500'>{errors.filePath}</p>
            )}
          </div>
        )}

        {/* 라인 번호 입력 (라인별 댓글인 경우) */}
        {formData.type === "line" && (
          <div className='space-y-2'>
            <Label htmlFor='lineNumber'>
              라인 번호 <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='lineNumber'
              type='number'
              min='1'
              value={formData.lineNumber || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  lineNumber: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                }))
              }
              placeholder='예: 25'
              className={errors.lineNumber ? "border-red-500" : ""}
            />
            {errors.lineNumber && (
              <p className='text-sm text-red-500'>{errors.lineNumber}</p>
            )}
          </div>
        )}

        {/* 댓글 내용 */}
        <div className='space-y-2'>
          <Label htmlFor='content'>
            댓글 내용 <span className='text-red-500'>*</span>
          </Label>
          <Textarea
            id='content'
            value={formData.content}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, content: e.target.value }))
            }
            placeholder='댓글을 작성하세요...'
            className={`min-h-[100px] ${
              errors.content ? "border-red-500" : ""
            }`}
          />
          {errors.content && (
            <p className='text-sm text-red-500'>{errors.content}</p>
          )}
          <p className='text-sm text-gray-500'>
            {formData.content.length}/5000자
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className='flex gap-2 justify-end'>
          {onCancel && (
            <Button variant='outline' onClick={onCancel}>
              <X className='w-4 h-4 mr-1' />
              취소
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !formData.content.trim()}
          >
            <Send className='w-4 h-4 mr-1' />
            {isLoading ? "작성 중..." : isReply ? "답글 작성" : "댓글 작성"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
