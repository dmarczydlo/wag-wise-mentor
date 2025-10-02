-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  language_preference TEXT NOT NULL DEFAULT 'en' CHECK (language_preference IN ('en', 'pl')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create puppies table
CREATE TABLE public.puppies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  breed TEXT NOT NULL,
  birthday DATE NOT NULL,
  current_weight DECIMAL(5,2),
  target_weight DECIMAL(5,2),
  activity_level TEXT DEFAULT 'moderate' CHECK (activity_level IN ('low', 'moderate', 'high')),
  photo_url TEXT,
  characteristics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create weight records table
CREATE TABLE public.weight_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  puppy_id UUID NOT NULL REFERENCES public.puppies(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5,2) NOT NULL,
  recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create food types table
CREATE TABLE public.food_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name TEXT NOT NULL,
  product_name TEXT NOT NULL,
  protein_percent DECIMAL(4,2),
  fat_percent DECIMAL(4,2),
  calories_per_100g INTEGER,
  feeding_guidelines JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create food assignments table
CREATE TABLE public.food_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  puppy_id UUID NOT NULL REFERENCES public.puppies(id) ON DELETE CASCADE,
  food_type_id UUID NOT NULL REFERENCES public.food_types(id) ON DELETE CASCADE,
  percentage INTEGER DEFAULT 100 CHECK (percentage > 0 AND percentage <= 100),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feeding schedules table
CREATE TABLE public.feeding_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  puppy_id UUID NOT NULL REFERENCES public.puppies(id) ON DELETE CASCADE,
  meal_number INTEGER NOT NULL CHECK (meal_number >= 1 AND meal_number <= 4),
  target_time TIME NOT NULL,
  portion_grams INTEGER NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feeding logs table
CREATE TABLE public.feeding_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  puppy_id UUID NOT NULL REFERENCES public.puppies(id) ON DELETE CASCADE,
  scheduled_feeding_id UUID REFERENCES public.feeding_schedules(id) ON DELETE SET NULL,
  actual_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actual_portion INTEGER,
  notes TEXT,
  completed BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table (for calendar)
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  puppy_id UUID NOT NULL REFERENCES public.puppies(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('vet', 'vaccination', 'grooming', 'training', 'other')),
  title TEXT NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create routines table
CREATE TABLE public.routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  puppy_id UUID NOT NULL REFERENCES public.puppies(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('feeding', 'exercise', 'training', 'sleep', 'socialization')),
  title TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  target_time TIME,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puppies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feeding_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feeding_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for puppies
CREATE POLICY "Users can view their own puppies"
  ON public.puppies FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own puppies"
  ON public.puppies FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own puppies"
  ON public.puppies FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own puppies"
  ON public.puppies FOR DELETE
  USING (auth.uid() = owner_id);

-- RLS Policies for weight_records
CREATE POLICY "Users can view weight records for their puppies"
  ON public.weight_records FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.puppies
    WHERE puppies.id = weight_records.puppy_id
    AND puppies.owner_id = auth.uid()
  ));

CREATE POLICY "Users can insert weight records for their puppies"
  ON public.weight_records FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.puppies
    WHERE puppies.id = weight_records.puppy_id
    AND puppies.owner_id = auth.uid()
  ));

CREATE POLICY "Users can update weight records for their puppies"
  ON public.weight_records FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.puppies
    WHERE puppies.id = weight_records.puppy_id
    AND puppies.owner_id = auth.uid()
  ));

CREATE POLICY "Users can delete weight records for their puppies"
  ON public.weight_records FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.puppies
    WHERE puppies.id = weight_records.puppy_id
    AND puppies.owner_id = auth.uid()
  ));

-- RLS Policies for food_types (public read, authenticated insert)
CREATE POLICY "Anyone can view food types"
  ON public.food_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert food types"
  ON public.food_types FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for food_assignments
CREATE POLICY "Users can view food assignments for their puppies"
  ON public.food_assignments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.puppies
    WHERE puppies.id = food_assignments.puppy_id
    AND puppies.owner_id = auth.uid()
  ));

CREATE POLICY "Users can insert food assignments for their puppies"
  ON public.food_assignments FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.puppies
    WHERE puppies.id = food_assignments.puppy_id
    AND puppies.owner_id = auth.uid()
  ));

CREATE POLICY "Users can update food assignments for their puppies"
  ON public.food_assignments FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.puppies
    WHERE puppies.id = food_assignments.puppy_id
    AND puppies.owner_id = auth.uid()
  ));

CREATE POLICY "Users can delete food assignments for their puppies"
  ON public.food_assignments FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.puppies
    WHERE puppies.id = food_assignments.puppy_id
    AND puppies.owner_id = auth.uid()
  ));

-- RLS Policies for feeding_schedules
CREATE POLICY "Users can view feeding schedules for their puppies"
  ON public.feeding_schedules FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.puppies
    WHERE puppies.id = feeding_schedules.puppy_id
    AND puppies.owner_id = auth.uid()
  ));

CREATE POLICY "Users can insert feeding schedules for their puppies"
  ON public.feeding_schedules FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.puppies
    WHERE puppies.id = feeding_schedules.puppy_id
    AND puppies.owner_id = auth.uid()
  ));

CREATE POLICY "Users can update feeding schedules for their puppies"
  ON public.feeding_schedules FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.puppies
    WHERE puppies.id = feeding_schedules.puppy_id
    AND puppies.owner_id = auth.uid()
  ));

CREATE POLICY "Users can delete feeding schedules for their puppies"
  ON public.feeding_schedules FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.puppies
    WHERE puppies.id = feeding_schedules.puppy_id
    AND puppies.owner_id = auth.uid()
  ));

-- RLS Policies for feeding_logs
CREATE POLICY "Users can view feeding logs for their puppies"
  ON public.feeding_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.puppies
    WHERE puppies.id = feeding_logs.puppy_id
    AND puppies.owner_id = auth.uid()
  ));

CREATE POLICY "Users can insert feeding logs for their puppies"
  ON public.feeding_logs FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.puppies
    WHERE puppies.id = feeding_logs.puppy_id
    AND puppies.owner_id = auth.uid()
  ));

CREATE POLICY "Users can update feeding logs for their puppies"
  ON public.feeding_logs FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.puppies
    WHERE puppies.id = feeding_logs.puppy_id
    AND puppies.owner_id = auth.uid()
  ));

CREATE POLICY "Users can delete feeding logs for their puppies"
  ON public.feeding_logs FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.puppies
    WHERE puppies.id = feeding_logs.puppy_id
    AND puppies.owner_id = auth.uid()
  ));

-- RLS Policies for events
CREATE POLICY "Users can view events for their puppies"
  ON public.events FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.puppies
    WHERE puppies.id = events.puppy_id
    AND puppies.owner_id = auth.uid()
  ));

CREATE POLICY "Users can insert events for their puppies"
  ON public.events FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.puppies
    WHERE puppies.id = events.puppy_id
    AND puppies.owner_id = auth.uid()
  ));

CREATE POLICY "Users can update events for their puppies"
  ON public.events FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.puppies
    WHERE puppies.id = events.puppy_id
    AND puppies.owner_id = auth.uid()
  ));

CREATE POLICY "Users can delete events for their puppies"
  ON public.events FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.puppies
    WHERE puppies.id = events.puppy_id
    AND puppies.owner_id = auth.uid()
  ));

-- RLS Policies for routines
CREATE POLICY "Users can view routines for their puppies"
  ON public.routines FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.puppies
    WHERE puppies.id = routines.puppy_id
    AND puppies.owner_id = auth.uid()
  ));

CREATE POLICY "Users can insert routines for their puppies"
  ON public.routines FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.puppies
    WHERE puppies.id = routines.puppy_id
    AND puppies.owner_id = auth.uid()
  ));

CREATE POLICY "Users can update routines for their puppies"
  ON public.routines FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.puppies
    WHERE puppies.id = routines.puppy_id
    AND puppies.owner_id = auth.uid()
  ));

CREATE POLICY "Users can delete routines for their puppies"
  ON public.routines FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.puppies
    WHERE puppies.id = routines.puppy_id
    AND puppies.owner_id = auth.uid()
  ));

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, language_preference)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'language_preference', 'en')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_puppies_updated_at
  BEFORE UPDATE ON public.puppies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();