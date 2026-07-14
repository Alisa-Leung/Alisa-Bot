import { App } from "@slack/bolt";
import { WebClient } from "@slack/web-api"

const userClient = new WebClient(Bun.env.SLACK_TOKEN);

const app = new App({
    token: process.env.SLACK_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true,
});

console.log("Hello via Bun!");

app.message(async (event) => {
    if (event.payload.subtype) return;
    if (event.payload.user !== 'U08STAQPGUR') return;
    await userClient.chat.postMessage({
        channel: event.payload.channel,
        text: "wowee cool message"
    });
});

await app.start();