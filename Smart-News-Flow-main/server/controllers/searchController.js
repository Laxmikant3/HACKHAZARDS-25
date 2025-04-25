const { keywordsGenerator } = require('./langchainController');
const { getNewsArticles } = require('../services/newsService');
const { eventEmitter } = require('../events/eventEmitter');

exports.search = async (req, res) => {
    const { email, prompt } = req.body;
    const user_id = email;
    const keywords = await keywordsGenerator(prompt);
    const articles = await getNewsArticles(keywords.join(' '));

    articles.forEach(article => {
        const payload = {
            user_id,
            prompt,
            keywords,
            article: {
                title: article.title,
                description: article.description,
                url: article.url,
                url_to_image: article.urlToImage,
                published_at: article.publishedAt,
                content: article.content
            },
        };
        eventEmitter.emit('data-event', JSON.stringify(payload));
    });
    res.status(200).send('Data routed to stream');
};