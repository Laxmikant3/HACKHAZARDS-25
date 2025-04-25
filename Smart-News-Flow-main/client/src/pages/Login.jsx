import { useState } from 'react';

function Login({ onNavigate }) {
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = () => {
        if (!validateEmail(email)) {
            setIsValidEmail(false);
            return;
        }

        onNavigate('search', { email });
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <>
            <h1>Smart News Flow</h1>

            <p className="read-the-docs">
                Experience Historical and real-time news in a smart way from multiple sources.
            </p>
            <div className="card">
                <input type="email" placeholder="example@gmail.com" value={email} onChange={handleChange} autoComplete="on" />
                {!isValidEmail && <p className="error">Please enter a valid email</p>}
                <button onClick={handleSubmit}>Get Started</button>
                <p>Enter your email to get started</p>
            </div>
        </>
    );
}

export default Login;
