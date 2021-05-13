const messages = {
  invalidInputMsg:
    '⚠️ Your message does not correspond to any command or game. ' +
    'Use */h* command to get additional help.',

  serverErrorMsg:
    '🚨 Tuvimos dificultades procesando su mensaje. Intente de nuevo o comuníquese al XXX.',

  askForAmountMsg:
    'Bienvenido al sistema de solicitud de garrafas de supergas ANCAP.' +
    '\n*1* - Quiero recibir una garrafa\n*2* - Quiero recibir dos garrafas',

  amount:
    '\n*1* - Quiero recibir una garrafa\n*2* - Quiero recibir dos garrafas',

  invalidOption: 'Opción inválida.\n\nIngrese una opción válida',
  invalidMessage: 'Mensaje inválido. Intente de nuevo.',

  askForName: 'Ingrese su *nombre completo*.',
  askForNameError: 'Respuesta inválida. Ingrese un nombre válido.',
  askForAddress: 'Ahora su *dirección de entrega* incluyendo la esquina más cercana.',

  askForConfirm: (deliveryTime) => `Su garrafa llegará hoy antes de las *${deliveryTime}.* Precio: $XXX\n*1* - Confirmar efectivo\n*2* - Confirmar débito/crédito\n*3* - Agregar observación\n*4* - Cancelar`,
  confirmOptions: '*1* - Confirmar efectivo\n*2* - Confirmar débito/crédito\n*3* - Agregar observación\n*4* - Cancelar',
  confirmOptionsWithoutNote: '*1* - Confirmar efectivo\n*2* - Confirmar débito/crédito\n*3* - Cancelar',
  noteSaved: 'Observación guardada exitosamente.\n\n',
  confirmMessage: (name, address, deliveryTime, note) => `Su solicitud se ingresó correctamente ✅\n\n*Nombre:* ${name}\n*Dirección:* ${address}\n*Precio:* $XXX\n*Horario de entrega:* ${deliveryTime}\n*Observación:* ${note}\nPor cualquier consulta comunicarse al XXX`,

  cancelled: 'Su solicitud ha sido cancelada con éxito.',
  askForNote: 'Ingrese su observación'
}

module.exports = {
  messages
};
