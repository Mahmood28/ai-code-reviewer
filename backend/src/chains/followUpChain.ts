import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { HumanMessage, AIMessage, BaseMessage } from '@langchain/core/messages';
import type { ChatRequest } from '../types.js';

const model = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.3,
});

const chatPrompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `You are a code review assistant. The user has received an AI review of their {language} code.
Help them understand and fix the issues. Be concise (under 200 words), direct, and actionable.
Use markdown for code snippets and structure.

Original code under review:
\`\`\`{language}
{code}
\`\`\`

Review summary: {summary}`,
  ],
  new MessagesPlaceholder('history'),
  ['human', '{question}'],
]);

/**
 * Continue a follow-up conversation about a reviewed code snippet.
 */
export async function runFollowUpChain({
  question,
  code,
  language,
  summary,
  history = [],
}: ChatRequest): Promise<string> {
  const messages: BaseMessage[] = history.map((m) =>
    m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
  );

  const chain = RunnableSequence.from([
    chatPrompt,
    model,
    new StringOutputParser(),
  ]);

  return chain.invoke({ question, code, language, summary, history: messages });
}
