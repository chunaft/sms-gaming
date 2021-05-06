const invalidInputMsg =
  '⚠️ Your message does not correspond to any command or game. ' +
  'Use */h* command to get additional help.';

const serverErrorMsg =
  '🚨 Tuvimos dificultades procesando su mensaje. Intente de nuevo.';

const singlePlayerWelcomeMsg = (() => {
  let message =
    'Bienvenido al sistema de solicitud de garrafas. Para recibir *una garrafa, ingrese su nombre completo*';
  return message;
})();


module.exports = {
  invalidInputMsg,
  serverErrorMsg,
  singlePlayerWelcomeMsg,
};
