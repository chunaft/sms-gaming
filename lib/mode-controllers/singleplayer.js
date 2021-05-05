const { invalidInputMsg } = require('../messages');
const commands = require('../commands').singlePlayerCommands;

const GameFactory = require('../games/GameFactory');
const SPGamesManager = require('../core/SPGamesManager');

module.exports = async (req, res) => {
  const { Body: userMsg } = req.body;

  if (req.user.gameSessId) {
    const gameId = req.user.gameSessId;
    const game = SPGamesManager.findGame(gameId);
    const responseMsg = game.handleUserResponse(userMsg);

    // Save new changes
    SPGamesManager.updateGame(game, gameId);

    if (game.state === 'gameover') {
      // Send gameover message
      SPGamesManager.destroyGame(gameId, req);
    }

    return res.sendMessage(responseMsg);
  }
  console.log("antes de find")
  const command = commands.find(c => c.code === userMsg);

  console.log("command", command);
  if (command) {
    let responseMsg = command.message;
    console.log("responseMsg", responseMsg);
    if (typeof command.message === 'function') {
      responseMsg = await command.message(req);
    }
    console.log("responseMsg desp del if ", responseMsg);
    return res.sendMessage(responseMsg);
  }

  // 2 es el codigo del juego que estoy usando (guessnumber)
  const gameNum = Number('2') - 1;

  console.log("nombre de la persona", req.body.Body);
  const game = GameFactory.createGame(gameNum, req.body.Body);
  console.log("gamenum", gameNum);
  console.log(game);
  if (game.init) await game.init();

  await SPGamesManager.createGame(game, req);

  return res.sendMessage(game.welcomeMessage);

};
