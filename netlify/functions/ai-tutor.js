// File: netlify/functions/ai-tutor.js
// VERSION WITH DEBUG LOGGING

const fetch = require('node-fetch');

exports.handler = async function(event) {
  console.log("--- ai-tutor function started. ---"); // Log that the function is running

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // --- Step 1: Get the API Key and LOG what we find ---
  const apiKey = process.env.GOOGLE_API_KEY;
  
  // THIS IS THE MOST IMPORTANT LOG: It tells us if the key was found.
  console.log("Is GOOGLE_API_KEY present in environment?", apiKey ? "Yes" : "No");

  // If the key exists, log the first 5 characters to confirm it's not empty.
  if (apiKey) {
    console.log("API Key starts with:", apiKey.substring(0, 5));
  }
  
  if (!apiKey) {
    console.error("CRITICAL: API key is missing from environment variables.");
    return { statusCode: 500, body: JSON.stringify({ error: 'API key is not configured on the server.' }) };
  }

  try {
    const { conversationPayload } = JSON.parse(event.body);
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(conversationPayload) 
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error response from Google AI:', data);
      return { statusCode: response.status, body: JSON.stringify(data) };
    }

    console.log("--- Successfully received response from Google. ---");
    return { statusCode: 200, body: JSON.stringify(data) };

  } catch (error) {
    console.error('Catastrophic error in function execution:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'An internal server error occurred.' }) };
  }
};
