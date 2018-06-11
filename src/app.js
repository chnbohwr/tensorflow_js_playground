import * as tf from '@tensorflow/tfjs';
import React, { Component } from 'react';
import random from 'random';
import { Button, FormGroup, Label, Input, Alert } from 'reactstrap';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';

window.tf = tf;

export default class App extends Component {
  state = {
    inputShape: [1],
    outputShape: [1],
    batchSize: 200,
    activation: 'elu',
    hiddenLayers: 3,
    hiddenUnits: 3,
    epochs: 200,
    isLoading: false,
    hasModel: false,
  }
  onChangeBatchSize = (e) => {
    this.setState({
      batchSize: parseInt(e.target.value),
    });
  }
  onChangeEpochs = (e) => {
    this.setState({
      epochs: parseInt(e.target.value),
    });
  }
  onChangeActivation = (e) => {
    this.setState({
      activation: e.target.value
    });
  }
  onChangeHiddenLayers = (e) => {
    this.setState({
      hiddenLayers: parseInt(e.target.value)
    });
  }
  onChangeHiddenUnits = (e) => {
    this.setState({
      hiddenUnits: parseInt(e.target.value)
    });
  }
  onClickReset = () => {
    this.setState({ hasModel: false, isLoading: false, data: null })
  }
  onClickCreateModel = () => {
    const { activation, hiddenLayers, hiddenUnits } = this.state
    const model = tf.sequential();
    const xsArr = Array
      .from(Array(this.state.batchSize))
      .map(() => random.float(-5, 5))
      .sort((a, b) => (a - b));
    const ysArr = xsArr.map(d => Math.sin(d));
    // this.state.layers.forEach((d, i) => {
    //   const option = { units: d.units, useBias: true, activation };
    //   if (i === 0) {
    //     option.inputShape = this.state.inputShape;
    //   }
    //   if (i === this.state.layers.length - 1) {
    //     option.outputShape = this.state.outputShape;
    //   }
    //   const layer = tf.layers.dense(option);
    //   model.add(layer);
    // });
    model.add(tf.layers.dense({ units: 1, useBias: true, inputShape: [1] }));
    for (let i = 0; i < hiddenLayers; i++) {
      model.add(tf.layers.dense({ units: hiddenUnits, useBias: true, activation }));
    }
    model.add(tf.layers.dense({ units: 1, useBias: true }));
    model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });
    this.model = model;
    this.xsArr = xsArr;
    this.ysArr = ysArr;
    window.model = model;
    console.log('create model success');
    this.setState({ hasModel: true });
    this.onClickTraining();
  }
  onClickTraining = () => {
    const { epochs, } = this.state;
    this.setState({ isLoading: true });
    const xs = tf.tensor2d(this.xsArr, [this.state.batchSize, 1]);
    const ys = tf.tensor2d(this.ysArr, [this.state.batchSize, 1]);
    console.log('hi1');

    console.log('hi2');
    this.model.fit(xs, ys, { epochs }).then((f) => {
      console.log(f);
      const predictArr = this.model.predictOnBatch(xs).dataSync();
      console.log('hi4')
      const data = Array.from(predictArr)
        .map((predict, i) => ({
          name: this.xsArr[i],
          answer: this.ysArr[i],
          predict: predict
        }));
      this.setState({ data, isLoading: false });
    });
    console.log('hi3');
  }
  render() {
    const {
      batchSize, epochs, data,
      activation, hiddenLayers, hiddenUnits,
      hasModel, isLoading,
    } = this.state;
    return (
      <div style={{ padding: 20 }}>
        <FormGroup>
          <Label>隱藏層數目</Label>
          <Input disabled={isLoading} type="number" name="hiddenLayers" value={hiddenLayers} onChange={this.onChangeHiddenLayers} />
        </FormGroup>
        <FormGroup>
          <Label>隱藏層神經元數目</Label>
          <Input disabled={isLoading} type="number" name="hiddenUnits" value={hiddenUnits} onChange={this.onChangeHiddenUnits} />
        </FormGroup>
        <FormGroup>
          <Label>訓練樣本數</Label>
          <Input disabled={isLoading} type="number" name="batchsize" value={batchSize} onChange={this.onChangeBatchSize} />
        </FormGroup>
        <FormGroup>
          <Label>訓練次數</Label>
          <Input disabled={isLoading} type="number" name="epoch" value={epochs} onChange={this.onChangeEpochs} />
        </FormGroup>
        <FormGroup>
          <Label>激勵函數</Label>
          <Input disabled={isLoading} value={activation} type="select" name="activation" onChange={this.onChangeActivation}>
            <option>elu</option>
            <option>relu</option>
            <option>relu6</option>
            <option>sigmoid</option>
            <option>softmax</option>
          </Input>
        </FormGroup>
        {
          hasModel ? (
            <div>
              <Button disabled={isLoading} style={{ marginRight: 20 }} color="primary" onClick={this.onClickTraining}>再訓練</Button>
              <Button disabled={isLoading} color="danger" onClick={this.onClickReset}>重置</Button>
            </div>
          ) : (
              <Button disabled={isLoading} color="success" onClick={this.onClickCreateModel}>建立模型</Button>
            )
        }


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
