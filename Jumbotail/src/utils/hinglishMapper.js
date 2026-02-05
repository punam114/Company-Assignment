const hinglishMap = {
    'sasta': 'cheap',
    'saste': 'cheap',
    'mehenga': 'expensive',
    'mehenge': 'expensive',
    'kam': 'low',
    'zyada': 'high',
    'accha': 'good',
    'achha': 'good',
    'best': 'best',
    'badhiya': 'good',
    'badiya': 'good',
    'bekar': 'bad',
    'bada': 'large',
    'bade': 'large',
    'chota': 'small',
    'chote': 'small',
    'naya': 'new',
    'naye': 'new',
    'purana': 'old',
    'purane': 'old',
    'latest': 'latest',
    'laal': 'red',
    'neela': 'blue',
    'hara': 'green',
    'kala': 'black',
    'safed': 'white',
    'gulabi': 'pink',
    'mobile': 'mobile',
    'phone': 'phone',
    'laptop': 'laptop',
    'charger': 'charger',
    'cover': 'cover',
    'screen': 'screen',
    'battery': 'battery',
    'camera': 'camera',
    'jyada': 'more',
    'bahut': 'very',
    'ke': '',
    'ka': '',
    'ki': '',
    'andar': 'under',
    'se': 'from',
    'tak': 'to',
    'wala': 'with',
    'wali': 'with',
    'wale': 'with'
};

const translateHinglish = (query) => {
    if (!query) return '';

    let translatedQuery = query.toLowerCase();

    Object.keys(hinglishMap).forEach(hinglishWord => {
        const englishWord = hinglishMap[hinglishWord];
        const regex = new RegExp(`\\b${hinglishWord}\\b`, 'gi');
        translatedQuery = translatedQuery.replace(regex, englishWord);
    });

    translatedQuery = translatedQuery.replace(/\s+/g, ' ').trim();

    return translatedQuery;
};

const isHinglish = (query) => {
    if (!query) return false;

    const lowerQuery = query.toLowerCase();
    return Object.keys(hinglishMap).some(word =>
        lowerQuery.includes(word)
    );
};

module.exports = {
    hinglishMap,
    translateHinglish,
    isHinglish
};
