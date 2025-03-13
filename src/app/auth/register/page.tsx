import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Sign Up - MoodJournal",
  description: "Create your MoodJournal account",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <RegisterForm />
    </div>
  );
} 