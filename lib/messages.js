const invalidInputMsg =
  '⚠️ Your message does not correspond to any command or game. ' +
  'Use */h* command to get additional help.';

const serverErrorMsg =
  '🚨 Tuvimos dificultades procesando su mensaje. Intente de nuevo o comuníquese al XXX.';

const singlePlayerWelcomeMsg = (() => {
  let message =
    'Bienvenido al sistema de solicitud de garrafas de supergas ANCAP.\n*1* - Quiero recibir una garrafa\n*2* - Quiero recibir dos garrafas';
  return message;
})();




module.exports = {
  invalidInputMsg,
  serverErrorMsg,
  singlePlayerWelcomeMsg,
};
