import echo from "./commands/echo"
import commands from "./commands/commands";
import inputparsing from "./inputparsing";
import baseverbs from "./verbs/baseverbs";
import promoteadmin from "./commands/promoteadmin";
import { AlfheimConfig } from "../../services/configuration";

export default async (config: AlfheimConfig) => {
    await echo({});
    await commands({});
    await inputparsing({});
    await baseverbs({});
    await promoteadmin(config);
}