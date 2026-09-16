import type { Metadata } from "next";
import LoginView from "@/app/components/login/LoginView";

type Props = PageProps<"/login">;

export const metadata: Metadata = {
  title: "Log in | YOURMARKET",
  description:
    "Log in to YOURMARKET to access your account, track orders and shop the premium collection.",
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const nextPath = typeof params.next === "string" ? params.next : undefined;
  return <LoginView nextPath={nextPath} />;
}