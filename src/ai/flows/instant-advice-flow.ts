'use server';
/**
 * @fileOverview An AI agent that provides instant pet advice.
 *
 * - getInstantAdvice - A function that handles the advice generation process.
 * - GetInstantAdviceInput - The input type for the getInstantAdvice function.
 * - GetInstantAdviceOutput - The return type for the getInstantAdvice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GetInstantAdviceInputSchema = z.object({
  question: z.string().describe('The question the user is asking.'),
});
export type GetInstantAdviceInput = z.infer<typeof GetInstantAdviceInputSchema>;

const GetInstantAdviceOutputSchema = z.string().describe("The AI's response to the user's question.");
export type GetInstantAdviceOutput = z.infer<typeof GetInstantAdviceOutputSchema>;

export async function getInstantAdvice(
  input: GetInstantAdviceInput
): Promise<GetInstantAdviceOutput> {
  return instantAdviceFlow(input);
}

const instantAdviceFlow = ai.defineFlow(
  {
    name: 'instantAdviceFlow',
    inputSchema: GetInstantAdviceInputSchema,
    outputSchema: GetInstantAdviceOutputSchema,
  },
  async ({ question }) => {

    const llmResponse = await ai.generate({
      prompt: `You are a friendly and knowledgeable pet care expert for the PetConnect app. Your goal is to provide helpful, safe, and encouraging advice to pet owners.

      Always prioritize the pet's safety and well-being. If a situation sounds urgent or serious, strongly advise the user to contact a veterinarian immediately. Do not provide medical diagnoses.
      
      Please answer the following question from the user: "${question}"`,
      model: 'googleai/gemini-pro',
      config: {
        safetySettings: [
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
          },
        ],
      },
    });

    return llmResponse.text;
  }
);
