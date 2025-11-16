import Navigation from "@/components/home/navigation";
import { Suspense } from "react";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense>
      <main className="w-full min-h-screen">
        <Navigation />
        {children}
      </main>
    </Suspense>
  );
}
