import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/main.css";
import App from './App.tsx'
import Providers from './core/Providers.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Providers>
            <App />
        </Providers>
    </StrictMode>,
)
