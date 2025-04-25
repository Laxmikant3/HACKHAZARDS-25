import React, { useEffect, useState } from 'react';
import NewsDisplay from '../component/NewsDisplay';

const NewsFlow = ({ onNavigate, data }) => {
    const { email, prompt } = data;
    const [news, setNews] = useState(data.news || []);

    useEffect(() => {
        const socket = new WebSocket(`${import.meta.env.VITE_WS_BASE_URL}?userId=${email}&prompt=${prompt}`);
        
        socket.onmessage = (event) => {
            const receivedData = JSON.parse(event.data);
            setNews((prevNews) => [...prevNews, receivedData]);
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            socket.close();
        };
    }, [email, prompt]);

    const handleBack = () => {
        onNavigate('search', { email, prompt, news } , "back");
    };

    return (
        <div className="news-flow">
            <div className="nav-top">
                <div className="nav">
                    <h2>Smart News Flow</h2>
                    <button onClick={handleBack}>Back to Search</button>
                </div>
                <h2>{prompt}?</h2>
            </div>
            <NewsDisplay newsData={news} />
        </div>
    );
};

export default NewsFlow;
