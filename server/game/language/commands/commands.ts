import * as Messages from '../../../../common/messages';
import { InternalEventBus } from '../../../events/internalevents';
import { InternalEvent } from '../../../events/internalevent';
import Player from '../../player';
import validator from 'validator';
import { AllWorlds } from '../../../services/worlds';
import { matchesPuncuation, replacePunctuation } from '../../../lib/util';
import { CreateInstance, DefaultInstance, FindInstance } from '../../../services/instancemanager';
import players, { LookupPlayer, LookupPlayerByDisplayname } from '../../../services/players';
import { GameEventBus } from '../../../events/gameevents';
import { GameEvent } from '../../../events/gameevent';
import { ProcessingStage } from '../../../events/processingstage';

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
            const cleaned = replacePunctuation(msg.args);
            ply.world()?.Broadcast('<span class="ooc"><span class="ooc-prefix">' + ply.authUser.displayname + ' to all:</span> ' + cleaned + '</span>');
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

        if (!validator.isAlpha(msg.args)) {
            ply.sendMessage('<span class="command-error">Names must be comprised of letters only.</span>');
            return;
        }
        // FOR TESTING ONLY
        if (!validator.isLength(msg.args, { max: 20, min: 1 })) {
            ply.sendMessage('<span class="command-error">Names should be between 5 and 20 characters.</span>');
            return;
        }

        if (LookupPlayerByDisplayname(msg.args)) {
            ply.sendMessage('<span class="command-error">A player with that name already exists.</span>');
            return;
        }

        ply.authUser.displayname = validator.escape(msg.args);
        ply.___save();
        ply.sendMessage('<span class="command-output">You\'ve changed your display name to "' + ply.authUser.displayname + '"</span>');

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
            if (GameEventBus.dispatch(GameEvent.CREATE_INSTANCE, ProcessingStage.PRE, {
                ply: ply,
                inst: ply.world(),

                msg: {
                    name: args[1],
                    type: args[0],
                },
            })) {
                console.log('Instance creation cancelled');
                return;
            }
            try {
                const inst = CreateInstance(x, args[1]);
                ply.world()?.removePlayer(ply);
                inst.addPlayer(ply);
                GameEventBus.dispatch(GameEvent.CREATE_INSTANCE, ProcessingStage.POST, {
                    ply: ply,
                    inst: ply.world(),

                    msg: {
                        name: args[1],
                        type: args[0],

                        inst: inst,
                    },
                });
                return true;
            } catch (e) {
                ply.sendMessage(`<span class="command-error">Failed to create instance, ${e}</span>`);
                return false;
            }
        });

        if (found) {
            ply.sendMessage('<span class="command-output">Successfully started a new session ' + args[1] + '</span>');
        } else {
            ply.sendMessage('<span class="command-error">No createable instance with that name found.</span>');
        }
    } else if (msg.cmd == 'exit') {
        if (ply.world() == DefaultInstance()) {
            ply.sendMessage('<span class="command-error">You can\'t back out of the base instance.</span>');
        }

        ply.world()?.removePlayer(ply);
        DefaultInstance().addPlayer(ply);
    } else if (msg.cmd == 'join') {
        if (!args || args.length != 1) {
            ply.sendMessage('<span class="command-error">Join instance expects exactly one word, the name of the instance to join.</span>');
            return;
        }
        const inst = FindInstance(args[0]);
        if (!inst) {
            ply.sendMessage(`<span class="command-error">Could not find an instance called "${args[0]}".</span>`);
            return;
        }
        ply.world()?.removePlayer(ply);
        inst.addPlayer(ply);
        ply.sendMessage(`Joining instance ${args[0]}`);
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
    InternalEventBus.onEvent(InternalEvent.MESSAGE_IN, ({ ply, message }: { ply: Player, message: Messages.Msg }) => {
        if (message.type == Messages.ClientMessage.TEXT_INPUT) {
            const body = ((message.body as any).input as string).trim().toLowerCase();
            if (body.startsWith('/')) {
                handleCommand(ply, splitCommand(body));
            }
        }
    });
};
