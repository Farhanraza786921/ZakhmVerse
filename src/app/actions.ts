
'use server';

import { generatePoem, GeneratePoemInput } from '@/ai/flows/generate-poem-from-prompt';
import { z } from 'zod';

const ActionInputSchema = z.object({
  prompt: z.string().min(1, { message: 'Prompt cannot be empty.' }),
  mood: z.string().optional(),
  language: z.string().optional(),
  style: z.string().optional(),
  length: z.string().optional(),
  keywords: z.string().optional(),
  rhyme: z.string().optional(),
});

export async function handleGeneratePoem(input: GeneratePoemInput) {
    const validation = ActionInputSchema.safeParse(input);
    if (!validation.success) {
        return { error: 'Invalid input.' };
    }

    try {
        const result = await generatePoem(validation.data);
        return { poem: result.poem };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to generate poem. Please try again later.' };
    }
}
