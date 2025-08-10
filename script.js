// Инициализация карты
const map = L.map('map').setView([50, 50], 5);

// Слои карты
const layers = {
    political: L.tileLayer('img/newfauxpolit.png', { noWrap: true }),
    geographic: L.tileLayer('img/newfaux.png', { noWrap: true }),
    resources: L.tileLayer('img/newfauxresource_actual_hod_0.png', { noWrap: true })
};

// Группы маркеров
const markers = {
    capitals: L.layerGroup(),
    cities: L.layerGroup(),
    fortresses: L.layerGroup(),
    ports: L.layerGroup()
};

// Добавление маркеров (пример)
function addMarkers() {
    // Столицы
    L.marker([50.5, 30.5], { 
        icon: L.divIcon({ html: '★', className: 'capital-icon' })
    }).bindPopup("<b>Столица</b>").addTo(markers.capitals);
    
    // Порты
    L.marker([49.8, 31.1], {
        icon: L.divIcon({ html: '⛵', className: 'port-icon' })
    }).bindPopup("<b>Порт Аркаим</b>").addTo(markers.ports);
    
    // Добавьте остальные маркеры по аналогии
}

// Инициализация
function init() {
    layers.political.addTo(map);
    addMarkers();
    
    // Добавляем все группы маркеров на карту
    Object.values(markers).forEach(group => group.addTo(map));
}

// Управление слоями
function showLayer(layerName) {
    Object.values(layers).forEach(layer => layer.remove());
    layers[layerName].addTo(map);
}

// Управление маркерами
function toggleMarkers(markerType) {
    if (map.hasLayer(markers[markerType])) {
        map.removeLayer(markers[markerType]);
    } else {
        map.addLayer(markers[markerType]);
    }
}

// Поиск маркеров
function searchMarker() {
    const query = document.getElementById("markerSearch").value.toLowerCase();
    // Реализуйте поиск по вашим маркерам
}

// Переключение меню
function toggleLayerMenu() {
    const menu = document.getElementById("layerMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function toggleMarkersMenu() {
    const menu = document.getElementById("markersMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Закрытие меню при клике вне его
document.addEventListener("click", (e) => {
    if (!e.target.closest(".layers-control")) {
        document.getElementById("layerMenu").style.display = "none";
    }
    if (!e.target.closest(".markers-control")) {
        document.getElementById("markersMenu").style.display = "none";
    }
});

init();
