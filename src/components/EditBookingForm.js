// components/EditBookingForm.js

import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { editBooking } from '../api';

function EditBookingForm() {
  const history = useHistory();
  const { bookingId } = useParams();
  const [userEmail, setUserEmail] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch booking details using bookingId and populate form fields
  }, [bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookingData = { userEmail, roomNumber, startTime, endTime };
      await editBooking(bookingId, bookingData);
      history.push('/'); // Redirect to bookings page after successful edit
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Edit Booking</h2>
      {error && <p>Error: {error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="User Email" required />
        <input type="text" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} placeholder="Room Number" required />
        <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditBookingForm;

