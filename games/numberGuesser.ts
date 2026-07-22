import { WebClient } from "@slack/web-api"
import { supabase } from "../supabase";

export const NumberGuesser = {
    createView,
    handleGuess,
    updateLeaderboard
};

interface GameState {
    target: number;
    attempts: number;
}

interface LeaderboardEntry {
    userId: string;
    username: string;
    tries: number;
}

const activeGames: Record<string, GameState> = {};

function updateView(message = "guess my number! im thinking of a number between 1 and 100") {
    return {
        type: "modal",
        callback_id: "number_guesser",
        title: {
            type: "plain_text",
            text: "number guesser",
        },
        submit: {
            type: "plain_text",
            text: "guess"
        },
        close: {
            type: "plain_text",
            text: "exit",
        },
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: message
                }
            },
            {
                type: "input",
                block_id: "guess",
                label: {
                    type: "plain_text",
                    text: "your guess"
                },
                element: {
                    type: "plain_text_input",
                    action_id: "number"
                }
            }
        ]
    }
}

function createView(userId: string) {
    const target = Math.floor(Math.random() * 100) + 1;
    activeGames[userId] = {
        target,
        attempts: 0
    };

    return updateView();
}

function winView(attempts: number) {
    return {
        type: "modal",
        callback_id: "number_guesser",
        title: {
            type: "plain_text",
            text: "number guesser"
        },
        close: {
            type: "plain_text",
            text: "close"
        },
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `you guessed it!\n\n` + `total attempts: ${attempts}`
                }
            },
            {
                type: "actions",
                elements: [
                    {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: "play again"
                        },
                        action_id: "play_again",
                        value: "number_guesser"
                    }
                ]
            }
        ]
    }
}

async function handleGuess({ ack, body, view, client }: { ack: (response?: any) => Promise<unknown>; body: any; view: any; client: any }) {
    const userId = body.user.id;
    const game = activeGames[userId];
    if (!game) {
        return;
    }
    const guess = Number(view.state.values.guess.number.value);
    game.attempts++;
    if (guess === game.target) {
        delete activeGames[userId];
        await ack({
            response_action: "update",
            view: winView(game.attempts)
        });
        await updateLeaderboard(client, userId, game.attempts);
        return;
    }
    let message = guess < game.target ? `too low!\n\n` + `your attempts: ${game.attempts}` : `too high!\n\n` + `your attempts: ${game.attempts}`;
    await ack({
        response_action: "update",
        view: updateView(message)
    });
}

async function updateLeaderboard(client: WebClient, userId: string, tries: number) {
    const userInfo = await client.users.info({ user: userId });
    const username = userInfo.user?.profile?.display_name || userInfo.user?.real_name || userInfo.user?.name || "unknown";
    const { data: existing, error } = await supabase.from("number_guesser").select("*").eq("user_id", userId).maybeSingle();
    if (error) throw error;
    if (!existing) {
        await supabase.from("number_guesser").insert({
            user_id: userId,
            username,
            best_tries: tries
        });
    } else if (tries < existing.best_tries) {
        await supabase.from("number_guesser").update({
            best_tries: tries,
            username
        }).eq("user_id", userId);
    }
    await updateLeaderboardCanvas(client);
}

async function updateLeaderboardCanvas(client: WebClient) {
    const { data, error } = await supabase.from("number_guesser").select("*").order("best_tries", { ascending: true }).limit(10);
    if (error) throw error;
    const text = `the leaderboard for the best number guessers\n\n` + data.map((entry, index) => `${index + 1}. ![](@${entry.user_id}) - ${entry.best_tries} tries`).join("\n");
    await client.canvases.edit({
        canvas_id: "F0BHS9UE5Q9",
        changes: [
            {
                operation: "replace",
                document_content: {
                    type: "markdown",
                    markdown: text
                }
            }
        ]
    })
}