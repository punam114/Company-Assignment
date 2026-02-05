const levenshtein = require('fast-levenshtein');

const findClosestMatch = (input, candidates, threshold = 0.7) => {
    let bestMatch = null;
    let bestScore = 0;
    
    candidates.forEach(candidate => {
        const distance = levenshtein.get(input.toLowerCase(), candidate.toLowerCase());
        const similarity = 1 - (distance / Math.max(input.length, candidate.length));
        
        if (similarity >= threshold && similarity > bestScore) {
            bestMatch = candidate;
            bestScore = similarity;
        }
    });
    
    return bestMatch;
};

module.exports = { findClosestMatch };