import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@wag-wise-mentor/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@wag-wise-mentor/ui/components/card";
import { Heart, Calendar, Scale, Bell, Plus, LogOut } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const [_user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Puppy Mentor
            </h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back! 🐾
          </h2>
          <p className="text-muted-foreground">
            Let's take care of your puppy today
          </p>
        </div>

        {/* Get Started Card */}
        <Card className="mb-8 bg-gradient-card border-2 border-primary/20 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              Get Started
            </CardTitle>
            <CardDescription>
              Add your first puppy to begin tracking their care journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="bg-primary hover:bg-primary-light shadow-soft transition-smooth gap-2">
              <Plus className="h-5 w-5" />
              Add Your Puppy
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionCard
            icon={<Heart className="h-8 w-8" />}
            title="Puppy Profile"
            description="Manage your puppy's information"
            color="primary"
          />
          <QuickActionCard
            icon={<Scale className="h-8 w-8" />}
            title="Feeding Schedule"
            description="Track meals and portions"
            color="secondary"
          />
          <QuickActionCard
            icon={<Calendar className="h-8 w-8" />}
            title="Appointments"
            description="Upcoming vet visits"
            color="accent"
          />
          <QuickActionCard
            icon={<Bell className="h-8 w-8" />}
            title="Reminders"
            description="Set up notifications"
            color="success"
          />
        </div>
      </main>
    </div>
  );
};

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "primary" | "secondary" | "accent" | "success";
}

const QuickActionCard = ({
  icon,
  title,
  description,
  color,
}: QuickActionCardProps) => {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    secondary: "text-secondary bg-secondary/10",
    accent: "text-accent bg-accent/10",
    success: "text-success bg-success/10",
  };

  return (
    <Card className="bg-gradient-card hover:shadow-soft transition-smooth cursor-pointer group">
      <CardContent className="p-6 space-y-4">
        <div
          className={`w-16 h-16 rounded-2xl ${colorClasses[color]} flex items-center justify-center group-hover:scale-110 transition-bounce`}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
