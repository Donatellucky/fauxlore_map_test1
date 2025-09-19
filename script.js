console.log('script.js loaded');

class MapApp {
    constructor() {
        this.activePanel = null;
        this.mapWidth = 3829;
        this.mapHeight = 2455;
        this.map = null;
        this.layers = {};
        this.markerGroups = {};
        this.isMenuExpanded = false;
    }


    init() {
        this.createMap();
        this.createLayers();
        this.createMarkers();
        this.setupUI();
        console.log("Карта инициализирована");
    }

    createMap() {
        // Проверяем наличие контейнера
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.error('Элемент #map не найден!');
            return;
        }

        // Создаем карту
    createMap() {
        this.map = L.map('map', {
            crs: L.CRS.Simple,
            minZoom: -2,
            maxZoom: 5,
            zoomControl: false
        });
    }
        
        // Устанавливаем границы
        const bounds = [[0, 0], [this.mapHeight, this.mapWidth]];
        this.map.fitBounds(bounds);
    }

    createLayers() {
        const bounds = [[0, 0], [this.mapHeight, this.mapWidth]];
    
    // Используем TileLayer для сохранения качества при масштабировании
this.layers = {
            political: L.imageOverlay('img/newfauxpolit.png', bounds),
            geographic: L.imageOverlay('img/newfaux.png', bounds),
            resources: L.imageOverlay('img/newfauxresource_actual_hod_0.png', bounds),
            trade: L.imageOverlay('img/newfauxtrade.png', bounds)
        };
        
        this.layers.political.addTo(this.map);
        this.map.fitBounds(bounds);
    }

    createMarkers() {
        this.markerGroups = {
            capitals: L.layerGroup(),
            cities: L.layerGroup(),
            fortresses: L.layerGroup(),
            ports: L.layerGroup()
        };

        const centerY = this.mapHeight/2;
        const centerX = this.mapWidth/2;
        
        L.marker([centerY, centerX], {
            icon: L.divIcon({ html: '★', className: 'capital-icon' })
        }).bindPopup("Столица").addTo(this.markerGroups.capitals);
        
        L.marker([centerY*1.2, centerX*0.8], {
            icon: L.divIcon({ html: '⛵', className: 'port-icon' })
        }).bindPopup("Главный порт").addTo(this.markerGroups.ports);

        Object.values(this.markerGroups).forEach(group => {
            group.addTo(this.map);
        });
    }

    setupUI() {
        
        // Добавляем все группы маркеров на карту
// Основная кнопка меню
        document.getElementById('mainMenuBtn')?.addEventListener('click', () => {
            this.toggleMainMenu();
        });

        // Кнопки управления
        document.getElementById('layersBtn')?.addEventListener('click', () => {
            this.togglePanel('layersPanel');
        });

        document.getElementById('markersBtn')?.addEventListener('click', () => {
            this.togglePanel('markersPanel');
        });

        document.getElementById('searchBtn')?.addEventListener('click', () => {
            this.togglePanel('searchPanel');
        });

        // Кнопки масштабирования
        document.getElementById('zoomInBtn')?.addEventListener('click', () => {
            this.map.zoomIn();
        });

        document.getElementById('zoomOutBtn')?.addEventListener('click', () => {
            this.map.zoomOut();
        });

        // Кнопки слоев
        document.getElementById('politicalBtn')?.addEventListener('click', () => {
            this.showLayer('political');
        });

        document.getElementById('geographicBtn')?.addEventListener('click', () => {
            this.showLayer('geographic');
        });

        document.getElementById('resourcesBtn')?.addEventListener('click', () => {
            this.showLayer('resources');
        });

        document.getElementById('tradeBtn')?.addEventListener('click', () => {
            this.showLayer('trade');
        });

        // Чекбоксы маркеров
        document.getElementById('toggleCapitals')?.addEventListener('change', (e) => {
            this.toggleMarkers('capitals', e.target.checked);
        });

        document.getElementById('toggleCities')?.addEventListener('change', (e) => {
            this.toggleMarkers('cities', e.target.checked);
        });

        document.getElementById('toggleFortresses')?.addEventListener('change', (e) => {
            this.toggleMarkers('fortresses', e.target.checked);
        });

        document.getElementById('togglePorts')?.addEventListener('change', (e) => {
            this.toggleMarkers('ports', e.target.checked);
        });

        // Поиск
        document.getElementById('executeSearch')?.addEventListener('click', () => {
            this.searchMarker();
        });

        // Закрытие при клике вне панели
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.control-panel')) {
                this.closeAllPanels();
            }
        });

        // Добавляем стандартные контролы масштабирования
        L.control.zoom({
            position: 'bottomright'
        }).addTo(this.map);
    }

    toggleMainMenu() {
        this.isMenuExpanded = !this.isMenuExpanded;
        const buttons = document.querySelector('.control-buttons');
        const mainBtn = document.getElementById('mainMenuBtn');
        
        if (this.isMenuExpanded) {
            buttons.style.display = 'flex';
            mainBtn.innerHTML = '✕';
            mainBtn.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
        } else {
            buttons.style.display = 'none';
            mainBtn.innerHTML = '☰';
            mainBtn.style.background = 'linear-gradient(135deg, #4a6ea9, #3a5a8f)';
            this.closeAllPanels();
        }
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
        if (!this.layers[layerName]) {
            console.error("Слой не найден:", layerName);
            return;
        }

        Object.values(this.layers).forEach(layer => {
            if (layer) layer.remove();
        });
        
        this.layers[layerName].addTo(this.map);
        this.closeAllPanels();
    }

    toggleMarkers(markerType, isChecked) {
        if (!this.markerGroups[markerType]) {
            console.error("Группа маркеров не найдена:", markerType);
            return;
        }

        if (isChecked) {
            this.map.addLayer(this.markerGroups[markerType]);
        } else {
            this.map.removeLayer(this.markerGroups[markerType]);
        }
    }

    searchMarker() {
        const searchInput = document.getElementById('markerSearch');
        if (!searchInput) {
            console.error("Поле поиска не найдено");
            return;
        }
        
        console.log('Поиск:', searchInput.value);
        this.closeAllPanels();
    }
}

// Инициализация после полной загрузки страницы
window.onload = () => {
    console.log("Страница загружена, инициализируем карту...");
    const app = new MapApp();
    app.init();
    
    // Для доступа из консоли
    window.app = app;
};

// В script.js, после создания карты
const provinceSystem = new ProvinceSystem(map);
provinceSystem.initSidebar();








