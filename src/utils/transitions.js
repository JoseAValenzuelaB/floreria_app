import { easePolyOut } from 'd3-ease';


const easePolyOutFunction = (params, callback) => {
  let currentTime = 0;
  const { initialValue, finalValue, duration, sampling } = params;
  const samplingFrecuency = sampling || 30;

  const getNextValue = () => {
    if (currentTime < duration) {
      const transitionPercentage = currentTime / duration;
      const nextNormalizedValue = easePolyOut(transitionPercentage, 4);
      const nextValue = ((finalValue - initialValue) * nextNormalizedValue) + initialValue;
      const response = { value: parseFloat(nextValue.toFixed(2), 10), finished: false };
      callback(response);

      setTimeout(() => {
        currentTime += samplingFrecuency;
        getNextValue();
      }, samplingFrecuency);
    } else {
      const nextValue = ((finalValue - initialValue) * easePolyOut(1, 4)) + initialValue;
      const response = { value: parseFloat(nextValue.toFixed(2), 10), finished: true };
      callback(response);
    }
  };

  getNextValue();
};


const singleValue = ({ initialValue, finalValue, animationProgress }) => (
  ((finalValue - initialValue) * (animationProgress / 100)) + initialValue
);


export default { easePolyOut: easePolyOutFunction, singleValue };
