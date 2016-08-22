'use strict'

import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './components/App'
import Home from './components/Home'
import NestedPath from './components/NestedPath'
import NotFound from './components/NotFound'
import nestedPaths from './nestedPaths'

export const routes = (
  <Route path='/' component={App}>
    <IndexRoute component={Home} />
    <Route path='nested' component={NestedPath} childRoutes={nestedPaths} staticExclude />
    <Route path='foobar'>
      <Route path='/foobar/whatever' component={Home}>
        <Route path='something/something' component={Home} />
        <Route path='*' component={NotFound} />
      </Route>
    </Route>
    <Route path='*' component={NotFound} staticName='error' />
  </Route>
)

export default routes
