import * as tf from '@tensorflow/tfjs';

export default class NeuralNetwrok {
  constructor({ batchSize, layers, epochs, loss, optimizer }) {
    this.batchSize = batchSize;
    this.layers = layers;
    this.epochs = epochs;
    this.loss = loss;
    this.optimizer = optimizer;
    this.createSampleData();
    this.createModel();
  }

  createSampleData() {
    let indexX = 0;
    this.xArr = [];
    this.predictArr = [];
    // -5 ~ 5 range
    while (indexX < this.batchSize * 2) {
      const num = -5 + (indexX / this.batchSize) * 10;
      if (indexX < this.batchSize) {
        this.xArr.push(num);
        this.predictArr.push(num);
      } else {
        this.predictArr.push(num);
      }
      indexX += 1;
    }
    this.yArr = this.xArr.map(d => Math.sin(d));
  }

  createModel() {
    this.model = tf.sequential();
    this.model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    this.layers.forEach(layerData => {
      this.model.add(tf.layers.dense(layerData))
    });
    this.model.add(tf.layers.dense({ units: 1 }));
    this.model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });
  }

  training() {
    const shape = [this.xArr.length, 1];
    const xs = tf.tensor2d(this.xArr, shape);
    const ys = tf.tensor2d(this.yArr, shape);
    return this.model.fit(xs, ys, { epochs: this.epochs });
  }

  predict() {
    const xs = tf.tensor2d(this.predictArr, [this.predictArr.length, 1]);
    return this.model.predictOnBatch(xs).data();
  }

}