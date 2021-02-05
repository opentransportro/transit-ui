import PropTypes from 'prop-types';
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { FormattedMessage } from 'react-intl';
import Icon from './Icon';

function DisruptionInfoButton(props, { config }) {
  if (!config.disruption || config.disruption.showInfoButton) {
    return (
      <button
        type="button"
        className="cursor-pointer disruption-info noborder"
        onClick={props.toggleDisruptionInfo}
      >
        <FormattedMessage id="disruptions" defaultMessage="Disruptions" />
        {props.viewer &&
          props.viewer.alerts &&
          props.viewer.alerts.length > 0 && (
            <Icon img="icon-icon_caution" className="disruption-info" />
          )}
      </button>
    );
  }
  return null;
}

DisruptionInfoButton.propTypes = {
  toggleDisruptionInfo: PropTypes.func.isRequired,
  viewer: PropTypes.shape({
    alerts: PropTypes.array,
  }),
};

DisruptionInfoButton.defaultProps = {
  viewer: {
    alerts: [],
  },
};

DisruptionInfoButton.contextTypes = {
  config: PropTypes.object.isRequired,
};

export default createFragmentContainer(DisruptionInfoButton, {
  viewer: graphql`
    fragment DisruptionInfoButton_viewer on QueryType
    @argumentDefinitions(feedIds: { type: "[String!]", defaultValue: [] }) {
      alerts(feeds: $feedIds) {
        id
      }
    }
  `,
});
