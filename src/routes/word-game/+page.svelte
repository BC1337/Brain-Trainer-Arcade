<script>
  import Layout from "../../layouts/Layout.svelte";
  import { onMount } from 'svelte';

  const maxRows = 6;
  const wordLength = 5;

const words = [
  // A
  'apple','ant','arm','axe','air','arrow','angel','apron','animal','arch','ask','add','able','also','after','any','age','act','ache','aim',
  'ate','awake','answer','alone','around','alike','alive','angle','ask','allow','accept','attic','anchor','amuse','alert','apex','arise','abuse','agree','abound',

  // B
  'ball','bat','bear','bird','book','bread','bag','boat','bench','brick','bunny','berry','black','blue','bright','big','bad','back','bath','box',
  'boy','bite','bake','bring','burn','bubble','broom','brush','bite','beach','beard','best','bite','brain','blend','break','brave','blind','bell','branch','build',

  // C
  'cat','cow','car','cup','cake','cloud','chair','coin','coat','crow','corn','cold','cute','clown','child','circle','clap','clean','cry','cook',
  'crab','climb','cage','clue','catch','clerk','chalk','cheese','chief','chain','chess','chip','chain','clap','cling','coat','clash','crawl','curly','cross','cave',

  // D
  'dog','duck','door','drum','desk','dance','dust','doll','dark','dirt','day','deep','dream','dress','drop','dig','draw','deal','done','drive',
  'dime','duckling','dare','dive','dull','drain','drip','dusty','damp','distant','dizzy','delight','dodge','drift','dwell','dine','dash','doodle','drain','dock','drumstick',

  // E
  'egg','ear','eye','eat','earth','echo','east','easy','edge','end','energy','enter','even','empty','early','each','eight','else','ever','exit',
  'earn','emit','envy','evil','elbow','elk','echo','envoy','event','enjoy','entire','edit','erase','enter','equal','extra','enter','eager','exert','essay','engage',

  // F
  'fish','frog','fan','foot','face','farm','flag','fire','fruit','field','fast','fall','fun','full','first','friend','fly','fog','find','food',
  'fence','frown','flame','fold','fancy','fetch','frame','fist','fade','fuel','foam','flee','flood','fright','feast','flash','flutter','flock','fringe','flare','ferry',

  // G
  'goat','girl','game','glass','grass','gate','gold','green','gum','giant','give','good','great','grow','ground','group','guess','glow','grab','gift',
  'gaze','grin','grape','globe','grim','glide','gush','gravel','gallop','glance','gather','grimace','glisten','garden','guide','grain','greet','gear','goblin','ghost','grace',

  // H
  'hat','hand','horse','house','hill','heart','home','honey','hold','help','happy','high','hot','hard','hug','hear','heat','hunt','hope','head',
  'hatch','hop','halt','hair','hollow','honest','hurry','hum','harm','heal','hero','hazel','hunt','hover','hatch','humble','howl','hub','habit','hike','hatch','hover','habit',

  // I
  'ice','ink','iron','island','idea','item','inch','inside','invite','ill','idle','icon','insect','iris','impact','imply','impose','intend','invest','income',
  'ignite','input','idle','inch','ivory','invent','intact','interest','issue','itch','identity','isolate','image','immerse','impact','ignite','inspire','import','invite','index','idle','inlay','impact','inform',

  // J
  'jar','jug','jump','juice','jelly','joke','jeans','jungle','join','job','jolly','jet','judge','jog','jam','jewel','join','jazz','jump','joy',
  'jest','jungle','jog','joint','jogging','jerk','jumping','juice','jiffy','jab','jack','jot','jacket','juggle','juncture','jubilant','justice','jingle','jersey','journey','jury','jolt','jargon','jewel',

  // K
  'kite','key','king','kick','kid','knee','knife','knot','kitten','know','kind','kept','knock','kitchen','kale','keen','karma','knob','kick','kiss',
  'kayak','kettle','kingdom','knit','kink','kindle','kernel','kneel','kingly','knapsack','keep','kickoff','knockout','kooky','koala','kay','kiosk','knead','kooky','kudos','karma','knotty','kneel','kit','keen','kiddo',

  // L
  'lion','lamp','leaf','leg','lake','love','list','line','light','lamb','long','luck','last','late','look','lift','loop','loss','loud','learn',
  'latch','leap','land','lazy','level','lean','lively','layer','link','listen','lurk','laugh','lick','lodge','lure','limit','load','lash','leave','let','load','loop','latch','lounge','lot','lift','light','lunar','lump','lock','luxury',

  // M
  'man','moon','milk','map','mouse','mango','mud','mask','meet','music','more','move','many','made','main','mine','menu','mean','mix','meal',
  'mark','match','mend','mimic','maze','muddy','march','melt','moss','mop','mist','moth','mint','meat','mask','mock','mug','medal','myth','must','mirth','mile','mingle','mock','mute','moan','moist','march','munch','mirror',

  // N
  'net','nest','nose','nap','night','name','near','need','note','nail','news','near','nice','north','new','next','none','number','nature','novel',
  'napkin','nick','nibble','narrow','nasty','neat','nudge','null','noun','nag','nerve','nickel','nifty','niche','notify','noise','noble','novice','nifty','nuzzle','nomad','nap','needle','nymph','noon','nape','note','nettle','node','nut',

  // O
  'owl','ox','ocean','orange','oil','open','old','odd','order','oven','once','only','over','own','outside','offer','object','okay','office','out',
  'oak','ounce','orbit','omen','oxen','opinion','orbit','obey','oath','ogle','online','opt','open','omit','ounce','ostrich','outfit','outlet','overflow','outrun','overlay','overlap','offer','outrage','outline','outdo',

  // P
  'pig','pen','pan','pear','peach','plant','play','plate','pot','park','party','pink','page','pick','pull','push','point','pool','paint','pie',
  'pond','pocket','patch','pound','palm','pause','peek','pitch','pile','poke','plow','plum','pray','peel','plug','plaza','prize','plain','prime','pride','plume','puff','paddle','paddle','pact','peer','pebble','peep','peanut','plenty','pat','paste','patrol',

  // Q
  'queen','quiz','quick','quiet','quack','quarter','question','quilt','quote','quality','quest','queue','quit','quirk','quill','quint','quake','quota','query','quark','quart',
  'quarry','quench','quest','quibble','quintet','quota','quake','quaint','quasar','quill','quench','quarry','quirky','quiescent','quorum','quench','quip','quietly','quill','quid','quokka','quiver','quintuple','quorum','quizlet','quip','queue','quack','quince',

  // R
  'rat','run','rain','road','rock','rose','ring','river','rabbit','red','ride','rest','room','rule','right','rush','rough','reach','read','roll',
  'rack','rust','race','ramp','rake','raven','rope','rail','rumble','riddle','rank','rant','roar','rack','reed','reap','reef','root','rely','risk','rivet','razor','rush','reign','rage','rail','rant','relax','robot',

  // S
  'sun','sky','sea','snake','star','sock','sand','shop','song','snow','slow','small','side','soft','stop','seat','study','sweet','safe','salt',
  'soap','sack','seal','sink','sip','spin','spoon','spade','spike','spill','stack','stir','stand','step','stump','stamp','spit','sweep','spark','spend','streak','sling','spare','spring','spine','scene','slope','slide','slope','swim','spike','splash','sprout','squad','sack','swell','swirl','sneeze','snack','snail','snowy',

  // T
  'tree','tap','toy','top','tank','table','train','town','ten','time','take','talk','test','turn','tiny','tall','tire','trap','taste','team',
  'task','trail','tame','tick','tug','twin','tank','toss','tide','tile','tread','trick','trophy','trunk','tune','twist','tuck','trend','thank','thorn','thump','thrive','trace','trail','tower','trade','thumb','treat','troll','toast',

  // U
  'urn','up','use','unit','under','uncle','until','urban','usual','unite','undo','urge','utter','update','upgrade','upset','uplift','uphold','umbrella','unique',
  'upper','umpire','utilize','urgent','upbeat','utility','utterly','uproot','upstairs','untie','unfold','unpack','upland','unseen','undergo','upgrade','under','upend','uphold','undoing','underlay','unveil','underwear','unknown','unload','upstart','update','upvote','undercover','upkeep','unrest','underpass','upturn','union','underscore','understudy','unitary','unicorn','upwind','unwrap','unstable','untamed','uncurl','unclip',

  // V
  'van','vet','vine','vest','vase','voice','view','vivid','visit','value','vote','vocal','vast','valid','venture','victory','veil','vapor','verse','video',
  'veil','vow','vent','vault','vibrate','venture','village','verse','vocal','venture','victim','victor','vigor','vane','volume','vacant','vivid','vacuum','vest','vanish','vocal','vantage','velvet','venture','vacate','visitor','vacuum','verdant','vividly','vestige','variant','vex','vortex','verbose','verify',

  // W
  'war','web','wax','wing','wolf','water','wind','wall','word','wave','wish','walk','wake','warm','watch','week','wide','wild','work','wise',
  'wink','wander','wade','weigh','wool','wilt','woven','wobble','wander','warp','wring','wrest','whale','whip','whisk','whirl','wink','wrench','whack','wobble','wilt','whine','wax','wobble','wade','worry','weave','wobble','wobble','win','won','wipe',

  // X
  'xray','xylophone','xenon','xerox','xenial','xpress','xmas','xylem','xtra','xenial',
  'xenon','xiphoid','xenial','xylitol','xenon','xerox','xmas','xray','xylitol','xenon','xenial','xeric','xyst','xenolith','xenophile','xerarch','xerophyte','xylocarp','xylograph','xenograft','xenocryst','xenolith','xylophone','xenon','xylotomy','xerox','xylidine','xenophile',

  // Y
  'yak','yard','yarn','yell','yellow','young','yes','yawn','year','yield','yoga','yolk','youth','yummy','yacht','yodel','yesterday','yearn','yeast','your',
  'yearly','yonder','yell','yap','yip','yikes','yelp','yummy','yowl','yogurt','yarn','yap','youthful','yoke','yodeler','yellowish','yielding','yawner','yuppie','yikes','yuck','youth','yoga','yardstick','yaw','yarn','yo-yo','yelp','yoke','yearn','yummy','yellowy','yap','yowl','yip','yawn','yank','yacht','yowl','yammer','yes-man','yeoman',

  // Z
  'zoo','zip','zero','zone','zigzag','zebra','zen','zinc','zoom','zeal','zephyr','zest','zig','zap','zenith','zodiac','zigzag','zillion','zipper','zany',
  'zest','zebra','zealot','zing','ziggy','zapper','zonal','zebrawood','zigzag','zinger','zeppelin','zoon','zodiacal','zoology','zoetic','zappy','zenana','zebu','zigzagged','zenithal','zealot','zealously','zeroed','zoster','zodiacally','zig','zip','zillionaire','zone','zoetrope','zygote'
];

  let targetWord = '';
  let currentRow = 0;
  let currentGuess = '';
  let won = false;
  let showModal = false;
  let rows = Array(maxRows).fill('').map(() =>
    Array(wordLength).fill({ letter: '', status: '', theme: 'light', typed: false })
  );
  let keyboardStatus = {};
  let isDarkMode = false;

  const h1Color = '#0a74da';

  function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
  }

  function detectTheme() {
    const brightness = window.getComputedStyle(document.body).backgroundColor;
    const rgbMatch = brightness.match(/\d+/g);
    const brightnessValue = rgbMatch ? (parseInt(rgbMatch[0]) + parseInt(rgbMatch[1]) + parseInt(rgbMatch[2])) / 3 : 255;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDarkMode = brightnessValue < 128 || prefersDark;

    applyThemeToRows();
    updateCurrentRow();
  }

  function startGame() {
    targetWord = getRandomWord();
    currentRow = 0;
    currentGuess = '';
    won = false;
    showModal = false;
    keyboardStatus = {};
    rows = Array(maxRows).fill('').map(() =>
      Array(wordLength).fill({
        letter: '',
        status: '',
        theme: isDarkMode ? 'dark' : 'light',
        typed: false
      })
    );
  }

  function evaluateGuess(guess) {
    const result = Array(wordLength).fill('missing');
    const targetArray = targetWord.split('');

    guess.split('').forEach((letter, i) => {
      if (targetArray[i] === letter) {
        result[i] = 'exact';
        targetArray[i] = null;
      }
    });

    guess.split('').forEach((letter, i) => {
      if (result[i] === 'missing') {
        const idx = targetArray.indexOf(letter);
        if (idx !== -1) {
          result[i] = 'close';
          targetArray[idx] = null;
        }
      }
    });

    return result;
  }

  function updateCurrentRow() {
    rows[currentRow] = currentGuess
      .split('')
      .map((l, i) => {
        const oldCell = rows[currentRow]?.[i] || {};
        return {
          ...oldCell,
          letter: l,
          typed: true,
          theme: isDarkMode ? 'dark' : 'light'
        };
      })
      .concat(
        Array(wordLength - currentGuess.length).fill({ letter: '', status: '', typed: false, theme: isDarkMode ? 'dark' : 'light' })
      );
  }

  function update(event) {
    event.preventDefault();
    const key = event.target.getAttribute('data-key');
    if (!key) return;

    if (key === 'backspace') {
      currentGuess = currentGuess.slice(0, -1);
      updateCurrentRow();
    } else if (key === 'enter') {
      if (currentGuess.length === wordLength) {
        const status = evaluateGuess(currentGuess);
        rows[currentRow] = currentGuess.split('').map((letter, i) => ({
          letter,
          status: status[i],
          theme: isDarkMode ? 'dark' : 'light',
          typed: false
        }));

        status.forEach((s, i) => {
          const letter = rows[currentRow][i].letter;
          if (s === 'exact' || (s === 'close' && keyboardStatus[letter] !== 'exact')) {
            keyboardStatus[letter] = s;
          } else if (!keyboardStatus[letter]) {
            keyboardStatus[letter] = s;
          }
        });

        won = status.every((s) => s === 'exact');
        if (won || currentRow + 1 === maxRows) showModal = true;

        currentRow++;
        currentGuess = '';
      }
    } else if (/^[a-z]$/.test(key) && currentGuess.length < wordLength) {
      currentGuess += key;
      updateCurrentRow();
    }
  }

  function keydown(event) {
    if (event.metaKey) return;
    const key = event.key.toLowerCase();
    if (key === ' ' || key === 'spacebar') { event.preventDefault(); return; }

    const keyboardButton = document.querySelector(`.keyboard [data-key="${key}"]`);
    if (keyboardButton) {
      keyboardButton.click();
      event.preventDefault();
    }
  }

  function closeModal() { showModal = false; }

  function applyThemeToRows() {
    rows = rows.map(row =>
      row.map(cell => ({
        ...cell,
        theme: isDarkMode ? 'dark' : 'light'
      }))
    );
  }

  onMount(() => {
    detectTheme();
    startGame();
    window.addEventListener('keydown', keydown);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', detectTheme);
    return () => {
      window.removeEventListener('keydown', keydown);
      mq.removeEventListener('change', detectTheme);
    };
  });
</script>

<Layout>
  <div class="word-game-container">
    <div class="header">
      <h1 style="color: {h1Color}">Word Game</h1>
      <button class="refresh-btn" on:click={startGame} title="Restart Game">↻</button>
    </div>

    <a class="how-to-play" href="/word-game/how-to-play">How to Play</a>

    <div class="grid">
      {#each rows as row}
        <div class="row">
          {#each row as cell}
            <div class="letter {cell.status} {cell.theme} {cell.typed ? 'typed' : ''}">
              {cell.letter.toUpperCase()}
            </div>
          {/each}
        </div>
      {/each}
    </div>

    <div class="keyboard">
      {#each ['qwertyuiop','asdfghjkl','zxcvbnm'] as row}
        <div class="row">
          {#each row.split('') as letter}
            <button type="button" data-key={letter} class={keyboardStatus[letter]} on:click={update}>
              {letter.toUpperCase()}
            </button>
          {/each}
        </div>
      {/each}
      <div class="row last-row">
        <button type="button" data-key="enter" on:click={update}>Enter</button>
        <button type="button" data-key="backspace" on:click={update}>Back</button>
      </div>
    </div>

    {#if showModal}
      <div class="modal-backdrop">
        <div class="modal">
          <h2>{won ? 'Hooray! 🎉' : 'Game Over'}</h2>
          <p>
            {won
              ? `You guessed the word "${targetWord.toUpperCase()}" in ${currentRow} ${currentRow === 1 ? 'guess' : 'guesses'}!`
              : `The word was "${targetWord.toUpperCase()}"`}
          </p>
          <button on:click={closeModal}>Close</button>
        </div>
      </div>
    {/if}
  </div>
</Layout>

<style>
.word-game-container {
  max-width: 420px;
  margin: 2rem auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Header */
.word-game-container .header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

/* Refresh button */
.word-game-container .refresh-btn {
  background: #6aaa64;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
}
.word-game-container .refresh-btn:hover {
  transform: rotate(20deg) scale(1.1);
  box-shadow: 0 0 8px #6aaa64;
}

/* Heading */
.word-game-container h1 {
  text-align: center;
  margin: 0;
}

/* How to play link */
.word-game-container .how-to-play {
  display: block;
  text-align: center;
  margin: 0.5rem 0 1rem;
  color: var(--color-theme-1, #0af);
}

/* Grid for game letters */
.word-game-container .grid {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.word-game-container .row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.3rem;
}

/* Game letters */
.word-game-container .letter {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.8rem;
  font-weight: bold;
  border-radius: 10px;
  color: black; /* letters always black */
  text-transform: uppercase;
  transition: all 0.2s ease;
  backdrop-filter: blur(6px);
  background: #f5f5f5; /* pre-submission neutral off-white */
}

/* Typed letters BEFORE submission - slightly darker grey */
.word-game-container .letter.typed {
  background: #ededed;
  text-shadow:
    0 1px 1px rgba(0,0,0,0.4),
    0 2px 2px rgba(0,0,0,0.2);
}

/* Status colors AFTER submission - KEEP ORIGINALS */
.word-game-container .letter.exact {
  background: rgba(106, 170, 100, 0.85);
  color: white;
}

.word-game-container .letter.close {
  background: rgba(201, 180, 88, 0.85);
  color: white;
}

.word-game-container .letter.missing {
  background: rgba(120, 124, 126, 0.85);
  color: white;
  opacity: 0.8;
}

/* Keyboard */
.word-game-container .keyboard {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.word-game-container .keyboard .row {
  display: flex;
  justify-content: center;
  gap: 0.2rem;
}

/* Keyboard buttons default (light mode) */
.word-game-container .keyboard button {
  width: 40px;
  height: 50px;
  border: none;
  border-radius: 6px;
  background: #ccc;
  color: #000;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.2s ease;
}

.word-game-container .keyboard button:hover {
  transform: scale(1.05);
  background: #bbb;
}

/* Keyboard buttons dark mode */
.word-game-container .keyboard button.dark {
  background: #333;
  color: white;
}

/* Status colors on keyboard */
.word-game-container .keyboard button.exact {
  background: #6aaa64;
  color: white;
}

.word-game-container .keyboard button.close {
  background: #c9b458;
  color: white;
}

.word-game-container .keyboard button.missing {
  background: #787c7e;
  color: white;
  opacity: 0.8;
}

/* Last row spacing */
.word-game-container .keyboard .row.last-row {
  gap: 1rem;
  justify-content: center;
}

/* Enter and Back buttons */
.word-game-container .keyboard button[data-key="enter"],
.word-game-container .keyboard button[data-key="backspace"] {
  width: 80px;
  background: #0a74da;
  color: white;
  font-size: 1rem;
  font-weight: bold;
}

.word-game-container .keyboard button[data-key="enter"]:hover,
.word-game-container .keyboard button[data-key="backspace"]:hover {
  background: #095bb5;
  transform: scale(1.05);
}

/* Modal backdrop */
.word-game-container .modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

/* Modal content */
.word-game-container .modal {
  background: var(--color-bg-1, #111);
  color: var(--color-text, white);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  max-width: 300px;
}

.word-game-container .modal button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  background: #6aaa64;
  color: white;
}

/* Responsive adjustments */
@media screen and (max-width: 480px) {
  .word-game-container .letter {
    width: 45px;
    height: 45px;
    font-size: 1.5rem;
  }
  .word-game-container .keyboard button {
    width: 35px;
    height: 45px;
    font-size: 0.9rem;
  }
  .word-game-container .keyboard button[data-key="enter"],
  .word-game-container .keyboard button[data-key="backspace"] {
    width: 70px;
  }
}

</style>
