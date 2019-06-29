import React, { Component } from 'react'
import { DrizzleContext } from 'drizzle-react'

import Balance from '../components/Balance';
import ContractForm from '../components/ContractForm';

class Cartera extends Component {

  constructor(props) {
    super(props)
    this.state = {
      drizzle: props.drizzle,
      drizzleState: props.drizzleState,
      initialized: false,
    }
    // this.componentDidMount = this.componentDidMount.bind(this)
  }
  
  componentDidMount() {
    var Cartera = this
    this.unsubscribe = this.props.drizzle.store.subscribe(function () {
      /**
      * It's important to refresh drizzleState by calling this method
      * from drizzle.store, otherwise, even though a change is observed
      * in drizzle.store drizzleState will remain the same.
      */
      var drizzle = Cartera.state.drizzle
      var drizzleState = drizzle.store.getState() 
      if (drizzleState.drizzleStatus.initialized) {
        Cartera.setState({
          drizzle: drizzle,
          drizzleState: drizzleState,
          initialized: true
        })
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    return (
      <div className="pure-g" style={{ backgroundColor: '#f50' }}>
        <div className='pure-u-1'>
          <div className='pure-u-1-2'>
            <div className='container'>

              <h2>Cartera</h2>

              <form
                className='pure-form'
                style={{ width: '100%' }}
              >
                <fieldset>
                  <label htmlFor='sendFrom'>
                    <strong>Please use Metamask to select the account to send from: </strong>
                  </label>
                  <input
                    id='sendFrom'
                    type='text'
                    value={this.state.drizzleState.accounts[0]}
                    readOnly
                  />
                  <br />
                </fieldset>
              </form>

              <ContractForm
                contract='TlaliCoin'
                drizzle={this.props.drizzle}
                drizzleState={this.props.drizzleState}
                method='transfer'
                /* sendArgs={{ value: this.props.drizzle.web3.utils.toWei('600','szabo')}} */
              />
            </div>
          </div>
          <div className='pure-u-1-2'>
            <div className='container'>
              <Balance
                drizzle={this.props.drizzle}
                drizzleState={this.props.drizzleState}
                index={0}
                tokenContract={'TlaliCoin'}
              />
            </div>
          </div>
        </div>        
      </div>
    )
  }
  
}

export default () => (
  <DrizzleContext.Consumer>
    {drizzleContext => {
      const { drizzle, drizzleState, initialized } = drizzleContext;
      if (!initialized) {
        return "Loading...";
      }
      return (
        <Cartera
          drizzle={drizzle}
          drizzleState={drizzleState}
        />
      )
    }}
  </DrizzleContext.Consumer >
)