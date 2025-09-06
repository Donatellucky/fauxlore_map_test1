console.log('provinces.js loaded');

// province.js
class ProvinceSystem {
    constructor(map) {
        this.map = map;
        this.provincesLayer = L.geoJSON(provincesData, {
            style: function(feature) {
                return {
                    fillColor: '#3388ff',
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    fillOpacity: 0.2
                };
            },
            onEachFeature: (feature, layer) => {
                layer.on({
                    click: (e) => this.showProvinceInfo(feature.properties, e.latlng)
                });
            }
        }).addTo(map);

        this.infoPanel = L.control({position: 'topright'});
        this.infoPanel.onAdd = function(map) {
            this._div = L.DomUtil.create('div', 'province-info-panel');
            this.update();
            return this._div;
        };
        this.infoPanel.update = function(props) {
            this._div.innerHTML = props ? 
                `<h4>${props.name}</h4>
                 <p>${props.description}</p>
                 <p>Ресурс: ${props.resource}</p>
                 <p>Религия: ${props.religion}</p>
                 <p>Правительство: ${props.government}</p>
                 <p>Раса: ${props.race}</p>
                 <p>Статус: ${props.status}</p>
                 <p>Постройки: ${props.buildings.join(', ')}</p>` : 'Нажмите на провинцию';
        };
        this.infoPanel.addTo(map);
    }

    showProvinceInfo(props, latlng) {
        this.infoPanel.update(props);
        // Можно также открыть popup или сделать что-то еще
    }
}
        
        // Маркер столицы
        if (province.capital) {
            markers.push(this.createMarker(
                province.capital.coords, 
                province.capital.name, 
                'capital',
                id
            ));
        }
        
        // Города
        if (province.cities) {
            province.cities.forEach(city => {
                markers.push(this.createMarker(
                    city.coords, 
                    city.name, 
                    'city',
                    id
                ));
            });
        }
        
        // Крепости
        if (province.fortresses) {
            province.fortresses.forEach(fort => {
                markers.push(this.createMarker(
                    fort.coords, 
                    fort.name, 
                    'fortress',
                    id
                ));
            });
        }
        
        return markers;
    }

    createMarker(coords, name, type, provinceId) {
        const iconCfg = this.config.iconTypes[type];
        const icon = L.divIcon({
            html: iconCfg.html,
            className: `province-marker ${iconCfg.className}`,
            iconSize: iconCfg.iconSize
        });
        
        const marker = L.marker([coords[0], coords[1]], { icon })
            .bindPopup(`<b>${name}</b><br>Провинция: ${this.provincesData[provinceId].name}`)
            .addTo(this.layer);
            
        marker.on('click', () => {
            this.highlightProvince(provinceId);
        });
        
        return L.marker([coords[0], coords[1]], { icon })
            .bindPopup(`<b>${name}</b><br>Провинция: ${this.provincesData[provinceId].name}`)
            .addTo(this.layer);
    }

    createSidebar() {
        this.sidebar = L.control({ position: 'topleft' });
        
        this.sidebar.onAdd = () => {
            this.sidebarContainer = L.DomUtil.create('div', 'province-sidebar');
            this.renderSidebarContent();
            return this.sidebarContainer;
        };
        
        this.sidebar.addTo(this.map);
    }

    renderSidebarContent(filter = '') {
        this.sidebarContainer.innerHTML = `
            <div class="province-header">
                <h3>Провинции</h3>
                <input type="text" class="province-search" placeholder="Поиск провинции...">
                <div class="province-filters">
                    <label><input type="checkbox" class="filter-mountain" checked> Горные</label>
                    <label><input type="checkbox" class="filter-plain" checked> Равнины</label>
                </div>
            </div>
            <div class="province-list"></div>
            <div class="province-info"></div>
        `;
        
        this.renderProvinceList(filter);
    }

    renderProvinceList(filter = '') {
        const listContainer = this.sidebarContainer.querySelector('.province-list');
        listContainer.innerHTML = '';
        
        const showMountain = this.sidebarContainer.querySelector('.filter-mountain').checked;
        const showPlain = this.sidebarContainer.querySelector('.filter-plain').checked;

        Object.entries(this.provinces).forEach(([id, province]) => {
            if (filter && !province.name.toLowerCase().includes(filter.toLowerCase())) return;
            
            // Фильтрация по типу
            if ((province.type === 'горный' && !showMountain) || 
                (province.type === 'равнина' && !showPlain)) return;
            
            const item = document.createElement('div');
            item.className = 'province-item';
            item.innerHTML = `
                <span class="province-id">${id}</span>
                <span class="province-name">${province.name}</span>
                <span class="province-type" style="color:${province.color}">${province.type}</span>
            `;
            
            item.addEventListener('click', () => this.highlightProvince(id));
            listContainer.appendChild(item);
        });
    }

    highlightProvince(id) {
        // Снимаем предыдущую подсветку
        if (this.highlighted) {
            this.layer.removeLayer(this.highlighted);
        }
        
        const province = this.provinces[id];
        if (!province) return;
        
        this.currentProvince = id;
        
        // Подсветка границ провинции
        this.highlighted = L.polygon(province.coords, {
            color: province.color,
            weight: 3,
            fillOpacity: 0.2
        }).addTo(this.layer);
        
        // Показываем информацию
        this.showProvinceInfo(id);
        
        // Центрируем карту на провинции
        const bounds = L.latLngBounds(province.coords);
        this.map.fitBounds(bounds.pad(0.2));
    }

    showProvinceInfo(id) {
        const province = this.provinces[id];
        if (!province) return;
        
        const infoContainer = this.sidebarContainer.querySelector('.province-info');
        infoContainer.innerHTML = `
            <h4>${province.name}</h4>
            <div class="province-meta">
                <span>ID: ${id}</span>
                <span>Тип: <span style="color:${province.color}">${province.type}</span></span>
            </div>
            <p>${province.description}</p>
            <div class="province-resources">
                <h5>Ресурсы:</h5>
                <ul>${province.resources.map(r => `<li>${r}</li>`).join('')}</ul>
            </div>
            ${province.capital ? `<div class="province-capital">Столица: ${province.capital.name}</div>` : ''}
        `;
    }

    getColorByType(type) {
        return this.config.colors[type] || this.config.colors.default;
    }

    setupEventListeners() {
        // Поиск провинций
        this.sidebarContainer?.querySelector('.province-search')?.addEventListener('input', (e) => {
            this.renderProvinceList(e.target.value);
        });
        
        // Фильтры
        this.sidebarContainer?.querySelector('.filter-mountain')?.addEventListener('change', () => {
            this.renderProvinceList(this.sidebarContainer.querySelector('.province-search').value);
        });
        
        this.sidebarContainer?.querySelector('.filter-plain')?.addEventListener('change', () => {
            this.renderProvinceList(this.sidebarContainer.querySelector('.province-search').value);
        });
    }
}

// В класс ProvinceSystem добавим:
initSidebar() {
    // Обработчики для открытия/закрытия
    document.getElementById('open-sidebar').addEventListener('click', () => {
        document.getElementById('province-sidebar').style.width = '250px';
    });
    document.getElementById('close-sidebar').addEventListener('click', () => {
        document.getElementById('province-sidebar').style.width = '0';
    });

    // Поиск
    const searchInput = document.getElementById('province-search');
    searchInput.addEventListener('input', () => {
        this.filterProvinces(searchInput.value);
    });

    this.renderProvinceList();
}

renderProvinceList(filter = '') {
    const listContainer = document.getElementById('province-list');
    listContainer.innerHTML = '';
    provincesData.features.forEach(feature => {
        const name = feature.properties.name;
        if (filter && !name.toLowerCase().includes(filter.toLowerCase())) return;

        const item = document.createElement('div');
        item.className = 'province-item';
        item.textContent = `${feature.id}: ${name}`;
        item.addEventListener('click', () => {
            // При клике на элемент списка показываем провинцию на карте
            this.highlightProvince(feature);
            this.showProvinceInfo(feature.properties);
        });
        listContainer.appendChild(item);
    });
}

filterProvinces(query) {
    this.renderProvinceList(query);
}

highlightProvince(feature) {
    // Убрать предыдущее выделение
    if (this.highlighted) {
        this.provincesLayer.resetStyle(this.highlighted);
    }
    // Найти слой провинции по id
    this.provincesLayer.eachLayer(layer => {
        if (layer.feature.id === feature.id) {
            this.highlighted = layer;
            layer.setStyle({
                color: '#ff7800',
                fillOpacity: 0.7
            });
            this.map.fitBounds(layer.getBounds());
        }
    });
}

// Отложенная инициализация
function initProvinceSystem() {
    if (window.mapApp && window.mapApp.map) {
        window.provinceSystem = new ProvinceSystem(window.mapApp.map);
        window.provinceSystem.init();
    } else {
        setTimeout(initProvinceSystem, 100);
    }
}

// Запуск
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProvinceSystem);
} else {
    initProvinceSystem();
}
