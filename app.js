import express from 'express';
import cors from 'cors'; // Import CORS package
import http from 'http';
import { OpenAI } from "langchain/llms/openai";
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { loadQAStuffChain } from "langchain/chains";
import { fileURLToPath } from "url";
import { dirname } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
app.use(cors()); // Use CORS middleware
const port = 3001;

/* Create HTTP server */
http.createServer(app).listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/* Get endpoint to check current status */
app.get('/api/health', async (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
  })
})

let currentQuestion = ''; // To store the current question

app.get('/ask', async (req, res) => {
  try {
    const llmA = new OpenAI({ modelName: "gpt-3.5-turbo"});
    const chainA = loadQAStuffChain(llmA);
    const directory = ".\\vectorstore\\";

    const loadedVectorStore = await FaissStore.load(
      directory,
      new OpenAIEmbeddings()
    );

    const question = req.query.question; // Use the current question
    const result = await loadedVectorStore.similaritySearch(question, 1);
    const resA = await chainA.call({
      input_documents: result,
      question,
    });

     res.json({ result: resA }); // Send the response as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
