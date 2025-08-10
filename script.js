// Инициализация после полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Размеры изображения
    const mapWidth = 2300;
    const mapHeight = 1500;
    const mapBounds = [[0, 0], [mapHeight, mapWidth]];
    
    // Инициализация карты
    const map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 5,
        zoomControl: false
    });

    // Слои карты
    const layers = {
        political: L.imageOverlay('img/newfauxpolit.png', mapBounds),
        geographic: L.imageOverlay('img/newfaux.png', mapBounds),
        resources: L.imageOverlay('img/newfauxresource_actual_hod_0.png', mapBounds)
    };

    // Группы маркеров
    const markerGroups = {
        capitals: L.layerGroup(),
        cities: L.layerGroup(),
        fortresses: L.layerGroup(),
        ports: L.layerGroup()
    };

    // Инициализация карты
    function init() {
        // Загрузка основного слоя
        layers.political.addTo(map);
        map.fitBounds(mapBounds);
        
        // Тестовые маркеры
        addTestMarkers();
        
        // Активация всех маркеров по умолчанию
        Object.values(markerGroups).forEach(group => group.addTo(map));
    }

    // Добавление тестовых маркеров
    function addTestMarkers() {
        // Центр карты
        L.marker([mapHeight/2, mapWidth/2], {
            icon: L.divIcon({ html: '★', className: 'capital-icon' })
        }).bindPopup("Столица").addTo(markerGroups.capitals);
        
        // Пример порта
        L.marker([mapHeight*0.7, mapWidth*0.3], {
            icon: L.divIcon({ html: '⛵', className: 'port-icon' })
        }).bindPopup("Порт").addTo(markerGroups.ports);
    }

    // Функции управления интерфейсом
    window.toggleControl = function(controlId) {
        const control = document.getElementById(controlId);
        if (control) {
            control.style.display = control.style.display === 'block' ? 'none' : 'block';
        }
    };

    window.showLayer = function(layerName) {
        Object.values(layers).forEach(layer => layer.remove());
        layers[layerName].addTo(map);
    };

    window.toggleMarkers = function(markerType) {
        if (map.hasLayer(markerGroups[markerType])) {
            map.removeLayer(markerGroups[markerType]);
        } else {
            map.addLayer(markerGroups[markerType]);
        }
    };

    window.searchMarker = function() {
        const query = document.getElementById("markerSearch").value.toLowerCase();
        console.log("Поиск:", query);
        document.getElementById("searchPanel").style.display = 'none';
    };

    // Закрытие панелей при клике вне их
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.control-panel')) {
            document.querySelectorAll('.control-content').forEach(panel => {
                panel.style.display = 'none';
            });
        }
    });

    // Запуск инициализации
    init();
});
