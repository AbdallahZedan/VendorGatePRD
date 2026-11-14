exports.convertToEdmDateTime = function (dateStr) {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('-').map(Number);
    const utcTimestamp = Date.UTC(year, month - 1, day);
    return `/Date(${utcTimestamp})/`;
}

exports.cleanODataPayload = (obj) => {
    if (obj === null || typeof obj !== 'object') {
        if (typeof obj === 'string' && obj.startsWith('/Date(')) {
            return exports.formatODataDate(obj);
        }
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => exports.cleanODataPayload(item));
    }

    if (obj.__deferred) {
        return [];
    }

    const cleaned = {};

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {

            if (key === '__metadata') {
                continue;
            }

            const value = obj[key];

            if (value && typeof value === 'object' && value.__deferred) {
                cleaned[key] = [];
            }

            else if (value && typeof value === 'object' && Array.isArray(value.results)) {
                cleaned[key] = exports.cleanODataPayload(value.results);
            }
            else {

                cleaned[key] = exports.cleanODataPayload(value);
            }
        }
    }

    return cleaned;
};

exports.formatODataDate = (dateStr) => {
    const match = dateStr.match(/\/Date\((\d+)\)\//);
    if (match) {
        const timestamp = parseInt(match[1], 10);
        const date = new Date(timestamp);

        // Extract day, month, and year
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }
    return dateStr;
};

exports.isPureArabic = (text) => {
    const pureArabicPattern = /^[\u0600-\u06FF\s]+$/;
    return pureArabicPattern.test(text);
};