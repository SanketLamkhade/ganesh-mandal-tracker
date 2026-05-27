import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SplashScreen from "@/components/SplashScreen";
import { authOptions } from "@/lib/auth";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/home");
  }

  return <SplashScreen />;
}
