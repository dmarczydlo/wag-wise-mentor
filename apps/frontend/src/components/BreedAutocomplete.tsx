import { useState, useMemo, useRef, useEffect } from "react";
import { Label } from "@wag-wise-mentor/ui/components/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@wag-wise-mentor/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@wag-wise-mentor/ui/components/popover";
import { Button } from "@wag-wise-mentor/ui/components/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const DOG_BREEDS = [
  {
    value: "labrador-retriever",
    label: "Labrador Retriever",
    size: "Large",
    temperament: "Friendly, Active, Outgoing",
  },
  {
    value: "golden-retriever",
    label: "Golden Retriever",
    size: "Large",
    temperament: "Intelligent, Friendly, Devoted",
  },
  {
    value: "german-shepherd",
    label: "German Shepherd",
    size: "Large",
    temperament: "Confident, Courageous, Smart",
  },
  {
    value: "french-bulldog",
    label: "French Bulldog",
    size: "Small",
    temperament: "Playful, Adaptable, Smart",
  },
  {
    value: "bulldog",
    label: "Bulldog",
    size: "Medium",
    temperament: "Calm, Courageous, Friendly",
  },
  {
    value: "poodle",
    label: "Poodle",
    size: "Medium",
    temperament: "Intelligent, Active, Elegant",
  },
  {
    value: "beagle",
    label: "Beagle",
    size: "Small",
    temperament: "Friendly, Curious, Merry",
  },
  {
    value: "rottweiler",
    label: "Rottweiler",
    size: "Large",
    temperament: "Loyal, Confident, Guardian",
  },
  {
    value: "yorkshire-terrier",
    label: "Yorkshire Terrier",
    size: "Small",
    temperament: "Affectionate, Sprightly, Tomboyish",
  },
  {
    value: "dachshund",
    label: "Dachshund",
    size: "Small",
    temperament: "Clever, Lively, Courageous",
  },
  {
    value: "boxer",
    label: "Boxer",
    size: "Large",
    temperament: "Playful, Energetic, Bright",
  },
  {
    value: "siberian-husky",
    label: "Siberian Husky",
    size: "Large",
    temperament: "Outgoing, Alert, Gentle",
  },
  {
    value: "shih-tzu",
    label: "Shih Tzu",
    size: "Small",
    temperament: "Affectionate, Playful, Outgoing",
  },
  {
    value: "doberman-pinscher",
    label: "Doberman Pinscher",
    size: "Large",
    temperament: "Loyal, Fearless, Alert",
  },
  {
    value: "miniature-schnauzer",
    label: "Miniature Schnauzer",
    size: "Small",
    temperament: "Friendly, Smart, Obedient",
  },
  {
    value: "great-dane",
    label: "Great Dane",
    size: "Extra Large",
    temperament: "Friendly, Patient, Dependable",
  },
  {
    value: "pomeranian",
    label: "Pomeranian",
    size: "Small",
    temperament: "Inquisitive, Bold, Lively",
  },
  {
    value: "australian-shepherd",
    label: "Australian Shepherd",
    size: "Medium",
    temperament: "Smart, Work-Oriented, Exuberant",
  },
  {
    value: "pembroke-welsh-corgi",
    label: "Pembroke Welsh Corgi",
    size: "Small",
    temperament: "Affectionate, Smart, Alert",
  },
  {
    value: "cocker-spaniel",
    label: "Cocker Spaniel",
    size: "Medium",
    temperament: "Gentle, Smart, Happy",
  },
  {
    value: "border-collie",
    label: "Border Collie",
    size: "Medium",
    temperament: "Affectionate, Smart, Energetic",
  },
  {
    value: "chihuahua",
    label: "Chihuahua",
    size: "Small",
    temperament: "Charming, Graceful, Sassy",
  },
  {
    value: "pug",
    label: "Pug",
    size: "Small",
    temperament: "Charming, Mischievous, Loving",
  },
  {
    value: "boston-terrier",
    label: "Boston Terrier",
    size: "Small",
    temperament: "Friendly, Bright, Amusing",
  },
  {
    value: "maltese",
    label: "Maltese",
    size: "Small",
    temperament: "Gentle, Playful, Charming",
  },
  {
    value: "mixed-breed",
    label: "Mixed Breed",
    size: "Varies",
    temperament: "Unique",
  },
  { value: "other", label: "Other", size: "Varies", temperament: "Varies" },
];

interface BreedAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  required?: boolean;
}

export const BreedAutocomplete = ({
  value,
  onChange,
  id = "breed",
  required = false,
}: BreedAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedBreed = useMemo(() => {
    return DOG_BREEDS.find(
      breed => breed.label.toLowerCase() === value.toLowerCase()
    );
  }, [value]);

  const filteredBreeds = useMemo(() => {
    if (!searchQuery) return DOG_BREEDS;

    const query = searchQuery.toLowerCase();
    return DOG_BREEDS.filter(
      breed =>
        breed.label.toLowerCase().includes(query) ||
        breed.temperament.toLowerCase().includes(query) ||
        breed.size.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  useEffect(() => {
    if (value && !selectedBreed) {
      setSearchQuery(value);
    }
  }, [value, selectedBreed]);

  const handleSelectBreed = (breedLabel: string) => {
    onChange(breedLabel);
    setOpen(false);
    setSearchQuery("");
  };

  const handleInputChange = (inputValue: string) => {
    setSearchQuery(inputValue);
    onChange(inputValue);
    if (inputValue && !open) {
      setOpen(true);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        Breed{required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value || "Select breed..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search breeds..."
              value={searchQuery}
              onValueChange={handleInputChange}
              ref={inputRef}
            />
            <CommandList>
              <CommandEmpty>
                {searchQuery ? (
                  <div className="text-sm p-2">
                    <p className="font-medium">No breed found.</p>
                    <p className="text-muted-foreground mt-1">
                      Try "Mixed Breed" or "Other"
                    </p>
                  </div>
                ) : (
                  <p className="text-sm">Start typing to search...</p>
                )}
              </CommandEmpty>
              <CommandGroup>
                {filteredBreeds.map(breed => (
                  <CommandItem
                    key={breed.value}
                    value={breed.label}
                    onSelect={handleSelectBreed}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === breed.label ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{breed.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {breed.size} • {breed.temperament}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedBreed && (
        <div className="text-sm text-muted-foreground mt-2 p-2 bg-muted rounded-md">
          <p>
            <strong>Size:</strong> {selectedBreed.size}
          </p>
          <p>
            <strong>Temperament:</strong> {selectedBreed.temperament}
          </p>
        </div>
      )}
    </div>
  );
};
