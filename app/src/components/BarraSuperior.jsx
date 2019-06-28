import React, { Component } from 'react'

export default class BarraSuperior extends Component {
  render() {
    return (
      <div
        className='pure-u-1 header'
        style={{
          backgroundColor: '#000',
          color: '#fff',
          fontFamily: 'inherit'
        }}
      >
        <h1>TlaliCoin</h1>
      </div>
    )
  }
}
