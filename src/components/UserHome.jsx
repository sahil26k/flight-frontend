import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation,  useNavigate } from 'react-router-dom';
import './userhome.css';



const UserHome = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingFormVisible, setBookingFormVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [myBookingsVisible, setMyBookingsVisible] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  
  const handleLogout = () => {
    navigate('/');
  };
  
  const [bookingData, setBookingData] = useState({
    name: '',
    flight_id: '',
    seat_number: ''
  });

  const location = useLocation();
  const username = location.state?.username || '';

  useEffect(() => {
    // Fetch flights
    axios
      .get('https://flightapi-xdy0.onrender.com/flights')
      .then((response) => {
        setFlights(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSearch = () => {
    setLoading(true);

    axios
      .get('https://flightapi-xdy0.onrender.com/flights', {
        params: {
          origin,
          destination,
          date,
          time
        }
      })
      .then((response) => {
        setFlights(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const handleBook = (flightId) => {
    // Find the selected flight from the flights array
    const selected = flights.find((flight) => flight.flight_id === flightId);
    setSelectedFlight(selected);
    setBookingFormVisible(true);
    setBookingData({
      name: '',
      flight_id: flightId,
      seat_number: '',
      username: ''
    });

    const bookingPayload = {
      name: bookingData.name,
      flight_id: flightId,
      seat_number: bookingData.seat_number,
      username: username
    };

    // Send a POST request to add the booking data to the booking table
    axios
      .post('https://flightapi-xdy0.onrender.com/bookings', bookingPayload)
      .then((response) => {
        console.log(response.data);
        setBookingData({
          name: '',
          flight_id: '',
          seat_number: '',
          username: ''
        });
        setBookingFormVisible(false);

      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleBookingFormSubmit = (e) => {
    e.preventDefault();

    const bookingPayload = {
      name: bookingData.name,
      flight_id: selectedFlight.flight_id,
      seat_number: bookingData.seat_number,
      username: username
    };

    // Send a POST request to add the booking data to the booking table
    axios
      .post('https://flightapi-xdy0.onrender.com/bookings', bookingPayload)
      .then((response) => {
        console.log(response.data);
        setBookingData({
          name: '',
          flight_id: '',
          seat_number: '',
          username:''
        });
        setBookingFormVisible(false);
        setShowPopup(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const closePopup = () => {
    setShowPopup(false);
  };
  const handleBookingFormInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleMyBookings = () => {
    axios
      .get(`https://flightapi-xdy0.onrender.com/bookings?username=${username}`)
      .then((response) => {
        setMyBookings(response.data);
        setMyBookingsVisible(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="user-home-container">
      <h2 className='user-home-container' >Welcome, {username}!</h2>
      <div className="logout-button">

        <button onClick={handleLogout}>Logout</button>
      </div>

      <button onClick={handleMyBookings}>My Bookings</button>
      {myBookingsVisible && (
        <div className="my-bookings">
          <h3>My Bookings</h3>
          {myBookings.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Flight ID</th>
                  <th>Seat Number</th>
                  <th>Booking ID</th>
                </tr>
              </thead>
              <tbody>
                {myBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.name}</td>
                    <td>{booking.flight_id}</td>
                    <td>{booking.seat_number}</td>
                    <td>{booking.booking_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No bookings found.</p>
          )}
        </div>
      )}
      <h2>Flight Search</h2>
      <div>
        <label htmlFor="origin">Origin:</label>
        <input
          placeholder="Enter origin city name"
          type="text"
          id="origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="destination">Destination:</label>
        <input
          placeholder="Enter destination city name"
          type="text"
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="time">Time:</label>
        <input
          type="time"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="input-field"
        />
      </div>
      <button onClick={handleSearch} className="search-button">
        Search
      </button>
  
      {loading ? (
        <p>Loading flights...</p>
      ) : (
        <div>
          {flights.length > 0 ? (
            <div>
              <h3>Search Results:</h3>
              {flights.map((flight) => (
                <div key={flight.flight_id}>
                  <p>Flight Number: {flight.flight_number}</p>
                  <p>Origin: {flight.origin}</p>
                  <p>Destination: {flight.destination}</p>
                  <button
                    onClick={() => handleBook(flight.flight_id)}
                    className="book-button"
                  >
                    More Info
                  </button>
                  <hr className="divider" />
                </div>
              ))}
            </div>
          ) : (
            <p>No flights found.</p>
          )}
        </div>
      )}
  
      {selectedFlight && (
        <div className="flight-details">
          <h3>Flight Details:</h3>
          <p>Flight Number: {selectedFlight.flight_number}</p>
          <p>Origin: {selectedFlight.origin}</p>
          <p>Destination: {selectedFlight.destination}</p>
          <p>Time: {selectedFlight.time}</p>
          <p>Date: {selectedFlight.date}</p>
          <p>Seat: {selectedFlight.seat_count}</p>
          {/* Add more flight details here */}
          <button
            onClick={() => setBookingFormVisible(true)}
            className="book-now-button"
          >
            Book Now
          </button>
        </div>
      )}
  
      {bookingFormVisible && (
        <div className="booking-form">
          <h3>Booking Form</h3>
          <form onSubmit={handleBookingFormSubmit}>
            <div>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={bookingData.name}
                onChange={handleBookingFormInputChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="seatNumber">Seat Number:</label>
              <input
                type="text"
                id="seatNumber"
                name="seat_number"
                value={bookingData.seat_number}
                onChange={handleBookingFormInputChange}
                className="input-field"
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      )}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Ticket Booking Confirmation</h3>
            <p>Your tour ticket was successfully booked!</p>
            <button onClick={closePopup} className="popup-close-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
  }
export default UserHome;  