// import d from 'debug';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import LogoSmall from './LogoSmall';
import withBreakpoint from '../util/withBreakpoint';
import Icon from './Icon';

function ChooseCityPopup(props, context) {
  const { multiCity } = context.config;
  let logoElement;
  if (!props.showLogo) {
    logoElement = (
      <section className="title">
        <LogoSmall className="logo" title={props.title} />
      </section>
    );
  } else {
    logoElement = <LogoSmall className="logo" logo={props.logo} showLogo />;
  }

  const cities = multiCity.cities.map(object => {
    return (
      <button
        type="button"
        className="list-item"
        key={object.name}
        onClick={props.onCitySelected.bind(this, object)}
      >
        <Icon img={object.icon} className="city-icon" />
        <div className="city-name">{object.name}</div>
      </button>
    );
  });

  return (
    <div
      className={`bp-${props.breakpoint} choose-city-popup ${
        props.enabled ? 'active' : ''
      }`}
    >
      <div className="content">
        {logoElement}
        <div className="message">
          <FormattedMessage
            className="header"
            id="choose-city-text"
            defaultMessage="Choose a city and discover transit routes available! Select one from the following available options:"
          />
        </div>
        <div className="list">{cities}</div>
      </div>
    </div>
  );
}

ChooseCityPopup.propTypes = {
  breakpoint: PropTypes.oneOf(['small', 'medium', 'large']),
  logo: PropTypes.string,
  showLogo: PropTypes.bool,
  title: PropTypes.node,
  enabled: PropTypes.bool,
  onCitySelected: PropTypes.func.isRequired,
};

ChooseCityPopup.defaultProps = {
  breakpoint: 'large',
  showLogo: false,
  enabled: false,
  title: '',
  logo: '',
};

ChooseCityPopup.displayName = 'ChooseCityPopup';

ChooseCityPopup.contextTypes = {
  config: PropTypes.object.isRequired,
};

const enhancedComponent = withBreakpoint(ChooseCityPopup);
export { enhancedComponent as default, ChooseCityPopup as Component };
