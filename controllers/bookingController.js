// bookingController.js

// Import necessary modules
const Booking = require('../models/booking');

// Function to calculate the total price based on room type and duration
function calculateTotalPrice(roomType, startTime, endTime) {
    // Convert start time and end time to Date objects
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    // Calculate the duration in hours
    const durationInHours = (endDate - startDate) / (1000 * 60 * 60);

    // Define prices per hour for each room type
    const pricesPerHour = {
        'A': 100,
        'B': 80,
        'C': 50
    };

    // Calculate the total price based on the room type and duration
    const totalPrice = pricesPerHour[roomType] * durationInHours;

    return totalPrice;
}

// Function to recalculate the total price based on changes in booking details
function recalculateTotalPrice(previousBooking, updatedBooking) {
    // Calculate the duration difference in hours
    const previousStartTime = new Date(previousBooking.startTime);
    const updatedStartTime = new Date(updatedBooking.startTime);
    const previousEndTime = new Date(previousBooking.endTime);
    const updatedEndTime = new Date(updatedBooking.endTime);
    const previousDurationInHours = (previousEndTime - previousStartTime) / (1000 * 60 * 60);
    const updatedDurationInHours = (updatedEndTime - updatedStartTime) / (1000 * 60 * 60);
    const durationDifferenceInHours = updatedDurationInHours - previousDurationInHours;

    // Define prices per hour for each room type
    const pricesPerHour = {
        'A': 100,
        'B': 80,
        'C': 50
    };

    // Calculate the total price difference based on the room type and duration difference
    const totalPriceDifference = pricesPerHour[updatedBooking.roomType] * durationDifferenceInHours;

    // Calculate the recalculated total price
    const recalculatedTotalPrice = previousBooking.totalPrice + totalPriceDifference;

    return recalculatedTotalPrice;
}

// Controller function to create a new booking
exports.createBooking = async (req, res) => {
    try {
        const { userEmail, roomNumber, startTime, endTime } = req.body;

        // Calculate total price
        const totalPrice = calculateTotalPrice(req.body.roomType, startTime, endTime);

        // Check for overlapping bookings
        const existingBooking = await Booking.findOne({
            roomNumber,
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
                { startTime: { $gte: startTime, $lt: endTime } },
                { endTime: { $gt: startTime, $lte: endTime } }
            ]
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'Booking overlaps with an existing booking' });
        }

        const newBooking = new Booking({
            userEmail,
            roomNumber,
            startTime,
            endTime,
            totalPrice
        });

        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller function to update a booking
exports.updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { userEmail, roomNumber, startTime, endTime } = req.body;

        // Find the booking by ID
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Calculate recalculated total price
        const recalculatedTotalPrice = recalculateTotalPrice(booking, req.body);

        // Update the booking details
        booking.userEmail = userEmail;
        booking.roomNumber = roomNumber;
        booking.startTime = startTime;
        booking.endTime = endTime;
        booking.totalPrice = recalculatedTotalPrice;

        await booking.save();
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller function to cancel a booking
exports.cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the booking by ID
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Perform cancellation logic based on start time
        let refundPercentage;
        const now = new Date();
        const bookingStartTime = new Date(booking.startTime);
        const timeDifferenceInHours = (bookingStartTime - now) / (1000 * 60 * 60);

        if (timeDifferenceInHours > 48) {
            refundPercentage = 1; // Full refund
        } else if (timeDifferenceInHours > 24) {
            refundPercentage = 0.5; // 50% refund
        } else {
            refundPercentage = 0; // No refund
        }

        const refundAmount = booking.totalPrice * refundPercentage;

        // Update booking status and refund amount
        booking.status = 'cancelled';
        booking.refundAmount = refundAmount;

        await booking.save();
        res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller function to get all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller function to get bookings by room number and room type
exports.getBookingsByRoom = async (req, res) => {
    try {
        const { roomNumber, roomType } = req.query;
        let query = {};

        if (roomNumber) {
            query.roomNumber = roomNumber;
        }
        if (roomType) {
            query.roomType = roomType;
        }

        const bookings = await Booking.find(query);
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller function to get bookings by start time and end time
exports.getBookingsByTime = async (req, res) => {
    try {
        const { startTime, endTime } = req.query;
        let query = {};

        if (startTime && endTime) {
            query.startTime = { $gte: startTime, $lte: endTime };
        }

        const bookings = await Booking.find(query);
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
