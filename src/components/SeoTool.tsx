"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { generateSEODescription, type GenerateSEODescriptionInput } from "@/ai/flows/generate-seo-description";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wand2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

type FormValues = GenerateSEODescriptionInput;

const SeoTool = () => {
  const { register, handleSubmit } = useForm<FormValues>();
  const [seoDescription, setSeoDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setSeoDescription("");
    try {
      const result = await generateSEODescription(data);
      setSeoDescription(result.seoDescription);
    } catch (e) {
      setError("Failed to generate SEO description. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Wand2 className="text-primary" />
          AI SEO Description Generator
        </CardTitle>
        <CardDescription>
          Optimize your website's visibility with an AI-generated SEO description.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="services">Services Offered</Label>
            <Input
              id="services"
              placeholder="e.g., Website Development, App Development"
              {...register("services", { required: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              placeholder="e.g., Small businesses, startups"
              {...register("targetAudience", { required: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Business Location</Label>
            <Input
              id="location"
              placeholder="e.g., Mumbai, India"
              {...register("location", { required: true })}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Description"}
          </Button>
        </form>
        {error && (
            <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {seoDescription && (
          <div className="mt-6 space-y-2">
            <Label htmlFor="seoResult">Generated SEO Description</Label>
            <Textarea
              id="seoResult"
              readOnly
              value={seoDescription}
              rows={4}
              className="bg-background"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SeoTool;
