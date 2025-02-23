const cityInput = document.querySelector(`.city-input`);
const searchBtn = document.querySelector(`.search-btn`)

const weatherInfoScetion = document.querySelector(`.weather-info`)
const notFoundSection = document.querySelector(`.Not-Found`)
const searchCitySection = document.querySelector(`.search-city`)

const countryTxt = document.querySelector(`.country-txt`)
const tempTxt = document.querySelector(`.temp-txt`)
const conditionTxt = document.querySelector(`.condition-txt`)
const humidityValueTxt = document.querySelector(`.hummidity-value-txt`)
const windValueTxt = document.querySelector(`.Wind-value-txt`)
const weatherSummeryicon =document.querySelector(`.weather-summary-icon`)
const currentDatetxt =document.querySelector(`.cureent-date-txt`)

const forecastItemsContainer = document.querySelector(`.forecast-items-container`)


const apiKey = `7decf32a4dfa0d10ef5bc4b60c66e4e6`

searchBtn.addEventListener(`click`, () => { 
    if (cityInput.value.trim() != ''){ 
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    } 
})
cityInput.addEventListener ('keydown' , (event) => {
    if (event.key == 'Enter' && 
        cityInput.value.trim() != ''
    ) {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }  
}) 
async function getFetchData(endPoint, city){
    const apiUrl =`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

    const respone = await fetch(apiUrl)

    return respone.json()
}

function getweatherIcon(id){

    if(id <= 232 ) return mist.png
    if(id <= 321 ) return clouds.png
    if(id <= 531 ) return rain.png
    
    else return `clouds.png`
}

function getCurrentDate() {
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day : '2-digit',
        month: 'short'
    }
   
    return currentDate.toLocaleDateString('en-GB',options)
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData ('weather', city)
    if (weatherData.cod != 200){
        showDisplaySection(notFoundSection)
        return
    }
    console.log(weatherData)
    const{
        name: country,
        main: {temp, humidity },
        weather:[{ id, main }],
        wind: {speed}


    } = weatherData
    countryTxt.textContent = country;
    tempTxt.textContent = temp + ' °C';
    conditionTxt.textContent = main;
    humidityValueTxt.textContent = humidity + '%';
    windValueTxt.textContent = speed + 'kms';
    weatherSummeryicon.src = getweatherIcon(id);
    currentDatetxt.textContent = getCurrentDate();
     
    console.log(getCurrentDate())
    await updateForecastsInfo(city)
    showDisplaySection(weatherInfoScetion)
}

async function updateForecastsInfo(city){
    const forecastData = await getFetchData('forecast',city);
    const timeTaken = '12:00:00';
    const todayDate = new Date().toLocaleDateString().split('T')[0];

    forecastItemsContainer.innerHTML = '';

    forecastData.list.forEach(forecastWeather =>{
        if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)){
            console.log(forecastWeather);
            updateForecastsInfos(forecastWeather);
        }
        
    });
    
}

function updateForecastsInfos(weatherData){
    console.log(weatherData)
    const{
        dt_txt: date,
        weather: [{id}],
        main: {temp}
    } = weatherData;

const dateTaken = new Date(date)
const dateOption = {
    day: '2-digit',
    month: 'short'
}
const dateResult = dateTaken.toLocaleTimeString('en-US', dateOption)

    const forecastItems = `
    <div class="forcast-item">
                    <h5 class="forcast-item-date">${dateResult}</h5>
                    <img src="${getweatherIcon(id)}" class="forcast-item-img" /><!--Fix src-->
                    <h5 class="forcast-item-temp">${temp}°C</h5>
                </div>
    `
    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItems);

}

function showDisplaySection(section) {
    [weatherInfoScetion, searchCitySection, notFoundSection ]
     .forEach (section => section.style.display = 'none')
    section.style.display = 'flex'
}