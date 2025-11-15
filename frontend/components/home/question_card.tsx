"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Clock, FileText, User } from "lucide-react";
import Link from "next/link";
import { Question } from "@/core/common/types";

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const { _id, question: text, user, answers, createdAt } = question;

  const formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link href={`/submissions/${_id}`}>
      <Card className="w-ful max-w-2xl mx-auto my-2 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="font-bold tracking-tight font-mono">{text}</CardTitle>
          <span className="text-sm font-medium text-blue-500">
            by {user?.name}
          </span>
        </CardHeader>
        <CardFooter className="flex justify-between items-center">
          <span className="text-xs text-gray-500 flex gap-[.75ch]">
            <Clock size={16} />
            {formattedDate}
          </span>
          <span className="text-xs text-gray-500 flex gap-[.75ch]">
            <FileText size={16} />
            {answers?.length || 0}{" "}
            {answers?.length === 1 ? "answer" : "answers"}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
