import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Heart, Users, Bell, Scale, BookOpen } from "lucide-react";
import heroPuppy from "@/assets/hero-puppy.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 z-10">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Your Puppy's Journey,{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Perfectly Guided
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Never miss a milestone, feeding time, or vet appointment. 
                AI-powered care plans that grow with your puppy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary-light shadow-soft transition-smooth text-lg font-semibold"
                  onClick={() => window.location.href = "/auth"}
                >
                  Get Started Free
                  <Heart className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary/10 transition-smooth text-lg font-semibold"
                  onClick={() => window.location.href = "/auth"}
                >
                  Sign In
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl" />
              <img
                src={heroPuppy}
                alt="Happy golden retriever puppy"
                className="relative rounded-3xl shadow-glow w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything Your Puppy Needs
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive care management designed for new puppy parents
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Calendar className="h-8 w-8" />}
              title="Smart Calendar"
              description="Automated scheduling for vet visits, vaccinations, and breed-specific health checks"
              color="primary"
            />
            <FeatureCard
              icon={<Scale className="h-8 w-8" />}
              title="Weight-Based Feeding"
              description="Precise portion calculations that adjust as your puppy grows"
              color="secondary"
            />
            <FeatureCard
              icon={<BookOpen className="h-8 w-8" />}
              title="Training Library"
              description="Age-appropriate exercises and behavioral training modules"
              color="accent"
            />
            <FeatureCard
              icon={<Bell className="h-8 w-8" />}
              title="Smart Reminders"
              description="Never miss feeding times, medications, or important milestones"
              color="success"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Family Sharing"
              description="Coordinate care with household members seamlessly"
              color="primary"
            />
            <FeatureCard
              icon={<Heart className="h-8 w-8" />}
              title="AI Care Plans"
              description="Personalized recommendations that adapt to your puppy's needs"
              color="accent"
            />
          </div>
        </div>
      </section>

      {/* Language Support */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-foreground">
              Available in Your Language
            </h2>
            <p className="text-lg text-muted-foreground">
              Currently supporting English and Polish, with more languages coming soon
            </p>
            <div className="flex justify-center gap-6 text-4xl">
              <span>🇬🇧</span>
              <span>🇵🇱</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-hero text-white shadow-glow border-0 overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')] opacity-20" />
              <div className="relative z-10 space-y-6">
                <h2 className="text-4xl font-bold">
                  Start Your Puppy's Journey Today
                </h2>
                <p className="text-xl opacity-90 max-w-2xl mx-auto">
                  Join thousands of puppy parents who trust Puppy Mentor for expert care guidance
                </p>
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 shadow-soft transition-smooth text-lg font-semibold"
                  onClick={() => window.location.href = "/auth"}
                >
                  Create Free Account
                  <Heart className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 Puppy Mentor. Helping puppies thrive, one milestone at a time.</p>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "primary" | "secondary" | "accent" | "success";
}

const FeatureCard = ({ icon, title, description, color }: FeatureCardProps) => {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    secondary: "text-secondary bg-secondary/10",
    accent: "text-accent bg-accent/10",
    success: "text-success bg-success/10",
  };

  return (
    <Card className="bg-gradient-card border-border hover:shadow-soft transition-smooth group">
      <CardContent className="p-6 space-y-4">
        <div className={`w-16 h-16 rounded-2xl ${colorClasses[color]} flex items-center justify-center group-hover:scale-110 transition-bounce`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Index;
