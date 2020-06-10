import PropTypes from 'prop-types';
import React from 'react';
import { intlShape } from 'react-intl';
import { routerShape, locationShape } from 'react-router';
import ExternalLink from './ExternalLink';
import DisruptionInfo from './DisruptionInfo';
import Icon from './Icon';
import ComponentUsageExample from './ComponentUsageExample';
import LangSelect from './LangSelect';
import MessageBar from './MessageBar';
import CanceledLegsBar from './CanceledLegsBar';
import LogoSmall from './LogoSmall';
import { addAnalyticsEvent } from '../util/analyticsUtils';
import LoginButton from './LoginButton';
import UserInfo from './UserInfo';

const AppBarLarge = (
  { titleClicked, logo, user },
  { router, location, config, intl },
) => {
  const openDisruptionInfo = () => {
    addAnalyticsEvent({
      category: 'Navigation',
      action: 'OpenDisruptions',
      name: null,
    });
    router.push({
      ...location,
      state: {
        ...location.state,
        disruptionInfoOpen: true,
      },
    });
  };

  const openChoseCityPopup = () => {
    addAnalyticsEvent({
      category: 'Navigation',
      action: 'OpenChoseCity',
      name: null,
    });
    router.push({
      ...location,
      state: {
        ...location.state,
        cityPopupOpen: true,
      },
    });
  };

  let logoElement;
  if (config.textLogo) {
    logoElement = (
      <section className="title">
        <LogoSmall className="navi-logo" title={config.title} />
      </section>
    );
  } else {
    logoElement = <LogoSmall className="navi-logo" logo={logo} showLogo />;
  }

  let disruptionButton = null;
  if (config.mainMenu.showDisruptions) {
    disruptionButton = (
      <div className="navi-icons navi-margin padding-horizontal">
        <button
          type="button"
          className="noborder"
          onClick={openDisruptionInfo}
          aria-label={intl.formatMessage({
            id: 'disruptions',
            defaultMessage: 'Disruptions',
          })}
        >
          <Icon img="icon-icon_caution" className="caution-topbar" />
        </button>
      </div>
    );
  }
  let choseCityButton = null;
  if (config.mainMenu.showDisruptions) {
    choseCityButton = (
      <div className="navi-icons navi-margin padding-horizontal">
        <button
          type="button"
          className="noborder"
          onClick={openChoseCityPopup}
          aria-label={intl.formatMessage({
            id: 'choose-city',
            defaultMessage: 'Choose City',
          })}
        >
          <Icon img="icon-icon_city-withBox" className="caution-topbar" />
        </button>
      </div>
    );
  }
  /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, jsx-a11y/anchor-is-valid */
  return (
    <div>
      <div className="top-bar bp-large flex-horizontal">
        <a
          className="noborder"
          onClick={e => {
            titleClicked(e);
            addAnalyticsEvent({
              category: 'Navigation',
              action: 'Home',
              name: null,
            });
          }}
        >
          {logoElement}
        </a>
        <div className="empty-space flex-grow" />
        {config.showLogin &&
          (!user.name ? (
            <LoginButton />
          ) : (
            <UserInfo
              user={user}
              list={[
                {
                  key: 'dropdown-item-1',
                  messageId: 'logout',
                  href: '/logout',
                },
              ]}
            />
          ))}

        <div className="navi-languages right-border navi-margin">
          <LangSelect />
        </div>
        {disruptionButton}
        {choseCityButton}
        <div className="padding-horizontal-large navi-margin">
          <ExternalLink
            className="external-top-bar"
            {...config.appBarLink}
            onClick={() => {
              addAnalyticsEvent({
                category: 'Navigation',
                action: 'OpenServiceHomeLink',
                name: null,
              });
            }}
          />
        </div>
      </div>
      <MessageBar />
      <DisruptionInfo />
      <CanceledLegsBar />
    </div>
  );
};

AppBarLarge.propTypes = {
  titleClicked: PropTypes.func.isRequired,
  logo: PropTypes.string,
  user: PropTypes.object,
};

AppBarLarge.defaultProps = {
  logo: undefined,
  user: undefined,
};

AppBarLarge.displayName = 'AppBarLarge';

AppBarLarge.contextTypes = {
  router: routerShape.isRequired,
  location: locationShape.isRequired,
  config: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
};

AppBarLarge.description = () => (
  <div>
    <p>AppBar of application for large display</p>
    <ComponentUsageExample description="">
      <AppBarLarge titleClicked={() => {}} />
    </ComponentUsageExample>
  </div>
);

export { AppBarLarge as default, AppBarLarge as Component };
