/*!
 * passhelp - MIT License - https://passhelp.github.io
 * Copyright 2016 Jacob Peddicord
 */

import * as character from '../src/generators/character';
import * as phrase from '../src/generators/phrase';

const outputField = document.getElementById('output') as HTMLInputElement;
outputField.addEventListener('focus', copyOutput);
const regenerateButton = document.getElementById('regenerate') as HTMLButtonElement;
regenerateButton.addEventListener('click', generate);

const typeOptions = document.querySelectorAll('.generator');
for (let i = 0; i < typeOptions.length; i++) {
  const opt = typeOptions.item(i);

  opt.addEventListener('click', typeSelected);
}

const lengthField = document.getElementById('length') as HTMLInputElement;
lengthField.addEventListener('change', e => {
  setLength(parseInt(lengthField.value));
});

/**
 * Read in form values, generate a password, and display it.
 */
function generate() {
  // load up the selected type
  const typeRadio = document.querySelector('input[name="type-radio"]:checked') as HTMLInputElement;
  if (typeRadio == null) {
    return;
  }
  const data = typeRadio.dataset as any;

  // read the desired length
  const passLength = parseInt((document.getElementById('length') as HTMLInputElement).value);

  let out = '';
  const type = data.type;
  if (type === 'character') {
    out = character.generate(passLength, (<any>character.alphabets)[data.alphabet], data.exhaustive === 'true');
  } else if (type === 'phrase') {
    out = phrase.generate(passLength, data.specials === 'true');
  }

  const outputField = document.getElementById('output') as HTMLInputElement;
  outputField.value = out;
}

function copyOutput(e: Event) {
  outputField.select();
  document.execCommand('copy');
}

/**
 * When a password type is selected, show more options and generate.
 */
function typeSelected(e: Event) {
  const radio = e.currentTarget as HTMLInputElement;
  const data = radio.dataset as any;

  // show description
  const descs = document.querySelectorAll('#description > .type');
  for (let i = 0; i < descs.length; i++) {
    const txt = descs.item(i) as HTMLElement;
    txt.style.display = 'none';
  }
  const desc = document.getElementById(`desc_${radio.id}`) as HTMLElement;
  desc.style.display = 'block';

  // show length picker
  const lengths = data.length.split(',').map((x: string) => parseInt(x));
  renderLengthOptions(lengths);
  const lengthPicker = document.getElementById('length-picker') as HTMLElement;
  lengthPicker.style.visibility = 'visible';
  lengthField.focus();
  lengthField.select();

  // eagerly generate a password
  generate();
}

/**
 * Given a list of numbers, update the length picker appropriately.
 */
function renderLengthOptions(lengths: Array<number>) {
  // make quick-select buttons
  const container = document.getElementById('length-presets') as HTMLElement;
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  for (let l of lengths) {
    const btn = document.createElement('button');
    btn.textContent = l.toString();
    btn.addEventListener('click', e => {
      setLength(l);
    });
    container.appendChild(btn);
  }

  // initialize length to something sane (second length option is "good enough")
  setLength(lengths[1]);
}

/**
 * Change the generated password length via event (hence string length).
 */
function setLength(length: number) {
  // TODO: this is a bit redundant; move length to url hash
  // don't we just love the DOM
  const lengthStr = length.toString();
  lengthField.value = lengthStr;
  generate();
}
