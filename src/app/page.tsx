import Header from "@/components/Header";

export default async function HomePage() {
  return (
    <div className="mx-auto flex min-h-screen flex-col">
      <Header />
      <main className="flex grow flex-col items-center justify-center gap-y-4">
        <h1 className="text-4xl">
          <strong>Musicboxd</strong>
        </h1>
        <p>An application built using Next.js 14 and MongoDB.</p>
      </main>
    </div>
  );
}
