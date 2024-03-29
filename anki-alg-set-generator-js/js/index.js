import Cube from 'https://cdn.skypack.dev/cubejs';
import { AlgCard } from './AlgCard.js';

let backTemplate = `{{FrontSide}}
<hr id=answer>
{{Case Name}}:<br>
{{Algorithm}}<br><br>
{{Note}}
`;

let rufModel = new Model({
  name: 'Algorithm (RUF Image)',
  id: 1695482707862,
  flds: [
    { name: 'Case Name' },
    { name: 'Algorithm' },
    { name: 'Note'},
    { name: 'Scramble'},
    { name: 'Pre-Rotation'}
  ],
  req: [
    [ 0, 'any', [0, 1, 2, 3, 4] ]
  ],
  tmpls: [
    {
      name: 'Card 1',
      qfmt: `<script src="https://cdn.cubing.net/js/cubing/twisty" type="module"></script>

      <twisty-player
        alg="{{Algorithm}}"
        experimental-setup-alg="{{Pre-Rotation}}"
        experimental-setup-anchor="end"
        visualization="PG3D"
        hint-facelets="none"
        background="none"
        control-panel="none"
        experimental-drag-input="none"
        camera-longitude="35"
        style="margin: auto;"
      >
      </twisty-player>
      <span style="color:#FF8080">{{Pre-Rotation}} </span>{{Scramble}}`,
      afmt: backTemplate,
    }
  ],
});
let llModel = new Model({
  name: 'Algorithm (Last Layer Image)',
  id: 1695482707863,
  flds: [
    { name: 'Case Name' },
    { name: 'Algorithm' },
    { name: 'Note'},
    { name: 'Scramble'},
    { name: 'Pre-Rotation'}
  ],
  req: [
    [ 0, 'any', [0, 1, 2, 3, 4] ]
  ],
  tmpls: [
    {
      name: 'Card 1',
      qfmt: `<script src="https://cdn.cubing.net/js/cubing/twisty" type="module"></script>

      <twisty-player
        alg="{{Algorithm}}"
        experimental-setup-alg="{{Pre-Rotation}}"
        experimental-setup-anchor="end"
        visualization="experimental-2D-LL"
        hint-facelets="none"
        background="none"
        control-panel="none"
        experimental-drag-input="none"
        style="margin: auto;"
      >
      </twisty-player>
      <span style="color:#FF8080">{{Pre-Rotation}} </span>{{Scramble}}`,
      afmt: backTemplate,
    }
  ],
});
let lfuModel = new Model({
  name: 'Algorithm (LFU Image)',
  id: 1695482707864,
  flds: [
    { name: 'Case Name' },
    { name: 'Algorithm' },
    { name: 'Note'},
    { name: 'Scramble'},
    { name: 'Pre-Rotation'}
  ],
  req: [
    [ 0, 'any', [0, 1, 2, 3, 4] ]
  ],
  tmpls: [
    {
      name: 'Card 1',
      qfmt: `<script src="https://cdn.cubing.net/js/cubing/twisty" type="module"></script>

      <twisty-player
        alg="{{Algorithm}}"
        experimental-setup-alg="{{Pre-Rotation}}"
        experimental-setup-anchor="end"
        visualization="PG3D"
        hint-facelets="none"
        background="none"
        control-panel="none"
        experimental-drag-input="none"
        camera-longitude="-35"
        style="margin: auto;"
      >
      </twisty-player>
      <span style="color:#FF8080">{{Pre-Rotation}} </span>{{Scramble}}`,
      afmt: backTemplate,
    }
  ],
});
let noneModel = new Model({
  name: 'Algorithm (No Image)',
  id: 1695482707865,
  flds: [
    { name: 'Case Name' },
    { name: 'Algorithm' },
    { name: 'Note'},
    { name: 'Scramble'},
    { name: 'Pre-Rotation'}
  ],
  req: [
    [ 0, 'any', [0, 1, 2, 3, 4] ]
  ],
  tmpls: [
    {
      name: 'Card 1',
      qfmt: '<span style="color:#FF8080">{{Pre-Rotation}} </span>{{Scramble}}',
      afmt: backTemplate,
    }
  ],
});

/**
 * Converts the input from the alg field into an array of AlgCard objects for further processing
 * @param {string[]} textLines Array of strings from the alg input field
 * @returns {AlgCard[]} Array of AlgCard objects
 */
function textInterpreter(textLines) {
  /**
   * Updates the currently valid tags
   * @param {string} line - unmodified line of the input field, must be a line that contains a tag
   * @param {string[]} tags - tree of tags
   * @returns {string[]} tree of tags, now updated to include the tag from the new line
   */
  function updateTags(line, tags) {
    const tagDepth = (line.match(/#/g)||[]).length - 1;

    const rawTag = line.replace(/#/g, '').trim().toLowerCase().replace(/ /g, '-');

    tags[tagDepth] = rawTag;
    tags.length=tagDepth + 1;
    return tags;
  }

  /**
   * Converts a line from the alg input field into an AlgCard object, calculates the scramble and returns the object.
   * @param {string} line Text line from the alg input field, that is confirmed to be a line containing an algorithm
   * @param {int} algNumber Number for naming algorithms with unspecified names (Format: #XX)
   * @param {Cube} cube cube object, so the solver doesn't have to be initialized for every card
   * @param {string[]} tags Currently valid tags
   * @param {int} lineNumber So that the line can be specified when there's an error
   */
  function toAlgCard(line, algNumber, tags, cube, lineNumber) {
    /**
     * Returns a scramble to an algorithm
     * @param {string} alg Must be a valid algorithm
     * @param {Cube} cube cube object, so the solver doesn't have to be initialized for every card
     * @returns {string} Scramble to the entered algorithm
     */
    function calculateScramble(alg, cube) {
      /**
       * normalizes the inputted notation in a way that it can be processed by cubejs
       * @param {string} alg algorithm
       */
      function normalizeNotation(alg) {
        const moveList = alg.split(' ');
        let normalizedAlg = '';

        for(let move of moveList) {
          move = move.replace(/[\(\)\*]/g, '');
          move = move.includes('w') ? move.replace(/w/g, '').toLowerCase() : move //Turn Rw into r
          
          const baseMove = move.replace(/[\d']/g, '');

          const amount = ((move.includes("'") ? 2 : 0) + (/\d/.test(move) ? parseInt(move.replace(/\D/g, '')) : 1)) % 4;
          normalizedAlg += amount == 0 ? '' : (baseMove + (amount == 2 ? '2' : '') + (amount == 3 ? "'" : '') + ' ');
        }

        return normalizedAlg;
      }

      const normalizedAlg = normalizeNotation(alg);


      cube.identity();
      
      cube.move(normalizedAlg);
      const scramble = cube.solve();

      return scramble;
    }

    let algName = '#' + algNumber;
    let note = '';
    let alg = line;
    
    const lineIncludesAlgName = line.includes(':');
    const lineIncludesNote = line.includes('*');

    if(lineIncludesAlgName) {
      const colonIndex = alg.indexOf(':');

      algName = alg.substring(0, colonIndex).trim();
      alg = alg.substring(colonIndex + 1).trim();
    }
    if(lineIncludesNote) {
      const asteriskIndex = alg.indexOf('*');
      
      note = alg.substring(asteriskIndex + 1);
      alg = alg.substring(0, asteriskIndex).trim();
    }
    
    let scramble = '';
    try {
      scramble = calculateScramble(alg, cube);

    } catch(error) {
      alert('Invalid syntax in the algorithm field on line ' + lineNumber + ".");
      console.error(error);
      throw new Error('Invalid syntax in algorithm field');
    }
    
    const algCard = new AlgCard(algName, alg, note, scramble, [...tags]);
    return algCard;
  }

  let tags = []
  let cards = []
  let algNumber = 0;
  
  let cube = new Cube();
  Cube.initSolver();

  let lineNumber = 1;

  
  let lineCounter = 0;
  for(let line of textLines) {
    const lineIsTagLine = line.includes('#');
    if(!lineIsTagLine) {
      lineCounter++;
    }
  }

  for(let line of textLines) {
    const lineIsTagLine = line.includes('#');
    if(lineIsTagLine) {
      tags = updateTags(line, tags);
    } else {
      algNumber++;
      while(algNumber.toString().length < lineCounter.toString().length) { //adds zeros in front of the number, so that all alg numbers have the same amount of digits
        algNumber = "0" + algNumber;
      }
      const algCard = toAlgCard(line, algNumber, tags, cube, lineNumber);
      cards.push(algCard);
    }
    lineNumber++;
  } 
  return cards;
}

function generatePackage(algs, deckName, imageType, preRotations) {
  let deck = new Deck(+new Date, deckName);
  let usedModel = undefined;

  if(imageType == 'none') {
    usedModel = noneModel;
  } else if(imageType == 'LL') {
    usedModel = llModel;
  } else if(imageType == 'RUF') {
    usedModel = rufModel;
  } else if(imageType == 'LFU') {
    usedModel = lfuModel;    
  }

  for(let alg of algs) {
    deck.addNote(usedModel.note([alg.name, alg.alg, alg.note, alg.scramble, preRotations], alg.tags));
  }
  const ankiPackage = new Package();
  ankiPackage.addDeck(deck);
  return ankiPackage;
}

function formSubmit() {
  const name = document.getElementById('name-input').value;
  const textLines = document.getElementById('alg-input').value.trim().split('\n');
  const preRotations = document.getElementById('pre-rotation').value;
  const imageType = document.getElementById('image-type').value;

  if(name == "" || textLines == "") {
    alert("No alg set name and/or algorithms entered!");
    return;
  }

  const cards = textInterpreter(textLines);
  
  const ankiPackage = generatePackage(cards, name, imageType, preRotations);

  const fileName = name.replace(/ /g, '_').toLowerCase() + '.apkg';

  ankiPackage.writeToFile(fileName);
}

let config = {
  locateFile: filename => `js/sql/sql-wasm.wasm`
}

let SQL;
window.SQL;
window.initSqlJs(config).then(function (sql) {
    window.SQL = sql;
});

document.getElementById('generate-button').addEventListener('click', formSubmit);
