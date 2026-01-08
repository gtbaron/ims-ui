import React, {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App'
import {configureStore} from '@reduxjs/toolkit';
import partsReducer from './store/slices/PartsSlice';
import itemsReducer from './store/slices/ItemsSlice';
import pickListsReducer from './store/slices/PickListSlice';
import shopReducer from './store/slices/ShopSlice';
import listingsReducer from './store/slices/ListingsSlice';
import {Provider} from 'react-redux';

export const store = configureStore({
    reducer: {
        parts: partsReducer,
        items: itemsReducer,
        pickLists: pickListsReducer,
        shop: shopReducer,
        listings: listingsReducer,
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
