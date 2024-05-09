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
const handleLocation = async () => {
  const path = window.location.pathname;
  const route = routes[path];
  const html = await fetch(route).then((data) => data.text());
  document.getElementById('main-page').innerHTML = html;
  if (path === '/map') {
    const reloadMap = document.getElementById('reload-map');
    reloadMap.addEventListener('click', () => {
      initMap();
      reloadMap.setAttribute('disabled', 'disabled');
      setTimeout(() => {
        reloadMap.removeAttribute('disabled');
      }, 300);
    });
    initMap();
  }
  if (path === '/time') {
    const timer = document.getElementById('timer');
    timer.innerHTML = timeFormat();
    setInterval(() => {
      timer.innerHTML = timeFormat();
    }, 1000);
    const reloadTimer = document.getElementById('reload-timer');
    reloadTimer.addEventListener('click', () => {
      timer.innerHTML = '00:00:00';
      seconds = 0;
      minutes = 0;
      hours = 0;
    });
  }
};
window.onpopstate = handleLocation;
window.route = route;
handleLocation();

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

// Timer
let seconds = 0;
let minutes = 0;
let hours = 0;
const timeFormat = () =>
  `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

function updateTime() {
  seconds++;
  if (seconds === 60) {
    minutes++;
    seconds = 0;
  }
  if (minutes === 60) {
    hours++;
    minutes = 0;
  }
}
setInterval(updateTime, 1000);
