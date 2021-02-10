import get from 'lodash/get';
import PropTypes from 'prop-types';
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import cx from 'classnames';
import { matchShape, routerShape } from 'found';
import { FormattedMessage } from 'react-intl';

import Icon from './Icon';
import TicketInformation from './TicketInformation';
import RouteInformation from './RouteInformation';
import ItinerarySummary from './ItinerarySummary';
import DateWarning from './DateWarning';
import ItineraryLegs from './ItineraryLegs';
import BackButton from './BackButton';
import { getRoutes, getZones } from '../util/legUtils';
import { BreakpointConsumer } from '../util/withBreakpoint';
import ComponentUsageExample from './ComponentUsageExample';

import exampleData from './data/ItineraryTab.exampleData.json';
import { getFares, shouldShowFareInfo } from '../util/fareUtils';
import { addAnalyticsEvent } from '../util/analyticsUtils';
/* eslint-disable prettier/prettier */
class ItineraryTab extends React.Component {
  static propTypes = {
    plan: PropTypes.shape({
      date: PropTypes.number.isRequired,
    }).isRequired,
    itinerary: PropTypes.object.isRequired,
    focus: PropTypes.func.isRequired,
    setMapZoomToLeg: PropTypes.func.isRequired,
  };

  static contextTypes = {
    config: PropTypes.object.isRequired,
    router: routerShape.isRequired,
    match: matchShape.isRequired,
  };

  state = {
    lat: undefined,
    lon: undefined,
  };

  getState = () => ({
    lat: this.state.lat || this.props.itinerary.legs[0].from.lat,
    lon: this.state.lon || this.props.itinerary.legs[0].from.lon,
  });

  handleFocus = (lat, lon) => {
    this.props.focus(lat, lon);

    return this.setState({
      lat,
      lon,
    });
  };

  shouldShowDisclaimer = (config) => {
    return config.showDisclaimer && this.context.match.params.hash !== 'walk' && this.context.match.params.hash !== 'bike';
  }

  printItinerary = e => {
    e.stopPropagation();

    addAnalyticsEvent({
      event: 'sendMatomoEvent',
      category: 'Itinerary',
      action: 'Print',
      name: null,
    });

    const printPath = `${this.context.match.location.pathname}/tulosta`;
    this.context.router.push({
      ...this.context.match.location,
      pathname: printPath,
    });
  };

  render() {
    const { itinerary, plan } = this.props;
    const { config } = this.context;

    if(!itinerary || !itinerary.legs[0]) {
      return null;
    }

    const fares = getFares(itinerary.fares, getRoutes(itinerary.legs), config);
    return (
      <div className="itinerary-tab">
        <BreakpointConsumer>
          {breakpoint => [
            breakpoint !== 'large' ? (
              <ItinerarySummary itinerary={itinerary} key="summary"/>
            ) : (
              <div className="desktop-title" key="header">
                <div className="title-container h2">
                  <BackButton
                    title={
                      <FormattedMessage
                        id="itinerary-page.title"
                        defaultMessage="Itinerary suggestions"
                      />
                    }
                    icon="icon-icon_arrow-collapse--left"
                    iconClassName="arrow-icon"
	            popFallback
                  />
                  <ItinerarySummary itinerary={itinerary} key="summary" />
                </div>
              </div>
            ),
            <div className="momentum-scroll itinerary-tabs__scroll" key="legs">
              <div className="itinerary-timeframe" key="timeframe"> 
                <DateWarning date={itinerary.startTime} refTime={plan.date} />
              </div>
              <div
                className={cx('itinerary-main', {
                  'bp-large': breakpoint === 'large',
                })}
              >
                {shouldShowFareInfo(config) &&
                  fares.some(fare => fare.isUnknown) && (
                    <div className="disclaimer-container unknown-fare-disclaimer__top">
                      <div className="icon-container">
                        <Icon className="info" img="icon-icon_info" />
                      </div>
                      <div className="description-container">
                        <FormattedMessage
                          id="separate-ticket-required-disclaimer"
                          values={{
                            agencyName: get(
                              config,
                              'ticketInformation.primaryAgencyName',
                            ),
                          }}
                        />
                      </div>
                    </div>
                        )}
                <ItineraryLegs
                  fares={fares}
                  itinerary={itinerary}
                  focusMap={this.handleFocus}
                  setMapZoomToLeg={this.props.setMapZoomToLeg}
                />
                {shouldShowFareInfo(config) && (
                  <TicketInformation
                    fares={fares}
                    zones={getZones(itinerary.legs)}
                    legs={itinerary.legs}
                />
                )}
                {config.showRouteInformation && <RouteInformation />}
              </div>
              {this.shouldShowDisclaimer(config) && (
                <div className="itinerary-disclaimer">
                  <FormattedMessage
                    id="disclaimer"
                    defaultMessage="Results are based on estimated travel times"
                  />
                </div>
              )}
            </div>
          ]}
        </BreakpointConsumer>
        </div>
    );
  }
}

ItineraryTab.description = (
  <ComponentUsageExample description="with disruption">
    <div style={{ maxWidth: '528px' }}>
      <ItineraryTab
        focus={() => {}}
        itinerary={{ ...exampleData.itinerary }}
        plan={{date: 1553845502000}}
        setMapZoomToLeg={() => {}}
      />
    </div>
  </ComponentUsageExample>
);

const withRelay = createFragmentContainer(ItineraryTab, {
  plan: graphql`
    fragment ItineraryTab_plan on Plan {
      date
    }
  `,
  itinerary: graphql`
    fragment ItineraryTab_itinerary on Itinerary {
      walkDistance
      duration
      startTime
      endTime
      elevationGained
      elevationLost
      fares {
        cents
        components {
          cents
          fareId
          routes {
            agency {
              gtfsId
              fareUrl
              name
            }
            gtfsId
          }
        }
        type
      }
      legs {
        mode
        ...LegAgencyInfo_leg
        from {
          lat
          lon
          name
          vertexType
          bikeRentalStation {
            networks
            bikesAvailable
            lat
            lon
            stationId
          }
          stop {
            gtfsId
            code
            platformCode
            vehicleMode
            zoneId
            alerts {
              alertSeverityLevel
              effectiveEndDate
              effectiveStartDate
              trip {
                pattern {
                  code
                }
              }
              alertHeaderText
              alertHeaderTextTranslations {
                text
                language
              }
              alertUrl
              alertUrlTranslations {
                text
                language
              }
            }
          }
        }
        to {
          lat
          lon
          name
          vertexType
          bikeRentalStation {
            lat
            lon
            stationId
            networks
            bikesAvailable
          }
          stop {
            gtfsId
            code
            platformCode
            zoneId
            alerts {
              alertSeverityLevel
              effectiveEndDate
              effectiveStartDate
              alertSeverityLevel
              effectiveEndDate
              effectiveStartDate
              trip {
                pattern {
                  code
                }
              }
              alertHeaderText
              alertHeaderTextTranslations {
                text
                language
              }
              alertUrl
              alertUrlTranslations {
                text
                language
              }
            }
          }
          bikePark {
            bikeParkId
            name
          }
        }
        legGeometry {
          length
          points
        }
        intermediatePlaces {
          arrivalTime
          stop {
            gtfsId
            lat
            lon
            name
            code
            platformCode
            zoneId
          }
        }
        realTime
        realtimeState
        transitLeg
        rentedBike
        startTime
        endTime
        mode
        interlineWithPreviousLeg
        distance
        duration
        intermediatePlace
        route {
          shortName
          color
          gtfsId
          longName
          desc
          agency {
            gtfsId
            fareUrl
            name
            phone
          }
          alerts {
            alertSeverityLevel
            effectiveEndDate
            effectiveStartDate
            trip {
              pattern {
                code
              }
            }
            alertHeaderText
            alertHeaderTextTranslations {
              text
              language
            }
            alertUrl
            alertUrlTranslations {
              text
              language
            }
          }
        }
        trip {
          gtfsId
          tripHeadsign
          pattern {
            code
          }
          stoptimes {
            pickupType
            realtimeState
            stop {
              gtfsId
            }
          }
        }
      }
    }
  `,
});

export { ItineraryTab as Component, withRelay as default };
