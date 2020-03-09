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

  handleUnits (e) {
    const units = e.target.value

    // Convert temperature if user clicks on a different unit
    // Saves us an API call
    if (this.state.data !== undefined) {
      const { data } = this.state
      const currTemp = data.main.temp
      const storedUnits = this.state.units

      if (storedUnits === 'metric' && units === 'imperial') {
        // metric -> imperial
        data.main.temp = (currTemp * (9 / 5)) + 32
      } else if (storedUnits === 'imperial' && units === 'metric') {
        // imperial -> metric
        data.main.temp = (currTemp - 32) * (5 / 9)
      }
    }

    this.setState(
      { units }
    )
  }

  handleWeather (json) {
    this.setState(
      {
        retrieved: true,
        data: json
      }
    )
  }

  handleError (err) {
    const errCode = err.message
    let msg

    if (errCode === '429') {
      msg = 'Too many requests!'
    } else if (errCode === '404') {
      msg = 'Looks like you tried a bad city name. Check your spelling :)'
    } else {
      msg = `Encountered an error: ${errCode}`
    }

    this.setState(
      {
        retrieved: null,
        errMsg: msg
      }
    )
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
        { cityName },
        () => this.handleData().then(this.handleWeather).catch(this.handleError)
      )
    }
  }

  render () {
    function WeatherDisplay (props) {
      let temperature = ''
      let weatherType = ''
      let location = ''
      let degrees = ''

      const { retrieved, data, units, errMsg } = props

      if (retrieved) {
        temperature = data.main.temp
        weatherType = data.weather[0].main
        location = data.name
        degrees = units === 'metric' ? '°C' : '°F'
      } else if (retrieved === null) {
        temperature = 'Oops!'
        weatherType = errMsg
      }

      return (
        <div id="weather-display">
          <p>{`${temperature}${degrees}`}</p>
          <p>{weatherType}</p>
          <p>{location}</p>
        </div>
      )
    }

    return (
      <div id="weather-container">
        <div id="temperature-selection">
          <input type="radio" name="units" id="celsius" value="metric" onClick={this.handleUnits}/>
          <label htmlFor="celsius">°C</label>
          <input defaultChecked type="radio" name="units" id="farenheit" value="imperial" onClick={this.handleUnits}/>
          <label htmlFor="farenheit">°F</label>
        </div>
        <input type="text" id="search" placeholder="New York" onKeyDown={this.handleSearch}/>
        <WeatherDisplay retrieved={this.state.retrieved} data={this.state.data} units={this.state.units} errMsg={this.state.errMsg} />
        {/* TODO: Use state to load gifs */}
      </div>
    )
  }
}

export default Weather
