// Инициализация карты
const map = L.map('map', {
    crs: L.CRS.Simple, // Простая система координат (без привязки к реальному миру)
    minZoom: -2,
    maxZoom: 2,
    zoomControl: false
});

// Определяем границы карты (подставьте реальные размеры вашего PNG в пикселях)
const mapWidth = 2000; // Ширина изображения в px
const mapHeight = 1500; // Высота изображения в px
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