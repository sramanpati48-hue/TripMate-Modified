import axios from 'axios'

export async function getRealWeather(city: string, state: string = '') {
  const API_KEY = process.env.OPENWEATHER_API_KEY
  
  if (!API_KEY) {
    console.log('OpenWeather API key not configured, using mock data')
    return null
  }
  
  try {
    const query = state ? `${city},${state},IN` : `${city},IN`
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=metric`
    )
    
    return {
      temperature: Math.round(response.data.main.temp),
      condition: response.data.weather[0].main,
      humidity: response.data.main.humidity,
      description: response.data.weather[0].description,
      feelsLike: Math.round(response.data.main.feels_like),
      windSpeed: Math.round(response.data.wind.speed * 3.6), // m/s to km/h
      icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
      sunrise: new Date(response.data.sys.sunrise * 1000),
      sunset: new Date(response.data.sys.sunset * 1000)
    }
  } catch (error: any) {
    console.error('Weather fetch error:', error.response?.data || error.message)
    return null
  }
}

export async function get5DayForecast(city: string, state: string = '') {
  const API_KEY = process.env.OPENWEATHER_API_KEY
  
  if (!API_KEY) {
    return null
  }
  
  try {
    const query = state ? `${city},${state},IN` : `${city},IN`
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${API_KEY}&units=metric`
    )
    
    // Get one forecast per day (every 8th item = 24 hours)
    return response.data.list
      .filter((_: any, index: number) => index % 8 === 0)
      .slice(0, 5)
      .map((item: any) => ({
        date: new Date(item.dt * 1000),
        temp: Math.round(item.main.temp),
        tempMin: Math.round(item.main.temp_min),
        tempMax: Math.round(item.main.temp_max),
        condition: item.weather[0].main,
        description: item.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
      }))
  } catch (error: any) {
    console.error('Forecast fetch error:', error.response?.data || error.message)
    return null
  }
}
