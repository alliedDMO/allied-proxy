// netlify/functions/api.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz3KSQcYcUyPQg4ima1CJ7OZpNPLi9FOnd5AroX-D_KfJtSf5IvwlgRl-kRQT6-a5dF/exec';

  try {
    // Forward the request
    const response = await fetch(APPS_SCRIPT_URL, {
      method: event.httpMethod || 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: event.body || JSON.stringify({ action: "login", password: "qqq" }), // fallback for testing
    });

    const data = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
      body: data,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};