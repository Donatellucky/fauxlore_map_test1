// Объект для управления картой
const MapManager = {
    map: null,
    mapWidth: 2300,
    mapHeight: 1500,
    
    init: function() {
        this.setupMap();
        this.setupLayers();
        this.setupMarkers();
        this.setupEventListeners();
    },
    
    setupMap: function() {
        this.map = L.map('map', {
            crs: L.CRS.Simple,
            minZoom: -2,
            maxZoom: 5,
            zoomControl: false
        });
    },
    
    setupLayers: function() {
        const bounds = [[0, 0], [this.mapHeight, this.mapWidth]];
        
        this.layers = {
            political: L.imageOverlay('img/newfauxpolit.png', bounds),
            geographic: L.imageOverlay('img/newfaux.png', bounds),
            resources: L.imageOverlay('img/newfauxresource_actual_hod_0.png', bounds)
        };
        
        this.layers.political.addTo(this.map);
        this.map.fitBounds(bounds);
    },
    
    setupMarkers: function() {
        this.markerGroups = {
            capitals: L.layerGroup(),
            cities: L.layerGroup(),
            fortresses: L.layerGroup(),
            ports: L.layerGroup()
        };
        
        // Добавляем тестовые маркеры
        const centerY = this.mapHeight/2;
        const centerX = this.mapWidth/2;
        
        L.marker([centerY, centerX], {
            icon: L.divIcon({ html: '★', className: 'capital-icon' })
        }).bindPopup("Столица").addTo(this.markerGroups.capitals);
        
        L.marker([centerY*1.2, centerX*0.8], {
            icon: L.divIcon({ html: '⛵', className: 'port-icon' })
        }).bindPopup("Главный порт").addTo(this.markerGroups.ports);
        
        // Активируем все маркеры
        Object.values(this.markerGroups).forEach(group => group.addTo(this.map));
    },
    
    setupEventListeners: function() {
        // Меню слоев
        document.getElementById('menuBtn').addEventListener('click', () => this.togglePanel('mainMenu'));
        document.getElementById('politicalBtn').addEventListener('click', () => this.showLayer('political'));
        document.getElementById('geographicBtn').addEventListener('click', () => this.showLayer('geographic'));
        document.getElementById('resourcesBtn').addEventListener('click', () => this.showLayer('resources'));
        
        // Маркеры
        document.getElementById('markersBtn').addEventListener('click', () => this.togglePanel('markersMenu'));
        document.getElementById('toggleCapitals').addEventListener('change', (e) => this.toggleMarkers('capitals', e.target.checked));
        document.getElementById('toggleCities').addEventListener('change', (e) => this.toggleMarkers('cities', e.target.checked));
        document.getElementById('toggleFortresses').addEventListener('change', (e) => this.toggleMarkers('fortresses', e.target.checked));
        document.getElementById('togglePorts').addEventListener('change', (e) => this.toggleMarkers('ports', e.target.checked));
        
        // Поиск
        document.getElementById('searchBtn').addEventListener('click', () => this.togglePanel('searchPanel'));
        document.getElementById('executeSearch').addEventListener('click', () => this.searchMarker());
        
        // Закрытие панелей
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.control-panel') && 
                !e.target.closest('.control-content')) {
                this.closeAllPanels();
            }
        });
    },
    
    togglePanel: function(panelId) {
        const panel = document.getElementById(panelId);
        if (panel) {
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        }
    },
    
    closeAllPanels: function() {
        document.querySelectorAll('.control-content').forEach(panel => {
            panel.style.display = 'none';
        });
    },
    
    showLayer: function(layerName) {
        Object.values(this.layers).forEach(layer => layer.remove());
        this.layers[layerName].addTo(this.map);
        this.closeAllPanels();
    },
    
    toggleMarkers: function(markerType, isChecked) {
        if (isChecked) {
            this.map.addLayer(this.markerGroups[markerType]);
        } else {
            this.map.removeLayer(this.markerGroups[markerType]);
        }
    },
    
    searchMarker: function() {
        const query = document.getElementById("markerSearch").value;
        console.log("Ищем:", query);
        this.closeAllPanels();
    }
};

// Инициализация при загрузке страницы
window.onload = () => MapManager.init();


