const { nanoid } = require('nanoid');

class GameFactory {
  static #games = [
    require('./Hangman'),
    require('./GuessNumber'),
    require('./EmojiTranslate'),
    require('./JumbledWord'),
    require('./Trivia')
  ];

  static createGame(index, name) {
    const gameId = nanoid();
    const Game = GameFactory.#games[index];

    return new Game(gameId, name);
  }

  static getGames() {
    return GameFactory.#games;
  }
}

module.exports = GameFactory;
