import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { routerShape, locationShape } from 'react-router';
import { FormattedMessage } from 'react-intl';
import getContext from 'recompose/getContext';
import connectToStores from 'fluxible-addons-react/connectToStores';
import AppBarSmall from './AppBarSmall';
import AppBarLarge from './AppBarLarge';
import { DesktopOrMobile } from '../util/withBreakpoint';
import ChooseCityPopup from './ChooseCityPopup';
import { setPrefferedCity } from '../action/userPreferencesActions';

class AppBarContainer extends React.Component {
  static contextTypes = {
    config: PropTypes.object.isRequired,
    executeAction: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.citySelectedCallback = this.handleCitySelected.bind(this);
  }

  isHome() {
    const { location, homeUrl } = this.props;
    return location.pathname.includes(homeUrl);
  }

  handleCitySelected(city) {
    this.context.executeAction(setPrefferedCity, {
      ...city,
    });
  }

  render() {
    const { router, location, homeUrl, logo, user, city, ...args } = this.props;
    const { multiCity } = this.context.config;
    // evaluating if popup required
    let popup = null;
    if (multiCity.enabled && (city.lat == null || city.lon == null)) {
      popup = (
        <ChooseCityPopup
          logo={logo}
          showLogo
          onCitySelected={this.citySelectedCallback}
        />
      );
    }

    return (
      <Fragment>
        <a href="#mainContent" id="skip-to-content-link">
          <FormattedMessage
            id="skip-to-content"
            defaultMessage="Skip to content"
          />
        </a>
        <DesktopOrMobile
          mobile={() => (
            <AppBarSmall
              {...args}
              showLogo={this.isHome()}
              logo={logo}
              homeUrl={homeUrl}
              user={user}
            />
          )}
          desktop={() => (
            <AppBarLarge
              {...args}
              logo={logo}
              titleClicked={() => router.push(homeUrl)}
              user={user}
            />
          )}
        />
        {popup}
      </Fragment>
    );
  }
}

AppBarContainer.propTypes = {
  location: locationShape.isRequired,
  router: routerShape.isRequired,
  homeUrl: PropTypes.string.isRequired,
  logo: PropTypes.string,
  user: PropTypes.object,
  city: PropTypes.object,
};

const WithContext = connectToStores(
  getContext({
    location: locationShape.isRequired,
    router: routerShape.isRequired,
  })(AppBarContainer),
  ['UserStore', 'PreferencesStore'],
  context => ({
    user: context.getStore('UserStore').getUser(),
    city: context.getStore('PreferencesStore').getPreferredCity(),
  }),
);

WithContext.propTypes = {
  disableBackButton: PropTypes.bool,
  title: PropTypes.node,
};

export default WithContext;
