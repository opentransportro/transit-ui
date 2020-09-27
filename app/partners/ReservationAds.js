/* eslint-disable prettier/prettier */
import React from 'react';

const wideStyle = {
  margin: '10px auto 10px auto',
  padding: '0px',
  height: '100px',
};

const squareStyle = {
  margin: '10px auto 10px auto',
  padding: '0px',
  width: '200px',
  height: '200px',
};

const ReservationWideBanner = function ReservationWideBanner() {
  const lang = 'ro';
  // TODO: set locale correctly: window.location.search
  // TODO: display ads only for/nearby Timisoara
  const url = `https://booking.goebike.ro/reservation/goe-rent-ebike-electric-bicycle-${lang}`;
  return (
    <div className="reservation-banner" style={wideStyle}>
      <a href={url}>
        <img src="/img/goebike-banner.png" alt="Rent/Reservations" />
      </a>
    </div>
  );
};

const ReservationSquareBanner = function ReservationSquareBanner() {
  const lang = 'ro';
  const url = `https://booking.goebike.ro/reservation/goe-rent-ebike-electric-bicycle-${lang}`;
  return (
    <div className="reservation-square-banner" style={squareStyle}>
      <a href={url}>
        <img src="/img/goebike-square-banner.png" alt="Rent/Reservations" />
      </a>
    </div>
  );
};

export {
  ReservationSquareBanner,
  ReservationWideBanner
};
