console.log('script.js loaded');

class MapApp {
    constructor() {
        this.activePanel = null;
        this.mapWidth = 2300;
        this.mapHeight = 1500;
        this.map = null;
        this.layers = {};
        this.markerGroups = {};
        this.provinceSystem = null; // Добавляем свойство для системы провинций
    }

    init() {
        this.createMap();
        this.createLayers();
        this.createMarkers();
        this.setupUI();
        window.mapApp = this;
        
       console.log("Проверка элементов DOM:");
        console.log("Элемент #map:", document.getElementById('map'));
        console.log("Размеры #map:", 
                    document.getElementById('map')?.offsetWidth, 
                    document.getElementById('map')?.offsetHeight);
        
        // Проверяем и инициализируем систему провинций
        if (typeof ProvinceSystem !== 'undefined') {
            try {
                this.provinceSystem = new ProvinceSystem(this.map);
                this.provinceSystem.init();
                console.log("Система провинций инициализирована");
            } catch (e) {
                console.error("Ошибка инициализации ProvinceSystem:", e);
            }
        } else {
            console.error("ProvinceSystem не загружен. Проверьте порядок загрузки скриптов.");
        }
        
        console.log("Карта инициализирована");
    }

createMap() {
    // Проверяем, существует ли уже карта
    if (this.map) {
        console.warn("Карта уже существует, удаляем старую версию");
        this.map.remove();
    }
    
    this.map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 5,
        zoomControl: false
    });
    
    console.log("Новая карта создана:", this.map);
}

    createLayers() {
        const bounds = [[0, 0], [this.mapHeight, this.mapWidth]];
        
        try {
            this.layers = {
                political: L.imageOverlay('img/newfauxpolit.png', bounds),
                geographic: L.imageOverlay('img/newfaux.png', bounds),
                resources: L.imageOverlay('img/newfauxresource_actual_hod_0.png', bounds),
                trade: L.imageOverlay('img/newfauxtrade.png', bounds)
            };

            // Добавляем обработчики ошибок для каждого слоя
            Object.values(this.layers).forEach(layer => {
                layer.on('error', () => {
                    console.error('Ошибка загрузки изображения слоя');
                });
            });
            
            this.layers.political.addTo(this.map).on('load', () => {
                console.log("Основной слой загружен");
                this.map.fitBounds(bounds);
            });
            
        } catch (e) {
            console.error("Ошибка создания слоев:", e);
        }
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

        // Тестовый маркер
        L.marker([centerY, centerX])
            .addTo(this.map)
            .bindPopup("Тест карты")
            .openPopup();     
        
        // Тестовые маркеры
        L.marker([centerY, centerX], {
            icon: L.divIcon({ html: '★', className: 'capital-icon' })
        }).bindPopup("Столица").addTo(this.markerGroups.capitals);
        
        L.marker([centerY*1.2, centerX*0.8], {
            icon: L.divIcon({ html: '⛵', className: 'port-icon' })
        }).bindPopup("Главный порт").addTo(this.markerGroups.ports);

        // Активируем все маркеры
        Object.values(this.markerGroups).forEach(group => {
            group.addTo(this.map);
        });
    }

    setupUI() {
        const initButton = (id, handler) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', handler.bind(this));
            } else {
                console.error("Элемент не найден:", id);
            }
        };

        // Основные кнопки
        initButton('menuBtn', () => this.togglePanel('mainMenu'));
        initButton('markersBtn', () => this.togglePanel('markersMenu'));
        initButton('searchBtn', () => this.togglePanel('searchPanel'));

        // Кнопки слоев
        initButton('politicalBtn', () => this.showLayer('political'));
        initButton('geographicBtn', () => this.showLayer('geographic'));
        initButton('resourcesBtn', () => this.showLayer('resources'));
        initButton('newfauxtradeBtn', () => this.showLayer('trade'));

        // Чекбоксы маркеров
        const initCheckbox = (id, type) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', (e) => 
                    this.toggleMarkers(type, e.target.checked));
            }
        };

        initCheckbox('toggleCapitals', 'capitals');
        initCheckbox('toggleCities', 'cities');
        initCheckbox('toggleFortresses', 'fortresses');
        initCheckbox('togglePorts', 'ports');

        // Поиск
        initButton('executeSearch', () => this.searchMarker());

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
        if (!panel) {
            console.error("Панель не найдена:", panelId);
            return;
        }

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
    
    window.app = app;
};





