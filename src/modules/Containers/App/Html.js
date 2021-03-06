// @flow
import React from 'react'
import { string, object, objectOf, shape } from 'prop-types'

// `getStyles` is to prevent FOUC in development
const getStyles = assets =>
  Object
    .keys(assets)
    .map(key => assets[key])
    .reduce((acc, { _style }) => {
      if (_style) {
        acc += _style
      }
      return acc
    }, '')

const getInitialState = state => {
  const json = JSON.stringify(state).replace('</', '<\\/')
  return `window.__INITIAL_STATE__=${ json }`
}

const Html = (props: Object) => {
  const { markup, state, assets: { styles, javascript, assets }, helmet } = props

  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        { helmet && helmet.title.toComponent() }
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/x-icon" href="/assets/favicon.ico" />
        <link type="text/css" rel="stylesheet" href="/assets/css/bootstrap/bootstrap.min.css" />
        <link type="text/css" rel="stylesheet" href="/assets/css/fonts.css" />
        <link type="text/css" rel="stylesheet" href="/assets/css/main.css" />
        {
          Object.keys(styles).map(key => (
            <link key={ key } type="text/css" rel="stylesheet" href={ styles[key] } />
          ))
        }
        { __DEV__ && <style dangerouslySetInnerHTML={ { __html: getStyles(assets) } } /> }
      
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={ { __html: markup } } />
        <script dangerouslySetInnerHTML={ { __html: getInitialState(state) } } />
        <script src={ javascript.app } />
      </body>
    </html>
  )
}

Html.displayName = 'Html'

Html.propTypes = {
  markup: string.isRequired,
  state: object.isRequired,
  assets: shape({
    styles: objectOf(string).isRequired,
    javascript: objectOf(string).isRequired,
    assets: object.isRequired
  }).isRequired,
  helmet: object
}

export default Html
