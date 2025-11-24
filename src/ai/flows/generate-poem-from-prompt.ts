'use server';

/**
 * @fileOverview Generates a poem based on a user prompt and optional constraints.
 *
 * - generatePoem - A function that generates a poem based on the input.
 * - GeneratePoemInput - The input type for the generatePoem function.
 * - GeneratePoemOutput - The output type for the generatePoem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePoemInputSchema = z.object({
  prompt: z.string().describe('The main text prompt for the poem.'),
  mood: z.string().optional().describe('The desired mood of the poem (e.g., happy, sad, reflective).'),
  language: z.string().optional().describe('The desired language of the poem (e.g., formal, informal).'),
  style: z.string().optional().describe('The desired style of the poem (e.g., sonnet, haiku, free verse).'),
  length: z.string().optional().describe('The desired length of the poem (e.g., short, medium, long).'),
  keywords: z.string().optional().describe('Keywords to include in the poem.'),
  rhyme: z.string().optional().describe('The desired rhyme scheme of the poem (e.g., AABB, ABAB, free verse).'),
});

export type GeneratePoemInput = z.infer<typeof GeneratePoemInputSchema>;

const GeneratePoemOutputSchema = z.object({
  poem: z.string().describe('The generated poem.'),
});

export type GeneratePoemOutput = z.infer<typeof GeneratePoemOutputSchema>;

export async function generatePoem(input: GeneratePoemInput): Promise<GeneratePoemOutput> {
  return generatePoemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePoemPrompt',
  input: {schema: GeneratePoemInputSchema},
  output: {schema: GeneratePoemOutputSchema},
  prompt: `You are a skilled poet. Generate a poem based on the following prompt and constraints.

Prompt: {{{prompt}}}

{{#if mood}}Mood: {{{mood}}}{{/if}}
{{#if language}}Language: {{{language}}}{{/if}}
{{#if style}}Style: {{{style}}}{{/if}}
{{#if length}}Length: {{{length}}}{{/if}}
{{#if keywords}}Keywords: {{{keywords}}}{{/if}}
{{#if rhyme}}Rhyme: {{{rhyme}}}{{/if}}

Poem:`,
});

const generatePoemFlow = ai.defineFlow(
  {
    name: 'generatePoemFlow',
    inputSchema: GeneratePoemInputSchema,
    outputSchema: GeneratePoemOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
