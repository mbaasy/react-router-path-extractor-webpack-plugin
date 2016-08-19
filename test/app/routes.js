'use strict'

import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './components/App'
import Home from './components/Home'
import nestedPaths from './nestedPaths'

export const routes = (
  <Route path='/' component={App}>
    <IndexRoute component={Home} />
    <Route path='nested' component={Home} childRoutes={nestedPaths} />
  </Route>
)

export default routes
