import './styles.css';
import * as ymaps3 from 'ymaps3';

// Routing
const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  if (event.target.href != undefined) {
    window.history.pushState({}, '', event.target.href);
  } else {
    window.history.pushState({}, '', event.target.parentElement.href);
  }
  handleLocation();
};
const routes = {
  '/home': 'home.html',
  '/activity': 'activity.html',
  '/map': 'map.html',
  '/time': 'time.html',
};
async function handleLocation() {
  const path = window.location.pathname;
  const route = routes[path];
  if (route !== undefined) {
    const html = await fetch(route).then((data) => data.text());
    document.getElementById('main-page').innerHTML = html;
  }
  switch (path) {
    case '/map':
      initMap();
      reloadMap();
      break;
    case '/time':
      reloadStopwatch();
      resetStopwatch();
      renderTimer();
      break;
  }
}
window.addEventListener('popstate', () => {
  handleLocation();
});

document.addEventListener('DOMContentLoaded', () => {
  handleLocation();
});

// Navigation block
function initNavigation() {
  const homeLink = document.getElementById('homeLink');
  const activityLink = document.getElementById('activityLink');
  const mapLink = document.getElementById('mapLink');
  const timeLink = document.getElementById('timeLink');
  homeLink.addEventListener('click', () => {
    route();
    activityLink.classList.remove('bg-bg');
    mapLink.classList.remove('bg-bg');
    timeLink.classList.remove('bg-bg');
  });
  activityLink.addEventListener('click', () => {
    route();
    activityLink.classList.add('bg-bg');
    mapLink.classList.remove('bg-bg');
    timeLink.classList.remove('bg-bg');
  });
  mapLink.addEventListener('click', () => {
    route();
    activityLink.classList.remove('bg-bg');
    mapLink.classList.add('bg-bg');
    timeLink.classList.remove('bg-bg');
  });
  timeLink.addEventListener('click', () => {
    route();
    activityLink.classList.remove('bg-bg');
    mapLink.classList.remove('bg-bg');
    timeLink.classList.add('bg-bg');
  });
}
initNavigation();

// Yandex map
let map;
async function initMap() {
  const mapLoader = document.getElementById('map-loader');
  mapLoader.classList.remove('hidden');
  if (map !== undefined) {
    map.destroy();
  }
  await ymaps3.ready;
  const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer } = ymaps3;
  const { YMapDefaultMarker } = await ymaps3.import('@yandex/ymaps3-markers@0.0.1');
  const layer = new YMapDefaultSchemeLayer();
  map = new YMap(document.getElementById('map-body'), {
    location: {
      center: [37.6219616833542, 55.75208325269551],
      zoom: 13,
    },
  });
  const GeoObject = new YMapDefaultMarker({
    coordinates: [37.6219616833542, 55.75208325269551],
    title: 'Andrey Gorchakov',
    subtitle: 'He is located somewhere here',
    color: '#505050',
  });
  map.addChild(layer);
  mapLoader.classList.add('hidden');
  map.addChild(new YMapDefaultFeaturesLayer());
  map.addChild(GeoObject);
}
function reloadMap() {
  const reloadMap = document.getElementById('reload-map');
  reloadMap.addEventListener('click', () => {
    initMap();
  });
}

// Stopwatch
let startTime;
let stopwatchInterval;
let passedTime = 0;
function startStopwatch() {
  startTime = new Date().getTime();
  stopwatchInterval = setInterval(() => {
    passedTime = Math.floor(new Date().getTime() - startTime);
  });
}
function reloadStopwatch() {
  const reloadTimer = document.getElementById('reload-timer');
  reloadTimer.addEventListener('click', () => {
    clearInterval(stopwatchInterval);
    startStopwatch();
  });
}
function resetStopwatch() {
  const resetTimer = document.getElementById('reset-timer');
  resetTimer.addEventListener('click', () => {
    clearInterval(stopwatchInterval);
    passedTime = 0;
  });
}
function renderTimer() {
  const timer = document.getElementById('timer');
  setInterval(() => {
    timer.innerHTML =
      Math.floor(passedTime / 1000 / 3600)
        .toString()
        .padStart(2, '0') +
      ':' +
      Math.floor(((passedTime / 1000) % 3600) / 60)
        .toString()
        .padStart(2, '0') +
      ':' +
      Math.floor((passedTime / 1000) % 60)
        .toString()
        .padStart(2, '0');
  });
}
startStopwatch();
