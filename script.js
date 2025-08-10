// Инициализация карты
const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 2,
    zoomControl: false
});

// Размеры изображения (подставьте реальные)
const mapWidth = 2700;
const mapHeight = 1700;
const mapBounds = [[0, 0], [mapHeight, mapWidth]];

// Слои карты (используем imageOverlay вместо tileLayer)
const layers = {
    political: L.imageOverlay('img/newfauxpolit.png', mapBounds),
    geographic: L.imageOverlay('img/newfaux.png', mapBounds),
    resources: L.imageOverlay('img/newfauxresource_actual_hod_0.png', mapBounds)
};

// Группы маркеров
const markers = {
    capitals: L.layerGroup(),
    cities: L.layerGroup(),
    fortresses: L.layerGroup(),
    ports: L.layerGroup()
};

// Инициализация
function init() {
    // Показываем политическую карту по умолчанию
    layers.political.addTo(map);
    map.fitBounds(mapBounds);
    
    // Добавляем маркеры
    addMarkers();
    
    // Добавляем все группы маркеров на карту
    Object.values(markers).forEach(group => group.addTo(map));
}
    
    // Добавляем маркеры
    addMarkers();
    
    // Добавляем все группы маркеров на карту
    Object.values(markers).forEach(group => group.addTo(map));
}

// Добавление маркеров
function addMarkers() {
    // Пример маркеров (добавьте свои координаты)
    L.marker([50.5, 30.5], { icon: L.divIcon({ html: '★', className: 'capital-icon' }) })
        .bindPopup("<b>Столица</b>").addTo(markers.capitals);
    
    L.marker([49.8, 31.1], { icon: L.divIcon({ html: '⛵', className: 'port-icon' }) })
        .bindPopup("<b>Порт Аркаим</b>").addTo(markers.ports);
}

// Управление элементами интерфейса
function toggleControl(controlId) {
    const control = document.getElementById(controlId);
    control.style.display = control.style.display === 'block' ? 'none' : 'block';
    
    // Закрываем другие открытые панели
    document.querySelectorAll('.control-content').forEach(panel => {
        if (panel.id !== controlId) panel.style.display = 'none';
    });
}

// Управление слоями
function showLayer(layerName) {
    Object.values(layers).forEach(layer => layer.remove());
    layers[layerName].addTo(map);
    document.querySelectorAll('.control-content').forEach(panel => {
        panel.style.display = 'none';
    });
}

// Управление маркерами
function toggleMarkers(markerType) {
    const checkbox = document.querySelector(`input[onclick="toggleMarkers('${markerType}')"]`);
    if (checkbox.checked) {
        map.addLayer(markers[markerType]);
    } else {
        map.removeLayer(markers[markerType]);
    }
}

// Поиск маркеров
function searchMarker() {
    const query = document.getElementById("markerSearch").value.toLowerCase();
    // Реализация поиска
    console.log("Поиск:", query);
    document.getElementById("searchPanel").style.display = 'none';
}

// Закрытие панелей при клике вне их
document.addEventListener('click', function(e) {
    if (!e.target.closest('.control-panel')) {
        document.querySelectorAll('.control-content').forEach(panel => {
            panel.style.display = 'none';
        });
    }
});

init();



