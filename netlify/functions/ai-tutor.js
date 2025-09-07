// File: netlify/functions/ai-tutor.js
// FINAL CORRECTED VERSION

const fetch = require('node-fetch');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key is not configured on the server.' }) };
  }

  try {
    const { conversationPayload } = JSON.parse(event.body);
    
    // THE FIX IS HERE: Updated the model name from gemini-pro to a current one.
    const modelName = 'gemini-1.5-flash-latest';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(conversationPayload) 
    });

    const data = await response.json();

    if (!response.ok) {
      return { statusCode: response.status, body: JSON.stringify(data) };
    }

    return { statusCode: 200, body: JSON.stringify(data) };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'An internal server error occurred.' }) };
  }
};
