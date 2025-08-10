// Главный объект для хранения состояния карты
const FauxloreMap = {
    map: null,
    mapWidth: 2300,
    mapHeight: 1500,
    layers: {},
    markerGroups: {},

    // Инициализация карты
    init: function() {
        // Создаем карту
        this.map = L.map('map', {
            crs: L.CRS.Simple,
            minZoom: -2,
            maxZoom: 5,
            zoomControl: false
        });

        const bounds = [[0, 0], [this.mapHeight, this.mapWidth]];
        
        // Инициализируем слои
        this.layers = {
            political: L.imageOverlay('img/newfauxpolit.png', bounds),
            geographic: L.imageOverlay('img/newfaux.png', bounds),
            resources: L.imageOverlay('img/newfauxresource_actual_hod_0.png', bounds)
        };

        // Инициализируем группы маркеров
        this.markerGroups = {
            capitals: L.layerGroup(),
            cities: L.layerGroup(),
            fortresses: L.layerGroup(),
            ports: L.layerGroup()
        };

        // Загружаем основной слой
        this.layers.political.addTo(this.map);
        this.map.fitBounds(bounds);
        
        // Добавляем тестовые маркеры
        this.addTestMarkers();
        
        // Активируем все маркеры по умолчанию
        Object.values(this.markerGroups).forEach(group => group.addTo(this.map));
    },

    // Добавление тестовых маркеров
    addTestMarkers: function() {
        const centerY = this.mapHeight/2;
        const centerX = this.mapWidth/2;
        
        // Столица
        L.marker([centerY, centerX], {
            icon: L.divIcon({ html: '★', className: 'capital-icon' })
        }).bindPopup("Столица").addTo(this.markerGroups.capitals);
        
        // Порт
        L.marker([centerY*1.2, centerX*0.8], {
            icon: L.divIcon({ html: '⛵', className: 'port-icon' })
        }).bindPopup("Главный порт").addTo(this.markerGroups.ports);
    }
};

// Глобальные функции для работы с интерфейсом
function toggleControl(controlId) {
    const control = document.getElementById(controlId);
    if (control) {
        control.style.display = control.style.display === 'block' ? 'none' : 'block';
        
        // Закрываем другие панели
        document.querySelectorAll('.control-content').forEach(panel => {
            if (panel.id !== controlId) panel.style.display = 'none';
        });
    }
}

function showLayer(layerName) {
    Object.values(FauxloreMap.layers).forEach(layer => layer.remove());
    FauxloreMap.layers[layerName].addTo(FauxloreMap.map);
    
    // Закрываем все панели
    document.querySelectorAll('.control-content').forEach(panel => {
        panel.style.display = 'none';
    });
}

function toggleMarkers(markerType) {
    const checkbox = document.querySelector(`input[onclick="toggleMarkers('${markerType}')"]`);
    if (checkbox) {
        if (checkbox.checked) {
            FauxloreMap.map.addLayer(FauxloreMap.markerGroups[markerType]);
        } else {
            FauxloreMap.map.removeLayer(FauxloreMap.markerGroups[markerType]);
        }
    }
}

function searchMarker() {
    const query = document.getElementById("markerSearch")?.value.toLowerCase();
    console.log("Поиск:", query);
    document.getElementById("searchPanel").style.display = 'none';
}

// Инициализация после загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    FauxloreMap.init();
    
    // Закрытие панелей при клике вне их
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.control-panel')) {
            document.querySelectorAll('.control-content').forEach(panel => {
                panel.style.display = 'none';
            });
        }
    });
});
