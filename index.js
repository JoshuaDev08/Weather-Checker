import axios from "axios";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const API_URL = "https://api.openweathermap.org/data/2.5/";   // this is the base URL
const myAPI = "a74b337640e65a5787ddc291c736091b";   // i registered to the website and generate key 

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", {weatherData: null, error: null});
});

app.post("/", async (req, res) => {
  try {
    const zipCode = req.body.zipcode; // data that input by the user  
    const response = await axios.get(`${API_URL}weather?zip=${zipCode},ph&appid=${myAPI}&units=metric`); // 
    
    
    let weatherIcon = ""; // this switch method used to change picture when the weather main has change

    switch (response.data.weather[0].main) {
        case "Clear":
            weatherIcon = "images/clear.png";
            break;
        case "Clouds":
            weatherIcon = "images/cloud.png";
            break;
        case "Rain":
            weatherIcon = "images/rain.png";
            break;
        case "mist":
            weatherIcon = "images/mist.png";
            break;
        default:
            weatherIcon = "images/clear.png";
            break;
    }

    // i pass all the data in the API and choose the data that only needed for the index.js
    const weatherData = {
      city: response.data.name,
      main: response.data.weather[0].main,
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      wind: response.data.wind.speed,
      pressure: response.data.main.pressure,
      icon: weatherIcon,
    };
    res.render("index.ejs", { weatherData: weatherData, error: null }); //throw error handling 
  } catch (error) {
    console.log(error.message);
    res.render("index.ejs", { weatherData: null, error: "Invalid Zip Code or API error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


