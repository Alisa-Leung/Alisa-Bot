import { App, LogLevel } from "@slack/bolt";
import { WebClient } from "@slack/web-api"

const userClient = new WebClient(Bun.env.SLACK_USER_TOKEN);

const app = new App({
    token: process.env.SLACK_USER_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true,
    logLevel: LogLevel.DEBUG,
});

app.message(async (event) => {
    console.log("message event");
    console.dir(event.payload, { depth: null });
    if (event.payload.subtype) return;
    if (event.payload.user !== 'U08STAQPGUR') return;
    await event.say("wow what a cool message");
});

await app.start();

// to do:
// join slack huddle when user joins huddle
// leave slack huddle when user leaves huddle
// send welcome message when user joins channel
// play music when users are in huddle
// track amount of time that users are in huddles

// users can:
// see their total amount of hours spent in huddles
// earn coins for the amount of time they spend in huddles
// spend coins on games to play in huddles --> after spending 30 minutes in a huddle, the bot will ping users