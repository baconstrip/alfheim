import echo from "../player/echo"
import commands from "../player/commands";
import inputparsing from "../player/inputparsing";
import baseverbs from "../verbs/baseverbs";

export default async ({}) => {
    await echo({});
    await commands({});
    await inputparsing({});
    await baseverbs({});
}