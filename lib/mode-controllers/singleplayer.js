const { invalidInputMsg } = require('../messages');
const commands = require('../commands').singlePlayerCommands;

const GameFactory = require('../games/GameFactory');
const SPGamesManager = require('../core/SPGamesManager');

module.exports = async (req, res) => {
  if (!req.user.gameSessId) {
    const game = GameFactory.createGame(req.body);
    if (game.init) await game.init();
    await SPGamesManager.createGame(game, req);
  }
  
  const { Body: userMsg } = req.body;

  const gameId = req.user.gameSessId;
  const game = SPGamesManager.findGame(gameId);
  game.handleUserResponse(userMsg).then(response => {

    // Save new changes
    SPGamesManager.updateGame(game, gameId);

    if (game.state === 'gameover') {
      // Send gameover message
      SPGamesManager.destroyGame(gameId, req);
    }

    res.sendMessage(response);
  });
};
