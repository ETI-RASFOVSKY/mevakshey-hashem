import { configureStore } from "@reduxjs/toolkit";
import DonorSlice from "../features/donors/DonorSlice";
import imageReducer from '../features/images/imageSlice';

export const store = configureStore({
    reducer: {
        users: DonorSlice,
        images: imageReducer,
    }
});