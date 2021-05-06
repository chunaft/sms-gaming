const { nanoid } = require('nanoid');

class GameFactory {
  static #games = [
    require('./GuessNumber'),
  ];

  static createGame(index, name) {
    // conv id   
    const gameId = nanoid();
    
    // guessnumber seria mi conversacion 
    const GuessNumber = require('./GuessNumber')
    return new GuessNumber(gameId, name);

  }

  static getGames() {
    return GameFactory.#games;
  }
}

module.exports = GameFactory;
