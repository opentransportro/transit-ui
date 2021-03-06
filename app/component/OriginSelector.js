import PropTypes from 'prop-types';
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { routerShape } from 'react-router';
import { dtLocationShape } from '../util/shapes';
import { navigateTo, TAB_NEARBY } from '../util/path';
import { isBrowser } from '../util/browser';
import OriginSelectorRow from './OriginSelectorRow';
import { suggestionToLocation, getIcon } from '../util/suggestionUtils';
import GeopositionSelector from './GeopositionSelector';
import { addAnalyticsEvent } from '../util/analyticsUtils';

const OriginSelector = (
  {
    favouriteLocations,
    favouriteStops,
    oldSearches,
    city,
    destination,
    origin,
    tab,
  },
  { config, router },
) => {
  const setOrigin = newOrigin => {
    addAnalyticsEvent({
      action: 'EditJourneyStartPoint',
      category: 'ItinerarySettings',
      name: 'NearYouList',
    });
    navigateTo({
      origin: { ...newOrigin, ready: true },
      destination,
      context: '/',
      router,
      base: router.location,
      tab,
    });
  };

  const notInFavouriteLocations = item =>
    favouriteLocations.filter(
      favourite =>
        item.geometry &&
        item.geometry.coordinates &&
        Math.abs(favourite.lat - item.geometry.coordinates[1]) < 1e-4 &&
        Math.abs(favourite.lon - item.geometry.coordinates[0]) < 1e-4,
    ).length === 0;

  const notInFavouriteStops = item =>
    favouriteStops.filter(
      favourite =>
        item.geometry &&
        item.geometry.coordinates &&
        Math.abs(favourite.lat - item.geometry.coordinates[1]) < 1e-4 &&
        Math.abs(favourite.lon - item.geometry.coordinates[0]) < 1e-4,
    ).length === 0;

  const isGeocodingResult = item => item.geometry && item.properties;

  // React doesn't anymore compare all elements rendered on server side to
  // those rendered on client side. Thanks to this fav icons aren't patched
  // and icons of default locations are shown. So don't render those on
  // server side.
  let names;
  if (!isBrowser) {
    names = [];
  } else {
    names = favouriteLocations
      .map(f => (
        <OriginSelectorRow
          key={`fl-${f.name}`}
          icon={getIcon('favourite')}
          onClick={() => {
            setOrigin({ ...f, address: f.name });
          }}
          label={f.name}
        />
      ))
      .concat(
        favouriteStops.map(f => (
          <OriginSelectorRow
            key={`fs-${f.name}`}
            icon={getIcon('favourite')}
            onClick={() => {
              setOrigin({ ...f, address: f.name });
            }}
            label={f.name}
          />
        )),
      )
      .concat(
        oldSearches
          .filter(isGeocodingResult)
          .filter(notInFavouriteLocations)
          .filter(notInFavouriteStops)
          .map(s => (
            <OriginSelectorRow
              key={`o-${s.properties.label || s.properties.name}`}
              icon={getIcon(s.properties.layer)}
              label={s.properties.label || s.properties.name}
              onClick={() => {
                setOrigin(suggestionToLocation(s));
              }}
            />
          )),
      );
    if (config.multiCity.enabled && city.origins && city.origins.length > 0) {
      names = names.concat(
        city.origins.map(o => (
          <OriginSelectorRow
            key={`o-${o.label}`}
            icon={o.icon}
            label={o.label}
            onClick={() => {
              setOrigin({ ...o, address: o.label });
            }}
          />
        )),
      );
    } else {
      names = names.concat(
        config.defaultOrigins.map(o => (
          <OriginSelectorRow
            key={`o-${o.label}`}
            icon={o.icon}
            label={o.label}
            onClick={() => {
              setOrigin({ ...o, address: o.label });
            }}
          />
        )),
      );
    }
  }

  return (
    <ul>
      <GeopositionSelector
        destination={destination}
        origin={origin}
        tab={tab}
      />
      {names.slice(0, 10)}
    </ul>
  );
};

OriginSelector.propTypes = {
  favouriteLocations: PropTypes.array.isRequired,
  favouriteStops: PropTypes.array.isRequired,
  oldSearches: PropTypes.array.isRequired,
  city: PropTypes.object.isRequired,
  destination: dtLocationShape.isRequired,
  origin: dtLocationShape.isRequired,
  tab: PropTypes.string,
};
OriginSelector.defaultProps = {
  tab: TAB_NEARBY,
};

OriginSelector.contextTypes = {
  config: PropTypes.object.isRequired,
  router: routerShape.isRequired,
};

const connectedComponent = connectToStores(
  OriginSelector,
  ['OldSearchesStore', 'FavouriteStore', 'PreferencesStore'],
  context => ({
    favouriteLocations: context.getStore('FavouriteStore').getLocations(),
    favouriteStops: context.getStore('FavouriteStore').getStopsAndStations(),
    oldSearches: context
      .getStore('OldSearchesStore')
      .getOldSearches('endpoint'),
    city: context.getStore('PreferencesStore').getPreferredCity(),
  }),
);

export { connectedComponent as default, OriginSelector as Component };
