'use strict'

import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class MenuItem extends Component {
  static propTypes = {
    path: PropTypes.string,
    staticExclude: PropTypes.bool,
    childRoutes: PropTypes.array,
    base: PropTypes.string
  }

  static defaultProps = {
    base: ''
  }

  render () {
    const { childRoutes, staticExclude } = this.props
    const path = /^\//.test(this.props.path)
      ? this.props.path
      : this.props.base + this.props.path
    const nextBase = /\/$/.test(path) ? path : path + '/'
    return (
      <ul>
        <li>
          {staticExclude
            ? <span>{path}</span>
            : <Link to={{pathname: path}}>{path}</Link>
          }
          {childRoutes && childRoutes.map((route) => (
            <MenuItem key={nextBase + route.path} base={nextBase} {...route} />
          ))}
        </li>
      </ul>
    )
  }
}

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element,
    routes: PropTypes.array.isRequired,
    location: PropTypes.object
  }

  render () {
    const { children, routes, location } = this.props

    return (
      <div>
        <MenuItem {...routes[0]} />
        <h1>{location.pathname}</h1>
        {children}
      </div>
    )
  }
}
