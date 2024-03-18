// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import BookingsPage from './components/BookingsPage';
import BookingForm from './components/BookingForm';
import EditBookingForm from './components/EditBookingForm.js';
import CancelBookingForm from './components/CancelBookingForm';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={BookingsPage} />
          <Route exact path="/book" component={BookingForm} />
          <Route exact path="/edit/:bookingId" component={EditBookingForm} />
          <Route exact path="/cancel/:bookingId" component={CancelBookingForm} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
