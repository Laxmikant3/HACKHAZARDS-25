import { useState, useEffect } from 'react';
import { Login, Search, NewsFlow } from './pages';
import './App.css';

function App() {
    // Retrieve initial states from local storage or use default values
    const [page, setPage] = useState(() => localStorage.getItem('page') || 'login');
    const [data, setData] = useState(() => JSON.parse(localStorage.getItem('data')) || {});
    const [promptHistoryData, setPromptHistoryData] = useState(() => JSON.parse(localStorage.getItem('promptHistoryData')) || []);

    // Update local storage whenever the state changes
    useEffect(() => {
        localStorage.setItem('page', page);
    }, [page]);

    useEffect(() => {
        localStorage.setItem('data', JSON.stringify(data));
    }, [data]);

    useEffect(() => {
        localStorage.setItem('promptHistoryData', JSON.stringify(promptHistoryData));
    }, [promptHistoryData]);

    const handleNavigate = (page, newData, index) => {
        setPage(page);
        setData(newData);
        if (index === 'back') {
            setPromptHistoryData((prevPromptHistory) => ([...prevPromptHistory, newData]));
        }
        if (index !== undefined && index !== 'back') {
            setPromptHistoryData((prevPromptHistory) => {
                return prevPromptHistory.filter((_, i) => i !== index);
            });
        }
    };

    return (
        <>
            {!data.email && <Login onNavigate={handleNavigate} />}
            {data.email && page === 'search' && (
                <Search onNavigate={handleNavigate} data={data} promptHistoryData={promptHistoryData} />
            )}
            {data.email && data.prompt && page === 'newsflow' && (
                <NewsFlow onNavigate={handleNavigate} data={data} />
            )}
        </>
    );
}

export default App;
