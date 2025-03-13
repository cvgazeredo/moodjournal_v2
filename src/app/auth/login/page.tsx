import { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login - MoodJournal",
  description: "Login to your MoodJournal account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <LoginForm />
    </div>
  );
} 