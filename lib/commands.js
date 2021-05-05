const ProcessManager = require('./core/ProcessManager');
const {
  listOfGames,
  singlePlayerWelcomeMsg,
  multiPlayerWelcomeMsg
} = require('./messages');

/**
 * Activates conversation mode
 * @param {("single-player" | "multi-player")} mode mode to activate
 * @param {Express.Request} req express request object
 * @returns {String} activated mode
 */
async function activateMode(mode, req) {
  const modes = ['single-player', 'multi-player'];
  const isModeValid = modes.indexOf(mode) !== -1;

  if (!isModeValid) throw new Error(`${mode} is invalid!`);

  req.user.mode = mode;
  await req.saveUserSession(req.user);

  return mode;
}

const modeCommands = [
  {
    code: '/s',
    async message(req) {
      await activateMode('single-player', req);
      return `⭐ Singleplayer mode activated.\n${singlePlayerWelcomeMsg}`;
    }
  },
  {
    code: '/m',
    async message(req) {
      await activateMode('multi-player', req);
      const process = await ProcessManager.createProcess(
        'username-creation',
        req
      );

      return ['✨ Multiplayer mode activated.', process.welcomeMessage];
    }
  }
];

const singlePlayerCommands = [
  ...modeCommands,
  {
    code: '/g',
    message: listOfGames
  },
  {
    code: '/h',
    message: singlePlayerWelcomeMsg
  }
];


module.exports = {
  singlePlayerCommands,

};
