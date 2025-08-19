console.log('provinces.js loaded');
class ProvinceSystem {
    constructor(map) {
        if (!map) {
            console.error("Карта не найдена.");
            return;
        }
        this.map = map;
        this.provinces = {};
        this.highlighted = null;
        this.layer = L.layerGroup().addTo(map);
    }

    // Инициализация системы провинций
    init() {
        this.loadProvinces();
        this.createSidebar();
    }

    // Загрузка данных о провинциях (пример)
    loadProvinces() {
        // В реальном проекте загружайте из JSON файла
        this.provinces = {
            101: this.createProvinceData("Северные земли", "горный", [[100,200],[120,220],[110,250]]),
            102: this.createProvinceData("Золотая долина", "равнина", [[300,400],[320,420],[310,450]]),
            // ... остальные провинции
        };
    }

    createProvinceData(name, type, coords) {
        return {
            name: name,
            type: type,
            coords: coords,
            description: `${name} - ${type} регион с уникальными особенностями`,
            color: this.getColorByType(type)
        };
    }

    getColorByType(type) {
        const colors = {
            'горный': '#4a6ea9',
            'равнина': '#2ecc71',
            'лес': '#27ae60',
            'пустыня': '#f39c12'
        };
        return colors[type] || '#3498db';
    }

    // Создание боковой панели
    createSidebar() {
        const sidebar = L.control({position: 'topleft'});
        
        sidebar.onAdd = () => {
            this.sidebarContainer = L.DomUtil.create('div', 'province-sidebar');
            this.renderSidebarContent();
            return this.sidebarContainer;
        };
        
        sidebar.addTo(this.map);
    }

    // Обновление содержимого боковой панели
    renderSidebarContent(filter = '') {
        this.sidebarContainer.innerHTML = `
            <div class="province-header">
                <h3>Провинции</h3>
                <input type="text" class="province-search" placeholder="Поиск...">
            </div>
            <div class="province-list"></div>
            <div class="province-info"></div>
        `;

        // Обработчики событий
        this.sidebarContainer.querySelector('.province-search').addEventListener('input', (e) => {
            this.renderProvinceList(e.target.value);
        });

        this.renderProvinceList(filter);
    }

    // Отображение списка провинций
    renderProvinceList(filter = '') {
        const listContainer = this.sidebarContainer.querySelector('.province-list');
        listContainer.innerHTML = '';

        Object.entries(this.provinces).forEach(([id, province]) => {
            if (filter && !province.name.toLowerCase().includes(filter.toLowerCase())) return;

            const item = document.createElement('div');
            item.className = 'province-item';
            item.innerHTML = `
                <span class="province-id">${id}</span>
                <span class="province-name">${province.name}</span>
            `;
            item.addEventListener('click', () => this.highlightProvince(id, province));
            listContainer.appendChild(item);
        });
    }

    // Подсветка провинции на карте
highlightProvince(id, province) {
    if (this.highlighted) {
        this.layer.removeLayer(this.highlighted);
    }

    // Преобразуем координаты в систему Leaflet
    const latLngs = province.coords.map(coord => {
        // Предполагаем, что coords в формате [y, x]
        return L.latLng(coord[0], coord[1]);
    });

    this.highlighted = L.polygon(latLngs, {
        color: province.color,
        weight: 3,
        fillOpacity: 0.2
    }).addTo(this.layer);

    this.showProvinceInfo(id, province);
}
highlightProvince(id, province) {
    // Удаляем предыдущую подсветку
    if (this.highlighted) {
        this.layer.removeLayer(this.highlighted);
    }

    // Проверяем и преобразуем координаты
    if (!province.coords || !Array.isArray(province.coords)) {
        console.error("Invalid coordinates for province:", id);
        return;
    }

    // Создаем полигон для подсветки
    try {
        this.highlighted = L.polygon(province.coords), {
            color: province.color || '#3498db',
            weight: 3,
            fillOpacity: 0.2
        }).addTo(this.layer);
    } catch (e) {
        console.error("Error creating polygon for province:", id, e);
    }

    // Показываем информацию
    this.showProvinceInfo(id, province);
}

    // Отображение информации о провинции
    showProvinceInfo(id, province) {
        const infoContainer = this.sidebarContainer.querySelector('.province-info');
        infoContainer.innerHTML = `
            <h4>${province.name}</h4>
            <div class="province-meta">
                <span>ID: ${id}</span>
                <span>Тип: ${province.type}</span>
            </div>
            <p>${province.description}</p>
        `;
    }
}
