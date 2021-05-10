const { invalidInputMsg } = require('../messages');
const commands = require('../commands').singlePlayerCommands;

const GameFactory = require('../games/GameFactory');
const SPGamesManager = require('../core/SPGamesManager');

module.exports = async (req, res) => {
  const { Body: userMsg } = req.body;

  if (req.user.gameSessId) {
    console.log("HOLAAAA");
    const gameId = req.user.gameSessId;
    const game = SPGamesManager.findGame(gameId);
    const responseMsg = await game.handleUserResponse(userMsg);
    // Save new changes
    SPGamesManager.updateGame(game, gameId);

    if (game.state === 'gameover') {
      // Send gameover message
      SPGamesManager.destroyGame(gameId, req);
    }

    return res.sendMessage(responseMsg);
  }

  console.log("nombre de la persona", req.body);

  const game = GameFactory.createGame( req.body);
  if (game.init) await game.init();

  await SPGamesManager.createGame(game, req);

  return res.sendMessage(game.welcomeMessage);

};
