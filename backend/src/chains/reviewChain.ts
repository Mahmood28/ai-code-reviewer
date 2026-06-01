import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { retrieveConventions } from '../rag/vectorStore.js';
import type { ReviewResult, ReviewRequest } from '../types.js';

const model = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.2,
});

const reviewPrompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `You are an expert code reviewer. You have access to the project's coding conventions below.
Use them to flag style/convention violations in addition to bugs, security issues, and quality concerns.

PROJECT CONVENTIONS (retrieved via RAG):
{conventions}

Return ONLY raw JSON (no markdown fences) matching this exact shape:
{{
  "scores": {{
    "overall": <1-10>,
    "readability": <1-10>,
    "structure": <1-10>,
    "maintainability": <1-10>,
    "security": <1-10>
  }},
  "summary": "<2-3 sentence overall assessment>",
  "findings": [
    {{
      "id": "F1",
      "category": "security|bug|readability|structure|maintainability|performance|convention",
      "severity": "critical|warning|info|good",
      "title": "<short title>",
      "description": "<detailed explanation>",
      "snippet": "<relevant code snippet, max 80 chars, or empty string>",
      "fix": "<concise fix suggestion>"
    }}
  ],
  "topPriorities": ["<action 1>", "<action 2>", "<action 3>"]
}}

Include 5-10 findings. Mix issues with positives (severity: "good"). Be specific and actionable.`,
  ],
  ['human', 'Review this {language} code:\n```{language}\n{code}\n```'],
]);

/**
 * Run the full code review chain with RAG-grounded conventions.
 */
export async function runReviewChain({ code, language }: ReviewRequest): Promise<ReviewResult> {
  const conventions = await retrieveConventions(
    `${language} code review: bugs, security, style`
  );

  const chain = RunnableSequence.from([
    reviewPrompt,
    model,
    new StringOutputParser(),
  ]);

  const raw = await chain.invoke({ code, language, conventions });
  const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  return JSON.parse(clean) as ReviewResult;
}
