require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const Admin = require('./models/admin');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Create default admin
const createDefaultAdmin = async () => {
    try {
        const adminExists = await Admin.findOne({ email: process.env.DEFAULT_ADMIN_EMAIL });
        if (!adminExists) {
            await Admin.create({
                email: process.env.DEFAULT_ADMIN_EMAIL,
                password: process.env.DEFAULT_ADMIN_PASSWORD,
            });
            console.log('Default admin created');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
};

createDefaultAdmin();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
