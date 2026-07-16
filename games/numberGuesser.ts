export const NumberGuesser = {
    createView,
};

function createView() {
    return {
        type: "modal",
        callback_id: "number_guesser",
        title: {
            type: "plain_text",
            text: "number guesser",
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