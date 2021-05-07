const { nanoid } = require('nanoid');

class GameFactory {
  static #games = [
    require('./GuessNumber'),
  ];

  static createGame(index, req) {
    // conv id   
    const gameId = nanoid();
    
    // guessnumber seria mi conversacion 
    const GuessNumber = require('./GuessNumber')
    return new GuessNumber(gameId, req);

  }

  static getGames() {
    return GameFactory.#games;
  }
}

module.exports = GameFactory;
