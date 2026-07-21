# Alisa Bot

Alisa Bot (wow, me) is a Slack selfbot built using TypeScript, Bun, Supabase, and Slack Bolt. It has some pretty cool features you can try out yourself on the Hack Club Slack!

### Key Features:
* Welcome and goodbye channel messages
* Responds to mentions
* Slash command for popup games
* Slack canvas leaderboard built using Supabase

### Requirements:


### Instructions for Selfhosting:
1. Clone the repository
```
git clone https://github.com/Alisa-Leung/Alisa-Bot.git
cd Alisa-Bot
```
2. Install dependencies
```
bun install
bun add @slack/bolt
bun add @slack/socket-mode
bun add @slack/web-api
bun add @supabase/supabase-js
```
3. Create a Slack app
* Go to https://api.slack.com/apps and create a new app
* Enable Socket Mode, Event Subscriptions, and Slash Commands
* OAuth & Permissions > Bot Token Scopes:
  * channels:history
  * commands
* OAuth & Permissions > User Token Scopes:
  * canvases:read
  * canvases:write
  * channels:history
  * channels:read
  * chat:write
* Event Subscriptions:
  * member_joined_channel
  * member_left_channel
  * message.channels
* Slash Commands:
  * /play
4. Installation
* Copy your:
  * Slack Bot Token
  * Slack User Token
  * Slack App Token
5. Supabase
* Create a table called `number_guesser` in a new Supabase project
* Populate the table with the following columns: `user_id [text]`, `username [text]`, and `best_tries [int4]`
* Copy your:
  * Supabase URL
  * Supabase Service Role Key
6. Environment Variables
* Create a `.env` file to store your environment variables, and fill in the following values
```
SLACK_TOKEN = YOUR_SLACK_BOT_TOKEN
SLACK_USER_TOKEN = YOUR_SLACK_USER_TOKEN
SLACK_APP_TOKEN = YOUR_SLACK_USER_TOKEN
SLACK_USER_ID = YOUR_SLACK_USER_ID
SUPABASE_URL = YOUR_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY = YOUR_SUPABASE_SERVICE_ROLE_KEY
```
7. Run it!
```
bun run index.ts
```
