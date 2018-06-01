import * as tf from '@tensorflow/tfjs';

const App = () => {
  // Fit a quadratic function by learning the coefficients a, b, c.
  // const xs = tf.tensor1d([0, 1, 2, 3]);
  // const ys = tf.tensor1d([1, 5.9, 16.8, 33.9]);

  const arrayX = Array.from(Array(3)).map((d, i) => i);
  const xs = tf.tensor1d(arrayX);
  const ys = tf.tensor1d(arrayX.map(x => (
    1 * (x ** 2) + 2 * x + 3
  )));
  xs.print();
  ys.print();

  // answer a:1, b:2, c:3
  const a = tf.scalar(Math.random()).variable();
  const b = tf.scalar(Math.random()).variable();
  const c = tf.scalar(Math.random()).variable();

  // y = a * x^2 + b * x + c.
  const f = x => a.mul(x.square()).add(b.mul(x)).add(c);
  const loss = (pred, label) => {
    const ans = pred.sub(label).square().mean();
    console.log('training loss');
    ans.print();
    return ans;
  }

  const learningRate = 0.01;
  const optimizer = tf.train.sgd(learningRate);

  // Train the model.
  for (let i = 0; i < 1000; i++) {
    optimizer.minimize(() => loss(f(xs), ys));
  }
  optimizer.minimize(() => loss(f(xs), ys));

  // Make predictions.
  console.log(
    `training finsh !!\n  a: ${a.dataSync()}, b: ${b.dataSync()}, c: ${c.dataSync()}`);
  const preds = f(xs).dataSync();
  console.log(preds);
}

export default App;
