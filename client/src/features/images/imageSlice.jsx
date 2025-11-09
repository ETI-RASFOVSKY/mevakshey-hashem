import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  images: [
    { id: 1, url: '/images/לוגו ועד מבקשי השם-1.jpg' },
    { id: 2, url: '/images/שבת.jpg' },
    { id: 3, url: '/images/ב.jpg' },
    { id: 4, url: '/images/ג.jpg' },
  ],        // רשימת התמונות באפליקציה
  status: 'idle',    // מצב: idle / loading / succeeded / failed
  error: null
};

const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    addImage: (state, action) => {
      state.images.push(action.payload); // הוספת תמונה חדשה לרשימה
    },
    removeImage: (state, action) => {
      state.images = state.images.filter(img => img.id !== action.payload); // הסרה לפי מזהה
    },
    setImages: (state, action) => {
      state.images = action.payload; // הגדרת כל הרשימה מחדש
    }
  }
});

export const { addImage, removeImage, setImages } = imageSlice.actions;

export default imageSlice.reducer;
