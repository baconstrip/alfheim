// From https://stackoverflow.com/questions/4328500/how-can-i-strip-all-punctuation-from-a-string-in-javascript-using-regex .
const punctuationRe = /[!-/:-@[-`{-~¡-©«-¬®-±´¶-¸»¿×÷˂-˅˒-˟˥-˫˭˯-˿͵;΄-΅·϶҂՚-՟։-֊־׀׃׆׳-״؆-؏؛؞-؟٪-٭۔۩۽-۾܀-܍߶-߹।-॥॰৲-৳৺૱୰௳-௺౿ೱ-ೲ൹෴฿๏๚-๛༁-༗༚-༟༴༶༸༺-༽྅྾-࿅࿇-࿌࿎-࿔၊-၏႞-႟჻፠-፨᎐-᎙᙭-᙮᚛-᚜᛫-᛭᜵-᜶។-៖៘-៛᠀-᠊᥀᥄-᥅᧞-᧿᨞-᨟᭚-᭪᭴-᭼᰻-᰿᱾-᱿᾽᾿-῁῍-῏῝-῟῭-`´-῾\u2000-\u206e⁺-⁾₊-₎₠-₵℀-℁℃-℆℈-℉℔№-℘℞-℣℥℧℩℮℺-℻⅀-⅄⅊-⅍⅏←-⏧␀-␦⑀-⑊⒜-ⓩ─-⚝⚠-⚼⛀-⛃✁-✄✆-✉✌-✧✩-❋❍❏-❒❖❘-❞❡-❵➔➘-➯➱-➾⟀-⟊⟌⟐-⭌⭐-⭔⳥-⳪⳹-⳼⳾-⳿⸀-\u2e7e⺀-⺙⺛-⻳⼀-⿕⿰-⿻\u3000-〿゛-゜゠・㆐-㆑㆖-㆟㇀-㇣㈀-㈞㈪-㉃㉐㉠-㉿㊊-㊰㋀-㋾㌀-㏿䷀-䷿꒐-꓆꘍-꘏꙳꙾꜀-꜖꜠-꜡꞉-꞊꠨-꠫꡴-꡷꣎-꣏꤮-꤯꥟꩜-꩟﬩﴾-﴿﷼-﷽︐-︙︰-﹒﹔-﹦﹨-﹫！-／：-＠［-｀｛-･￠-￦￨-￮￼-�]|\ud800[\udd00-\udd02\udd37-\udd3f\udd79-\udd89\udd90-\udd9b\uddd0-\uddfc\udf9f\udfd0]|\ud802[\udd1f\udd3f\ude50-\ude58]|\ud809[\udc00-\udc7e]|\ud834[\udc00-\udcf5\udd00-\udd26\udd29-\udd64\udd6a-\udd6c\udd83-\udd84\udd8c-\udda9\uddae-\udddd\ude00-\ude41\ude45\udf00-\udf56]|\ud835[\udec1\udedb\udefb\udf15\udf35\udf4f\udf6f\udf89\udfa9\udfc3]|\ud83c[\udc00-\udc2b\udc30-\udc93]/;
const commonPunctuationMatcher = /[#-\+:->@[-`{-~¡-©«-¬®-±´¶-¸»¿×÷˂-˅˒-˟˥-˫˭˯-˿͵;΄-΅·϶҂՚-՟։-֊־׀׃׆׳-״؆-؏؛؞-؟٪-٭۔۩۽-۾܀-܍߶-߹।-॥॰৲-৳৺૱୰௳-௺౿ೱ-ೲ൹෴฿๏๚-๛༁-༗༚-༟༴༶༸༺-༽྅྾-࿅࿇-࿌࿎-࿔၊-၏႞-႟჻፠-፨᎐-᎙᙭-᙮᚛-᚜᛫-᛭᜵-᜶។-៖៘-៛᠀-᠊᥀᥄-᥅᧞-᧿᨞-᨟᭚-᭪᭴-᭼᰻-᰿᱾-᱿᾽᾿-῁῍-῏῝-῟῭-`´-῾\u2000-\u206e⁺-⁾₊-₎₠-₵℀-℁℃-℆℈-℉℔№-℘℞-℣℥℧℩℮℺-℻⅀-⅄⅊-⅍⅏←-⏧␀-␦⑀-⑊⒜-ⓩ─-⚝⚠-⚼⛀-⛃✁-✄✆-✉✌-✧✩-❋❍❏-❒❖❘-❞❡-❵➔➘-➯➱-➾⟀-⟊⟌⟐-⭌⭐-⭔⳥-⳪⳹-⳼⳾-⳿⸀-\u2e7e⺀-⺙⺛-⻳⼀-⿕⿰-⿻\u3000-〿゛-゜゠・㆐-㆑㆖-㆟㇀-㇣㈀-㈞㈪-㉃㉐㉠-㉿㊊-㊰㋀-㋾㌀-㏿䷀-䷿꒐-꓆꘍-꘏꙳꙾꜀-꜖꜠-꜡꞉-꞊꠨-꠫꡴-꡷꣎-꣏꤮-꤯꥟꩜-꩟﬩﴾-﴿﷼-﷽︐-︙︰-﹒﹔-﹦﹨-﹫！-／：-＠［-｀｛-･￠-￦￨-￮￼-�]+|\ud800[\udd00-\udd02\udd37-\udd3f\udd79-\udd89\udd90-\udd9b\uddd0-\uddfc\udf9f\udfd0]|\ud802[\udd1f\udd3f\ude50-\ude58]|\ud809[\udc00-\udc7e]|\ud834[\udc00-\udcf5\udd00-\udd26\udd29-\udd64\udd6a-\udd6c\udd83-\udd84\udd8c-\udda9\uddae-\udddd\ude00-\ude41\ude45\udf00-\udf56]|\ud835[\udec1\udedb\udefb\udf15\udf35\udf4f\udf6f\udf89\udfa9\udfc3]|\ud83c[\udc00-\udc2b\udc30-\udc93]/;

export function matchesPuncuation(input: string): boolean {
    return input.match(punctuationRe) ? true : false;
}

/**
 * Replaces all but commonly used punctuation with spaces.
 * 
 * Currently allows ! ? . , ' without modification.
 * 
 * @param input Input to scrub 
 */
export function replacePunctuation(input: string): string {
    return input.replace(commonPunctuationMatcher, ' ');
}
