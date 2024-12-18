import Link from "next/link";

export default async function Header() {
  return (
    <nav className="flex w-full items-center justify-between p-2 text-lg shadow-md">
      <Link href="/">Musicboxd</Link>
      <div className="flex gap-x-2">
        <Link href="/login">Log In</Link>
        <Link href="/signup">Sign Up</Link>
      </div>
    </nav>
  );
}
