// src/utils/handleLogger.js
import { IncomingWebhook } from '@slack/webhook';

const webhook = process.env.SLACK_WEBHOOK 
  ? new IncomingWebhook(process.env.SLACK_WEBHOOK)
  : null;

export const loggerStream = {
  write: (message) => {
    const is5xx = /"\s*5\d\d\s/.test(message) || /status\s*:\s*5\d\d/i.test(message);

    if (webhook && is5xx) {
      webhook.send({
        text: `${new Date().toISOString()}: API*\n\`\`\`${message}\`\`\``
      }).catch(err => console.error('Error sent to Slack:', err));
    }

    console.error(message);
  }
};

export const sendSlackNotification = async (message) => {
  const is5xx = /5\d\d/.test(message);

  if (webhook && is5xx) {
    try {
      await webhook.send({ text: message });
    } catch (err) {
      console.error('Error sent to Slack:', err);
    }
  }
};

// await sendSlackNotification(`${new Date().toISOString()} : POST /api/user - ERROR_DURING_CREATION`);