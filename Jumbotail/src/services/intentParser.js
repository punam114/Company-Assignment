const { translateHinglish } = require('../utils/hinglishMapper');
const { correctBrandTypos } = require('../utils/fuzzyMatcher');

/**
 * Intent Parser Service
 * Parses user queries to understand search intent
 * Handles: Hinglish, typos, budget extraction, attribute detection
 */

/**
 * Extracts budget/price from query
 * Examples: "50k", "50000", "under 50k", "50 thousand"
 * @param {string} query - User's search query
 * @returns {number|null} - Extracted budget in rupees
 */
const extractBudget = (query) => {
    if (!query) return null;

    const lowerQuery = query.toLowerCase();

    // Pattern 1: "50k", "50K"
    const kPattern = /(\d+)\s*k\b/i;
    const kMatch = lowerQuery.match(kPattern);
    if (kMatch) {
        return parseInt(kMatch[1]) * 1000;
    }

    // Pattern 2: "50000", "50,000"
    const numberPattern = /(\d{4,})/;
    const numberMatch = lowerQuery.match(numberPattern);
    if (numberMatch) {
        return parseInt(numberMatch[1].replace(/,/g, ''));
    }

    // Pattern 3: "50 thousand", "50 hazaar"
    const thousandPattern = /(\d+)\s*(thousand|hazaar|hajar)/i;
    const thousandMatch = lowerQuery.match(thousandPattern);
    if (thousandMatch) {
        return parseInt(thousandMatch[1]) * 1000;
    }

    // Pattern 4: "5 lakh", "5 lac"
    const lakhPattern = /(\d+)\s*(lakh|lac)/i;
    const lakhMatch = lowerQuery.match(lakhPattern);
    if (lakhMatch) {
        return parseInt(lakhMatch[1]) * 100000;
    }

    return null;
};

/**
 * Extracts attributes from query
 * Examples: "red color", "8GB RAM", "128GB storage"
 * @param {string} query - User's search query
 * @returns {Object} - Extracted attributes
 */
const extractAttributes = (query) => {
    if (!query) return {};

    const attributes = {};
    const lowerQuery = query.toLowerCase();

    // Color extraction
    const colors = ['red', 'blue', 'green', 'black', 'white', 'silver', 'gold', 'pink', 'purple', 'grey', 'gray', 'yellow', 'orange'];
    colors.forEach(color => {
        if (lowerQuery.includes(color)) {
            attributes.color = color;
        }
    });

    // RAM extraction (4GB, 8GB, 12GB, 16GB)
    const ramPattern = /(\d+)\s*gb\s*(ram)?/i;
    const ramMatch = lowerQuery.match(ramPattern);
    if (ramMatch) {
        attributes.ram = `${ramMatch[1]}GB`;
    }

    // Storage extraction (64GB, 128GB, 256GB, 512GB, 1TB)
    const storagePattern = /(\d+)\s*(gb|tb)\s*(storage|rom)?/i;
    const storageMatch = lowerQuery.match(storagePattern);
    if (storageMatch) {
        attributes.storage = `${storageMatch[1]}${storageMatch[2].toUpperCase()}`;
    }

    // Screen size extraction (6.1 inch, 15.6")
    const screenPattern = /(\d+\.?\d*)\s*(inch|"|inches)/i;
    const screenMatch = lowerQuery.match(screenPattern);
    if (screenMatch) {
        attributes.screenSize = `${screenMatch[1]} inch`;
    }

    // Battery extraction (5000mAh, 5000 mah)
    const batteryPattern = /(\d+)\s*mah/i;
    const batteryMatch = lowerQuery.match(batteryPattern);
    if (batteryMatch) {
        attributes.battery = `${batteryMatch[1]}mAh`;
    }

    return attributes;
};

/**
 * Detects product category from query
 * @param {string} query - User's search query
 * @returns {string|null} - Detected category
 */
const detectCategory = (query) => {
    if (!query) return null;

    const lowerQuery = query.toLowerCase();

    // Mobile/Phone keywords
    const mobileKeywords = ['mobile', 'phone', 'smartphone', 'iphone', 'android'];
    if (mobileKeywords.some(keyword => lowerQuery.includes(keyword))) {
        return 'mobile';
    }

    // Laptop keywords
    const laptopKeywords = ['laptop', 'notebook', 'macbook'];
    if (laptopKeywords.some(keyword => lowerQuery.includes(keyword))) {
        return 'laptop';
    }

    // Accessory keywords
    const accessoryKeywords = ['charger', 'cable', 'cover', 'case', 'earphone', 'headphone', 'powerbank', 'adapter'];
    if (accessoryKeywords.some(keyword => lowerQuery.includes(keyword))) {
        return 'accessory';
    }

    return null;
};

/**
 * Extracts keywords from query (after removing budget, attributes, etc.)
 * @param {string} query - User's search query
 * @returns {Array<string>} - Extracted keywords
 */
const extractKeywords = (query) => {
    if (!query) return [];

    let cleanQuery = query.toLowerCase();

    // Remove budget patterns
    cleanQuery = cleanQuery.replace(/(\d+)\s*k\b/gi, '');
    cleanQuery = cleanQuery.replace(/(\d{4,})/g, '');
    cleanQuery = cleanQuery.replace(/(\d+)\s*(thousand|hazaar|hajar|lakh|lac)/gi, '');

    // Remove common filler words
    const fillerWords = ['under', 'above', 'below', 'with', 'without', 'ke', 'ka', 'ki', 'andar', 'se', 'tak', 'wala', 'wali', 'wale', 'the', 'a', 'an'];
    fillerWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        cleanQuery = cleanQuery.replace(regex, '');
    });

    // Clean up and split into keywords
    const keywords = cleanQuery
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .filter(word => word.length > 2); // Remove very short words

    return [...new Set(keywords)]; // Remove duplicates
};

/**
 * Main intent parser function
 * Combines all parsing logic
 * @param {string} query - User's search query
 * @returns {Object} - Parsed intent
 */
const parseIntent = (query) => {
    if (!query) {
        return {
            originalQuery: '',
            translatedQuery: '',
            keywords: [],
            budget: null,
            attributes: {},
            category: null,
            isHinglish: false
        };
    }

    // Step 1: Translate Hinglish to English
    const translatedQuery = translateHinglish(query);

    // Step 2: Correct brand typos
    const correctedQuery = correctBrandTypos(translatedQuery);

    // Step 3: Extract budget
    const budget = extractBudget(correctedQuery);

    // Step 4: Extract attributes
    const attributes = extractAttributes(correctedQuery);

    // Step 5: Detect category
    const category = detectCategory(correctedQuery);

    // Step 6: Extract keywords
    const keywords = extractKeywords(correctedQuery);

    // Step 7: Check if original query was Hinglish
    const isHinglish = query !== translatedQuery;

    return {
        originalQuery: query,
        translatedQuery: correctedQuery,
        keywords,
        budget,
        attributes,
        category,
        isHinglish
    };
};

module.exports = {
    parseIntent,
    extractBudget,
    extractAttributes,
    detectCategory,
    extractKeywords
};
