import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, intlShape } from 'react-intl';

import CardHeader from './CardHeader';
import ComponentUsageExample from './ComponentUsageExample';
import Icon from './Icon';
import ServiceAlertIcon from './ServiceAlertIcon';
import { getActiveAlertSeverityLevel } from '../util/alertUtils';
import ExternalLink from './ExternalLink';
import FavouriteStopContainer from './FavouriteStopContainer';

class StopCardHeader extends React.Component {
  get headerConfig() {
    return this.context.config.stopCard.header;
  }

  getDescription() {
    let description = '';

    if (this.headerConfig.showDescription && this.props.stop.desc) {
      description += this.props.stop.desc;
    }

    if (this.headerConfig.showDistance && this.props.distance) {
      description += ` // ${Math.round(this.props.distance)} m`;
    }

    if (this.props.isTerminal && this.props.stop.stops) {
      description = this.props.stop.stops[0].desc;
    }

    return description;
  }

  getExternalLink(gtfsId, isPopUp) {
    // Check for popup from stopMarkerPopup, should the external link be visible
    if (!gtfsId || isPopUp || !this.headerConfig.virtualMonitorBaseUrl) {
      return null;
    }
    const url = `${this.headerConfig.virtualMonitorBaseUrl}${gtfsId}`;
    return (
      <ExternalLink className="external-stop-link" href={url}>
        {' '}
        {
          <FormattedMessage
            id="stop-virtual-monitor"
            defaultMessage="Virtual monitor"
          />
        }{' '}
      </ExternalLink>
    );
  }

  render() {
    const {
      className,
      currentTime,
      headingStyle,
      icons,
      stop,
      isPopUp,
      breakpoint, // DT-3472
      isTerminal,
    } = this.props;
    if (!stop) {
      return false;
    }

    return (
      <CardHeader
        className={className}
        headerIcon={
          <ServiceAlertIcon
            className="inline-icon"
            severityLevel={getActiveAlertSeverityLevel(
              stop.alerts,
              currentTime,
            )}
          />
        }
        headingStyle={headingStyle}
        description={this.getDescription()}
        code={this.headerConfig.showStopCode && stop.code ? stop.code : null}
        externalLink={this.getExternalLink(stop.gtfsId, isPopUp)}
        icons={icons}
        showBackButton={breakpoint === 'large'}
        stop={stop}
        headerConfig={this.headerConfig}
        isTerminal={isTerminal}
        favouriteContainer={
          <FavouriteStopContainer stop={stop} isTerminal={isTerminal} />
        }
      />
    );
  }
}

StopCardHeader.propTypes = {
  currentTime: PropTypes.number,
  stop: PropTypes.shape({
    gtfsId: PropTypes.string,
    name: PropTypes.string,
    code: PropTypes.string,
    desc: PropTypes.string,
    isPopUp: PropTypes.bool,
    zoneId: PropTypes.string,
    stops: PropTypes.arrayOf(
      PropTypes.shape({
        desc: PropTypes.string,
      }),
    ),
    alerts: PropTypes.arrayOf(
      PropTypes.shape({
        alertSeverityLevel: PropTypes.string,
        effectiveEndDate: PropTypes.number,
        effectiveStartDate: PropTypes.number,
      }),
    ),
    lat: PropTypes.number,
    lon: PropTypes.number,
  }),
  distance: PropTypes.number,
  className: PropTypes.string,
  headingStyle: PropTypes.string,
  icons: PropTypes.arrayOf(PropTypes.node),
  isPopUp: PropTypes.bool,
  breakpoint: PropTypes.string, // DT-3472
  isTerminal: PropTypes.bool,
};

StopCardHeader.defaultProps = {
  stop: undefined,
  isTerminal: false,
};

StopCardHeader.contextTypes = {
  config: PropTypes.shape({
    stopCard: PropTypes.shape({
      header: PropTypes.shape({
        showDescription: PropTypes.bool,
        showDistance: PropTypes.bool,
        showStopCode: PropTypes.bool,
        showZone: PropTypes.bool,
        virtualMonitorBaseUrl: PropTypes.string,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  intl: intlShape.isRequired,
};

const exampleStop = {
  code: '4611',
  gtfsId: 'HSL:1541157',
  name: 'Kaivonkatsojanpuisto',
  desc: 'Kaivonkatsojantie',
};

StopCardHeader.displayName = 'StopCardHeader';

StopCardHeader.description = () => (
  <div>
    <ComponentUsageExample description="basic">
      <StopCardHeader stop={exampleStop} distance={345.6} />
    </ComponentUsageExample>
    <ComponentUsageExample description="with icons">
      <StopCardHeader
        stop={exampleStop}
        distance={345.6}
        icons={[
          <Icon className="info" img="icon-icon_info" key="1" />,
          <Icon className="caution" img="icon-icon_caution" key="2" />,
        ]}
      />
    </ComponentUsageExample>
  </div>
);

export default StopCardHeader;
