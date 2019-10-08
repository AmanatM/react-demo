import React, { useState, useEffect } from 'react'
import axios from 'axios'

//   https://restcountries.eu/rest/v2/all

const SearchBar = ({handleSearch, searchValue}) => {
  return (
    <div>
      <p>Search for country: <input placeholder="Search" autoFocus={true} value={searchValue} onChange={handleSearch}/></p>
    </div>
  )
}

const CountryInformation = ({country}) => {
  return (
    <div>
      <h1>{country.name}</h1>
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>
      {country.languages.length > 1 ? <h3>Languages: </h3> : <h3>Language: </h3>}
      <ul>
        {country.languages.map(item => <li key={item.name}>{item.name}</li>)}
      </ul>
      <img width="250px" height="150px" src={country.flag} alt="Country flag"/>
      <WeatherInformation city={country.capital}/>
    </div>
  )
}

const WeatherInformation = ({city}) => {

  let url = `http://api.weatherstack.com/current?access_key=d5edec813030391a9046197ffaf8bdc4&query=${city}`
  const [ weather, setWeather ] = useState(null)

  useEffect(() => {
    axios
    .get(url)
    .then(res => {
      setWeather(res.data)
    })
  }, [url])


  if(weather) {
    return (
      <>
        <h3>Weather in {city}</h3>
        <p>Temperature: {weather.current.temperature}</p>
        {weather.current.weather_icons.map((url, index) => <img key={index} src={url}/>)}
        <p>Wind: {weather.current.wind_speed} k/h, direction: {weather.current.wind_dir}</p>

      </>
    )
  } else {
    return (
      <p>Loading weather data...</p>
    )
  }


}


const Display = ({countries, searchValue, setCurrentCountry, currentCountry, handleCountryClick}) => {
  let filteredCountries = countries.map(country => country.name).filter(countryName => countryName.toLowerCase().includes(searchValue.toLowerCase())).map(item => <li key={item}>{item}<button data-name={item} onClick={handleCountryClick}>Show</button></li>).slice(0, 10)
  let noMatches = false
  if(filteredCountries.length === 1) {
    setCurrentCountry(countries.find(item => item.name === filteredCountries[0].key))
  } else if(filteredCountries.length === 0){
    setCurrentCountry(null)
    noMatches = true
  } else {
    setCurrentCountry(null)
  }

  if(noMatches) {
    return (
      <div>
         No matches at all
      </div>
    )
  } else if(searchValue === '') {
    return (
      <div>
         Type to search
      </div>
    )
  }
  else if(currentCountry === null) {
    return (
      <div>
         {filteredCountries}
      </div>
    )
  } else {
    return (
      <div>
        <CountryInformation country={currentCountry}/>
      </div>
    )
  }

}


const App = () => {

  const [ countries, setCountries ] = useState([])
  const [ searchValue, setSearchValue ] = useState('')
  const [ currentCountry, setCurrentCountry ] = useState(null)



  useEffect(() => {
    axios
    .get("https://restcountries.eu/rest/v2/all")
    .then(res => {
      setCountries(res.data)
    })
  }, [])

  const handleSearch = (e) => {
    setSearchValue(e.target.value)
  }

  const handleCountryClick = (e) => {
    setSearchValue(e.target.attributes.getNamedItem('data-name').value)
  }

  return (
    <div>
      <SearchBar handleSearch={handleSearch} searchValue={searchValue}/>
      <Display handleCountryClick={handleCountryClick} countries={countries} searchValue={searchValue} currentCountry={currentCountry} setCurrentCountry={setCurrentCountry}/>
    </div>
  )
}
export default App

