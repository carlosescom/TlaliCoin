import React, { Component } from 'react'
import { DrizzleContext } from 'drizzle-react'
import _ from 'lodash'

// Components
import { newContextComponents } from 'drizzle-react-components'

const { ContractData } = newContextComponents;

var tinycolor = require("tinycolor2");
class Balance extends Component {

  constructor(props) {
    super(props)
    this.state = {
      address: {
        color: '#000',
        display: 'inline',
        fontSize: '12px',
      },
      balance: {
        color: 'white',
        backgroundColor: '#000',
        borderRadius: '4px',
        boxShadow: 'inset 1px 1px 4px #333',
        fontWeight: 'bold',
        padding: '3px 7px',
      },
      tableRow: {
        backgroundColor: '#eee',
      },
      tableData: {
        width: '50%',
        padding: '2px'
      },
      currentAccount: props.currentAccount,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevProps) {
      this.setState({
        address: {
          ...prevState.address,
          color: tinycolor.mostReadable(
            '#eee',
            [this.props.currentAccount.substring(2, 8)],
            { includeFallbackColors: true }
          ).toString(),
        },
        balance: {
          ...prevState.balance,
          backgroundColor: tinycolor(this.props.currentAccount.substring(9, 15)).toString(),
        },
        currentAccount: this.props.currentAccount,
      })
    }
  }

  render() {
    if (_.isEmpty(this.props.currentAccount))
      return (
        <div>
          503 - Service unavailable - !this.props.currentAccount
        </div>
      )
    else {
      return (
        <div style={this.state.tableRow}>
          <div style={this.state.tableData}>
            balanceOf:{' '}
            <strong style={this.state.address}>
              {this.props.currentAccount}
            </strong>{' '}
          </div>
          <div style={this.state.tableData}>
            <div style={this.state.balance}>
              <ContractData
                drizzle={this.props.drizzle}
                drizzleState={this.props.drizzleState}
                contract={this.props.tokenContract}
                method="balanceOf"
                methodArgs={[this.props.currentAccount]}
              />{' Fair Share eCards'}
            </div>
          </div>
        </div>
      )
    }
  }

}

export default (props) => (
  <DrizzleContext.Consumer>
    {drizzleContext => {
      const { drizzle, drizzleState, initialized } = drizzleContext;
      if (!initialized || !drizzleState.accounts[props.index]) {
        return 'Loading...';
      }
      return (
        <Balance
          drizzle={drizzle}
          drizzleState={drizzleState}
          currentAccount={drizzleState.accounts[props.index]}
          tokenContract={props.tokenContract}
        />
      )
    }}
  </DrizzleContext.Consumer >
)