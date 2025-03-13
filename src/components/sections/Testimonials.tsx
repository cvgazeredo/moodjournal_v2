import { Container } from "@/components/ui/container";

const testimonials = [
  {
    quote:
      "This app has completely transformed how I understand my emotions. The insights have been invaluable for my mental health journey.",
    author: "Sarah J.",
    title: "Mental Health Advocate",
  },
  {
    quote:
      "The daily tracking feature is so easy to use, and the pattern recognition has helped me identify triggers I never noticed before.",
    author: "Michael R.",
    title: "Mindfulness Practitioner",
  },
  {
    quote:
      "As a therapist, I recommend this app to my clients. It's an excellent tool for emotional awareness and self-reflection.",
    author: "Dr. Emily Chen",
    title: "Clinical Psychologist",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-background">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            What Our Users Say
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who have improved their emotional well-being with our app.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative p-6 bg-muted/50 rounded-2xl"
            >
              <div className="absolute top-0 left-0 transform -translate-x-2 -translate-y-2">
                <svg
                  className="h-8 w-8 text-primary/40"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                >
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>
              <div className="relative">
                <blockquote className="mt-8">
                  <p className="text-lg text-foreground leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </blockquote>
                <div className="mt-4 flex items-center gap-4">
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.title}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
} 