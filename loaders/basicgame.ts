import echo from "../services/player/echo"
import commands from "../services/player/commands";
import inputparsing from "../services/player/inputparsing";
import baseverbs from "../verbs/baseverbs";

export default async ({}) => {
    await echo({});
    await commands({});
    await inputparsing({});
    await baseverbs({});
}