import echo from "../services/player/echo"
import commands from "../services/player/commands";
import inputparsing from "../services/player/inputparsing";

export default async ({}) => {
    await echo({});
    await commands({});
    await inputparsing({});
}