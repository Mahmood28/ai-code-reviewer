import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from '@langchain/openai';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let _store: MemoryVectorStore | null = null;

/**
 * Build (once) and cache an in-memory vector store from the knowledge base.
 */
export async function getVectorStore(): Promise<MemoryVectorStore> {
  if (_store) return _store;

  const knowledgePath = path.join(__dirname, '../knowledge/conventions.md');
  const loader = new TextLoader(knowledgePath);
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  const chunks = await splitter.splitDocuments(docs);

  _store = await MemoryVectorStore.fromDocuments(
    chunks,
    new OpenAIEmbeddings({ model: 'text-embedding-3-small' })
  );

  return _store;
}

/**
 * Retrieve the top-k most relevant convention snippets for a query.
 */
export async function retrieveConventions(query: string, k = 4): Promise<string> {
  const store = await getVectorStore();
  const results = await store.similaritySearch(query, k);
  return results.map((r) => r.pageContent).join('\n\n---\n\n');
}
