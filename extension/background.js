import { GEMINI_API_KEY } from './popup-config.js';

async function findSimilarItems() {
    console.log('Background script: Starting findSimilarItems');

    // 1. Read metadata files
    const currentItemUrl = chrome.runtime.getURL('current_item_metadata.json');
    const retailersUrl = chrome.runtime.getURL('retailer_metadata.json');

    console.log('Reading metadata files...');
    console.log('Current item URL:', currentItemUrl);
    console.log('Retailers URL:', retailersUrl);

    const [currentItemResponse, retailersResponse] = await Promise.all([
        fetch(currentItemUrl),
        fetch(retailersUrl)
    ]);

    const currentItem = await currentItemResponse.json();
    const retailerItems = await retailersResponse.json();

    console.log('Current item loaded:', currentItem);
    console.log('Retailer catalog loaded:', retailerItems.length, 'items');

    // 2. Construct the prompt
    const prompt = `
        You are a fashion expert AI. Based on the current item, find up to 3 similar items from the retailer catalog.
        Prioritize items with a similar style, category, and color.
        Do not include the current item itself in the results.
        
        For each item, include these fields: title, price, shop, and optionally discountType, oldPrice, image, url.
        Return the results as JSON with this format: {"similarItems": [{"title": "...", "price": ..., "shop": "...", "discountType": "...", "oldPrice": ..., "image": "...", "url": "..."}]}

        Current Item: ${JSON.stringify(currentItem, null, 2)}

        Retailer Catalog: ${JSON.stringify(retailerItems, null, 2)}
    `;

    console.log('--- GENERATED PROMPT ---');
    console.log(prompt);
    console.log('------------------------');

    // 3. Call the Gemini API using direct fetch
    try {
        console.log('Making API call to Gemini...');
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        console.log('API response status:', response.status);
        console.log('API response headers:', response.headers);
        
        const data = await response.json();
        console.log('Raw API Response:', data);

        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            let text = data.candidates[0].content.parts[0].text;
            console.log('Raw extracted text:', text);
            
            // Remove markdown wrapper if present
            if (text.includes('```json')) {
                text = text.replace(/```json\s*/, '').replace(/```\s*$/, '');
                console.log('Cleaned JSON text:', text);
            }
            
            // Try to parse JSON response
            try {
                const parsed = JSON.parse(text);
                console.log('SUCCESS: Parsed JSON directly:', parsed);
                
                // Add missing fields to AI items
                if (parsed.similarItems) {
                    console.log('Adding missing fields to', parsed.similarItems.length, 'items');
                    parsed.similarItems = parsed.similarItems.map((item, index) => ({
                        id: `ai-${index}`,
                        title: item.title || 'Unknown Item',
                        price: item.price || 0,
                        shop: item.shop || 'Unknown Shop',
                        image: item.image || null,
                        url: item.url || null,
                        discountType: item.discountType || null,
                        oldPrice: item.oldPrice || null
                    }));
                    console.log('Enhanced items:', parsed.similarItems);
                }
                
                return parsed;
            } catch (parseError) {
                console.error('Failed to parse JSON:', parseError);
                console.error('Text that failed:', text);
                
                // Return dummy data as fallback
                return { 
                    similarItems: [
                        { title: "Test Item 1", price: 29.99, shop: "Test Shop" },
                        { title: "Test Item 2", price: 39.99, shop: "Another Shop" }
                    ]
                };
            }
        } else {
            console.error('Unexpected API response structure:', data);
            console.error('Available keys in response:', Object.keys(data));
            console.error('Full response stringified:', JSON.stringify(data, null, 2));
            
            // Check for common error structures
            if (data.error) {
                console.error('API Error:', data.error);
            }
            if (data.candidates) {
                console.error('Candidates array:', data.candidates);
            }
            
            return { similarItems: [] };
        }

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        
        // Return dummy data to test the flow
        return { 
            similarItems: [
                { title: "Fallback Item 1", price: 19.99, shop: "Fallback Shop" },
                { title: "Fallback Item 2", price: 49.99, shop: "Another Fallback" }
            ]
        };
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'findSimilar') {
        findSimilarItems().then(sendResponse);
        return true; // Indicates that the response is sent asynchronously
    }
});
