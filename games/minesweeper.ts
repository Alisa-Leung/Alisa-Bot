export const Minesweeper = {
    createView,
};

function createView(){
    return {
        type: "modal",
        callback_id: "minesweeper",
        title: {
            type: "plain_text",
            text: "minesweeper",
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