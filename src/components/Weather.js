import React from 'react'
import './styles/Weather.css'

const weatherApiKey = process.env.REACT_APP_WEATHER_API_KEY

async function getData (cityName, units) {
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

function Weather () {
  return (
    <div id="weather-container">
      <input type="text" id="search" onKeyDown={(e) => {
        if (e.keyCode === 13) {
          getData(e.target.value, 'imperial').then(console.log).catch(
            (err) => console.log(err.message))
        }
      }}></input>
    </div>
  )
}

export default Weather
