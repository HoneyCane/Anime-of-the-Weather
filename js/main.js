// Canvas metadata
var canvas;

// Interactive elements
var saveButton;

// images
var splashArts;

// JSON data files
var weatherData;
var animeData;

// data extracted from JSON files
var dayOfTheWeek;
var animes;
var startRange;

// API URL's
var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=Chicago&APPID=5ca565343c9e82454d3153c469f9498f";
var animeURL   = "https://api.jikan.moe/v3";

function preload() {
  weatherData = loadJSON(weatherURL, loadAnimeData);
}

// preload helper function
// loads the anime of the day schedule
function loadAnimeData() {
  dayOfTheWeek = getDayOfTheWeek();
  animeData = loadJSON(animeURL + "/schedule/" + dayOfTheWeek);
}

function setup() {
  // set up the canvas window
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0,0);
  canvas.style("z-index", "-1");

  background(255,204,0);

  textAlign(CENTER);
  textFont("Arial");

  updateHeader();

  // have the weather data update every 5 seconds
  setInterval(updateWeather, 5000);

  // button that saves current data to user's folder
  saveButton = createButton("Download");
  saveButton.position(10, windowHeight - 55);
  saveButton.mouseReleased(saveData);
}

// Returns the string for the day of the week. Gets info from weather data
function getDayOfTheWeek() {
  var unixTimestamp = weatherData.dt;
  var myDate = new Date(unixTimestamp * 1000);
  var days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  return days[myDate.getDay()];
}

// Loads splash art images from top 3 animes of the day
function loadAnimes() {
  // empty the arrays
  animes     = [];
  splashArts = [];

  switch (dayOfTheWeek) {
    case "monday":
        animes = animeData.monday;
        break;
    case "tuesday":
        animes = animeData.tuesday;
        break;
    case "wednesday":
        animes = animeData.wednesday;
        break;
    case "thursday":
        animes = animeData.thursday;
        break;
    case "friday":
        animes = animeData.friday;
        break;
    case "saturday":
        animes = animeData.saturday;
        break;
    case "sunday":
        animes = animeData.sunday;
  }

  // determine the range of animes to display based on weather data
  startRange = int(map(int(weatherData.main.temp), 255, 310, 0, (animes.length)-3, true));

  startingX = (windowWidth / 2) - 437;

  for (var i = 0; i < 3; ++i) {
    splashArts.push(createImg(animes[i + startRange].image_url));
    splashArts[i].position(startingX + (i)*325, 150);
  }
}

// Saves the weather data as a json file in browser's default download path
function saveData() {
  saveJSON(animeData, "anime.json");
  // saveJSON(weatherData, "weather.json");
}

// Releads the JSON var with latest data from API
function updateWeather() {
  weatherData = loadJSON(weatherURL, updateHeader);
}

// prints the text onto the canvas
function updateHeader() {
  background(255,204,0);

  var weatherStr = "In Chicago, it's " + int(weatherData.main.temp - 234) +
                    " degrees with " + str(weatherData.weather[0].description);
  textSize(30);
  text(weatherStr, 50, 50, windowWidth-50, 100);

  var animeStr = "I recommend these animes this " + dayOfTheWeek;
  textSize(20);
  text(animeStr, 50, 100, windowWidth-50, 150);

  loadAnimes();
}

// deprecated
function showurl() {
  text(str(animeData.monday[0].image_url) , windowWidth/2, windowHeight/2);
}

//------------------------------------------------------------------------------
function draw() {
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
