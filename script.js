// Инициализация карты
const map = L.map('map', {
    crs: L.CRS.Simple, // Простая система координат (без привязки к реальному миру)
    minZoom: -2,
    maxZoom: 2,
    zoomControl: false
});

// Определяем границы карты (подставьте реальные размеры вашего PNG в пикселях)
const mapWidth = 2282; // Ширина изображения в px
const mapHeight = 1561; // Высота изображения в px
const mapBounds = [[0, 0], [mapHeight, mapWidth]];

// Создаем слои
const layers = {
    political: L.imageOverlay('img/newfauxpolit.png', mapBounds),
    geographic: L.imageOverlay('img/newfaux.png', mapBounds),
    resources: L.imageOverlay('img/newfauxresource_actual_hod_0.png', mapBounds)
};

// Показываем политическую карту по умолчанию
layers.political.addTo(map);
map.fitBounds(mapBounds);

// Функция переключения слоев
function showLayer(layerName) {
    Object.values(layers).forEach(layer => layer.remove());
    layers[layerName].addTo(map);
}

// Добавляем маркер (пример)
L.marker([mapHeight * 0.5, mapWidth * 0.5]).addTo(map)
    .bindPopup("Столица");

const markersData = {
    capitals: [
        { coords: [50.5, 30.5], title: "Столица", population: "1.2 млн" },
        { coords: [51.2, 29.8], title: "Запасная столица", population: "500 тыс" }
    ],
    cities: [
        { coords: [49.8, 31.1], title: "Порт Аркаим", population: "300 тыс" }
    ],
    fortresses: [
        { coords: [50.1, 29.5], title: "Крепость Чёрного Ордена", garrison: "5 тыс воинов" }
    ]
};

// Стили иконок
const icons = {
    capitals: L.divIcon({
        html: '★',
        className: 'map-icon capital-icon',
        iconSize: [24, 24]
    }),
    cities: L.divIcon({
        html: '●',
        className: 'map-icon city-icon',
        iconSize: [20, 20]
    }),
    fortresses: L.divIcon({
        html: '⌖',
        className: 'map-icon fortress-icon',
        iconSize: [22, 22]
    })
};

// Добавление всех маркеров на карту
function addMarkers() {
    Object.entries(markersData).forEach(([type, markers]) => {
        markers.forEach(marker => {
            L.marker(marker.coords, {
                icon: icons[type]
            })
            .bindPopup(`
                <b>${marker.title}</b><br>
                ${marker.population || marker.garrison}
            `)
            .addTo(map);
        });
    });
}

const markerLayers = {
    capitals: L.layerGroup(),
    cities: L.layerGroup(),
    fortresses: L.layerGroup()
};

// Добавляем маркеры в слои
function addMarkersToLayers() {
    Object.entries(markersData).forEach(([type, markers]) => {
        markers.forEach(marker => {
            L.marker(marker.coords, { icon: icons[type] })
                .bindPopup(`<b>${marker.title}</b>`)
                .addTo(markerLayers[type]);
        });
    });
}

// Панель управления слоями
L.control.layers(null, {
    "Столицы": markerLayers.capitals,
    "Города": markerLayers.cities,
    "Крепости": markerLayers.fortresses
}, { collapsed: false }).addTo(map);

// Поиск маркеров по названиям
function searchMarker() {
    const query = document.getElementById("markerSearch").value.toLowerCase();
    let found = false;
    
    Object.values(markersData).flat().forEach(marker => {
        if (marker.title.toLowerCase().includes(query)) {
            map.setView(marker.coords, 8);
            found = true;
        }
    });
    
    if (!found) alert("Ничего не найдено!");
}

// Анимация маркера при выборе
function highlightMarker(marker) {
    marker.setIcon(L.divIcon({
        html: '✧',
        className: 'map-icon highlight-icon',
        iconSize: [30, 30]
    }));
    
    setTimeout(() => {
        marker.setIcon(icons[marker.options.type]);
    }, 1000);
}

// Кластеризация маркеров
const markersCluster = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false
});

// Добавляем маркеры в кластер
Object.values(markerLayers).forEach(layer => {
    markersCluster.addLayer(layer);
});

map.addLayer(markersCluster);

// Переключение меню слоёв
function toggleLayerMenu() {
    const menu = document.getElementById("layerMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Закрытие меню при клике вне его
document.addEventListener("click", (e) => {
    if (!e.target.closest(".controls")) {
        document.getElementById("layerMenu").style.display = "none";
    }
});

document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.textContent.includes(layerName)) btn.classList.add("active");
});

// Отключаем масштабирование карты при касании кнопок
document.querySelectorAll(".controls button").forEach(btn => {
    btn.addEventListener("touchstart", (e) => e.stopPropagation());
});


