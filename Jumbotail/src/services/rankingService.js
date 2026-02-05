const calculateScore = (product, parsedIntent) => {
    let textRelevance = 0;
    let ratingScore = product.rating / 5;
    let priceScore = 1;
    let stockScore = product.stock > 0 ? 1 : 0.3;
    let salesScore = Math.min(product.sales / 1000, 1);
    let metadataScore = 0;
    
    // Text relevance
    parsedIntent.keywords.forEach(keyword => {
        if (product.title.toLowerCase().includes(keyword)) {
            textRelevance += 0.3;
        }
        if (product.description.toLowerCase().includes(keyword)) {
            textRelevance += 0.2;
        }
    });
    textRelevance = Math.min(textRelevance, 1);
    
    // Price score
    if (parsedIntent.budget) {
        if (product.price <= parsedIntent.budget) {
            priceScore = 1;
        } else if (product.price <= parsedIntent.budget * 1.1) {
            priceScore = 0.7;
        } else if (product.price <= parsedIntent.budget * 1.2) {
            priceScore = 0.4;
        } else {
            priceScore = 0.1;
        }
    }
    
    // Metadata score
    Object.keys(parsedIntent.attributes).forEach(attr => {
        if (product.metadata[attr] && 
            product.metadata[attr].toLowerCase().includes(parsedIntent.attributes[attr].toLowerCase())) {
            metadataScore += 0.2;
        }
    });
    metadataScore = Math.min(metadataScore, 1);
    
    return (
        0.35 * textRelevance +
        0.20 * ratingScore +
        0.15 * priceScore +
        0.15 * stockScore +
        0.10 * salesScore +
        0.05 * metadataScore
    );
};

module.exports = { calculateScore };