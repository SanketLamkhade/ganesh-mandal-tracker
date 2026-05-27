import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/home");
  }

  return (
    <main className="flex min-h-full flex-1 items-center justify-center px-4 py-12">
      <div className="absolute inset-0 -z-10 mandal-pattern opacity-30" />
      <Suspense fallback={<div className="text-sm text-maroon/70">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
