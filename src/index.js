import "./index.html";
import "./navigation.html";
import "./activity.html";
import "./map.html";
import "./time.html";
import "./styles.css";
import * as ymaps3 from "ymaps3";
import customize from "../map-customization.json";

// Routing
const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    if (event.target.href != undefined) {
        window.history.pushState({}, "", event.target.href);
    } else {
        window.history.pushState({}, "", event.target.parentElement.href);
    }
    handleLocation();
};
const routes = {
    "/home": "navigation.html",
    "/activity": "activity.html",
    "/map": "map.html",
    "/time": "time.html",
};
const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path];
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("main-page").innerHTML = html;
    if (path === "/map") {
        const reloadMap = document.getElementById("reload-map");
        reloadMap.addEventListener("click", () => {
            initMap();
            reloadMap.setAttribute("disabled", "disabled");
            setTimeout(() => {
                reloadMap.removeAttribute("disabled");
            }, 300);
        });
        initMap();
    }
    if (path === "/time") {
        const timer = document.getElementById("timer");
        timer.innerHTML = timeFormat();
        setInterval(() => {
            timer.innerHTML = timeFormat();
        }, 1000);
        const reloadTimer = document.getElementById("reload-timer");
        reloadTimer.addEventListener("click", () => {
            timer.innerHTML = "00:00:00";
            seconds = 0;
            minutes = 0;
            hours = 0;
        });
    }
};
window.addEventListener("popstate", function (event) {
    if (event.state?.source === "back" || event.state?.source === "forward") {
        window.onpopstate = handleLocation;
    }
});
window.route = route;
handleLocation();

// Yandex map
let map;

async function initMap() {
    const mapLoader = document.getElementById("map-loader");
    mapLoader.classList.remove("hidden");
    if (map !== undefined) {
        map.destroy();
    }
    await ymaps3.ready;
    const { YMap, YMapDefaultSchemeLayer } = ymaps3;
    const layer = new YMapDefaultSchemeLayer({
        customization: customize,
    });
    setTimeout(() => {
        map = new YMap(document.getElementById("map-body"), {
            location: {
                center: [37.6219616833542, 55.75208325269551],
                zoom: 13,
            },
        });
        map.addChild(layer);
        mapLoader.classList.add("hidden");
    }, 250);
}

// Timer
let seconds = 0;
let minutes = 0;
let hours = 0;
const timeFormat = () =>
    `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

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
