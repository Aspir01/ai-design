import React, { useState } from 'react';
import style from "./Inputs.module.css";

const Inputs = ({ handleUserInput, handleAnswer }) => {
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleClearInput = () => {
        setInputValue("");
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const downloadImage = async (imageId) => {
        const url = `https://gigachat.devices.sberbank.ru/api/v1/files/${imageId}/content`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/jpg',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            return imageUrl;
        } catch (error) {
            console.error('Error downloading image:', error);
            return null;
        }
    };

    const handleKeyPress = async (event) => {
        if (event.key === 'Enter') {
            setLoading(true);

            try {
                const response = await fetch('http://79.174.84.28:8000/picasso/api/text/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                    body: JSON.stringify({ usertext: inputValue }),
                    credentials: 'include'
                });

                const data = await response.json();
                console.log(data);

                const imageId = data.img_text;

                // Ждем несколько секунд перед загрузкой изображения (если требуется время на генерацию)
                await new Promise(resolve => setTimeout(resolve, 5000));

                const imageUrl = await downloadImage(imageId);

                if (imageUrl) {
                    handleAnswer(imageUrl);
                }

                handleUserInput(inputValue);
                setInputValue("");
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className={style.main}>
            <div className={style.container}>
                <input
                    type="text"
                    placeholder='Начните создавать'
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                />
                <button>
                    <svg width="20" height="26" viewBox="0 0 20 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.73372 0.199951C10.7946 0.199951 11.812 0.621379 12.5622 1.37152C13.3123 2.12167 13.7337 3.13909 13.7337 4.19995V12.2C13.7337 13.2608 13.3123 14.2782 12.5622 15.0284C11.812 15.7785 10.7946 16.2 9.73372 16.2C8.67286 16.2 7.65544 15.7785 6.9053 15.0284C6.15515 14.2782 5.73372 13.2608 5.73372 12.2V4.19995C5.73372 3.13909 6.15515 2.12167 6.9053 1.37152C7.65544 0.621379 8.67286 0.199951 9.73372 0.199951ZM19.0671 12.2C19.0671 16.9066 15.5871 20.7866 11.0671 21.44V25.5333H8.40039V21.44C3.88039 20.7866 0.400391 16.9066 0.400391 12.2H3.06706C3.06706 13.9681 3.76944 15.6638 5.01968 16.914C6.26992 18.1642 7.96561 18.8666 9.73372 18.8666C11.5018 18.8666 13.1975 18.1642 14.4478 16.914C15.698 15.6638 16.4004 13.9681 16.4004 12.2H19.0671Z" fill="#333333" />
                    </svg>
                </button>
                <button onClick={handleClearInput}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M4.19306 5H8V7H1V0H3V3.27035C4.72511 1.18251 7.19577 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10H2C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C7.60638 2 5.55354 3.0787 4.19306 5Z" fill="#828282" />
                    </svg>
                </button>
            </div>
            <button className={style.samples}><a href="https://developers.sber.ru/help/gigachat/how-to-generate-images" target='_blank'>Шаблоны</a></button>
            {loading && <p className={style.loading}>Загрузка...</p>}
        </div>
    );
};

export default Inputs;
