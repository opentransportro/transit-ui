import PropTypes from 'prop-types';
import React from 'react';
import Icon from './Icon';

const OriginSelectorRow = ({ icon, label, onClick }) => (
  <li>
    <button
      id="localize-user"
      className="noborder noborder2"
      style={{ display: 'block' }}
      onClick={onClick}
    >
      <Icon className={`splash-icon ${icon}`} img={icon} />
      {label}
    </button>
  </li>
);

OriginSelectorRow.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default OriginSelectorRow;
