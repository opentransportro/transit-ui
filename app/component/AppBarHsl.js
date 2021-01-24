/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import React from 'react';
import { intlShape } from 'react-intl';
import { matchShape } from 'found';
import LazilyLoad, { importLazy } from './LazilyLoad';
import { clearOldSearches, clearFutureRoutes } from '../util/storeUtils';

const modules = {
  SiteHeader: () => importLazy(import('@hsl-fi/site-header')),
  SharedLocalStorageObserver: () =>
    importLazy(import('@hsl-fi/shared-local-storage')),
};

const clearStorages = context => {
  clearOldSearches(context);
  clearFutureRoutes(context);
  context.getStore('FavouriteStore').clearFavourites();
};

const AppBarHsl = ({ lang, user }, context) => {
  const { config, match, intl } = context;
  const { location } = match;

  const languages = [
    {
      name: 'fi',
      url: `/fi${location.pathname}${location.search}`,
    },
    {
      name: 'sv',
      url: `/sv${location.pathname}${location.search}`,
    },
    {
      name: 'en',
      url: `/en${location.pathname}${location.search}`,
    },
  ];

  const { given_name, family_name } = user;

  const initials =
    given_name && family_name
      ? given_name.charAt(0) + family_name.charAt(0)
      : ''; // Authenticated user's initials, will be shown next to Person-icon.

  const url = encodeURI(`${location.pathname}${location.search}`);

  const userMenu =
    config.allowLogin && (user.sub || user.notLogged)
      ? {
          userMenu: {
            isLoading: false, // When fetching for login-information, `isLoading`-property can be set to true. Spinner will be shown.
            isAuthenticated: !!user.sub, // If user is authenticated, set `isAuthenticated`-property to true.
            loginUrl: `/login?url=${url}`, // Url that user will be redirect to when Person-icon is pressed and user is not logged in.
            initials,
            menuItems: [
              {
                name: intl.formatMessage({
                  id: 'userinfo',
                  defaultMessage: 'My information',
                }),
                url: `${config.URL.ROOTLINK}/omat-tiedot`,
                selected: false,
              },
              {
                name: intl.formatMessage({
                  id: 'logout',
                  defaultMessage: 'Logout',
                }),
                url: '/logout',
                selected: false,
                onClick: () => clearStorages(context),
              },
            ],
          },
        }
      : {};
  return (
    <LazilyLoad modules={modules}>
      {({ SiteHeader, SharedLocalStorageObserver }) => (
        <>
          <SharedLocalStorageObserver
            keys={['saved-searches', 'favouriteStore', 'futureRoutes']}
            url={config.localStorageEmitter}
          />
          <SiteHeader
            hslFiUrl={config.URL.ROOTLINK}
            lang={lang}
            {...userMenu}
            languageMenu={languages}
          />
        </>
      )}
    </LazilyLoad>
  );
};

AppBarHsl.contextTypes = {
  match: matchShape.isRequired,
  config: PropTypes.object.isRequired,
  getStore: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

AppBarHsl.propTypes = {
  lang: PropTypes.string,
  user: PropTypes.shape({
    given_name: PropTypes.string,
    family_name: PropTypes.string,
    sub: PropTypes.string,
    notLogged: PropTypes.bool,
  }),
};

AppBarHsl.defaultProps = {
  lang: 'fi',
  user: {},
};

export { AppBarHsl as default, AppBarHsl as Component };
