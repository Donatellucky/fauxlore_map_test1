// Инициализация карты
document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 5,
        zoomControl: false
    });

    // Размеры изображения в пикселях
    const mapWidth = 2300;
    const mapHeight = 1500;
    const mapBounds = [[0, 0], [mapHeight, mapWidth]];

    // Слои карты
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

    // Инициализация карты
    function initMap() {
        // Показываем политическую карту по умолчанию
        layers.political.addTo(map);
        map.fitBounds(mapBounds);
        
        // Добавляем маркеры (координаты в пикселях относительно изображения)
        addMarkers();
        
        // Добавляем все группы маркеров на карту
        Object.values(markers).forEach(group => group.addTo(map));
    }

    // Добавление маркеров
    function addMarkers() {
        // Координаты в формате [y, x] (от верхнего левого угла изображения)
        
        // Пример маркера столицы (примерно в центре)
        L.marker([mapHeight/2, mapWidth/2], { 
            icon: L.divIcon({ html: '★', className: 'capital-icon', iconSize: [24, 24] })
        }).bindPopup("<b>Столица</b>").addTo(markers.capitals);
        
        // Пример маркера порта (правее и ниже центра)
        L.marker([mapHeight*0.6, mapWidth*0.7], {
            icon: L.divIcon({ html: '⛵', className: 'port-icon', iconSize: [20, 20] })
        }).bindPopup("<b>Порт Аркаим</b>").addTo(markers.ports);
    }

    // Остальные функции управления интерфейсом
    function toggleControl(controlId) {
        const control = document.getElementById(controlId);
        if (control) {
            control.style.display = control.style.display === 'block' ? 'none' : 'block';
            
            document.querySelectorAll('.control-content').forEach(panel => {
                if (panel.id !== controlId && panel.style) {
                    panel.style.display = 'none';
                }
            });
        }
    }

    function showLayer(layerName) {
        Object.values(layers).forEach(layer => layer.remove());
        layers[layerName].addTo(map);
    }

    function toggleMarkers(markerType) {
        const checkbox = document.querySelector(`input[onclick="toggleMarkers('${markerType}')"]`);
        if (checkbox) {
            if (checkbox.checked) {
                map.addLayer(markers[markerType]);
            } else {
                map.removeLayer(markers[markerType]);
            }
        }
    }

    function searchMarker() {
        const query = document.getElementById("markerSearch")?.value.toLowerCase();
        console.log("Поиск:", query);
        document.getElementById("searchPanel").style.display = 'none';
    }

    // Инициализация
    initMap();
});
