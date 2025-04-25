const { ChatGroq } = require("@langchain/groq");

const llmForToolCalling = new ChatGroq({
    model: "llama3-groq-70b-8192-tool-use-preview",
    temperature: 0.5,
    max_tokens: 1024,
    apiKey: process.env.GROQ_API_KEY,
    maxRetries: 2,
});

module.exports = llmForToolCalling;
