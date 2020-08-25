import echo from "../services/player/echo"
import commands from "../services/player/commands";

export default async ({}) => {
    await echo({});
    await commands({});
}