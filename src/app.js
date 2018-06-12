import React, { Component } from 'react';
import {
  Button, FormGroup, Label, Input,
} from 'reactstrap';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Layer from './layer.js';
import NeuralNetwork from './NeuralNetwork.js';
import 'bootstrap/dist/css/bootstrap.min.css';


export default class App extends Component {
  state = {
    batchSize: 50,
    epochs: 20,
    layers: [],
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
    const { batchSize, layers, epochs } = this.state;
    this.network = new NeuralNetwork({
      batchSize, layers, epochs,
    });
    this.setState({ hasModel: true });
    this.onClickTraining();
  }
  onClickTraining = () => {

    this.network.training().then(() => {
      this.network.predict().then(prediceDatas => {
        const data = Array.from(prediceDatas).map((pd, i) => {
          return {
            predict: pd,
            answer: this.network.yArr[i] || null,
            name: this.network.predictArr[i],
          }
        });
        this.setState({ data });
      })
    })
  }
  onLayerAdd = () => {
    const layers = [
      ...this.state.layers,
      {
        id: Math.random().toString().substring(2),
        activation: 'elu',
        units: 1,
      }
    ];
    this.setState({ layers });
  }
  onLayerChange = (layerData) => {
    const index = this.state.layers.findIndex(l => l.id === layerData.id);
    this.state.layers.splice(index, 1, layerData);
    const layers = [...this.state.layers];
    this.setState({ layers });
  }

  onLayerDel = (layerData) => {
    const index = this.state.layers.findIndex(l => l.id === layerData.id);
    this.state.layers.splice(index, 1);
    const layers = [...this.state.layers];
    this.setState({ layers });
  }
  render() {
    const {
      batchSize, epochs, data,
      layers,
      hasModel, isLoading,
    } = this.state;
    return (
      <div style={{ padding: 20 }}>
        <FormGroup>
          <Label>Data Size</Label>
          <Input disabled={hasModel} type="number" name="batchsize" value={batchSize} onChange={this.onChangeBatchSize} />
        </FormGroup>
        <FormGroup>
          <Label>Training Epochs</Label>
          <Input disabled={hasModel} type="number" name="epoch" value={epochs} onChange={this.onChangeEpochs} />
        </FormGroup>
        {
          layers.map(layerData => <Layer disabled={hasModel} key={layerData.id} layerData={layerData} onChange={this.onLayerChange} onDel={this.onLayerDel} />)
        }
        <Button disabled={hasModel} style={{ marginBottom: 16 }} color="success" onClick={this.onLayerAdd}>Add Hidden Layer</Button>
        <br />
        {
          hasModel ? (
            <div>
              <Button disabled={isLoading} style={{ marginRight: 20 }} color="primary" onClick={this.onClickTraining}>Training Again</Button>
              <Button disabled={isLoading} color="danger" onClick={this.onClickReset}>Reset</Button>
            </div>
          ) : (
              <Button disabled={isLoading} color="success" onClick={this.onClickCreateModel}>Start</Button>
            )
        }


        {
          data &&
          (
            <LineChart data={data} width={600} height={300}
              margin={{ top: 30, right: 30, left: 20, bottom: 5 }} >
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
