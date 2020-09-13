const features = tf.tensor([
    [-121, 47],
    [-121, 46],
    [-122, 50],
    [-140, 44],
    [-700, 44],
])

const labels = tf.tensor([
    [10],
  [200],
  [250],
  [400],
  [900],
]);

const predictionPoint = tf.tensor([-500, 44]);
const k = 2;

features
  .sub(predictionPoint)
    .pow(2)
  .sum(1)
    .pow(.5)
    .expandDims(1)
  .concat(labels, 1)
    .unstack()
  .sort((a, b) => a.get(0) > b.get(0) ? 1 : -1)
  .slice(0, k)
  .reduce((acc, pair) => acc + pair.get(1), 0) / k