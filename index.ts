import { App } from "@slack/bolt";

const app = new App({
    token: process.env.SLACK_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true,
});

console.log("Hello via Bun!");

app.message(async (event) => {
    if (event.payload.subtype) return;
    if (event.payload.user !== 'U08STAQPGUR') return;
    await event.say("wow what a cool message");
});

await app.start();