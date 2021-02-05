import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connectToStores } from 'fluxible-addons-react';
import { matchShape } from 'found';
import { createRefetchContainer, graphql, fetchQuery } from 'react-relay';
import moment from 'moment';
import uniqBy from 'lodash/uniqBy';
import compact from 'lodash/compact';
import indexOf from 'lodash/indexOf';
import isEqual from 'lodash/isEqual';
import polyline from 'polyline-encoded';
import withBreakpoint from '../../util/withBreakpoint';
import TimeStore from '../../store/TimeStore';
import FavouriteStore from '../../store/FavouriteStore';
import PreferencesStore from '../../store/PreferencesStore';
import BackButton from '../BackButton';
import VehicleMarkerContainer from './VehicleMarkerContainer';
import Line from './Line';
import MapWithTracking from './MapWithTracking';
import {
  startRealTimeClient,
  stopRealTimeClient,
} from '../../action/realTimeClientAction';
import { addressToItinerarySearch } from '../../util/otpStrings';
import {
  sortNearbyRentalStations,
  sortNearbyStops,
} from '../../util/sortUtils';
import ItineraryLine from './ItineraryLine';
import Loading from '../Loading';
import LazilyLoad, { importLazy } from '../LazilyLoad';

const locationMarkerModules = {
  LocationMarker: () =>
    importLazy(import(/* webpackChunkName: "map" */ './LocationMarker')),
};
const handleStopsAndStations = edges => {
  const terminalNames = [];
  const stopsAndStations = edges.map(({ node }) => {
    const stop = { ...node.place, distance: node.distance };
    if (
      stop.parentStation &&
      indexOf(terminalNames, stop.parentStation.name) === -1
    ) {
      terminalNames.push(stop.parentStation.name);
      return { ...stop.parentStation, distance: node.distance };
    }
    if (!stop.parentStation) {
      return stop;
    }
    return null;
  });
  return compact(stopsAndStations);
};

const startClient = (context, routes) => {
  const { realTime } = context.config;
  let agency;
  if (!context.config.showNewMqtt) {
    return;
  }
  /* handle multiple feedid case */
  context.config.feedIds.forEach(ag => {
    if (!agency && realTime[ag]) {
      agency = ag;
    }
  });
  const source = agency && realTime[agency];
  if (source && source.active && routes.length > 0) {
    const config = {
      ...source,
      agency,
      options: routes,
    };
    context.executeAction(startRealTimeClient, config);
  }
};
const stopClient = context => {
  const { client } = context.getStore('RealTimeInformationStore');
  if (client) {
    context.executeAction(stopRealTimeClient, client);
  }
};

const handleBounds = (location, edges, breakpoint) => {
  if (Array.isArray(edges)) {
    if (edges.length === 0) {
      // No stops anywhere near
      return [
        [location.lat, location.lon],
        [location.lat, location.lon],
      ];
    }

    const nearestStop = edges[0].node.place;

    const bounds =
      breakpoint !== 'large'
        ? [
            [
              nearestStop.lat + (nearestStop.lat - location.lat) * 0.5,
              nearestStop.lon + (nearestStop.lon - location.lon) * 0.5,
            ],
            [
              location.lat + (location.lat - nearestStop.lat) * 0.5,
              location.lon + (location.lon - nearestStop.lon) * 0.5,
            ],
          ]
        : [
            [nearestStop.lat, nearestStop.lon],
            [
              location.lat + location.lat - nearestStop.lat,
              location.lon + location.lon - nearestStop.lon,
            ],
          ];

    return bounds;
  }
  return [];
};

const getLocationMarker = location => {
  return (
    <LazilyLoad modules={locationMarkerModules} key="from">
      {({ LocationMarker }) => (
        <LocationMarker position={location} type="from" />
      )}
    </LazilyLoad>
  );
};

function StopsNearYouMap(
  {
    breakpoint,
    currentTime,
    stops,
    match,
    loading,
    favouriteIds,
    relay,
    position,
  },
  { ...context },
) {
  const { mode } = match.params;
  const walkRoutingThreshold =
    mode === 'RAIL' || mode === 'SUBWAY' || mode === 'FERRY' ? 3000 : 1500;
  const sortedStopEdges =
    mode === 'CITYBIKE'
      ? stops.nearest.edges.slice().sort(sortNearbyRentalStations(favouriteIds))
      : stops.nearest.edges
          .slice()
          .sort(sortNearbyStops(favouriteIds, walkRoutingThreshold));
  let useFitBounds = true;
  const bounds = handleBounds(position, sortedStopEdges, breakpoint);

  if (!bounds.length) {
    useFitBounds = false;
  }
  let uniqueRealtimeTopics;
  const { environment } = relay;
  const [secondPlan, setSecondPlan] = useState({
    itinerary: [],
    isFetching: false,
    stop: null,
  });
  const [firstPlan, setFirstPlan] = useState({
    itinerary: [],
    isFetching: false,
    stop: null,
  });
  const stopsAndStations = handleStopsAndStations(sortedStopEdges);

  const fetchPlan = (stop, first) => {
    const toPlace = {
      address: stop.name ? stop.name : 'stop',
      lon: stop.lon,
      lat: stop.lat,
    };
    const variables = {
      fromPlace: addressToItinerarySearch(position),
      toPlace: addressToItinerarySearch(toPlace),
      date: moment(currentTime * 1000).format('YYYY-MM-DD'),
      time: moment(currentTime * 1000).format('HH:mm:ss'),
    };
    const query = graphql`
      query StopsNearYouMapQuery(
        $fromPlace: String!
        $toPlace: String!
        $date: String!
        $time: String!
      ) {
        plan: plan(
          fromPlace: $fromPlace
          toPlace: $toPlace
          date: $date
          time: $time
          transportModes: [{ mode: WALK }]
        ) {
          itineraries {
            legs {
              mode
              ...ItineraryLine_legs
            }
          }
        }
      }
    `;
    if (stop.distance < walkRoutingThreshold) {
      fetchQuery(environment, query, variables).then(({ plan: result }) => {
        if (first) {
          setFirstPlan({ itinerary: result, isFetching: false, stop });
        } else {
          setSecondPlan({ itinerary: result, isFetching: false, stop });
        }
      });
    } else if (first) {
      setFirstPlan({ itinerary: [], isFetching: false, stop });
    } else {
      setSecondPlan({ itinerary: [], isFetching: false, stop });
    }
  };

  useEffect(() => {
    relay.refetch(oldVariables => {
      return {
        ...oldVariables,
        lat: position.lat,
        lon: position.lon,
      };
    });
  }, [position]);

  useEffect(() => {
    startClient(context, uniqueRealtimeTopics);
    return function cleanup() {
      stopClient(context);
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  useEffect(() => {
    if (Array.isArray(stopsAndStations)) {
      if (stopsAndStations.length > 0) {
        const firstStop = stopsAndStations[0];
        if (!isEqual(firstStop, firstPlan.stop)) {
          setFirstPlan({
            itinerary: firstPlan.itinerary,
            isFetching: true,
            stop: firstStop,
          });
          fetchPlan(firstStop, true);
        }
      }
      if (stopsAndStations.length > 1) {
        const secondStop = stopsAndStations[1];
        if (!isEqual(secondStop, secondPlan.stop)) {
          setSecondPlan({
            itinerary: secondPlan.itinerary,
            isFetching: true,
            stop: secondStop,
          });
          fetchPlan(stopsAndStations[1], false);
        }
      }
    }
  }, [favouriteIds, stops]);

  const routeLines = [];
  const realtimeTopics = [];
  const renderRouteLines = mode !== 'CITYBIKE';
  let leafletObjs = [];
  if (renderRouteLines && Array.isArray(sortedStopEdges)) {
    sortedStopEdges.forEach(item => {
      const { place } = item.node;
      place.patterns.forEach(pattern => {
        const feedId = pattern.route.gtfsId.split(':')[0];
        realtimeTopics.push({
          feedId,
          route: pattern.route.gtfsId.split(':')[1],
          shortName: pattern.route.shortName,
        });
        routeLines.push(pattern);
      });
    });
    const getPattern = pattern =>
      pattern.patternGeometry ? pattern.patternGeometry.points : '';
    leafletObjs = uniqBy(routeLines, getPattern).map(pattern => {
      if (pattern.patternGeometry) {
        return (
          <Line
            key={`${pattern.code}`}
            opaque
            geometry={polyline.decode(pattern.patternGeometry.points)}
            mode={mode.toLowerCase()}
          />
        );
      }
      return null;
    });
  }

  uniqueRealtimeTopics = uniqBy(realtimeTopics, route => route.route);

  if (uniqueRealtimeTopics.length > 0) {
    leafletObjs.push(<VehicleMarkerContainer key="vehicles" useLargeIcon />);
  }
  if (
    firstPlan.itinerary.itineraries &&
    firstPlan.itinerary.itineraries.length > 0
  ) {
    leafletObjs.push(
      firstPlan.itinerary.itineraries.map((itinerary, i) => {
        return (
          <ItineraryLine
            key="itinerary"
            hash={i}
            legs={itinerary.legs}
            passive={false}
            showIntermediateStops={false}
            streetMode="walk"
          />
        );
      }),
    );
  }
  if (
    secondPlan.itinerary.itineraries &&
    secondPlan.itinerary.itineraries.length > 0
  ) {
    leafletObjs.push(
      secondPlan.itinerary.itineraries.map((itinerary, i) => {
        return (
          <ItineraryLine
            key="itinerary"
            hash={i}
            flipBubble
            legs={itinerary.legs}
            passive={false}
            showIntermediateStops={false}
            streetMode="walk"
          />
        );
      }),
    );
  }
  const hilightedStops = () => {
    if (
      Array.isArray(sortedStopEdges) &&
      sortedStopEdges.length > 0 &&
      mode !== 'CITYBIKE'
    ) {
      return [sortedStopEdges[0].node.place.gtfsId];
    }
    return [''];
  };
  // Marker for the search point.
  leafletObjs.push(getLocationMarker(position));

  const zoom = 16;
  let map;
  if (breakpoint === 'large') {
    map = (
      <MapWithTracking
        breakpoint={breakpoint}
        showStops
        stopsNearYouMode={mode}
        showScaleBar
        fitBounds={useFitBounds}
        defaultMapCenter={context.config.defaultEndpoint}
        disableParkAndRide
        boundsOptions={{ maxZoom: zoom }}
        bounds={bounds}
        fitBoundsWithSetCenter
        setInitialMapTracking
        hilightedStops={hilightedStops()}
        leafletObjs={leafletObjs}
      />
    );
  } else {
    map = (
      <>
        <BackButton
          icon="icon-icon_arrow-collapse--left"
          iconClassName="arrow-icon"
          color={context.config.colors.primary}
        />
        <MapWithTracking
          breakpoint={breakpoint}
          showStops
          stopsNearYouMode={mode}
          fitBounds={useFitBounds}
          defaultMapCenter={context.config.defaultEndpoint}
          boundsOptions={{ maxZoom: zoom }}
          bounds={bounds}
          showScaleBar
          fitBoundsWithSetCenter
          setInitialMapTracking
          hilightedStops={hilightedStops()}
          leafletObjs={leafletObjs}
        />
      </>
    );
  }
  return map;
}

StopsNearYouMap.propTypes = {
  match: matchShape.isRequired,
  breakpoint: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  relay: PropTypes.shape({
    refetch: PropTypes.func.isRequired,
  }).isRequired,
};

StopsNearYouMap.contextTypes = {
  config: PropTypes.object,
  executeAction: PropTypes.func,
  getStore: PropTypes.func,
};

const StopsNearYouMapWithBreakpoint = withBreakpoint(StopsNearYouMap);

const StopsNearYouMapWithStores = connectToStores(
  StopsNearYouMapWithBreakpoint,
  [TimeStore, PreferencesStore, FavouriteStore],
  ({ getStore }, { match }) => {
    const currentTime = getStore(TimeStore).getCurrentTime().unix();
    const language = getStore(PreferencesStore).getLanguage();

    const favouriteIds =
      match.params.mode === 'CITYBIKE'
        ? new Set(
            getStore('FavouriteStore')
              .getBikeRentalStations()
              .map(station => station.stationId),
          )
        : new Set(
            getStore('FavouriteStore')
              .getStopsAndStations()
              .map(stop => stop.gtfsId),
          );
    return {
      language,
      currentTime,
      favouriteIds,
    };
  },
);

const containerComponent = createRefetchContainer(
  StopsNearYouMapWithStores,
  {
    stops: graphql`
      fragment StopsNearYouMap_stops on QueryType
      @argumentDefinitions(
        startTime: { type: "Long!", defaultValue: 0 }
        omitNonPickups: { type: "Boolean!", defaultValue: false }
        lat: { type: "Float!" }
        lon: { type: "Float!", defaultValue: 0 }
        filterByPlaceTypes: { type: "[FilterPlaceType]", defaultValue: null }
        filterByModes: { type: "[Mode]", defaultValue: null }
        first: { type: "Int!", defaultValue: 5 }
        maxResults: { type: "Int" }
        maxDistance: { type: "Int" }
      ) {
        nearest(
          lat: $lat
          lon: $lon
          filterByPlaceTypes: $filterByPlaceTypes
          filterByModes: $filterByModes
          first: $first
          maxResults: $maxResults
          maxDistance: $maxDistance
        ) {
          edges {
            node {
              distance
              place {
                __typename
                ... on BikeRentalStation {
                  name
                  lat
                  lon
                  stationId
                }
                ... on Stop {
                  gtfsId
                  lat
                  lon
                  name
                  parentStation {
                    lat
                    lon
                    name
                    gtfsId
                  }
                  patterns {
                    route {
                      gtfsId
                      shortName
                    }
                    code
                    directionId
                    patternGeometry {
                      points
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
  },
  graphql`
    query StopsNearYouMapRefetchQuery(
      $lat: Float!
      $lon: Float!
      $filterByPlaceTypes: [FilterPlaceType]
      $filterByModes: [Mode]
      $first: Int!
      $maxResults: Int!
      $maxDistance: Int!
      $startTime: Long!
      $omitNonPickups: Boolean!
    ) {
      viewer {
        ...StopsNearYouMap_stops
        @arguments(
          startTime: $startTime
          omitNonPickups: $omitNonPickups
          lat: $lat
          lon: $lon
          filterByPlaceTypes: $filterByPlaceTypes
          filterByModes: $filterByModes
          first: $first
          maxResults: $maxResults
          maxDistance: $maxDistance
        )
      }
    }
  `,
);

export {
  containerComponent as default,
  StopsNearYouMapWithBreakpoint as Component,
};
