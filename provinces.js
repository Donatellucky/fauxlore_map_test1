console.log('provinces.js loaded');

class ProvinceSystem {
    constructor() {
        console.log("Система провинций загружена");
        this.provinces = {};
        this.highlighted = null;
        this.layer = null;
    }

    init() {
        console.log("Инициализация системы провинций");
        
        if (!window.app || !window.app.map) {
            console.error("Карта не найдена");
            return;
        }

        this.map = window.app.map;
        this.layer = L.layerGroup().addTo(this.map);
        
        // Загрузка данных провинций (временная заглушка)
        this.loadProvinces();
        this.createSidebar();
        
        console.log("Система провинций инициализирована");
    }

    loadProvinces() {
        // Временные данные для тестирования
        this.provinces = {
            "1": {
                name: "Северные земли",
                type: "горный",
                coords: [[300, 400], [320, 420], [310, 450]],
                description: "Холодный регион с богатыми месторождениями железной руды",
                resource: "Железная руда",
                religion: "Православие",
                government: "Монархия",
                race: "Люди",
                status: "регион",
                buildings: ["Шахта", "Казармы"],
                color: "#4a6ea9"
            },
            "2": {
                name: "Золотая долина",
                type: "равнина",
                coords: [[500, 600], [520, 620], [510, 650]],
                description: "Плодородные земли сельскохозяйственного назначения",
                resource: "Пшеница",
                religion: "Солнцепоклонничество",
                government: "Республика",
                race: "Эльфы",
                status: "город",
                buildings: ["Ферма", "Рынок"],
                color: "#2ecc71"
            }
        };
    }

    createSidebar() {
        console.log("Создание боковой панели провинций");
        // Реализация боковой панели будет добавлена позже
    }

    highlightProvince(id) {
        console.log("Выделение провинции:", id);
        // Реализация выделения провинции будет добавлена позже
    }

    showProvinceInfo(id) {
        console.log("Показ информации о провинции:", id);
        // Реализация показа информации будет добавлена позже
    }
}

// Отложенная инициализация
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        if (window.app && window.app.map) {
            window.provinceManager = new ProvinceSystem();
            window.provinceManager.init();
            console.log("Система провинций успешно инициализирована");
        } else {
            console.log("Карта еще не готова для системы провинций");
        }
    }, 2000); // Увеличиваем задержку для гарантированной готовности карты
});
