import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@wag-wise-mentor/ui/components/button";
import { Input } from "@wag-wise-mentor/ui/components/input";
import { Label } from "@wag-wise-mentor/ui/components/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@wag-wise-mentor/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wag-wise-mentor/ui/components/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { z } from "zod";
import { BreedAutocomplete } from "./BreedAutocomplete";

const basicInfoSchema = z.object({
  name: z.string().min(1, "Puppy name is required"),
  birthday: z.string().min(1, "Birthday is required"),
});

const breedSchema = z.object({
  breed: z.string().min(1, "Breed is required"),
});

const physicalDetailsSchema = z.object({
  currentWeight: z.number().positive("Weight must be positive").optional(),
  targetWeight: z.number().positive("Weight must be positive").optional(),
  activityLevel: z.enum(["low", "moderate", "high"]),
});

interface PuppyRegistrationData {
  name: string;
  birthday: string;
  breed: string;
  currentWeight?: number;
  targetWeight?: number;
  activityLevel: "low" | "moderate" | "high";
  photoUrl?: string;
}

const STEPS = [
  { id: 1, title: "Basic Info", description: "Tell us about your puppy" },
  { id: 2, title: "Breed", description: "Select your puppy's breed" },
  {
    id: 3,
    title: "Physical Details",
    description: "Weight and activity information",
  },
  { id: 4, title: "Photo", description: "Add a photo (optional)" },
];

export const PuppyRegistrationWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PuppyRegistrationData>({
    name: "",
    birthday: "",
    breed: "",
    activityLevel: "moderate",
  });

  const navigate = useNavigate();
  const { user } = useAuth();

  const updateFormData = (data: Partial<PuppyRegistrationData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const validateStep = (step: number): boolean => {
    try {
      if (step === 1) {
        basicInfoSchema.parse({
          name: formData.name,
          birthday: formData.birthday,
        });
      } else if (step === 2) {
        breedSchema.parse({ breed: formData.breed });
      } else if (step === 3) {
        physicalDetailsSchema.parse({
          currentWeight: formData.currentWeight,
          targetWeight: formData.targetWeight,
          activityLevel: formData.activityLevel,
        });
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
      return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("You must be logged in to register a puppy");
      return;
    }

    if (currentStep !== STEPS.length) {
      handleNext();
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("puppies").insert({
        owner_id: user.id,
        name: formData.name,
        breed: formData.breed,
        birthday: formData.birthday,
        current_weight: formData.currentWeight ?? null,
        target_weight: formData.targetWeight ?? null,
        activity_level: formData.activityLevel,
        photo_url: formData.photoUrl ?? null,
        characteristics: {},
      });

      if (error) {
        toast.error(`Failed to register puppy: ${error.message}`);
        return;
      }

      toast.success(`${formData.name} has been registered successfully!`);
      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Puppy Name</Label>
              <Input
                id="name"
                placeholder="Max"
                value={formData.name}
                onChange={e => updateFormData({ name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthday">Birthday</Label>
              <Input
                id="birthday"
                type="date"
                value={formData.birthday}
                onChange={e => updateFormData({ birthday: e.target.value })}
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <BreedAutocomplete
              value={formData.breed}
              onChange={(value) => updateFormData({ breed: value })}
              required
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentWeight">Current Weight (kg)</Label>
              <Input
                id="currentWeight"
                type="number"
                step="0.1"
                placeholder="5.5"
                value={formData.currentWeight ?? ""}
                onChange={e =>
                  updateFormData({
                    currentWeight: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetWeight">Target Weight (kg)</Label>
              <Input
                id="targetWeight"
                type="number"
                step="0.1"
                placeholder="25.0"
                value={formData.targetWeight ?? ""}
                onChange={e =>
                  updateFormData({
                    targetWeight: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activityLevel">Activity Level</Label>
              <Select
                value={formData.activityLevel}
                onValueChange={(value: "low" | "moderate" | "high") =>
                  updateFormData({ activityLevel: value })
                }
              >
                <SelectTrigger id="activityLevel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="photoUrl">Photo URL (optional)</Label>
              <Input
                id="photoUrl"
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={formData.photoUrl ?? ""}
                onChange={e =>
                  updateFormData({
                    photoUrl: e.target.value || undefined,
                  })
                }
              />
              <p className="text-sm text-muted-foreground">
                Photo upload feature coming soon
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
        <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
        <div className="flex gap-2 mt-4">
          {STEPS.map(step => (
            <div
              key={step.id}
              className={`h-2 flex-1 rounded-full ${
                step.id <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>{renderStepContent()}</CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1 || loading}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={currentStep === STEPS.length ? handleSubmit : handleNext}
          disabled={loading}
        >
          {loading
            ? "Registering..."
            : currentStep === STEPS.length
              ? "Register Puppy"
              : "Next"}
          {currentStep < STEPS.length && (
            <ChevronRight className="h-4 w-4 ml-2" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
