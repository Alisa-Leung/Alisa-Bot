import { App, LogLevel } from "@slack/bolt";
import { WebClient } from "@slack/web-api"

const userClient = new WebClient(Bun.env.SLACK_USER_TOKEN);

const app = new App({
    token: process.env.SLACK_USER_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true,
    logLevel: LogLevel.DEBUG,
});

// when alisa sends a message
app.message(async (event) => {
    console.log("message event");
    console.dir(event.payload, { depth: null });
    if (event.payload.subtype) return;
    if (event.payload.user !== 'U08STAQPGUR') return;
    await event.say("wow what a cool message");
});

// when someone joins the channel
app.event('member_joined_channel', async ({ event, client, logger }) => {
    try {
        const userId = event.user;
        const channelId = event.channel;
        if (channelId !== 'C0BHGKC7P51') return;
        await client.chat.postMessage({
            channel: channelId,
            text: `welcome to the channel, <@${userId}>! :D`,
        });
    } catch (error) {
        logger.error('error handling member_joined_channel event: ', error);
    }
});

// when someone leaves the channel
app.event('member_left_channel', async ({ event, client, logger }) => {
    try {
        const userId = event.user;
        const channelId = event.channel;
        if (channelId !== 'C0BHGKC7P51') return;
        await client.chat.postMessage({
            channel: channelId,
            text: `bye bye, <@${userId}> :(`,
        });
    } catch (error) {
        logger.error('error handling member_left_channel event: ', error);
    }
});

await app.start();

// to do:
// send welcome message when user joins channel
// play music when users are in huddle
// track amount of time that users are in huddles

// users can:
// see their total amount of hours spent in huddles
// earn coins for the amount of time they spend in huddles
// spend coins on games to play in huddles --> after spending 30 minutes in a huddle, the bot will ping users

// running a game through a canvas
// searching messages
// pinning messages
// uploading and messing around with files
// messing around with custom emojis --> apples to apples but with custom slack emojis
// changing statuses?
// dialogs? --> they act as modals where you can input information