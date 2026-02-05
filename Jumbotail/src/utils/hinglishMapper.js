const hinglishMap = {
    'sasta': 'cheap',
    'mehenga': 'expensive',
    'accha': 'good',
    'best': 'best',
    'naya': 'new',
    'purana': 'old',
    'bada': 'large',
    'chota': 'small'
};

const translateHinglish = (text) => {
    let translatedText = text;
    
    Object.keys(hinglishMap).forEach(hinglish => {
        const regex = new RegExp(hinglish, 'gi');
        translatedText = translatedText.replace(regex, hinglishMap[hinglish]);
    });
    
    return translatedText;
};

module.exports = { translateHinglish };