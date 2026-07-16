export const Wordle = {
    createView,
};

function createView() {
    return {
        type: "modal",
        callback_id: "wordle",
        title: {
            type: "plain_text",
            text: "wordle",
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