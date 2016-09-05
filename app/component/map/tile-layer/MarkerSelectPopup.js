import React from 'react';
import { FormattedMessage } from 'react-intl';

import SelectStopRow from './SelectStopRow';
import SelectTerminalRow from './SelectTerminalRow';
import SelectCityBikeRow from './SelectCityBikeRow';
import SelectParkAndRideRow from './SelectParkAndRideRow';
import ComponentUsageExample from '../../documentation/ComponentUsageExample';
import { options } from '../../documentation/ExampleData';


function MarkerSelectPopup(props) {
  const rows = props.options.map((option) => {
    if (option.layer === 'stop' && option.feature.properties.stops) {
      return (
        <SelectTerminalRow
          {...option.feature.properties}
          key={option.feature.properties.gtfsId}
          selectRow={() => props.selectRow(option)}
        />
      );
    } else if (option.layer === 'stop') {
      return (
        <SelectStopRow
          {...option.feature.properties}
          key={option.feature.properties.gtfsId}
          selectRow={() => props.selectRow(option)}
        />
      );
    } else if (option.layer === 'citybike') {
      return (
        <SelectCityBikeRow
          {...option.feature.properties}
          key={option.feature.properties.stationId}
          selectRow={() => props.selectRow(option)}
        />
      );
    } else if (option.layer === 'parkAndRide') {
      return (
        <SelectParkAndRideRow
          {...option.feature.properties}
          key={option.feature.properties.carParkId}
          selectRow={() => props.selectRow(option)}
        />
      );
    }
    return null;
  });

  return (
    <div className="card marker-select-popup">
      <h3 className="padding-normal gray">
        <FormattedMessage id="choose-stop" defaultMessage="Choose stop" />
      </h3>
      <hr className="no-margin gray" />
      <div
        className="scrollable momentum-scroll card-row"
      >
        {rows}
      </div>
    </div>
  );
}

MarkerSelectPopup.displayName = 'MarkerSelectPopup';

MarkerSelectPopup.description = (
  <div>
    <p>Renders a marker select popup</p>
    <ComponentUsageExample description="">
      <MarkerSelectPopup
        options={options}
        selectRow={() => {}}
      />
    </ComponentUsageExample>
  </div>
);

MarkerSelectPopup.propTypes = {
  options: React.PropTypes.array.isRequired,
  selectRow: React.PropTypes.func.isRequired,
};

export default MarkerSelectPopup;
