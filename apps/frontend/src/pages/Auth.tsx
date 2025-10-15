import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@wag-wise-mentor/ui/components/button";
import { Input } from "@wag-wise-mentor/ui/components/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@wag-wise-mentor/ui/components/card";
import { Label } from "@wag-wise-mentor/ui/components/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      authSchema.parse({ email, password });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Invalid email or password");
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success("Welcome back!");
      } else {
        const redirectUrl = `${window.location.origin}/dashboard`;

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast.error(
              "This email is already registered. Please sign in instead."
            );
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success("Account created! Welcome to Puppy Mentor!");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-soft animate-scale-in">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            {isLogin ? "Welcome Back" : "Get Started"}
          </CardTitle>
          <CardDescription className="text-base">
            {isLogin
              ? "Sign in to continue your puppy's journey"
              : "Create an account to start caring for your puppy"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="transition-smooth"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="transition-smooth"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-light shadow-soft transition-smooth"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isLogin
                  ? "Sign In"
                  : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-smooth"
            >
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <span className="font-semibold">
                {isLogin ? "Sign Up" : "Sign In"}
              </span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
