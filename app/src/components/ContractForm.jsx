import React, { Component } from "react";
import PropTypes from "prop-types";

import _ from 'lodash'

class ContractForm extends Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.contracts = props.drizzle.contracts;

    // Get the contract ABI
    const abi = this.contracts[this.props.contract].abi;

    this.inputs = [];
    var initialState = {};

    // Iterate over abi for correct function.
    for (var i = 0; i < abi.length; i++) {
      if (abi[i].name === this.props.method) {
        this.inputs = abi[i].inputs;

        for (var j = 0; j < this.inputs.length; j++) {
          initialState[this.inputs[j].name] =
            /[a-z]+[0-9]*\[[0-9]+\]/.test(this.inputs[j].type) ? [] : "";
        }

        break;
      }
    }

    this.state = initialState;
  }

  handleSubmit(event) {
    event.preventDefault();

    const convertedInputs = this.inputs.map((input, index) => {
      var size = this.getSize(input.type);
      let isArray = 1 < size
      if (isArray) {
        let isBytes = /^bytes/.test(input.type)
        let emptyArray = _.range(size)
        let convertedArray = _.map(emptyArray, subindex => {
          let subinputName = input.name
          let subinputInState = this.state[subinputName][subindex]
          return isBytes ? this.props.drizzle.web3.utils.toHex(subinputInState) : subinputInState
        })
        return convertedArray
      }
      else if (/^bytes/.test(input.type)) {
        return this.props.drizzle.web3.utils.toHex(this.state[input.name])
      }
      return this.state[input.name];
    })

    if (this.props.sendArgs) {
      return this.contracts[this.props.contract].methods[
        this.props.method
      ].cacheSend(...convertedInputs, this.props.sendArgs);
    }

    return this.contracts[this.props.contract].methods[
      this.props.method
    ].cacheSend(...convertedInputs);
  }

  handleInputChange(event) {
    let target = event.target
    let name = target.name
    let value = target.value
    let isArray = /[a-z]+[0-9]*\[[0-9]+\]/.test(name)
    if (isArray) {
      let abiName = /([^)]+)\[[0-9]+\]/.exec(name)[1]
      this.setState((prevState, state) => {
        let newArray = this.state[abiName]
        newArray[this.getSize(name)] = value
        return {
          [abiName]: newArray
        }
      });
    }
    else this.setState({ [name]: value });
  }

  getSize(type) {
    if (/[a-z]+[0-9]*\[[0-9]+\]/.test(type)) {
      let size = /\[([^)]+)\]/.exec(type)[1]
      return parseInt(size)
    }
    else return 1
  }
  
  getHTMLType(type) {
    if (/^uint/.test(type))
      return "number"
    else if (/^string/.test(type) || /^bytes/.test(type))
      return "text"
    else if (/^bool/.test(type))
      return "checkbox"
    else
      return "text"
  }

  render() {
    return (
      <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit}>
        {this.inputs.map((input, index) => {
          var size = this.getSize(input.type);
          var type = this.getHTMLType(input.type);
          // if the labels props are passed, assign the corresponding label to the inputLabel
          // variable that will be passed to the placeholder prop of the corresponding input
          var inputLabel = this.props.labels
            ? this.props.labels[index]
            : input.name;
          // check if input type is struct and if so loop out struct fields as well
          return _.range(size).map(subindex => {
            let suffix = 1 < size ? '[' + subindex + ']' : ''
            return (
              <input
                key={input.name + suffix}
                type={type}
                name={input.name + suffix}
                value={this.state[input.name + suffix]}
                placeholder={inputLabel + suffix}
                onChange={this.handleInputChange}
              />
            )
          })
        })}
        <button
          key="submit"
          className="pure-button"
          type="button"
          onClick={this.handleSubmit}
        >
          Submit
        </button>
      </form>
    );
  }
}

ContractForm.propTypes = {
  drizzle: PropTypes.object.isRequired,
  contract: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  sendArgs: PropTypes.object,
  labels: PropTypes.arrayOf(PropTypes.string),
};

export default ContractForm;
