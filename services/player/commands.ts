import * as Messages from '../../types/messages';
import { EventBus } from '../eventbus';
import { AlfEvent } from '../../types/events';
import Player from '../../types/game/player';
import validator from 'validator';
import players from '../players';
import { AllWorlds } from '../../loaders/worlds';
import { matchesPuncuation } from '../../lib/util';
import { CreateInstance, DefaultInstance } from '../instancemanager';

const wsRe = /.*\s+.*/;

function splitCommand(msg: string): { cmd: string, args: string | undefined } | undefined {
    const commandRe = /\/([a-zA-Z0-9\.\+\-\/]*)\s*(.*)/;
    const matches = msg.match(commandRe);
    if (!matches) {
        return undefined;
    }
    return {
        cmd: matches[1],
        args: matches[2],
    }
}

function fixWhitespace(input: string | undefined): string | undefined {
    return input?.trim().replace(/\s{2,}/g, ' ');
}

function handleCommand(ply: Player, msg: { cmd: string, args: string | undefined } | undefined): void {
    if (!msg) {
        return;
    }


    const args = fixWhitespace(msg.args)?.toLowerCase().split(' ');
    if (msg.cmd == '/' || msg.cmd == 'ooc') {
        if (!msg.args) {
            return;
        } else {
            ply.location?.fromWorld.Broadcast('<span class="ooc"><span class="ooc-prefix">' + ply.authUser.displayname + ' to all:</span> ' + msg.args + '</span>');
        }
    } else if (msg.cmd == 'dname' || msg.cmd == 'displayname') {
        if (!msg.args) {
            ply.sendMessage('<span class="command-error">Please provide a new displayname</span>');
            return;
        }
        if (msg.args.match(wsRe)) {
            ply.sendMessage('<span class="command-error">Names must only be one word.</span>');
            return;
        }
        if (matchesPuncuation(msg.args)) {
            ply.sendMessage('<span class="command-error">Names should not contain control characters or punctuation.</span>');
            return;
        }
        // FOR TESTING ONLY
        if (!validator.isLength(msg.args, { max: 20, min: 1 })) {
            ply.sendMessage('<span class="command-error">Names should be between 5 and 20 characters.</span>');
            return;
        }

        ply.authUser.displayname = validator.escape(msg.args);
        ply.___save();
        ply.sendMessage('<span class="command-output">You\'ve changed your display name to: ' + ply.authUser.displayname + '</span>');

    } else if (msg.cmd == 'allworlds' || msg.cmd == 'worlds' || msg.cmd == 'availableworlds') {
        const filteredWorlds = AllWorlds().filter((x) => x.loadable);
        let output = '<span class="world-print">Available Worlds:<br><ul>'
        filteredWorlds.forEach((w) => output = output + '\t<li>' + w.name + ' (' + w.shortName + ')</li>')
        output = output + '</ul></span>';
        ply.sendMessage(output);
    } else if (msg.cmd =='createinstance' || msg.cmd == 'create') {
        if (!args|| args.length != 2) {
            ply.sendMessage('<span class="command-error">Create instance expects exactly two words, the world type and an instance name.</span>');
            return
        }
        
        const found = AllWorlds().filter((x) => x.loadable).filter(x => x.shortName.toLowerCase() == args[0]).some(x => {
            const inst = CreateInstance(x, args[1]);
            ply.location?.fromWorld.removePlayer(ply);
            inst.addPlayer(ply);
            console.log("With lexicon %O", inst.WorldLexicon());
            return true;
        });

        if (found) {
            ply.sendMessage('<span class="command-output">Successfully started a new session ' + args[1] + '</span>');
        } else {
            ply.sendMessage('<span class="command-error">No createable instance with that name found.</span>');
        }
    } else if (msg.cmd == 'exit') {
        if (ply.location?.fromWorld == DefaultInstance()) {
            ply.sendMessage('<span class="command-error">You can\'t back out of the base instance.</span>');
        }

        ply.location?.fromWorld.removePlayer(ply);
        DefaultInstance().addPlayer(ply);
    } else if (msg.cmd == 'echo') {
        const reply = msg.args?.trim();
        ply.sendMessage('> <i>' + reply + '</i>');
    } else if (msg.cmd == 'help') {
        const msg = "Known Commands:<br>" +
            "/dname <name>: change your name<br>" +
            "/worlds: List all available worlds (short names shown in parens)<br>" + 
            "//: Talk out of character to all players<br>" +
            "/create <world_name> <instance_name>: Create a new instance, world name is the short name from the list in /worlds<br>";
        ply.sendMessage('<span class="help-message">'+msg+'<br></span>');
    }
    else {
        ply.sendMessage('<span class="command-error">Unknown command: ' + msg.cmd + '</span>');
    }
    return;
};

export default async ({ }) => {
    EventBus.onEvent(AlfEvent.MESSAGE_IN, ({ ply, message }: { ply: Player, message: Messages.Msg }) => {
        if (message.type == Messages.ClientMessage.TEXT_INPUT) {
            const body = ((message.body as any).input as string).trim().toLowerCase();
            if (body.startsWith('/')) {
                handleCommand(ply, splitCommand(body));
            }
        }
    });
};
