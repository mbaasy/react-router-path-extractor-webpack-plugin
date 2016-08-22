'use strict'

import React from 'react'
import { render } from 'react-dom'
import { renderToString } from 'react-dom/server'
import {
  RouterContext,
  Router,
  browserHistory,
  match,
  createMemoryHistory
} from 'react-router'
import routes from './routes'

const template = (html, assets) => (`
<!DOCTYPE html>
<html>
  <head>
    <title>ReactRouterPathExtractorWebpackPlugin Test</title>
    <meta charset='utf-8' />
  </head>
  <body>
    <div id='outlet'>${html}</div>
    <script src='/${assets.main}'></script>
  </body>
</html>
`)

if (typeof document !== 'undefined') {
  render(
    <Router history={browserHistory} routes={routes} />
  , document.getElementById('outlet'))
}

export default (locals, callback) => {
  const history = createMemoryHistory()
  const location = history.createLocation(locals.path)

  match({routes, location}, (error, redirectLocation, renderProps) => {
    if (error) { return callback(error) }
    const html = renderToString(
      <RouterContext {...renderProps} />
    )
    callback(null, template(html, locals.assets))
  })
}
