// components/BookingForm.js

import React, { useState } from 'react';
import { createBooking } from '../api';

function BookingForm() {
  const [userEmail, setUserEmail] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookingData = { userEmail, roomNumber, startTime, endTime };
      await createBooking(bookingData);
      // Reset form fields after successful booking
      setUserEmail('');
      setRoomNumber('');
      setStartTime('');
      setEndTime('');
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Book a Room</h2>
      {error && <p>Error: {error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="User Email" required />
        <input type="text" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} placeholder="Room Number" required />
        <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        <button type="submit">Book</button>
      </form>
    </div>
  );
}

export default BookingForm;
