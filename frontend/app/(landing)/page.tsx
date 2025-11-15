"use client";
import Section from "@/components/common/section";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { Pin, Search } from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Hybrid Answers: Community + AI",
    description:
      "Get instant solutions powered by pre-trained AI models, displayed alongside verified, community-contributed answers.",
  },
  {
    title: "Semantic Search Precision",
    description:
      "Move beyond keyword matching. Our AI-driven search understands the intent and context of your technical query, instantly linking you to the most relevant discussions.",
  },
  {
    title: "Community Vetted Reliability",
    description:
      "All AI-generated answers and community contributions can be upvoted, downvoted, and flagged by seasoned developers.",
  },
  {
    title: "Multi-Perspective Solutioning",
    description:
      "Request the AI to generate alternative solutions or debug common errors based on your query. Don't settle for one answer; explore several verified approaches side-by-side.",
  },
  {
    title: "Searchable Knowledge Base",
    description:
      "Saved answers become searchable resources for your team — reduce duplicate questions and onboard faster.",
  },
];

export default function Home() {
	const user = useAuthStore((state) => state.user);

  return (
    <main>
      <Section>
        <div className="flex flex-col gap-4 items-center justify-center h-[400px]">
          <span className="py-1 px-4 rounded-full bg-blue-50 text-sm font-medium text-blue-600 border border-blue-500 mb-5">
            Built by Okoye Charles 2021/248708
          </span>
          <h1 className="text-center font-mono font-bold text-xl md:text-4xl mb-4">
            Ask Developers. Get{" "}
            <span className="text-blue-500">AI-powered</span> answers.
          </h1>
          <p className="text-gray-600 max-w-[450px] text-center mb-5">
            A community Q&A for engineers that combines human expertise with
            AI-generated, personalized answers — so you get reliable solutions
            tailored to your code and context.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href={user ? "/submissions" : "/auth/login"}>
              <Button className="cursor-pointer" size={'default'}>Get Started</Button>
            </Link>
            <Link href="/submissions?search=1">
              <Button className="cursor-pointer" variant={"outline"} size={'default'}>
                <Search /> Search Submissions
              </Button>
            </Link>
          </div>
        </div>
      </Section>
      <div className="bg-white border-t border-gray-300 py-4">
        <Section>
          <header className="flex flex-col items-center justify-center">
            <h2 className="text-center font-mono font-bold text-xl md:text-2xl mb-4 flex gap-2 items-center">
              <Pin className="text-blue-500" />
              Features{" "}
            </h2>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:-translate-y-2 transition-transform">
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Section>
      </div>
    </main>
  );
}
