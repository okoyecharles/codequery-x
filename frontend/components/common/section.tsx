function Section({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="flex justify-center px-6 py-4">
      <div className="w-full max-w-5xl">{children}</div>
    </section>
  );
}

export default Section;
