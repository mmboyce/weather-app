import React from 'react'

import './styles/Giphy.css'

class Giphy extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoaded: false
    }

    this.getData = this.getData.bind(this)
    this.loadImage = this.loadImage.bind(this)
  }

  async getData () {
    const weather = this.props.weatherData.weather[0].main

    const giphyApiKey = process.env.REACT_APP_GIPHY_API_KEY
    const giphyURL = `https://api.giphy.com/v1/gifs/translate?api_key=${giphyApiKey}&s=${weather}`

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
        isLoaded: true
      }
    )
  }

  componentDidUpdate (prevProps) {
    if (prevProps.weatherData !== this.props.weatherData) {
      this.setState({
        isLoaded: false
      })
    }
  }

  render () {
    if (this.props.weatherData !== undefined && !this.state.isLoaded) {
      this.getData().then(this.loadImage)
    }

    return (
      <div id="giphy-display">
        <img alt={this.state.alt} src={this.state.url} />
      </div>
    )
  }
}

export default Giphy
