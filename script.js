console.log('script.js loaded');

class MapApp {
    constructor() {
        this.activePanel = null;
        this.mapWidth = 3819;
        this.mapHeight = 2455;
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
            }),
            trade: L.imageOverlay('img/newfauxtrade.png', bounds, {
                error: () => console.error('Ошибка загрузки торговой карты')
            }),
            resource: L.imageOverlay('img/newfauxresource_actual_hod_0.png', bounds, {
                error: () => console.error('Ошибка загрузки ресурсной карты')
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
    document.getElementById('menuBtn')?.addEventListener('click', () => {
        this.togglePanel('mainMenu');
    });
    
    document.getElementById('markersBtn')?.addEventListener('click', () => {
        this.togglePanel('markersMenu');
    });
    
    document.getElementById('politicalBtn')?.addEventListener('click', () => {
        this.showLayer('political');
    });
    
    document.getElementById('geographicBtn')?.addEventListener('click', () => {
        this.showLayer('geographic');
    });

    document.getElementById('tradeBtn')?.addEventListener('click', () => {
        this.showLayer('trade');
    }); // Закрывающая скобка для tradeBtn

    document.getElementById('resourceBtn')?.addEventListener('click', () => {
        this.showLayer('resource');
    });

    // Чекбоксы маркеров
    document.getElementById('toggleCapitals')?.addEventListener('change', (e) => {
        this.toggleMarkers('capitals', e.target.checked);
    });
    
    document.getElementById('togglePorts')?.addEventListener('change', (e) => {
        this.toggleMarkers('ports', e.target.checked);
    });
            
    // Закрытие при клике вне панели
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.control-panel') && 
            !e.target.closest('.control-content')) {
            this.closeAllPanels();
        }
    });
}

       togglePanel(panelId) {
        const panel = document.getElementById(panelId);
        if (!panel) return;

        if (this.activePanel === panel) {
            this.closeAllPanels();
            return;
        }
        
        this.closeAllPanels();
        panel.classList.add('active');
        this.activePanel = panel;
    }

    closeAllPanels() {
        document.querySelectorAll('.control-content').forEach(panel => {
            panel.classList.remove('active');
        });
        this.activePanel = null;
    }
    
    showLayer(layerName) {
        if (!this.layers[layerName]) return;

        Object.values(this.layers).forEach(layer => layer.remove());
        this.layers[layerName].addTo(this.map);
    }

    toggleMarkers(markerType, isChecked) {
        if (!this.markerGroups[markerType]) return;

        isChecked ? 
            this.map.addLayer(this.markerGroups[markerType]) : 
            this.map.removeLayer(this.markerGroups[markerType]);
    }
}

// Инициализация при загрузке страницы
window.onload = () => {
    if (typeof L === 'undefined') {
        console.error('Leaflet не загружен!');
        return;
    }

    new MapApp().init();
};

// В script.js, после создания карты
const provinceSystem = new ProvinceSystem(map);
provinceSystem.initSidebar();






