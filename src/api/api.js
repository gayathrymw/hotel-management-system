// api.js

const BASE_URL = 'http://localhost:5000/api'; // Update this with your backend URL

export const fetchBookings = async () => {
  try {
    const response = await fetch(`${BASE_URL}/bookings`);
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
      throw new Error('Failed to create booking');
    }
    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const editBooking = async (bookingId, bookingData) => {
  try {
    const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
      throw new Error('Failed to edit booking');
    }
    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to cancel booking');
    }
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
