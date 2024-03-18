// components/CancelBookingForm.js

import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { cancelBooking } from '../api';

function CancelBookingForm() {
  const history = useHistory();
  const { bookingId } = useParams();
  const [error, setError] = useState(null);

  const handleCancellation = async () => {
    try {
      await cancelBooking(bookingId);
      history.push('/'); // Redirect to bookings page after successful cancellation
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Cancel Booking</h2>
      {error && <p>Error: {error}</p>}
      <p>Are you sure you want to cancel this booking?</p>
      <button onClick={handleCancellation}>Yes, Cancel Booking</button>
    </div>
  );
}

export default CancelBookingForm;
