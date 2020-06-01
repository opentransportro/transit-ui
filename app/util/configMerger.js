import mergeWith from 'lodash/mergeWith';

// eslint-disable-next-line no-unused-vars
function merger(objValue, srcValue) {
  if (Array.isArray(srcValue)) {
    return srcValue;
  } // Return only latest if array
  if (Array.isArray(objValue)) {
    return objValue;
  }

  return undefined; // Otherwise use default customizer
}

export default function configMerger(obj, src) {
  return mergeWith({}, obj, src, merger);
}
