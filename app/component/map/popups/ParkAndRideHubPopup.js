import { createFragmentContainer, graphql } from 'react-relay';
import withProps from 'recompose/withProps';
import compact from 'lodash/compact';
import every from 'lodash/every';
import sumBy from 'lodash/sumBy';
import ParkAndRidePopup from './ParkAndRidePopup';

export default createFragmentContainer(
  withProps(({ facilities, locationPopup, onSelectLocation }) => ({
    // compact removes any falseisch values from the array
    // (bike parks are included in the hub but return null from graphQL carParks)
    realtime: every(compact(facilities), 'realtime'),
    maxCapacity: sumBy(compact(facilities), 'maxCapacity'),
    spacesAvailable: sumBy(compact(facilities), 'spacesAvailable'),
    locationPopup,
    onSelectLocation,
  }))(ParkAndRidePopup),
  {
    facilities: graphql`
      fragment ParkAndRideHubPopup_facilities on CarPark @relay(plural: true) {
        spacesAvailable
        maxCapacity
        realtime
      }
    `,
  },
);
