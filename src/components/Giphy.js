import React from 'react'
import PropTypes from 'prop-types'

import './styles/Giphy.css'

const hidden = {
  display: 'none'
}

const visible = {
  display: 'block'
}

const loadingGif = process.env.PUBLIC_URL + '/img/loading.gif'
const loadingErr = process.env.PUBLIC_URL + '/img/error.png'

const loadingAlt = 'loading'
const loadingAltError = 'error!'

class Giphy extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isRetrieved: false,
      loadingStyle: hidden,
      giphyStyle: hidden,
      loadingWait: loadingGif,
      loadingAlt: loadingAlt
    }

    this.getData = this.getData.bind(this)
    this.loadImage = this.loadImage.bind(this)
    this.handleLoad = this.handleLoad.bind(this)
    this.handleError = this.handleError.bind(this)
  }

  async getData () {
    const weather = this.props.weatherData.weather[0].main

    const superSecretApiKeyPlzNoSteal = 'vy6ld9Wo9MZVtkZDxMOtas9GCD2dnaGd'
    const giphyURL = `https://api.giphy.com/v1/gifs/translate?api_key=${superSecretApiKeyPlzNoSteal}&s=${weather}`

    const response = await fetch(giphyURL, { mode: 'cors' })

    if (response.ok) {
      const data = await response.json()

      return data
    } else {
      throw new Error(response.status)
    }
  }

  loadImage (json) {
    const url = json.data.images.original.url
    const alt = json.data.title

    this.setState(
      {
        url: url,
        alt: alt,
        isRetrieved: true
      }
    )
  }

  componentDidUpdate (prevProps) {
    if (prevProps.weatherData !== this.props.weatherData) {
      this.setState({
        isRetrieved: false,
        loadingStyle: visible,
        loadingAlt: loadingAlt,
        giphyStyle: hidden
      })
    }
  }

  handleLoad () {
    this.setState({
      giphyStyle: visible,
      loadingStyle: hidden
    })
  }

  handleError (err) {
    this.setState({
      loadingAlt: err.message + loadingAltError,
      loadingWait: loadingErr
    })
  }

  render () {
    if (this.props.weatherData !== undefined && !this.state.isRetrieved) {
      this.getData().then(this.loadImage).catch(this.handleError)
    }

    return (
      <div id="giphy-display">
        <img
          id="loading"
          style={this.state.loadingStyle}
          src={this.state.loadingWait}
          alt={this.state.loadingAlt}
        />
        <img
          id="giphy"
          onLoad={this.handleLoad}
          style={this.state.giphyStyle}
          alt={this.state.alt}
          src={this.state.url}
        />
      </div>
    )
  }
}

// All we need from weatherData is the type of weather which looks like
// {
//   weather: [
//     {
//       main: 'Clouds'
//     }
//   ]
// }
Giphy.propTypes = {
  weatherData: PropTypes.shape({
    weather: PropTypes.arrayOf(PropTypes.shape(
      {
        main: PropTypes.string.isRequired
      }).isRequired
    ).isRequired
  })
}

export default Giphy
