// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { createBooking, cancelBooking, updateBooking, getAllBookings } = require('./controllers/bookingController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hotel_booking_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.post('/api/bookings', createBooking);
app.delete('/api/bookings/:id', cancelBooking);
app.put('/api/bookings/:id', updateBooking);
app.get('/api/bookings', getAllBookings);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
