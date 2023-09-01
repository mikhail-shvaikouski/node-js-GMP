const repl = require('repl');

function getRandomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

repl.start('$> ').context.getRandomNumber = getRandomNumber;
