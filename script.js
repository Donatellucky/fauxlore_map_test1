console.log('script.js loaded');

class MapApp {
    constructor() {
        this.activePanel = null;
        this.mapWidth = 2300;
        this.mapHeight = 1500;
        this.map = null;
        this.layers = {};
        this.markerGroups = {
            capitals: L.layerGroup(),
            cities: L.layerGroup(),
            fortresses: L.layerGroup(),
            ports: L.layerGroup()
        };
    }

    init() {
        this.createMap();
        this.createBaseLayers();
        this.createMarkers();
        this.setupUI();
        
        console.log("Карта успешно инициализирована");
        window.mapApp = this;
    }

    createMap() {
        // Проверяем наличие контейнера
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.error('Элемент #map не найден!');
            return;
        }

        // Создаем карту
        this.map = L.map('map', {
            crs: L.CRS.Simple,
            minZoom: -2,
            maxZoom: 5,
            zoomControl: false
        });

        // Устанавливаем границы
        const bounds = [[0, 0], [this.mapHeight, this.mapWidth]];
        this.map.fitBounds(bounds);
    }

    createBaseLayers() {
        const bounds = [[0, 0], [this.mapHeight, this.mapWidth]];
        
        // Основные слои
        this.layers = {
            political: L.imageOverlay('img/newfauxpolit.png', bounds, {
                error: () => console.error('Ошибка загрузки политической карты')
            }),
            geographic: L.imageOverlay('img/newfaux.png', bounds, {
                error: () => console.error('Ошибка загрузки географической карты')
            })
        };

        // Добавляем политическую карту по умолчанию
        this.layers.political.addTo(this.map);
    }

    createMarkers() {
        const centerY = this.mapHeight / 2;
        const centerX = this.mapWidth / 2;

        // Тестовые маркеры
        L.marker([centerY, centerX], {
            icon: L.divIcon({ html: '★', className: 'capital-icon' })
        })
        .bindPopup("Столица")
        .addTo(this.markerGroups.capitals);

        L.marker([centerY * 1.2, centerX * 0.8], {
            icon: L.divIcon({ html: '⛵', className: 'port-icon' })
        })
        .bindPopup("Главный порт")
        .addTo(this.markerGroups.ports);

        // Добавляем все группы маркеров на карту
        Object.values(this.markerGroups).forEach(group => {
            group.addTo(this.map);
        });
    }

    setupUI() {
        // Кнопки переключения слоев
        document.getElementById('politicalBtn')?.addEventListener('click', () => {
            this.showLayer('political');
        });
        
        document.getElementById('geographicBtn')?.addEventListener('click', () => {
            this.showLayer('geographic');
        });

        // Чекбоксы маркеров
        document.getElementById('toggleCapitals')?.addEventListener('change', (e) => {
            this.toggleMarkers('capitals', e.target.checked);
        });
        
        document.getElementById('togglePorts')?.addEventListener('change', (e) => {
            this.toggleMarkers('ports', e.target.checked);
        });
    }

    showLayer(layerName) {
        if (!this.layers[layerName]) {
            console.error("Слой не найден:", layerName);
            return;
        }

        // Скрываем все слои
        Object.values(this.layers).forEach(layer => layer.remove());
        
        // Показываем выбранный слой
        this.layers[layerName].addTo(this.map);
    }

    toggleMarkers(markerType, isChecked) {
        if (!this.markerGroups[markerType]) {
            console.error("Группа маркеров не найдена:", markerType);
            return;
        }

        isChecked ? 
            this.map.addLayer(this.markerGroups[markerType]) : 
            this.map.removeLayer(this.markerGroups[markerType]);
    }
}

// Инициализация при загрузке страницы
window.onload = () => {
    // Проверяем загрузился ли Leaflet
    if (typeof L === 'undefined') {
        console.error('Leaflet не загружен!');
        document.body.innerHTML = '<div style="color:red;padding:20px;">Ошибка: Библиотека карт не загрузилась</div>';
        return;
    }

    new MapApp().init();
};
