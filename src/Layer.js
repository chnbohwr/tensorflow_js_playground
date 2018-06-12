import React, { PureComponent } from 'react';
import { Card, CardBody, CardTitle, FormGroup, Label, Input, Button } from 'reactstrap';
import PropTypes from 'prop-types';

const activations = [
  'elu',
  'hardSigmoid',
  'linear',
  'relu',
  'relu6',
  'selu',
  'sigmoid',
  'softmax',
  'softplus',
  'softsign',
  'tanh'
];

export default class Layer extends PureComponent {
  static propTypes = {
    layerData: PropTypes.shape({
      id: PropTypes.string,
      units: PropTypes.number,
      activation: PropTypes.string,
    }),
    onChange: PropTypes.func,
    onDel: PropTypes.func,
    disabled: PropTypes.bool,
  }

  onChangeActivation = (e) => {
    this.props.onChange({
      ...this.props.layerData,
      activation: e.target.value,
    });
  }

  onChangeUnits = (e) => {
    this.props.onChange({
      ...this.props.layerData,
      units: parseInt(e.target.value),
    });
  }

  onDeleteLayer = () => {
    this.props.onDel(this.props.layerData);
  }

  render() {
    const { id, units, activation } = this.props.layerData;
    const { disabled } = this.props;
    return (
      <div style={{ marginBottom: 20 }}>
        <Card>
          <CardBody>
            <CardTitle>layerId: {id}</CardTitle>
            <FormGroup>
              <Label>units</Label>
              <Input disabled={disabled} type="number" value={units} onChange={this.onChangeUnits} />
            </FormGroup>
            <FormGroup>
              <Label>activation</Label>
              <Input disabled={disabled} type="select" name="select" value={activation} onChange={this.onChangeActivation} >
                {activations.map(activationString => <option key={activationString}>{activationString}</option>)}
              </Input>
            </FormGroup>
            <Button color="danger" disabled={disabled} onClick={this.onDeleteLayer}>Remove this layer</Button>
          </CardBody>
        </Card>
      </div>
    )
  }
}
