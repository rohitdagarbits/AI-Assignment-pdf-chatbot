import { OpenAI } from "langchain/llms/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import * as dotenv from 'dotenv'
dotenv.config()

export const injest_docs = async() => {
  const loader = new PDFLoader("WILP_IR_Assignment.pdf"); //name of the pdf, place pdf in root directory
  const docs = await loader.load();
  console.log('docs loaded')
  
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })

  const docOutput = await textSplitter.splitDocuments(docs)
  let vectorStore = await FaissStore.fromDocuments(
    docOutput,
    new OpenAIEmbeddings(),
    )
    console.log('saving data...')

    const directory = ".\\vectorstore\\"; 
    await vectorStore.save(directory);
    console.log('data saved!, start application to chat with your pdf data')

}

injest_docs()