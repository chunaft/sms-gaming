const GameFactory = require('./games/GameFactory');

const listOfGames = (() => {
  let message = '';
  const games = GameFactory.getGames();

  games.forEach((Game, i) => {
    message += `${i + 1} - ${Game.name}\n`;
  });

  return message;
})();

const invalidInputMsg =
  '⚠️ Your message does not correspond to any command or game. ' +
  'Use */h* command to get additional help.';

const serverErrorMsg =
  '🚨 Uh, oh! We had some difficulties processing your message.' +
  'Could you please send it again?';

const singlePlayerWelcomeMsg = (() => {
  let message =
    'Bienvenido, ingrese su nombre';
  return message;
})();

  const userConfirm =
  '1 - Confirmar efectivo\n2 - Confirmar tarjeta\n3 - Cancelar';


module.exports = {
  listOfGames,
  invalidInputMsg,
  serverErrorMsg,
  singlePlayerWelcomeMsg,
  userConfirm
};
