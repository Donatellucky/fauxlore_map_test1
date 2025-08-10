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

// Инициализация
function init() {
    layers.political.addTo(map);
    addMarkers();
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
