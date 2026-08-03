const express = require('express');
const https = require('https');
const app = express();

const BOT_TOKEN = '8895411616:AAHxkQPIkuTsQjOfp2MhcYfTN1hlt7UrlN4';
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

let lastUpdateId = 0;

// Helper to make HTTPS requests
function telegramRequest(endpoint, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(`${API_URL}${endpoint}`);
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Termux-Bot/1.0'
      },
      timeout: 35000 // 10 second timeout
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error('Failed to parse JSON response'));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
    
    req.write(postData);
    req.end();
  });
}

// Function to send a message
async function sendMessage(chatId, text, options = {}) {
  const data = {
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown',
    ...options
  };
  
  try {
    await telegramRequest('/sendMessage', data);
  } catch (error) {
    console.error('Error sending message:', error.message);
  }
}

// Function to get updates (Short Polling)
async function getUpdates() {
  const offset = lastUpdateId + 1;
  const endpoint = '/getUpdates?offset=' + offset + '&timeout=30'; // 5 second timeout
  
  try {
    const result = await telegramRequest(endpoint, {});
    if (result.ok && result.result.length > 0) {
      result.result.forEach(update => {
        lastUpdateId = update.update_id;
        handleUpdate(update);
      });
    }
  } catch (error) {
  console.error(error);
}
  
  // Check again every 3 seconds
  setTimeout(getUpdates, 3000);
}

// Handle incoming updates
function handleUpdate(update) {
  const msg = update.message;
  if (!msg) return;

  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    const pin = Math.floor(1000 + Math.random() * 9000);
    const registerUrl = `http://localhost:3000?pin=${pin}`;
    const message = `👋 Hello ${msg.from.first_name}!\n\nYour registration PIN is:\n🔑 **${pin}**\n\nClick the button below to register:`;
    
    sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '✅ Register Now', url: registerUrl }]
        ]
      }
    });
  }
}

// Start polling
function startPolling() {
  console.log('Bot started short-polling...');
  getUpdates();
}

// Start Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startPolling();
});
