const axios = require('axios');

async function getNewsArticles(keyword) {
    console.log(`Fetching news articles for keyword: ${keyword}`);
    try {
        const response = await axios.get(`https://newsapi.org/v2/everything?q=${keyword}&apiKey=${process.env.NEWS_API_KEY}`);
        console.log(response.data.articles);
        return response.data.articles;
    } catch (error) {
        console.error('Error fetching news articles:', error);
        throw new Error(`Failed to fetch news articles for keyword: ${keyword}`);
    }
}

module.exports = {
    getNewsArticles
};
