import { App, LogLevel, type BlockButtonAction } from "@slack/bolt";
import { WebClient } from "@slack/web-api"
import type { ModalView } from "@slack/types"

import { TicTacToe } from "./games/ticTacToe";
import { Minesweeper } from "./games/minesweeper";
import { NumberGuesser } from "./games/numberGuesser";
import { Wordle } from "./games/wordle";

const userClient = new WebClient(Bun.env.SLACK_USER_TOKEN);

const app = new App({
    token: process.env.SLACK_USER_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true,
    logLevel: LogLevel.DEBUG,
});

const games = {
    tic_tac_toe: TicTacToe,
    minesweeper: Minesweeper,
    number_guesser: NumberGuesser,
    wordle: Wordle,
};

// when specific user sends a message
app.message(async (event) => {
    console.log("message event");
    console.dir(event.payload, { depth: null });
    if (event.payload.channel !== 'C0BHGKC7P51') return;
    if (event.payload.subtype) return;
    if (event.payload.user !== process.env.SLACK_USER_ID) return;
    await event.say("wow what a cool message");
});

// when someone pings alisabot
app.message(async ({ message, client }) => {
    if (!("text" in message)) return;
    if (!message.text?.includes("<@U0BHE6A3V33>")) return;
    if (message.channel !== 'C0BHGKC7P51') return;
    await client.chat.postMessage({
        channel: message.channel,
        text: `hi <@${message.user}>! you pinged me :D`
    })
})

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

function playCommand(body: any): { trigger_id: string; view: ModalView; } {
    return {
        trigger_id: body.trigger_id,
        view: {
            type: "modal",
            callback_id: "play_modal",
            title: {
                type: "plain_text",
                text: "games"
            },
            close: {
                type: "plain_text",
                text: "cancel",
            },
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: "game selection"
                    },
                },
                {
                    type: "context",
                    elements: [
                        {
                            type: "plain_text",
                            text: "what game would you like to play? select a game below to get started!"
                        }
                    ]
                },
                {
                    type: "divider"
                },
                // {
                //     type: "card",
                //     icon: {
                //         type: "image",
                //         image_url: "https://cdn.hackclub.com/019f698a-2eed-742a-b6a8-fe4ebc178833/minesweeper.png",
                //         alt_text: "minesweeper"
                //     },
                //     title: {
                //         type: "mrkdwn",
                //         text: "minesweeper",
                //         verbatim: false
                //     },
                //     subtitle: {
                //         type: "mrkdwn",
                //         text: "eliminate the mines",
                //         verbatim: false
                //     },
                //     actions: [
                //         {
                //             type: "button",
                //             text: {
                //                 type: "plain_text",
                //                 text: "play"
                //             },
                //             action_id: "select_game",
                //             value: "minesweeper"
                //         }
                //     ]
                // },
                {
                    type: "card",
                    icon: {
                        type: "image",
                        image_url: "https://cdn.hackclub.com/019f698a-322e-7158-ac41-b0b89224384b/number_guesser.png",
                        alt_text: "number guesser"
                    },
                    title: {
                        type: "mrkdwn",
                        text: "number guesser",
                        verbatim: false
                    },
                    subtitle: {
                        type: "mrkdwn",
                        text: "guess the number",
                        verbatim: false
                    },
                    actions: [
                        {
                            type: "button",
                            text: {
                                type: "plain_text",
                                text: "play"
                            },
                            action_id: "select_game",
                            value: "number_guesser"
                        }
                    ]
                },
                // {
                //     type: "card",
                //     icon: {
                //         type: "image",
                //         image_url: "https://cdn.hackclub.com/019f698a-2b6a-776a-aae8-1113e24c9ffa/tic_tac_toe.png",
                //         alt_text: "tic tac toe"
                //     },
                //     title: {
                //         type: "mrkdwn",
                //         text: "tic tac toe",
                //         verbatim: false
                //     },
                //     subtitle: {
                //         type: "mrkdwn",
                //         text: "tic, tac, and toe",
                //         verbatim: false
                //     },
                //     actions: [
                //         {
                //             type: "button",
                //             text: {
                //                 type: "plain_text",
                //                 text: "play"
                //             },
                //             action_id: "select_game",
                //             value: "tic_tac_toe"
                //         }
                //     ]
                // },
                // {
                //     type: "card",
                //     icon: {
                //         type: "image",
                //         image_url: "https://cdn.hackclub.com/019f698a-377b-76f4-ad29-8d45146f018b/wordle.png",
                //         alt_text: "wordle"
                //     },
                //     title: {
                //         type: "mrkdwn",
                //         text: "wordle",
                //         verbatim: false
                //     },
                //     subtitle: {
                //         type: "mrkdwn",
                //         text: "guess the word",
                //         verbatim: false
                //     },
                //     actions: [
                //         {
                //             type: "button",
                //             text: {
                //                 type: "plain_text",
                //                 text: "play"
                //             },
                //             action_id: "select_game",
                //             value: "wordle"
                //         }
                //     ]
                // }
            ]
        },
    }
}

// play command
app.command("/play", async ({ ack, body, client }) => {
    await ack();
    client.views.open(playCommand(body)).catch(console.error);
});

// game handler
app.action<BlockButtonAction>("select_game", async ({ ack, body, client, action }) => {
    ack();
    const game = games[action.value as keyof typeof games];
    if (!game) {
        return;
    }
    const view = game.createView(body.user.id);
    await client.views.update({
        view_id: body.view!.id,
        hash: body.view!.hash,
        view: view as any,
    });
});

// replay
app.action<BlockButtonAction>("play_again", async ({ ack, body, client, action }) => {
    ack();
    const gameId = action.value;
    const game = games[gameId as keyof typeof games];
    if (!game) {
        console.error(`unknown game: ${gameId}`);
        return;
    }
    await client.views.update({
        view_id: body.view!.id,
        hash: body.view!.hash,
        view: game.createView(body.user.id) as any
    });
})

app.view("number_guesser", async ({ ack, body, view, client }) => {
    console.log("view handler called");
    await NumberGuesser.handleGuess({ ack, body, view, client });
});

await app.start();