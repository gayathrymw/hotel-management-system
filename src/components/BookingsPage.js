// components/BookingsPage.js

import React, { useState, useEffect } from 'react';
import { fetchBookings } from '../api';

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const data = await fetchBookings();
        setBookings(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    getBookings();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>All Bookings</h2>
      <ul>
        {bookings.map((booking) => (
          <li key={booking._id}>
            {booking.userEmail} - Room: {booking.roomNumber} - {booking.startTime} to {booking.endTime}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookingsPage;
