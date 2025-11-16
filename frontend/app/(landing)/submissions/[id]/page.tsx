"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useQuestionStore } from "@/store/question";
import { useAlertStore } from "@/store/alert";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Calendar,
  MessageSquare,
  Trash2,
  Edit,
  ThumbsUp,
  ThumbsDown,
  User2,
  LibraryBig,
  Sparkles,
  ArrowUp,
  RefreshCcw,
} from "lucide-react";
import Section from "@/components/common/section";
import { Spinner } from "@/components/ui/spinner";

export default function QuestionPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    question,
    aiLoading,
    getIntelligentAnswer,
    getQuestion,
    postAnswer,
    upvoteAnswer,
    downvoteAnswer,
    deleteAnswer,
    updateAnswer,
    deleteQuestion,
    updateQuestion,
  } = useQuestionStore();
  const { trigger } = useAlertStore();

  const [answerText, setAnswerText] = useState("");
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [editAnswerText, setEditAnswerText] = useState("");

  // Modals state
  const [updateQuestionOpen, setUpdateQuestionOpen] = useState(false);
  const [updatedQuestionText, setUpdatedQuestionText] = useState("");

  const [deleteQuestionOpen, setDeleteQuestionOpen] = useState(false);

  useEffect(() => {
    getQuestion(id);
  }, [id, getQuestion]);

  const handlePostAnswer = async () => {
    if (!answerText.trim()) return;
    try {
      await postAnswer(id, answerText);
      setAnswerText("");
      trigger("Answer posted successfully");
    } catch (err: any) {
      trigger(err, "destructive");
    }
  };

  const handleUpdateAnswer = async (answerId: string) => {
    if (!editAnswerText.trim()) return;
    try {
      await updateAnswer(id, answerId, editAnswerText);
      setEditingAnswerId(null);
      setEditAnswerText("");
      trigger("Answer updated successfully");
    } catch (err: any) {
      trigger(err, "destructive");
    }
  };

  const handleDeleteAnswer = async (answerId: string) => {
    try {
      await deleteAnswer(id, answerId);
      trigger("Answer deleted successfully");
    } catch (err: any) {
      trigger(err, "destructive");
    }
  };

  const handleDeleteQuestion = async () => {
    try {
      await deleteQuestion(id);
      trigger("Question deleted successfully");
      router.push("/submissions"); // redirect after delete
    } catch (err: any) {
      trigger(err, "destructive");
    }
  };

  const handleUpdateQuestion = async () => {
    if (!updatedQuestionText.trim()) return;
    try {
      await updateQuestion(id, updatedQuestionText);
      trigger("Question updated successfully");
      setUpdateQuestionOpen(false);
    } catch (err: any) {
      trigger(err, "destructive");
    }
  };

  const handleGetIntelligentAnswer = async () => {
    try {
      await getIntelligentAnswer(id);
    } catch (err: any) {
      trigger(err, "destructive");
    }
  };

  if (!question || question._id !== id)
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <Spinner className="text-gray-500" />
      </div>
    );

  return (
    <div className="bg-white min-h-screen pt-6">
      <Section>
        {/* Question Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold tracking-tight font-mono">
            {question.question}
          </h1>
          {user && question.user._id === user._id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setUpdatedQuestionText(question.question);
                    setUpdateQuestionOpen(true);
                  }}
                >
                  <Edit className="mr-2 w-4 h-4" /> Update
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDeleteQuestionOpen(true)}>
                  <Trash2 className="mr-2 w-4 h-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Question Info Badges */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Badge variant="secondary" className="text-gray-700">
            <Calendar className="w-4 h-4" />{" "}
            {new Date(question.createdAt).toLocaleDateString()}
          </Badge>
          <Badge variant="secondary" className="text-gray-700">
            <MessageSquare className="w-4 h-4" /> {question.answers.length}{" "}
            Answers
          </Badge>
          <Badge variant="secondary" className="text-gray-700">
            <User2 className="w-4 h-4" /> By {question.user.name}
          </Badge>
        </div>

        {/* Intelligent Suggestions Section */}
        {user && user._id === question.user._id && (
          <div className="mb-6 p-4 ring-2 ring-blue-300 rounded-sm bg-gradient-to-r from-[#2dd4bf]/40 via-[#60a5fa]/30 to-[#8b5cf6]/40">
            <div className="flex flex-col">
              <h2 className="font-bold flex gap-[1ch] items-center mb-4">
                Intelligent Answer <Sparkles size={18} />
              </h2>
              <p
                className="mb-4 text-sm"
                dangerouslySetInnerHTML={{
                  __html:
                    question.intelligentAnswer ||
                    "Click “Generate” to receive a smart, context-aware answer tailored to your question.",
                }}
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  className="w-[125px]"
                  disabled={aiLoading}
                  onClick={handleGetIntelligentAnswer}
                >
                  {aiLoading ? (
                    <Spinner className="w-4 h-4" />
                  ) : question.intelligentAnswer ? (
                    <span className="flex gap-[.5ch] items-center">
                      Re-generate{" "}
                      <RefreshCcw size={16} className="text-gray-400" />
                    </span>
                  ) : (
                    <span className="flex gap-[.5ch] items-center">
                      Generate <ArrowUp size={16} className="text-gray-400" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Post Answer */}
        {
          <div className="mb-6 flex flex-col gap-2">
            <Textarea
              placeholder={
                user ? "Write your answer..." : "Write anonymously..."
              }
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
            />
            <Button onClick={handlePostAnswer}>Post Answer</Button>
          </div>
        }

        {/* Answers List */}
        <div className="flex flex-col">
          <header>
            <h2 className="font-bold mb-4">
              Answers ({question.answers.length})
            </h2>
          </header>
          {question.answers.length === 0 && (
            <div className="text-gray-500 text-sm min-h-[200px] text-center flex flex-col items-center justify-center">
              <LibraryBig size={90} className="text-gray-300" />
              No answers yet
            </div>
          )}

          {question.answers.map((ans) => (
            <div
              key={ans._id}
              className="p-4 border-b flex flex-col gap-2 bg-white"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <div className="text-gray-500 text-sm">
                    {(ans.user?.name || "Anonymous") +
                      " · " +
                      new Date(ans.createdAt).toLocaleDateString()}
                  </div>
                  {editingAnswerId !== ans._id && (
                    <div className="flex gap-2 text-gray-700">{ans.answer}</div>
                  )}
                </div>

                {user && ans.user && ans.user._id === user._id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="p-1">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingAnswerId(ans._id);
                          setEditAnswerText(ans.answer);
                        }}
                      >
                        <Edit className="mr-2 w-4 h-4" /> Update
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteAnswer(ans._id)}
                      >
                        <Trash2 className="mr-2 w-4 h-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Answer editing */}
              {editingAnswerId === ans._id && (
                <div className="flex gap-2">
                  <Textarea
                    value={editAnswerText}
                    className="text-base"
                    onChange={(e) => setEditAnswerText(e.target.value)}
                  />
                  <Button onClick={() => handleUpdateAnswer(ans._id)}>
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingAnswerId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              )}

              {/* Upvote / Downvote */}
              <div className="flex gap-2 justify-end">
                <Button
                  size="sm"
                  variant={
                    ans.upvotes.some((id) => id === user?._id)
                      ? "default"
                      : "outline"
                  }
                  disabled={!user}
                  onClick={() => upvoteAnswer(id, ans._id)}
                >
                  <ThumbsUp className="w-4 h-4" /> {ans.upvotes.length || 0}
                </Button>
                <Button
                  size="sm"
                  variant={
                    ans.downvotes.some((id) => id === user?._id)
                      ? "default"
                      : "outline"
                  }
                  disabled={!user}
                  onClick={() => downvoteAnswer(id, ans._id)}
                >
                  <ThumbsDown className="w-4 h-4" /> {ans.downvotes.length || 0}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Update Question Modal */}
        <Dialog open={updateQuestionOpen} onOpenChange={setUpdateQuestionOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Question</DialogTitle>
            </DialogHeader>
            <Textarea
              value={updatedQuestionText}
              onChange={(e) => setUpdatedQuestionText(e.target.value)}
            />
            <DialogFooter className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setUpdateQuestionOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateQuestion}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Question Modal */}
        <Dialog open={deleteQuestionOpen} onOpenChange={setDeleteQuestionOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete this question? This action cannot
              be undone.
            </p>
            <DialogFooter className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteQuestionOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteQuestion}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>
    </div>
  );
}
