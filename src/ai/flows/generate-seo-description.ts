'use server';

/**
 * @fileOverview A flow that generates an SEO-optimized description for the website.
 *
 * - generateSEODescription - A function that generates the SEO description.
 * - GenerateSEODescriptionInput - The input type for the generateSEODescription function.
 * - GenerateSEODescriptionOutput - The return type for the generateSEODescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSEODescriptionInputSchema = z.object({
  services: z
    .string()
    .describe('A comma-separated list of services offered by the company.'),
  targetAudience: z.string().describe('A description of the target audience.'),
  location: z.string().describe('The location of the business.'),
});
export type GenerateSEODescriptionInput = z.infer<
  typeof GenerateSEODescriptionInputSchema
>;

const GenerateSEODescriptionOutputSchema = z.object({
  seoDescription: z
    .string()
    .describe('The SEO-optimized description for the website.'),
});
export type GenerateSEODescriptionOutput = z.infer<
  typeof GenerateSEODescriptionOutputSchema
>;

export async function generateSEODescription(
  input: GenerateSEODescriptionInput
): Promise<GenerateSEODescriptionOutput> {
  return generateSEODescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSEODescriptionPrompt',
  input: {schema: GenerateSEODescriptionInputSchema},
  output: {schema: GenerateSEODescriptionOutputSchema},
  prompt: `You are an SEO expert tasked with generating a compelling and
  search engine optimized description for a website.

  The website provides the following services: {{{services}}}.
  The target audience is: {{{targetAudience}}}.
  The business is located in: {{{location}}}.

  Write a concise and engaging SEO description that incorporates relevant
  keywords to attract the target audience and improve search engine rankings.
  The description should be no more than 160 characters.
  Ensure the description accurately reflects the services offered and the
  location of the business.
  Remember to focus on clear value proposition and include strong keywords.
  Please do not include any hashtags.
`,
});

const generateSEODescriptionFlow = ai.defineFlow(
  {
    name: 'generateSEODescriptionFlow',
    inputSchema: GenerateSEODescriptionInputSchema,
    outputSchema: GenerateSEODescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
