// Объект для хранения состояния карты
const app = {
    map: null,
    mapWidth: 2300,
    mapHeight: 1500,
    
    init: function() {
        // Инициализация карты
        this.map = L.map('map', {
            crs: L.CRS.Simple,
            minZoom: -2,
            maxZoom: 5,
            zoomControl: false
        });

        const bounds = [[0, 0], [this.mapHeight, this.mapWidth]];
        
        // Слои карты
        this.layers = {
            political: L.imageOverlay('img/newfauxpolit.png', bounds),
            geographic: L.imageOverlay('img/newfaux.png', bounds),
            resources: L.imageOverlay('img/newfauxresource_actual_hod_0.png', bounds)
        };

        // Группы маркеров
        this.markerGroups = {
            capitals: L.layerGroup(),
            cities: L.layerGroup(),
            fortresses: L.layerGroup(),
            ports: L.layerGroup()
        };

        // Показываем политическую карту по умолчанию
        this.layers.political.addTo(this.map);
        this.map.fitBounds(bounds);
        
        // Добавляем тестовые маркеры
        this.addTestMarkers();
        
        // Активируем все маркеры по умолчанию
        Object.values(this.markerGroups).forEach(group => group.addTo(this.map));
        
        // Инициализируем обработчики
        this.initEventListeners();
    },
    
    addTestMarkers: function() {
        const centerY = this.mapHeight/2;
        const centerX = this.mapWidth/2;
        
        L.marker([centerY, centerX], {
            icon: L.divIcon({ html: '★', className: 'capital-icon' })
        }).bindPopup("Столица").addTo(this.markerGroups.capitals);
        
        L.marker([centerY*1.2, centerX*0.8], {
            icon: L.divIcon({ html: '⛵', className: 'port-icon' })
        }).bindPopup("Главный порт").addTo(this.markerGroups.ports);
    },
    
    initEventListeners: function() {
        // Обработчики для кнопок
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = e.target.getAttribute('data-target');
                this.toggleControl(targetId);
            });
        });
        
        // Обработчики для слоев
        document.querySelectorAll('[data-layer]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const layerName = e.target.getAttribute('data-layer');
                this.showLayer(layerName);
            });
        });
        
        // Обработчики для маркеров
        document.querySelectorAll('[data-markers]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const markerType = e.target.getAttribute('data-markers');
                this.toggleMarkers(markerType);
            });
        });
        
        // Обработчик поиска
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.searchMarker();
        });
        
        // Закрытие панелей при клике вне их
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.control-panel')) {
                this.closeAllPanels();
            }
        });
    },
    
    toggleControl: function(controlId) {
        const control = document.getElementById(controlId);
        if (control) {
            control.style.display = control.style.display === 'block' ? 'none' : 'block';
            this.closeOtherPanels(controlId);
        }
    },
    
    closeOtherPanels: function(excludeId) {
        document.querySelectorAll('.control-content').forEach(panel => {
            if (panel.id !== excludeId) {
                panel.style.display = 'none';
            }
        });
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
    
    toggleMarkers: function(markerType) {
        const checkbox = document.querySelector(`input[data-markers="${markerType}"]`);
        if (checkbox) {
            if (checkbox.checked) {
                this.map.addLayer(this.markerGroups[markerType]);
            } else {
                this.map.removeLayer(this.markerGroups[markerType]);
            }
        }
    },
    
    searchMarker: function() {
        const query = document.getElementById("markerSearch").value.toLowerCase();
        console.log("Поиск:", query);
        this.closeAllPanels();
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => app.init());
