// This is the updated code for our secure "serverless mailroom."
// It now acts as a simple, secure proxy for the AI.

// The 'node-fetch' library is needed to make network requests from the server.
const fetch = require('node-fetch');

exports.handler = async function(event) {
    // This function runs every time a student makes a request from the app.
    
    // 1. Get the complete conversation payload directly from the request body.
    // The main app is now responsible for constructing the entire payload.
    const { conversationPayload } = JSON.parse(event.body);

    // 2. Access YOUR secret API key from Netlify's environment variables.
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        // If the key is missing, return a server error.
        return { statusCode: 500, body: JSON.stringify({ error: 'API key is not configured on the server.' }) };
    }

    // 3. Prepare the request to send to the Google AI.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    try {
        // 4. Send the exact payload from the app directly to Google's AI.
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(conversationPayload) 
        });

        // If Google's API returns an error, log it and pass it along.
        if (!response.ok) {
            const errorBody = await response.json();
            console.error('Google AI API Error:', errorBody);
            return { statusCode: response.status, body: JSON.stringify({ error: 'An error occurred with the AI service.', details: errorBody }) };
        }

        const data = await response.json();

        // 5. Return the AI's successful response back to the student's browser.
        return { statusCode: 200, body: JSON.stringify(data) };

    } catch (error) {
        // Handle any other unexpected errors during the process.
        console.error('Serverless function error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'An internal server error occurred.' }) };
    }
};

