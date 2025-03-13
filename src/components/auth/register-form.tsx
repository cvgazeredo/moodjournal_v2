import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong");
      }

      router.push("/login?registered=true");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your name"
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          disabled={isLoading}
        />
      </div>
      {error && (
        <div className="text-sm text-destructive">
          {error}
        </div>
      )}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
} 