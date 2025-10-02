import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  Calendar, 
  Scale, 
  BookOpen, 
  Bell, 
  Settings, 
  LogOut,
  Plus
} from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }
      
      setUser(session.user);
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
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
            <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Puppy Mentor</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-muted-foreground">
            Let's take care of your puppy together
          </p>
        </div>

        {/* Add Puppy CTA */}
        <Card className="mb-8 bg-gradient-hero text-white border-0 shadow-glow">
          <CardContent className="p-8 text-center">
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h3 className="text-2xl font-bold mb-2">Add Your First Puppy</h3>
            <p className="text-white/90 mb-6">
              Start your puppy care journey by creating a profile
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 shadow-soft transition-smooth"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Puppy Profile
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionCard
            icon={<Calendar className="h-6 w-6" />}
            title="Calendar"
            description="Upcoming appointments"
            color="primary"
          />
          <QuickActionCard
            icon={<Scale className="h-6 w-6" />}
            title="Feeding"
            description="Track meals & weight"
            color="secondary"
          />
          <QuickActionCard
            icon={<BookOpen className="h-6 w-6" />}
            title="Training"
            description="Exercises & progress"
            color="accent"
          />
          <QuickActionCard
            icon={<Heart className="h-6 w-6" />}
            title="Health"
            description="Medical records"
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

const QuickActionCard = ({ icon, title, description, color }: QuickActionCardProps) => {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    secondary: "text-secondary bg-secondary/10",
    accent: "text-accent bg-accent/10",
    success: "text-success bg-success/10",
  };

  return (
    <Card className="bg-gradient-card border-border hover:shadow-soft transition-smooth cursor-pointer group">
      <CardHeader>
        <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-3 group-hover:scale-110 transition-bounce`}>
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
    </Card>
  );
};

export default Dashboard;
