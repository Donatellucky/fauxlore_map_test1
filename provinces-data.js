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

const provincesData = {
    101: {
        name: "Северные земли",
        type: "горный",
        coords: [[450, 300], [500, 350], [480, 400], [430, 380]],
        description: "Холодный регион с богатыми месторождениями руды. Население: 120,000.",
        resources: ["железо", "уголь", "пушнина"],
        capital: {
            coords: [460, 350],
            name: "Винтерхольд"
        },
        cities: [
            {coords: [490, 320], name: "Сноухилл"},
            {coords: [440, 370], name: "Айронфордж"}
        ]
    },
    102: {
        name: "Золотая долина",
        type: "равнина",
        coords: [[600, 500], [650, 550], [700, 520], [680, 480]],
        description: "Плодородные земли сельскохозяйственного назначения. Население: 250,000.",
        resources: ["пшеница", "кукуруза", "виноград"],
        capital: {
            coords: [630, 530],
            name: "Голденфилд"
        },
        cities: [
            {coords: [670, 510], name: "Санрайз"},
            {coords: [610, 490], name: "Харвест"}
        ],
        tradeRoutes: [103, 104]
    },
    103: {
        name: "Восточные болота",
        type: "болото",
        coords: [[750, 600], [800, 650], [850, 620], [820, 580]],
        description: "Заболоченные земли с редкими поселениями. Население: 45,000.",
        resources: ["торф", "лечебные травы", "рыба"],
        capital: {
            coords: [780, 630],
            name: "Мирквуд"
        }
    },
    104: {
        name: "Огненные горы",
        type: "вулканический",
        coords: [[900, 400], [950, 450], [1000, 420], [980, 380]],
        description: "Вулканический регион с горячими источниками. Население: 80,000.",
        resources: ["сера", "обсидиан", "драгоценные камни"],
        capital: {
            coords: [930, 430],
            name: "Эмбертаун"
        },
        fortresses: [
            {coords: [960, 410], name: "Форт Блэкстоун"}
        ]
    }
};

// Дополнительные данные для системы провинций
const provinceSystemConfig = {
    colors: {
        горный: "#4a6ea9",
        равнина: "#2ecc71",
        болото: "#8e44ad",
        вулканический: "#e74c3c",
        лес: "#27ae60",
        пустыня: "#f39c12",
        default: "#3498db"
    },
    iconTypes: {
        capital: {
            html: "★",
            className: "capital-icon",
            iconSize: [24, 24]
        },
        city: {
            html: "●",
            className: "city-icon",
            iconSize: [20, 20]
        },
        fortress: {
            html: "🛡️",
            className: "fortress-icon",
            iconSize: [22, 22]
        }
    }
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
