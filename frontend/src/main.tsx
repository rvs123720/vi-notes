import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = "607338838579-fi7t8l98c0jc57t5b5dubv3pjd5dg5tf.apps.googleusercontent.com";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
);