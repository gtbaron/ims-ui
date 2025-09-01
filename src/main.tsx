import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { configureStore } from '@reduxjs/toolkit';
import partsReducer from "./store/slices/PartsSlice";
import itemsReducer from "./store/slices/ItemsSlice";
import React from "react";
import {Provider} from "react-redux";

export const store = configureStore({
    reducer: {
        parts: partsReducer,
        items: itemsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>
)
