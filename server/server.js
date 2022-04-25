const { App } = require('@slack/bolt');

require('dotenv').config();
// Initializes your app with your bot token and signing secret

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  // socketMode: true, // alternative socket mode
  // appToken: process.env.APP_TOKEN,
});

/**
 * Schedule command
 *
 * At the moment, for simplicity sake, date is initialized to current date
 *
 * If you want to schedule message for tomorrow, you would input /schedule your-text|1|hours|minutes|seconds
 *
 * The one symbolizes one day after current day
 *
 * This is something that needs to be fixed at some point
 *
 * Another thing to consider is that @channel command does not work and will need additional research to potentially implement
 */
app.command('/schedule', async ({ command, ack, say }) => {
  try {
    await ack();
    const messageId = command.text.split('|');
    const channelId = command.channel_id;
    const message = {
      messageInfo: messageId[0].trim(),
      date: Number(messageId[1].trim()),
      hours: Number(messageId[2].trim()),
      minutes: Number(messageId[3].trim()),
      seconds: Number(messageId[4].trim()),
    };
    const date = new Date();
    date.setDate(date.getDate() + message.date);
    date.setHours(message.hours, message.minutes, message.seconds);
    const newDate = Math.floor(date.getTime() / 1000);
    const result = await app.client.chat.scheduleMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: channelId,
      text: message.messageInfo,
      post_at: newDate,
    });
    console.log(result);
  } catch (error) {
    console.log(error);
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
