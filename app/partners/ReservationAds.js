/* eslint-disable prettier/prettier */
import PropTypes from 'prop-types';
import React from 'react';
import {
  getCityPreferenceStorage,
} from '../store/localStorage';

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

const getAdvertisingOptions = function getAdvertisingContext(props, locale) {
  const selectedLocale = locale || 'ro'; // Default locale: Romanian
  const adSpecs = [
    {
      locale: 'en',
      locationFilter: ((citySelection) => citySelection.icon === 'icon-icon_city-timisoara'),
      wideImageBannerUrl: '/img/goebike-banner.png',
      squareImageBannerUrl: '/img/goebike-square-banner.png',
      url: 'https://booking.goebike.ro/reservation/goe-rent-ebike-electric-bicycle-en',
    },
    {
      locale: 'ro',
      locationFilter: ((citySelection) => citySelection.icon === 'icon-icon_city-timisoara'),
      wideImageBannerUrl: '/img/goebike-banner.png',
      squareImageBannerUrl: '/img/goebike-square-banner.png',
      url: 'https://booking.goebike.ro/reservation/goe-rent-ebike-electric-bicycle-ro',
    },
  ];

  const preferedCityInfo = getCityPreferenceStorage();

  const results = adSpecs.filter((ad) => {
    return ad.locale === selectedLocale && ad.locationFilter(preferedCityInfo)
  });
  return results;
}

const ReservationWideBanner = function ReservationWideBanner(props, { location }) {
  const ads = getAdvertisingOptions(props, location.query.locale);
  if (!ads || !ads.length) {
    return (<></>);
  }
  const ad = ads[0];

  return (
    <div className="reservation-banner" style={wideStyle}>
      <a href={ad.url}>
        <img src={ad.wideImageBannerUrl} alt="Rent/Reservations" />
      </a>
    </div>
  );
};

const ReservationSquareBanner = function ReservationSquareBanner(props, { location }) {
  const ads = getAdvertisingOptions(props, location.query.locale);
  if (!ads || !ads.length) {
    return (<></>);
  }
  const ad = ads[0];
  
  return (
    <div className="reservation-square-banner" style={squareStyle}>
      <a href={ad.url}>
        <img src={ad.squareImageBannerUrl} alt="Rent/Reservations" />
      </a>
    </div>
  );
};

ReservationWideBanner.propTypes = {
  // no props, yet
};

ReservationWideBanner.contextTypes = {
  config: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

ReservationSquareBanner.propTypes = {
  // no props, yet
};

ReservationSquareBanner.contextTypes = {
  config: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export {
  ReservationSquareBanner,
  ReservationWideBanner
};
