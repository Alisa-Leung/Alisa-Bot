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