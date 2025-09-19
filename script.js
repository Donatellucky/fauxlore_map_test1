console.log('script.js loaded');

class MapApp {
    constructor() {
        this.activePanel = null;
        this.mapWidth = 2300;
        this.mapHeight = 1500;
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
        this.map = L.map('map', {
            crs: L.CRS.Simple,
            minZoom: -2,
            maxZoom: 5,
            zoomControl: false
        });
    }

    createLayers() {
        const bounds = [[0, 0], [this.mapHeight, this.mapWidth]];
        
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

        const centerY = this.mapHeight / 2;
        const centerX = this.mapWidth / 2;
        
        L.marker([centerY, centerX], {
            icon: L.divIcon({ html: '★', className: 'capital-icon' })
        }).bindPopup("Столица").addTo(this.markerGroups.capitals);
        
        L.marker([centerY * 1.2, centerX * 0.8], {
            icon: L.divIcon({ html: '⛵', className: 'port-icon' })
        }).bindPopup("Главный порт").addTo(this.markerGroups.ports);

        Object.values(this.markerGroups).forEach(group => {
            group.addTo(this.map);
        });
    }

    setupUI() {
        // Основная кнопка меню
        this.addClickListener('mainMenuBtn', () => {
            this.toggleMainMenu();
        });

        // Кнопки управления
        this.addClickListener('layersBtn', () => {
            this.togglePanel('layersPanel');
        });

        this.addClickListener('markersBtn', () => {
            this.togglePanel('markersPanel');
        });

        this.addClickListener('searchBtn', () => {
            this.togglePanel('searchPanel');
        });

        // Кнопки масштабирования
        this.addClickListener('zoomInBtn', () => {
            this.map.zoomIn();
        });

        this.addClickListener('zoomOutBtn', () => {
            this.map.zoomOut();
        });

        // Кнопки слоев
        this.addClickListener('politicalBtn', () => {
            this.showLayer('political');
        });

        this.addClickListener('geographicBtn', () => {
            this.showLayer('geographic');
        });

        this.addClickListener('resourcesBtn', () => {
            this.showLayer('resources');
        });

        this.addClickListener('tradeBtn', () => {
            this.showLayer('trade');
        });

        // Чекбоксы маркеров
        this.addChangeListener('toggleCapitals', (e) => {
            this.toggleMarkers('capitals', e.target.checked);
        });

        this.addChangeListener('toggleCities', (e) => {
            this.toggleMarkers('cities', e.target.checked);
        });

        this.addChangeListener('toggleFortresses', (e) => {
            this.toggleMarkers('fortresses', e.target.checked);
        });

        this.addChangeListener('togglePorts', (e) => {
            this.toggleMarkers('ports', e.target.checked);
        });

        // Поиск
        this.addClickListener('executeSearch', () => {
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

    addClickListener(id, handler) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', handler);
        } else {
            console.warn('Элемент не найден:', id);
        }
    }

    addChangeListener(id, handler) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', handler);
        } else {
            console.warn('Элемент не найден:', id);
        }
    }

    toggleMainMenu() {
        this.isMenuExpanded = !this.isMenuExpanded;
        const buttons = document.querySelector('.control-buttons');
        const mainBtn = document.getElementById('mainMenuBtn');
        
        if (buttons && mainBtn) {
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
document.addEventListener('DOMContentLoaded', function() {
    console.log("Страница загружена, инициализируем карту...");
    const app = new MapApp();
    app.init();
    
    // Для доступа из консоли
    window.app = app;
});









