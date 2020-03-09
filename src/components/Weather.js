import React from 'react'
import './styles/Weather.css'

class Weather extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      cityName: 'New York',
      units: 'imperial',
      retrieved: false
    }

    this.handleData = this.handleData.bind(this)
    this.handleWeather = this.handleWeather.bind(this)
    this.handleError = this.handleError.bind(this)
    this.handleUnits = this.handleUnits.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }

  handleUnits (units) {
    this.setState(
      { units }
    )
  }

  handleWeather (json) {
    console.log(json)
  }

  handleError (err) {
    alert(err)
  }

  async handleData () {
    const { cityName, units } = this.state

    const weatherApiKey = process.env.REACT_APP_WEATHER_API_KEY

    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${weatherApiKey}&units=${units}`
    const response = await fetch(apiURL, { mode: 'cors' })

    console.log(response)

    let data

    if (response.ok) {
      data = await response.json()
      return data
    } else {
      throw new Error(response.status)
    }
  }

  handleSearch (event) {
    const { keyCode } = event

    if (keyCode === 13) {
      const cityName = event.target.value

      this.setState(
        { cityName }
      )

      this.handleData(this.state).then(this.handleWeather).catch(this.handleError)
    }
  }

  render () {
    return (
      <div id="weather-container">
        <div>
          <input type="radio" name="units" id="celsius" value="metric" onClick={
            (e) => this.handleUnits(e.target.value)
          }/>
          <label htmlFor="celsius">°C</label>
          <input type="radio" name="units" id="farenheit" value="imperial" onClick={
            (e) => this.handleUnits(e.target.value)
          }/>
          <label htmlFor="farenheit">°F</label>
        </div>
        <input type="text" id="search" onKeyDown={(e) => {
          this.handleSearch(e)
        }}>
          {/* TODO: Use state to load gifs */}
        </input>
      </div>
    )
  }
}

export default Weather
