import * as Messages from '../../types/messages';
import { EventBus } from '../eventbus';
import { AlfEvent } from '../../types/events';
import Player from '../../types/game/player';
import validator from 'validator';
import players from '../players';
import { AllWorlds } from '../../loaders/worlds';

// From https://stackoverflow.com/questions/4328500/how-can-i-strip-all-punctuation-from-a-string-in-javascript-using-regex .
const punctuationRe = /[!-/:-@[-`{-~¡-©«-¬®-±´¶-¸»¿×÷˂-˅˒-˟˥-˫˭˯-˿͵;΄-΅·϶҂՚-՟։-֊־׀׃׆׳-״؆-؏؛؞-؟٪-٭۔۩۽-۾܀-܍߶-߹।-॥॰৲-৳৺૱୰௳-௺౿ೱ-ೲ൹෴฿๏๚-๛༁-༗༚-༟༴༶༸༺-༽྅྾-࿅࿇-࿌࿎-࿔၊-၏႞-႟჻፠-፨᎐-᎙᙭-᙮᚛-᚜᛫-᛭᜵-᜶។-៖៘-៛᠀-᠊᥀᥄-᥅᧞-᧿᨞-᨟᭚-᭪᭴-᭼᰻-᰿᱾-᱿᾽᾿-῁῍-῏῝-῟῭-`´-῾\u2000-\u206e⁺-⁾₊-₎₠-₵℀-℁℃-℆℈-℉℔№-℘℞-℣℥℧℩℮℺-℻⅀-⅄⅊-⅍⅏←-⏧␀-␦⑀-⑊⒜-ⓩ─-⚝⚠-⚼⛀-⛃✁-✄✆-✉✌-✧✩-❋❍❏-❒❖❘-❞❡-❵➔➘-➯➱-➾⟀-⟊⟌⟐-⭌⭐-⭔⳥-⳪⳹-⳼⳾-⳿⸀-\u2e7e⺀-⺙⺛-⻳⼀-⿕⿰-⿻\u3000-〿゛-゜゠・㆐-㆑㆖-㆟㇀-㇣㈀-㈞㈪-㉃㉐㉠-㉿㊊-㊰㋀-㋾㌀-㏿䷀-䷿꒐-꓆꘍-꘏꙳꙾꜀-꜖꜠-꜡꞉-꞊꠨-꠫꡴-꡷꣎-꣏꤮-꤯꥟꩜-꩟﬩﴾-﴿﷼-﷽︐-︙︰-﹒﹔-﹦﹨-﹫！-／：-＠［-｀｛-･￠-￦￨-￮￼-�]|\ud800[\udd00-\udd02\udd37-\udd3f\udd79-\udd89\udd90-\udd9b\uddd0-\uddfc\udf9f\udfd0]|\ud802[\udd1f\udd3f\ude50-\ude58]|\ud809[\udc00-\udc7e]|\ud834[\udc00-\udcf5\udd00-\udd26\udd29-\udd64\udd6a-\udd6c\udd83-\udd84\udd8c-\udda9\uddae-\udddd\ude00-\ude41\ude45\udf00-\udf56]|\ud835[\udec1\udedb\udefb\udf15\udf35\udf4f\udf6f\udf89\udfa9\udfc3]|\ud83c[\udc00-\udc2b\udc30-\udc93]/;
const wsRe = /.*\s+.*/;

function splitCommand(msg: string): { cmd: string, args: string | undefined } | undefined {
    const commandRe = /\/([a-zA-Z0-9\.\+\-\/]*)\s*(.*)/;
    console.log(JSON.stringify(msg.match(commandRe)));
    const matches = msg.match(commandRe);
    if (!matches) {
        return undefined;
    }
    return {
        cmd: matches[1],
        args: matches[2],
    }
}

function handleCommand(ply: Player, msg: { cmd: string, args: string | undefined } | undefined): void {
    if (!msg) {
        return;
    }
    if (msg.cmd == '/' || msg.cmd == 'ooc') {
        if (!msg.args) {
            return;
        } else {
            ply.location?.fromWorld.Broadcast('<span class="ooc"><span class="ooc-prefix">' + ply.authUser.displayname + ' to all:</span> ' + msg.args + '</span><br>');
        }
    } else if (msg.cmd == 'dname' || msg.cmd == 'displayname') {
        if (!msg.args) {
            ply.sendMessage('<span class="command-error">Please provide a new displayname</span><br>');
            return;
        }
        if (msg.args.match(wsRe)) {
            ply.sendMessage('<span class="command-error">Names must only be one word.</span><br>');
            return;
        }
        if (msg.args.match(punctuationRe)) {
            ply.sendMessage('<span class="command-error">Names should not contain control characters or punctuation.</span><br>');
            return;
        }
        // FOR TESTING ONLY
        if (!validator.isLength(msg.args, { max: 20, min: 1 })) {
            ply.sendMessage('<span class="command-error">Names should be between 5 and 20 characters.</span><br>');
            return;
        }

        ply.authUser.displayname = validator.escape(msg.args);
        ply.___save();

    } else if (msg.cmd == 'allworlds' || msg.cmd == 'worlds' || msg.cmd == 'availableworlds') {
        const filteredWorlds = AllWorlds().filter((x) => x.loadable);
        let output = '<span class="world-print">Available Worlds:<br><ul>'
        filteredWorlds.forEach((w) => output = output + '\t<li>' + w.name + '</li>')
        output = output + '</ul></span>';
        ply.sendMessage(output);
    }
    else {
        ply.sendMessage('<span class="command-error">Unknown command: ' + msg.cmd + '</span><br>');
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
