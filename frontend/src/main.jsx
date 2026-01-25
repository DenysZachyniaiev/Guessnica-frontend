import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'

window.fbAsyncInit = function () {
    FB.init({
        appId: window.REACT_APP_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: false,
        version: "v18.0"
    });
};

createRoot(document.getElementById('root')).render(
    <StrictMode>
        {/* Wrap the entire app with the Router */}
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>,
);
