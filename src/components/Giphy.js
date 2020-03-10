import React from 'react'

import './styles/Giphy.css'

const hidden = {
  display: 'none'
}

const visible = {
  display: 'block'
}

class Giphy extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isRetrieved: false,
      loadingStyle: hidden,
      giphyStyle: hidden
    }

    this.getData = this.getData.bind(this)
    this.loadImage = this.loadImage.bind(this)
    this.handleLoad = this.handleLoad.bind(this)
  }

  async getData () {
    const weather = this.props.weatherData.weather[0].main

    const superSecretApiKeyPlzNoSteal = 'vy6ld9Wo9MZVtkZDxMOtas9GCD2dnaGd'
    const giphyURL = `https://api.giphy.com/v1/gifs/translate?api_key=${superSecretApiKeyPlzNoSteal}&s=${weather}`

    const response = await fetch(giphyURL, { mode: 'cors' })
    const data = await response.json()

    return data
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

  render () {
    if (this.props.weatherData !== undefined && !this.state.isRetrieved) {
      this.getData().then(this.loadImage)
    }

    return (
      <div id="giphy-display">
        <img style={this.state.loadingStyle} id="loading" src={process.env.PUBLIC_URL + '/img/loading.gif'} alt='loading' />
        <img onLoad={this.handleLoad} style={this.state.giphyStyle} id="giphy" alt={this.state.alt} src={this.state.url} />
      </div>
    )
  }
}

export default Giphy
