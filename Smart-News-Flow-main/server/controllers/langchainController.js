const llmForToolCalling = require('../services/langchainService');
const { z } = require('zod');

async function keywordsGenerator(prompt) {
    const Keywords = z.object({
        keywords: z
            .array(z.string().describe("keywords"))
            .describe("List of keywords"),
    });

    const structuredLlm = llmForToolCalling.withStructuredOutput(Keywords, {
        name: "Keywords",
    });

    const keywordsResults = await structuredLlm.invoke([
        [
            "system",
            `You are a specialized Research Assistant focused on event analysis and information transfer. Your primary task is to generate effective keywords for NewsAPI searches based on ideas, requests, topics, or project details provided by the user. 

NewsAPI is a platform offering real-time access to current and historic news articles from over 150,000 worldwide sources. Your goal is to create keywords that will yield the best search results on this platform.

When generating keywords, consider the following:
1. Relevance to the given topic or project
2. Current events and trending topics
3. Geographic and cultural context
4. Time sensitivity of information
5. Multiple perspectives on the subject
6. Potential synonyms and related terms
7. Industry-specific jargon or terminology
8. Acronyms and abbreviations
9. Named entities (people, organizations, locations)
10. Cause and effect relationships

Follow these guidelines for your output:
- Prioritize keywords by potential relevance and specificity
- Include a mix of broad and narrow terms
- Consider boolean operators for complex queries (AND, OR, NOT)
- Suggest phrases in quotes for exact matches when appropriate
- Limit the number of keywords to 2-3
- Avoid overly generic terms that may lead to information overload

Additional instructions:
- Be prepared to adapt keyword suggestions based on initial search results
- Provide brief explanations for chosen keywords if requested
- Be ready to refine searches based on user feedback
- Stay updated on NewsAPI's search capabilities and best practices

Your response should be a JSON array of keyword for example [keyword1,keyword2,...] just that and no other text or explanation`,
        ],
        ["human", prompt],
    ]);

    console.log("Keywords", keywordsResults);

    return keywordsResults.keywords;
}

async function checkRelevance(prompt, content) {
    const Relevance = z.object({
        relevant: z.boolean().describe("Boolean value indicating relevance"),
        content: z.string().nullable().describe("Short news tweet that answers the prompt"),
    });

    const structuredLlm = llmForToolCalling.withStructuredOutput(Relevance, {
        name: "Relevance",
    });

    const relevanceResults = await structuredLlm.invoke([
        [
            "system",
            `You are a specialized Research Assistant focused on event analysis and information transfer. Your primary task is to evaluate the relevance of news articles to specific prompts or topics provided by the user. 

When assessing relevance, consider the following:
1. Direct connection to the prompt or topic
2. Accuracy and factual information

Your goal is to determine whether the content of a news article is relevant to the prompt. If the content is relevant, provide a short news tweet that answers the prompt. If the content is not relevant, return a boolean value indicating the lack of relevance.

Follow these guidelines for your output:
- Use a binary response (true/false) for relevance
- Keep the news tweet concise and informative
- Avoid subjective opinions or interpretations
- Focus on factual information and direct answers

Your response should be a JSON object with two keys: 'relevant' (boolean) and 'content' (string).`,
        ],
        ["human", prompt],
        ["human", content],
    ]);

    console.log("Relevance", relevanceResults);

    return relevanceResults;
}

module.exports = { keywordsGenerator, checkRelevance };