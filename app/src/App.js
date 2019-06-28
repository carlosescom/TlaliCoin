// React
import React, { Component } from "react";

// React Components
import BarraSuperior from './components/BarraSuperior'

// Drizzle
import { Drizzle, generateStore } from 'drizzle'
import { DrizzleContext } from 'drizzle-react'
import drizzleOptions from './drizzleOptions'


class App extends Component {

  render() {
    var drizzleStore = generateStore(drizzleOptions)
    var drizzle = new Drizzle(drizzleOptions, drizzleStore)
    return (
      <DrizzleContext.Provider drizzle={drizzle}>
        <BarraSuperior />
      </DrizzleContext.Provider>
    )
  }
}

export default App;
