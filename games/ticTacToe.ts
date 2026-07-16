export const TicTacToe = {
    createView,
};

function createView(userId: string) {
    return {
        type: "modal",
        callback_id: "tic_tac_toe",
        title: {
            type: "plain_text",
            text: "tic tac toe",
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
                    text: "placeholder"
                }
            }
        ]
    }
}