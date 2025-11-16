"use client";
import Section from "@/components/common/section";
import QuestionCard from "@/components/home/question_card";
import CreateQuestionDialog from "@/components/modals/create_question_modal";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useAuthStore } from "@/store/auth";
import { useQuestionsStore } from "@/store/questions";
import { Search, SearchX, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useMemo } from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";

export default function Submissions() {
  const search = useSearchParams().get("search") || "";
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();
  const { questions, getQuestions, searchQuestions } = useQuestionsStore();
  const [initialLoad, setInitialLoad] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "mine">("all");

  async function fetchQuestions() {
    getQuestions().finally(() => {
      setInitialLoad(false);
    });
  }

  // Focus input if search exists
  useEffect(() => {
    if (searchInputRef.current && search) {
      searchInputRef.current.focus();
    }
  }, [searchTerm]);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.trim() === "") {
        fetchQuestions();
      } else {
        searchQuestions(searchTerm);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, getQuestions, searchQuestions]);

  // Filter client-side
  const filteredQuestions = useMemo(() => {
    console.log(questions);
    if (!user || filter === "all") return questions;
    return questions.filter((q) => q.user._id === user._id);
  }, [questions, filter, user]);

  return (
    <div>
      <Section>
        <header className="flex gap-4 justify-end items-center flex-wrap">
          <InputGroup className="bg-white max-w-[300px]">
            <InputGroupInput
              ref={searchInputRef}
              placeholder="Search Submissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {filter === "all" ? "All" : "By You"}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilter("all")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("mine")}>
                  By You
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {user ? (
            <CreateQuestionDialog />
          ) : (
            <Link href="/auth/login">
              <Button>Submit Query</Button>
            </Link>
          )}
        </header>
      </Section>

      <Section>
        {initialLoad ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center">
						<Spinner />
          </div>
        ) : filteredQuestions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredQuestions.map((q) => (
              <QuestionCard key={q._id} question={q} />
            ))}
          </div>
        ) : (
          <div className="min-h-[400px] flex flex-col items-center justify-center">
            <SearchX size={90} className="text-gray-500" />
            <span className="text-center text-sm text-gray-500">
              No Questions Available
            </span>
          </div>
        )}
      </Section>
    </div>
  );
}
