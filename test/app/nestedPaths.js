'use strict'

import Home from './components/Home'

export default [{
  path: '1',
  component: Home,
  childRoutes: [{
    path: '1.1',
    component: Home,
    childRoutes: [{
      path: '1.1.1',
      component: Home
    }]
  }, {
    path: '1.2',
    childRoutes: [{
      path: '1.2.1',
      childRoutes: [{
        path: '1.2.1.1',
        component: Home
      }]
    }]
  }]
}, {
  path: '2',
  component: Home,
  childRoutes: [{
    path: '2.1',
    childRoutes: [{
      path: '2.1.1',
      component: Home
    }]
  }]
}]
