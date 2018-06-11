import * as tf from '@tensorflow/tfjs';
import React, { Component } from 'react';
import random from 'random';
import { Button, FormGroup, Label, Input, Alert } from 'reactstrap';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';

window.tf = tf;

export default class App extends Component {
  state = {
    layers: [{ units: 1 }, { units: 100 }, { units: 100 }, { units: 100 }, { units: 1 }],
    inputShape: [1],
    outputShape: [1],
    batchSize: 1000,
    epochs: 10,
    model: null,
  }
  onChangeBatchSize = (e) => {
    this.setState({
      batchSize: parseInt(e.target.value),
      model: null
    });
  }
  onChangeEpochs = (e) => {
    this.setState({
      epochs: parseInt(e.target.value),
      model: null
    });
  }
  onClickCreateModel = () => {
    const model = tf.sequential();
    const xsArr = Array
      .from(Array(this.state.batchSize))
      .map(() => random.float(-5, 5))
      .sort((a, b) => (a - b));
    const ysArr = xsArr.map(d => Math.sin(d));
    this.state.layers.forEach((d, i) => {
      const option = { units: d.units };
      if (i === 0) {
        option.inputShape = this.state.inputShape;
      }
      if (i === this.state.layers.length - 1) {
        option.outputShape = this.state.outputShape;
      }
      console.log(option);
      const layer = tf.layers.dense(option);
      model.add(layer);
    });
    model.compile({ loss: tf.losses.meanSquaredError, optimizer: 'sgd' });
    this.model = model;
    this.xsArr = xsArr;
    this.ysArr = ysArr;
  }
  onClickTraining = () => {
    const { epochs, } = this.state;
    const xs = tf.tensor2d(this.xsArr, [this.state.batchSize, 1]);
    const ys = tf.tensor2d(this.ysArr, [this.state.batchSize, 1]);
    tf.tidy(() => {
      this.model.fit(xs, ys).then(() => {
        const predictArr = this.model.predictOnBatch(xs).dataSync();
        const data = Array.from(predictArr)
          .map((predict, i) => ({
            name: this.xsArr[i],
            answer: this.ysArr[i],
            predict: predict
          }));
        this.setState({ data });
      });
    });
  }
  render() {
    const { batchSize, epochs, data } = this.state;
    return (
      <div>
        <FormGroup>
          <Label>訓練樣本數</Label>
          <Input type="number" name="batchsize" value={batchSize} onChange={this.onChangeBatchSize} />
        </FormGroup>
        <FormGroup>
          <Label>訓練次數</Label>
          <Input type="number" name="epoch" value={epochs} onChange={this.onChangeEpochs} />
        </FormGroup>
        <Button color="success" onClick={this.onClickCreateModel}>建立模型!</Button>
        <Button color="success" onClick={this.onClickTraining}>開始訓練!</Button>
        {
          data &&
          (
            <LineChart data={data} width={600} height={300}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
              <Line dataKey="answer" stroke="#8884d8" />
              <Line dataKey="predict" stroke="#82ca9d" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
            </LineChart>
          )
        }

      </div>
    )
  }
}


// const App = () => {
//   const model = tf.sequential();
//   model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

//   // Prepare the model for training: Specify the loss and the optimizer.
//   model.compile({ loss: tf.losses.meanSquaredError, optimizer: 'sgd' });

//   const length = 10;
//   // Generate some synthetic data for training.
//   const xarr = Array.from(Array(length)).map((d, i) => i);
//   const yarr = Array.from(Array(length)).map((d, i) => i * 10);

//   const xs = tf.tensor2d(xarr, [length, 1]);
//   const ys = tf.tensor2d(yarr, [length, 1]);

//   model.fit(xs, ys, { epochs: 250 }).then(() => {
//     model.predict(tf.tensor2d([2], [1, 1])).print();
//   });

// }