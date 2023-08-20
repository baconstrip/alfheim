import echo from "./commands/echo"
import commands from "./commands/commands";
import inputparsing from "./inputparsing";
import baseverbs from "./verbs/baseverbs";

export default async ({}) => {
    await echo({});
    await commands({});
    await inputparsing({});
    await baseverbs({});
}