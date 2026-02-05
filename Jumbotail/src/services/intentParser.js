const { translateHinglish } = require('../utils/hinglishMapper');
const { findClosestMatch } = require('../utils/fuzzyMatcher');

const parseIntent = (query) => {
    const translatedQuery = translateHinglish(query.toLowerCase());
    
    const budgetMatch = translatedQuery.match(/(\d+)k?/);
    const budget = budgetMatch ? parseInt(budgetMatch[1]) * (budgetMatch[0].includes('k') ? 1000 : 1) : null;
    
    const keywords = translatedQuery.split(' ').filter(word => 
        !['ke', 'andar', 'under', 'below', 'above'].includes(word) && 
        !word.match(/\d+/)
    );
    
    const attributes = {};
    const colors = ['red', 'blue', 'black', 'white', 'green'];
    colors.forEach(color => {
        if (translatedQuery.includes(color)) {
            attributes.color = color;
        }
    });
    
    const category = translatedQuery.includes('mobile') || translatedQuery.includes('phone') ? 'mobile' : 'electronics';
    
    return {
        keywords,
        budget,
        attributes,
        category
    };
};

module.exports = { parseIntent };