// React
import React, { Component } from "react";
import { Route, NavLink, HashRouter } from "react-router-dom"

// React Components
import BarraSuperior from './components/BarraSuperior'
import Cartera from './pages/Cartera'

// Drizzle
import { Drizzle, generateStore } from 'drizzle'
import { DrizzleContext } from 'drizzle-react'
import drizzleOptions from './drizzleOptions'


// Styles
import './css/pure-min.css'
import './css/App.css'

class App extends Component {

  render() {
    var drizzleStore = generateStore(drizzleOptions)
    var drizzle = new Drizzle(drizzleOptions, drizzleStore)
    return (
      <DrizzleContext.Provider drizzle={drizzle}>
        <BarraSuperior />
        <HashRouter>
          <div>
            <nav>
              <ul className="header" style={{ display: 'inline-block' }}>
                <li><NavLink to="/Cartera">Cartera</NavLink></li>
              </ul>
            </nav>
            <div className="content">
              <Route path="/" component={Cartera} />
            </div>
          </div>
        </HashRouter>
      </DrizzleContext.Provider>
    )
  }
}

export default App;
