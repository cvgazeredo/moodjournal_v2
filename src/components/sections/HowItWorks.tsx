import { Container } from "@/components/ui/container";

const steps = [
  {
    number: "01",
    title: "Track Your Daily Mood",
    description:
      "Start by logging your mood each day. Take a moment to reflect on how you're feeling and rate your emotional state.",
  },
  {
    number: "02",
    title: "Add Context & Notes",
    description:
      "Record activities, thoughts, and circumstances that might have influenced your mood. The more detail you provide, the better insights you'll receive.",
  },
  {
    number: "03",
    title: "Review Your Patterns",
    description:
      "Explore your mood trends over time through intuitive visualizations. Identify patterns and triggers that affect your emotional well-being.",
  },
  {
    number: "04",
    title: "Get Personalized Insights",
    description:
      "Receive tailored recommendations and insights based on your data. Learn strategies to maintain positive emotions and manage challenging ones.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-muted/50">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started with our simple four-step process to begin your journey toward better emotional well-being.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative p-6 bg-background rounded-2xl border"
            >
              <div className="space-y-4">
                <span className="inline-block text-4xl font-bold text-primary/50">
                  {step.number}
                </span>
                <h3 className="text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
              {index !== steps.length - 1 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                  <svg
                    className="w-8 h-8 text-primary/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
} 