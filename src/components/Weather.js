import React from 'react'
import PropTypes from 'prop-types'
import './styles/Weather.css'

import Giphy from './Giphy'

function roundTemps (temp) {
  // Round our temperatures to two decimal places at most
  return Math.round(temp * 100) / 100
}

function WeatherDisplay (props) {
  let temperature = ''
  let weatherType = ''
  let location = ''
  let degrees = ''

  const { retrieved, data, units, errMsg } = props

  if (retrieved === 1) {
    location = `In ${data.name}`
    temperature = `It's ${data.main.temp}`
    weatherType = `Weather: ${data.weather[0].main}`

    degrees = units === 'metric' ? '°C' : '°F'
    degrees = `${degrees} outside`
  } else if (retrieved === -1) {
    temperature = 'Oops!'
    weatherType = errMsg
  }

  return (
    <div id="weather-display">
      <p>{location}</p>
      <p>{`${temperature}${degrees}`}</p>
      <p>{weatherType}</p>
    </div>
  )
}

WeatherDisplay.propTypes = {
  retrieved: PropTypes.oneOf(
    [
      -1,
      0,
      1
    ]
  ).isRequired,
  data: PropTypes.shape(
    {
      weather: PropTypes.arrayOf(
        PropTypes.shape(
          {
            main: PropTypes.string
          }
        )
      ),
      main: PropTypes.shape(
        {
          temp: PropTypes.number
        }
      ),
      name: PropTypes.string
    }
  ),
  units: PropTypes.oneOf(
    [
      'metric',
      'imperial'
    ]
  ),
  errMsg: PropTypes.string
}

class Weather extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      cityName: 'New York',
      units: 'imperial',
      retrieved: 0
      /*
        retrieved = -1 : error
        retrieved =  0 : false, not yet retrieved
        retrievied = 1 :
       */
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
        data.main.temp = roundTemps((currTemp * (9 / 5)) + 32)
      } else if (storedUnits === 'imperial' && units === 'metric') {
        // imperial -> metric
        data.main.temp = roundTemps((currTemp - 32) * (5 / 9))
      }
    }

    this.setState(
      { units }
    )
  }

  handleWeather (json) {
    this.setState(
      {
        retrieved: 1,
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
        retrieved: -1,
        errMsg: msg
      }
    )
  }

  async handleData () {
    const { cityName, units } = this.state

    const superSecretApiKeyPlzNoSteal = '69329efdd58f9bc2cda118a18ae27b59'

    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${superSecretApiKeyPlzNoSteal}&units=${units}`
    const response = await fetch(apiURL, { mode: 'cors' })

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
    return (
      <div id="weather-container">

        <div id="weather-entries">
          <div id="temperature-selection">
            <input type="radio" name="units" id="celsius" value="metric" onClick={this.handleUnits}/>
            <label htmlFor="celsius">°C</label>
            <input defaultChecked type="radio" name="units" id="farenheit" value="imperial" onClick={this.handleUnits}/>
            <label htmlFor="farenheit">°F</label>
          </div>
          <input type="text" id="search" placeholder="New York" onKeyDown={this.handleSearch}/>
        </div>
        <WeatherDisplay retrieved={this.state.retrieved} data={this.state.data} units={this.state.units} errMsg={this.state.errMsg} />
        <Giphy weatherData={this.state.data}/>
      </div>
    )
  }
}

export default Weather
