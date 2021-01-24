import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { intlShape } from 'react-intl';
import { matchShape, routerShape } from 'found';
import connectToStores from 'fluxible-addons-react/connectToStores';
import DTAutosuggestPanel from '@digitransit-component/digitransit-component-autosuggest-panel';
import { addAnalyticsEvent } from '../util/analyticsUtils';
import ComponentUsageExample from './ComponentUsageExample';
import withSearchContext from './WithSearchContext';
import {
  setIntermediatePlaces,
  updateItinerarySearch,
  onLocationPopup,
} from '../util/queryUtils';
import { getIntermediatePlaces, locationToOTP } from '../util/otpStrings';
import { dtLocationShape } from '../util/shapes';
import { setViaPoints } from '../action/ViaPointActions';
import { LightenDarkenColor } from '../util/colorUtils';

const DTAutosuggestPanelWithSearchContext = withSearchContext(
  DTAutosuggestPanel,
);

class OriginDestinationBar extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    origin: dtLocationShape.isRequired,
    destination: dtLocationShape.isRequired,
    language: PropTypes.string,
    isMobile: PropTypes.bool,
    showFavourites: PropTypes.bool.isRequired,
    viaPoints: PropTypes.array,
  };

  static contextTypes = {
    intl: intlShape.isRequired,
    router: routerShape.isRequired,
    getStore: PropTypes.func.isRequired,
    executeAction: PropTypes.func.isRequired,
    match: matchShape.isRequired,
    config: PropTypes.object.isRequired,
  };

  static defaultProps = {
    className: undefined,
    language: 'fi',
    isMobile: false,
    viaPoints: [],
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const viaPoints = getIntermediatePlaces(this.context.match.location.query);
    this.context.executeAction(setViaPoints, viaPoints);
  }

  componentWillUnmount() {
    // fixes the bug that DTPanel starts excecuting updateViaPoints before this component is even mounted
    this.context.executeAction(setViaPoints, []);
  }

  updateViaPoints = newViaPoints => {
    const p = newViaPoints.filter(vp => vp.lat && vp.address);
    this.context.executeAction(setViaPoints, p);
    setIntermediatePlaces(
      this.context.router,
      this.context.match,
      p.map(locationToOTP),
    );
  };

  swapEndpoints = () => {
    const { location } = this.context.match;
    const intermediatePlaces = getIntermediatePlaces(location.query);
    if (intermediatePlaces.length > 1) {
      location.query.intermediatePlaces.reverse();
    }
    updateItinerarySearch(
      this.props.destination,
      this.props.origin,
      this.context.router,
      location,
      this.context.executeAction,
    );
  };

  onLocationSelect = (item, id) => {
    let action;
    if (id === parseInt(id, 10)) {
      // id = via point index
      action = 'EditJourneyViaPoint';
      const points = [...this.props.viaPoints];
      points[id] = { ...item };
      this.updateViaPoints(points);
    } else {
      action =
        id === 'origin' ? 'EditJourneyStartPoint' : 'EditJourneyEndPoint';
      onLocationPopup(
        item,
        id,
        this.context.router,
        this.context.match,
        this.context.executeAction,
      );
    }
    addAnalyticsEvent({
      action,
      category: 'ItinerarySettings',
      name: item.type,
    });
  };

  render() {
    return (
      <div
        className={cx(
          'origin-destination-bar',
          this.props.className,
          'flex-horizontal',
        )}
      >
        <DTAutosuggestPanelWithSearchContext
          appElement="#app"
          origin={this.props.origin}
          destination={this.props.destination}
          originPlaceHolder="search-origin-index"
          destinationPlaceHolder="search-destination-index"
          showMultiPointControls
          viaPoints={this.props.viaPoints}
          updateViaPoints={this.updateViaPoints}
          addAnalyticsEvent={addAnalyticsEvent}
          swapOrder={this.swapEndpoints}
          selectHandler={this.onLocationSelect}
          sources={[
            'History',
            'Datasource',
            this.props.showFavourites ? 'Favourite' : '',
          ]}
          targets={[
            'Locations',
            'CurrentPosition',
            this.props.isMobile ? 'MapPosition' : '',
            'Stops',
          ]}
          lang={this.props.language}
          disableAutoFocus={this.props.isMobile}
          isMobile={this.props.isMobile}
          itineraryParams={this.context.match.location.query}
          color={this.context.config.colors.primary}
          hoverColor={
            this.context.config.colors.hover ||
            LightenDarkenColor(this.context.config.colors.primary, -20)
          }
        />{' '}
      </div>
    );
  }
}

OriginDestinationBar.description = (
  <React.Fragment>
    <ComponentUsageExample>
      <OriginDestinationBar
        destination={{}}
        origin={{
          address: 'Messukeskus, Itä-Pasila, Helsinki',
          lat: 60.201415,
          lon: 24.936696,
        }}
        showFavourites
      />
    </ComponentUsageExample>
    <ComponentUsageExample description="with-viapoint">
      <OriginDestinationBar
        destination={{}}
        location={{
          query: {
            intermediatePlaces: 'Opastinsilta 6, Helsinki::60.199093,24.940536',
          },
        }}
        origin={{
          address: 'Messukeskus, Itä-Pasila, Helsinki',
          lat: 60.201415,
          lon: 24.936696,
        }}
        showFavourites
      />
    </ComponentUsageExample>
  </React.Fragment>
);

const connectedComponent = connectToStores(
  OriginDestinationBar,
  ['PreferencesStore', 'FavouriteStore', 'ViaPointStore'],
  ({ getStore }) => ({
    language: getStore('PreferencesStore').getLanguage(),
    showFavourites: getStore('FavouriteStore').getStatus() === 'has-data',
    viaPoints: getStore('ViaPointStore').getViaPoints(),
  }),
);

export { connectedComponent as default, OriginDestinationBar as Component };
