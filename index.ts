import { App, LogLevel, type BlockButtonAction } from "@slack/bolt";
import { WebClient } from "@slack/web-api"

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

// play command
app.command("/play", async ({ ack, body, client }) => {
    await ack();
    await client.views.open({
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
                    type: "card",
                    icon: {
                        type: "image",
                        image_url: ".images/minesweeper.png",
                        alt_text: "minesweeper"
                    },
                    title: {
                        type: "mrkdwn",
                        text: "minesweeper",
                        verbatim: false
                    },
                    subtitle: {
                        type: "mrkdwn",
                        text: "eliminate the mines",
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
                            value: "minesweeper"
                        }
                    ]
                },
                {
                    type: "card",
                    icon: {
                        type: "image",
                        image_url: "./images/number_guesser.png",
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
                {
                    type: "card",
                    icon: {
                        type: "image",
                        image_url: "./images/tic_tac_toe.png",
                        alt_text: "tic tac toe"
                    },
                    title: {
                        type: "mrkdwn",
                        text: "tic tac toe",
                        verbatim: false
                    },
                    subtitle: {
                        type: "mrkdwn",
                        text: "tic, tac, and toe",
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
                            value: "tic_tac_toe"
                        }
                    ]
                },
                {
                    type: "card",
                    icon: {
                        type: "image",
                        image_url: "./images/wordle.png",
                        alt_text: "wordle"
                    },
                    title: {
                        type: "mrkdwn",
                        text: "wordle",
                        verbatim: false
                    },
                    subtitle: {
                        type: "mrkdwn",
                        text: "guess the word",
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
                            value: "wordle"
                        }
                    ]
                }
            ]
        },
    });
});

app.action<BlockButtonAction>("select_game", async ({ ack, body, client, action }) => {
    await ack();
    const gameId = action.value;
    const game = games[gameId as keyof typeof games];
    if (!game) {
        console.error(`unknown game: ${gameId}`);
        return;
    }
    await client.views.update({
        view_id: body.view!.id,
        hash: body.view!.hash,
        view: game.createView() as any,
    });
});

await app.start();

// to do:
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

// the /play command should: send a message with buttons in it