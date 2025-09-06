/**
 * Данные провинций для карты Fauxlore
 * Формат: 
 * {
 *   id: {
 *     name: "Название",
 *     type: "тип",
 *     coords: [[y1,x1], [y2,x2], ...], // Координаты полигона
 *     description: "Описание",
 *     resources: ["ресурс1", "ресурс2"],
 *     capital: {coords: [y,x], name: "Название столицы"},
 *     cities: [{coords: [y,x], name: "Название"}]
 *   }
 * }
 */

// province-data.js
var provincesData = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "id": 1,
            "properties": {
                "name": "Северные земли",
                "resource": "Железо",
                "religion": "Православие",
                "government": "Монархия",
                "race": "Люди",
                "description": "Холодный регион с богатыми месторождениями руды",
                "status": "регион",
                "buildings": ["Шахта", "Казармы"]
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[100,200], [120,220], [110,250], [100,200]]]
            }
        },
        // ... другие провинции
    ]
};

/**
 * Функция для загрузки данных провинций
 * @returns {Object} Объект с данными провинций и конфигурацией
 */
function loadProvincesData() {
    return {
        provinces: provincesData,
        config: provinceSystemConfig
    };
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { provincesData, provinceSystemConfig, loadProvincesData };
}
