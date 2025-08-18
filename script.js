class MapApp {
    constructor() {
        this.activePanel = null;
        this.mapWidth = 2300;
        this.mapHeight = 1500;
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

        Object.values(this.markerGroups).forEach(group => group.addTo(this.map));
    }

    setupUI() {
        // Основные кнопки
        document.getElementById('menuBtn').addEventListener('click', () => 
            this.togglePanel('mainMenu'));
        document.getElementById('markersBtn').addEventListener('click', () => 
            this.togglePanel('markersMenu'));
        document.getElementById('searchBtn').addEventListener('click', () => 
            this.togglePanel('searchPanel'));

        // Кнопки слоев
        document.getElementById('politicalBtn').addEventListener('click', () => 
            this.showLayer('political'));
        document.getElementById('geographicBtn').addEventListener('click', () => 
            this.showLayer('geographic'));
        document.getElementById('resourcesBtn').addEventListener('click', () => 
            this.showLayer('resources'));
        document.getElementById('newfauxtradeBtn').addEventListener('click',() =>
            this.showLayer('trade'));

        // Чекбоксы маркеров
        document.getElementById('toggleCapitals').addEventListener('change', (e) => 
            this.toggleMarkers('capitals', e.target.checked));
        document.getElementById('toggleCities').addEventListener('change', (e) => 
            this.toggleMarkers('cities', e.target.checked));
        document.getElementById('toggleFortresses').addEventListener('change', (e) => 
            this.toggleMarkers('fortresses', e.target.checked));
        document.getElementById('togglePorts').addEventListener('change', (e) => 
            this.toggleMarkers('ports', e.target.checked));

        // Поиск
        document.getElementById('executeSearch').addEventListener('click', () => 
            this.searchMarker());

        // Закрытие при клике вне панели
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.control-panel')) {
                this.closeAllPanels();
            }
        });
    }

    togglePanel(panelId) {
        const panel = document.getElementById(panelId);
        
        if (this.activePanel === panel) {
            this.closeAllPanels();
            return;
        }
        
        this.closeAllPanels();
        
        if (panel) {
            panel.classList.add('active');
            this.activePanel = panel;
            
            // Плавно сдвигаем другие кнопки вниз
            const buttons = document.querySelectorAll('.control-btn');
            buttons.forEach(btn => {
                if (btn !== document.activeElement) {
                    btn.style.transform = 'translateY(0)';
                }
            });
        }
    }

    closeAllPanels() {
        document.querySelectorAll('.control-content').forEach(panel => {
            panel.classList.remove('active');
        });
        this.activePanel = null;
    }

    showLayer(layerName) {
        Object.values(this.layers).forEach(layer => layer.remove());
        this.layers[layerName].addTo(this.map);
        this.closeAllPanels();
    }

    toggleMarkers(markerType, isChecked) {
        if (isChecked) {
            this.map.addLayer(this.markerGroups[markerType]);
        } else {
            this.map.removeLayer(this.markerGroups[markerType]);
        }
    }

    searchMarker() {
        const query = document.getElementById('markerSearch').value;
        console.log('Поиск:', query);
        this.closeAllPanels();
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    const app = new MapApp();
    app.init();
});


