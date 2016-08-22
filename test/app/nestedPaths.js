'use strict'

export default [{
  path: '1',
  childRoutes: [{
    path: '1.1',
    staticExclude: true,
    childRoutes: [{
      path: '1.1.1'
    }]
  }, {
    path: '1.2',
    staticExclude: true,
    childRoutes: [{
      path: '1.2.1',
      childRoutes: [{
        path: '1.2.1.1'
      }]
    }]
  }]
}, {
  path: '2',
  childRoutes: [{
    path: '2.1',
    staticExclude: true,
    childRoutes: [{
      path: '2.1.1'
    }]
  }]
}]
