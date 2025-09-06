// This is the code for our "serverless mailroom."
// It runs securely on a server, not in the student's browser.

// The 'fetch' function is needed to make network requests.
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // This function runs every time a student makes a request from the app.

    // 1. Get the student's conversation history from the request.
    const { conversationHistory, prompt } = JSON.parse(event.body);

    // 2. Access YOUR secret API key.
    // This is stored securely in Netlify's settings, not in the code.
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'API key is not configured.' })
        };
    }

    // 3. Prepare the request to send to the Google AI.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    const requestBody = {
        contents: [...conversationHistory, { role: 'user', parts: [{ text: prompt }] }]
    };

    try {
        // 4. Send the request to Google's AI on the student's behalf.
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            // If Google's API returns an error, pass it along.
            const errorBody = await response.json();
            console.error('Google AI API Error:', errorBody);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: 'An error occurred with the AI service.', details: errorBody })
            };
        }

        const data = await response.json();

        // 5. Return the AI's successful response back to the student's browser.
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('Serverless function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An internal error occurred.' })
        };
    }
};
