export const getRandomInt = (minValue, maxValue) => {
  if((Math.sign(minValue) === -1) || (Math.sign(maxValue) === -1) || minValue >= maxValue) {
    throw new Error('minValue or maxValue in fish-text they have the wrong value');
  }
  return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
};

export const getUNID = () => (
  Date.now().toString(36) + Math.random().toString(36).substr(2)
);

export const sortByField = (field) => {
  const result = (a, b) => a[field] < b[field] ? 1 : -1;
  return result;
};
