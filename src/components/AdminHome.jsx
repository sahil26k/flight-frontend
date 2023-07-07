import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './adminhome.css'
const AdminHome = () => {
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [newFlight, setNewFlight] = useState({
    flight_id: '',
    flight_number: '',
    origin: '',
    destination: '',
    departure_time: '',
    arrival_time: '',
    seat_count: ''
  });

  useEffect(() => {
    // Fetch flights
    axios.get('https://flightapi-xdy0.onrender.com/flight')
      .then(response => {
        setFlights(response.data);
      })
      .catch(error => {
        console.error(error);
      });

    // Fetch bookings
    axios.get('https://flightapi-xdy0.onrender.com/bookings')
      .then(response => {
        setBookings(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);



  const handleAddFlight = () => {
    // Send a POST request to add the flight
    axios.post('https://flightapi-xdy0.onrender.com/flights', newFlight)
      .then(response => {
        // Add the new flight to the flights state
        setFlights(prevFlights => [...prevFlights, response.data]);
        console.log('Flight added successfully');
        setNewFlight({
          flight_id: '',
          flight_number: '',
          origin: '',
          destination: '',
          departure_time: '',
          arrival_time: '',
          seat_count: ''
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleRemoveFlight = (flightId) => {
    // Send a DELETE request to remove the flight
    axios.delete(`https://flightapi-xdy0.onrender.com/flights/${flightId}`)
      .then(response => {
        // Remove the flight from the flights state
        setFlights(prevFlights => prevFlights.filter(flight => flight.flight_id !== flightId));
        console.log(`Flight with ID ${flightId} removed successfully`);
      })
      .catch(error => {
        console.error(error);
      });
  };
  const handleCancelBooking = (bookingId) => {
    axios
      .delete(`https://flightapi-xdy0.onrender.com/bookings/${bookingId}`)
      .then(response => {
        setBookings(prevBookings => prevBookings.filter(booking => booking.booking_id !== bookingId));
        console.log('Booking canceled successfully');
        // Perform any additional actions or update state as needed
      })
      .catch(error => {
        console.error('Error canceling booking:', error);
        // Handle any error scenarios
      });
  };

  const handleInputChange = (e) => {
    setNewFlight({ ...newFlight, [e.target.name]: e.target.value });
  };

  return (
    <div className='center' >
      <h2>Welcome, Admin!</h2>
  
      <h3>Flights</h3>
        <table>
          <thead>
            <tr>
              <th>Flight Number</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <tr key={flight.flight_id}>
                <td>{flight.flight_number}</td>
                <td>{flight.origin}</td>
                <td>{flight.destination}</td>
                <td>
                  <button onClick={() => handleRemoveFlight(flight.flight_id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>


  
      <h3>Add Flight</h3>
      <form onSubmit={handleAddFlight} className='container' >
        <div>
          <label htmlFor="flight_id">Flight ID:</label>
          <input type="text" id="flight_id" name="flight_id" value={newFlight.flight_id} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="flight_number">Flight Number:</label>
          <input type="text" id="flight_number" name="flight_number" value={newFlight.flight_number} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="origin">Origin:</label>
          <input type="text" id="origin" name="origin" value={newFlight.origin} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="destination">Destination:</label>
          <input type="text" id="destination" name="destination" value={newFlight.destination} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="time">Time:</label>
          <input
            type="time"
            id="time"
            name="time"
            value={newFlight.time}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={newFlight.date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="seat_count">Seat Count:</label>
          <input type="text" id="seat_count" name="seat_count" value={newFlight.seat_count} onChange={handleInputChange} required />
        </div>
        <button type="submit">Add Flight</button>
      </form>
  

  

      <h3>Bookings</h3>
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Passenger Name</th>
              <th>Flight ID</th>
              <th>Seat Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.booking_id}>
                <td>{booking.booking_id}</td>
                <td>{booking.name}</td>
                <td>{booking.flight_id}</td>
                <td>{booking.seat_number}</td>
                <td>
                  <button onClick={() => handleCancelBooking(booking.booking_id)}>
                    Cancel Booking
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>


    </div>
  );
};

export default AdminHome;

