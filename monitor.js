import { chromium } from 'playwright';
import fetch from 'node-fetch';

const EVENT_URL = 'https://www.eventbrite.ca/e/YOUR_EVENT_ID';

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

async function sendNotification(message) {
  if (!BOT_TOKEN || !CHAT_ID) return;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message
    })
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(EVENT_URL, { waitUntil: 'domcontentloaded' });

  try {
    const available = await page.locator('text=Register').isVisible();
    if (available) {
      await sendNotification('🎉 Eventbrite tickets are AVAILABLE!');
    }
  } catch (e) {
    console.log('Tickets not available');
  }

  await browser.close();
})();
