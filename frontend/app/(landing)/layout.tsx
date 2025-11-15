import Navigation from "@/components/home/navigation";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full min-h-screen">
			<Navigation />
      {children}
    </main>
  );
}
