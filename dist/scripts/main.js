'use strict';

const generateRandomDigit = () => `${Math.floor(Math.random() * 10)}`;

let generatedNumber = '';

for (let i = 0; i < 4; i++) {
  let digit = generateRandomDigit();

  while (generatedNumber.includes(digit)) {
    digit = generateRandomDigit();
  }

  generatedNumber += digit;
}

const bullsAndCows = (generatedNum, enteredNum) => {
  let bullsCount = 0;
  let cowsCount = 0;

  for (let i = 0; i < enteredNum.length; i++) {
    if (enteredNum[i] === generatedNum[i]) {
      bullsCount++;
    } else if (generatedNum.includes(enteredNum[i])) {
      cowsCount++;
    }
  }

  return { bulls: bullsCount, cows: cowsCount };
};

const goBlock = document.body.querySelector('#go-block');
const goBlockRight = goBlock.querySelector('.block__right');
const goBlockRightHtml = document.createElement('div');

goBlockRightHtml.className = 'block__right';

goBlockRightHtml.innerHTML = `
  <input class="block__go-btn" type="button" value="Go">
`;

const codeBlocks = document.body.querySelectorAll('.block__code--go');
const codeBlockNotActive = codeBlocks[1].className;
const codeBlockActive = codeBlocks[0].className;
let activeIndex = 0;

const handleCodeBlockClick = (currentEvent, currentIndex) => {
  let currentBlock = currentEvent.target.closest('.block__code--go');
  const key = currentEvent.key;

  activeIndex = !currentIndex ? activeIndex : currentIndex;

  if (currentEvent.type === 'keydown') {
    currentBlock = codeBlocks[activeIndex];
  }

  if (!currentBlock) {
    return;
  }

  currentEvent.preventDefault();

  if (currentEvent.type === 'click' || key === 'ArrowUp') {
    currentBlock.textContent++;
  }

  if (key === 'ArrowDown') {
    currentBlock.textContent--;
  }

  if (key === 'ArrowLeft') {
    activeIndex--;
  }

  if (key === 'ArrowRight') {
    activeIndex++;
  }

  if (activeIndex === 4) {
    activeIndex = 0;
  }

  if (activeIndex === -1) {
    activeIndex = 3;
  }

  codeBlocks.forEach(block => {
    block.className = codeBlockNotActive;
  });
  codeBlocks[activeIndex].className = codeBlockActive;

  if (currentBlock.textContent === '10') {
    currentBlock.textContent = 0;
  }

  if (currentBlock.textContent === '-1') {
    currentBlock.textContent = 9;
  }

  if (goBlockRight !== goBlockRightHtml) {
    goBlockRight.innerHTML = `
      <input class="block__go-btn" type="button" value="Go">
    `;
  }
};

window.addEventListener('keydown', function(keydown) {
  handleCodeBlockClick(keydown);
});

codeBlocks.forEach(
  (codeBlock, index) => {
    codeBlock.addEventListener('click', function(click) {
      handleCodeBlockClick(click, index);
    });
  }
);

const gameButtons = document.body.querySelector('.game__buttons-container');
let enteredNumber = '';
let result = null;
let duplicates;

const handleGoClick = (click) => {
  const goButton = click.target.closest('.block__go-btn');

  if (!goButton) {
    return;
  }

  let blockLeftBody = '';

  codeBlocks.forEach(
    codeBlock => {
      enteredNumber += codeBlock.textContent;

      blockLeftBody += `
        <div class="block__code">${codeBlock.textContent}</div>
      `;
    }
  );

  let isDuplicates = false;

  for (const digit of enteredNumber) {
    if (enteredNumber.indexOf(digit) !== enteredNumber.lastIndexOf(digit)) {
      isDuplicates = true;
    }
  }

  if (isDuplicates) {
    if (goButton.nextElementSibling === duplicates) {
      return;
    }
    duplicates = document.createElement('p');
    duplicates.className = 'block__duplicates';
    duplicates.innerText = 'Duplicates';
    goButton.after(duplicates);
    isDuplicates = 'false';
    enteredNumber = '';
  } else {
    result = bullsAndCows(generatedNumber, enteredNumber);

    enteredNumber = '';

    const newBlock = document.createElement('div');

    newBlock.className = 'block';

    newBlock.innerHTML = `
      <div class="block__left">
        ${blockLeftBody}
      </div>
      <div class="block__right">
        <div class="block__bulls">${result.bulls}</div>
        <div class="block__cows">${result.cows}</div>
      </div>
    `;

    goBlock.before(newBlock);

    if (result.bulls === 4) {
      goBlock.remove();

      const winBlock = document.createElement('p');

      winBlock.className = 'game__win';
      winBlock.innerText = 'Well done!';
      gameButtons.before(winBlock);
    }
  }
};

goBlock.addEventListener('click', handleGoClick);

const giveUpButton = document.body.querySelector('.game__give-up-btn');

const handleGiveUp = (click) => {
  const giveUp = click.target;

  if (!giveUp) {
    return;
  }

  goBlock.remove();

  const giveUpBlock = document.createElement('p');

  giveUpBlock.className = 'game__give-up';
  giveUpBlock.innerText = generatedNumber;
  gameButtons.before(giveUpBlock);
};

giveUpButton.addEventListener('click', handleGiveUp, { once: true });

const newGameButton = document.body.querySelector('.game__new-game-btn');

newGameButton.addEventListener('click', () => location.reload());
