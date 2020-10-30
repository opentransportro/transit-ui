import PropTypes from 'prop-types';
import connectToStores from 'fluxible-addons-react/connectToStores';
import getJson from '@digitransit-search-util/digitransit-search-util-get-json';
import { intlShape } from 'react-intl';
import Favourite from './Favourite';
import { saveFavourite, deleteFavourite } from '../action/FavouriteActions';
import { addAnalyticsEvent } from '../util/analyticsUtils';

const FavouriteStopContainer = connectToStores(
  Favourite,
  ['FavouriteStore', 'UserStore', 'PreferencesStore'],
  (context, { stop, isTerminal }) => ({
    favourite: context
      .getStore('FavouriteStore')
      .isFavourite(stop.gtfsId, isTerminal ? 'station' : 'stop'),
    addFavourite: () => {
      const favouriteType = isTerminal ? 'station' : 'stop';
      let gid = `gtfs${stop.gtfsId
        .split(':')[0]
        .toLowerCase()}:${favouriteType}:GTFS:${stop.gtfsId}`;
      if (stop.code) {
        gid += `#${stop.code}`;
      }
      getJson(context.config.URL.PELIAS_PLACE, {
        ids: gid,
        // lang: context.getStore('PreferencesStore').getLanguage(), TODO enable this when OTP supports translations
      }).then(res => {
        if (Array.isArray(res.features) && res.features.length > 0) {
          const stopOrStation = res.features[0];
          const { label } = stopOrStation.properties;
          context.executeAction(saveFavourite, {
            address: label,
            code: stop.code,
            gid,
            gtfsId: stop.gtfsId,
            lat: stop.lat,
            lon: stop.lon,
            type: favouriteType,
          });
          addAnalyticsEvent({
            category: 'Stop',
            action: 'MarkStopAsFavourite',
            name: !context
              .getStore('FavouriteStore')
              .isFavourite(stop.gtfsId, favouriteType),
          });
        }
      });
    },
    deleteFavourite: () => {
      const stopToDelete = context
        .getStore('FavouriteStore')
        .getByGtfsId(stop.gtfsId, isTerminal ? 'station' : 'stop');
      context.executeAction(deleteFavourite, stopToDelete);
      addAnalyticsEvent({
        category: 'Stop',
        action: 'MarkStopAsFavourite',
        name: !context
          .getStore('FavouriteStore')
          .isFavourite(stop.gtfsId, isTerminal ? 'station' : 'stop'),
      });
    },
    allowLogin: context.config.allowLogin || false,
    isLoggedIn:
      context.config.allowLogin &&
      context.getStore('UserStore').getUser().sub !== undefined,
    getModalTranslations: () => {
      const translation = {
        language: context.getStore('PreferencesStore').getLanguage(),
        text: {
          login: context.intl.formatMessage({
            id: 'login',
            defaultMessage: 'Log in',
          }),
          cancel: context.intl.formatMessage({
            id: 'cancel',
            defaultMessage: 'cancel',
          }),
          headerText: context.intl.formatMessage({
            id: 'login-header',
            defautlMessage: 'Log in first',
          }),
          dialogContent: context.intl.formatMessage({
            id: 'login-content',
            defautlMessage: 'Log in first',
          }),
        },
      };
      return translation;
    },
  }),
);

FavouriteStopContainer.contextTypes = {
  getStore: PropTypes.func.isRequired,
  executeAction: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
};

export default FavouriteStopContainer;