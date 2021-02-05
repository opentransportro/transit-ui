import React from 'react';
import PropTypes from 'prop-types';
import Lottie from 'react-lottie';
import loadingAnimationData from '../../static/assets/animations/loading.json';

const Loading = props => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <Lottie
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -(props.width / 2),
        marginTop: -(props.height / 2),
      }}
      options={defaultOptions}
      width={props.width}
      height={props.height}
      isStopped={false}
      isPaused={false}
    />
  );
};

Loading.displayName = 'Loading';
Loading.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

Loading.defaultProps = {
  height: 200,
  width: 200,
};
export default Loading;
