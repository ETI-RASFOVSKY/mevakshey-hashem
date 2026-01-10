require('dotenv').config(); // כדי להשתמש בקובץ .env

const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const emailRoutes = require('./routes/emailRoutes');

// בדיקת משתני סביבה נדרשים
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error('Missing required environment variables: SUPABASE_URL, SUPABASE_KEY');
}

if (!process.env.JWT_SECRET) {
  throw new Error('Missing required environment variable: JWT_SECRET');
}

if (!process.env.ADMIN_HASH) {
  console.warn('Warning: ADMIN_HASH not set. Admin login will work only if admin exists in Supabase admins table.');
}

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// רוט בדיקה
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// חיבור ראוטים
app.use('/api/auth', authRoutes);
console.log("Auth routes connected at /api/auth");

app.use('/api/users', userRoutes);
console.log("User routes connected at /api/users");

app.use('/api/media', mediaRoutes);
console.log("Media routes connected at /api/media");

app.use('/api/email', emailRoutes);
console.log("Email routes connected at /api/email");

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
