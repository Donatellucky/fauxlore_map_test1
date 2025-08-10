class MapApp {
    constructor() {
        this.mapWidth = 2300;
        this.mapHeight = 1500;
        this.map = null;
        this.layers = {};
        this.markerGroups = {};
    }

    init() {
        this.createMap();
        this.createLayers();
        this.createMarkers();
        this.setupUI();
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
            resources: L.imageOverlay('img/newfauxresource_actual_hod_0.png', bounds)
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
        
        // Тестовые маркеры
        L.marker([centerY, centerX], {
            icon: L.divIcon({ html: '★', className: 'capital-icon' })
        }).bindPopup("Столица").addTo(this.markerGroups.capitals);
        
        L.marker([centerY*1.2, centerX*0.8], {
            icon: L.divIcon({ html: '⛵', className: 'port-icon' })
        }).bindPopup("Главный порт").addTo(this.markerGroups.ports);

        Object.values(this.markerGroups).forEach(group => group.addTo(this.map));
    }

    setupUI() {
        // Проверяем существование элементов перед добавлением обработчиков
        const elements = {
            menuBtn: () => this.togglePanel('mainMenu'),
            politicalBtn: () => this.showLayer('political'),
            geographicBtn: () => this.showLayer('geographic'),
            resourcesBtn: () => this.showLayer('resources'),
            markersBtn: () => this.togglePanel('markersMenu'),
            searchBtn: () => this.togglePanel('searchPanel'),
            executeSearch: () => this.searchMarker()
        };

        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', elements[id]);
            } else {
                console.warn(`Element with ID '${id}' not found`);
            }
        });

        // Обработчики для чекбоксов
        const checkboxes = {
            toggleCapitals: 'capitals',
            toggleCities: 'cities',
            toggleFortresses: 'fortresses',
            togglePorts: 'ports'
        };

        Object.keys(checkboxes).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', (e) => {
                    this.toggleMarkers(checkboxes[id], e.target.checked);
                });
            }
        });

        // Закрытие панелей при клике вне их
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.control-panel') && 
                !e.target.closest('.control-content')) {
                this.closeAllPanels();
            }
        });
    }

    togglePanel(panelId) {
        const panel = document.getElementById(panelId);
        if (panel) {
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        }
    }

    closeAllPanels() {
        document.querySelectorAll('.control-content').forEach(panel => {
            if (panel.style) {
                panel.style.display = 'none';
            }
        });
    }

    showLayer(layerName) {
        Object.values(this.layers).forEach(layer => layer.remove());
        this.layers[layerName].addTo(this.map);
        this.closeAllPanels();
    }

    toggleMarkers(markerType, isChecked) {
        if (this.markerGroups[markerType]) {
            if (isChecked) {
                this.map.addLayer(this.markerGroups[markerType]);
            } else {
                this.map.removeLayer(this.markerGroups[markerType]);
            }
        }
    }

    searchMarker() {
        const searchInput = document.getElementById('markerSearch');
        if (searchInput) {
            console.log("Ищем:", searchInput.value);
            this.closeAllPanels();
        }
    }
}

// Инициализация при полной загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const app = new MapApp();
    app.init();
});
