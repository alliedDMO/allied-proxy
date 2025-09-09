// netlify/functions/api.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz3KSQcYcUyPQg4ima1CJ7OZpNPLi9FOnd5AroX-D_KfJtSf5IvwlgRl-kRQT6-a5dF/exec';

  try {
    const method = event.httpMethod || 'POST';
    const headers = {
      'Content-Type': 'application/json',
    };

    const options = {
      method,
      headers,
    };

    // Only include body for non-GET requests
    if (method !== 'GET' && method !== 'HEAD') {
      options.body = event.body;
    }

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(APPS_SCRIPT_URL, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await response.text();

    // ALWAYS return CORS headers — even on error
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
      body: data,
    };
  } catch (error) {
    console.error('Proxy error:', error.message);

    // STILL return CORS headers on error
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Proxy request failed',
        details: error.message,
      }),
    };
  }
};

