class GuessNumber {
  static name = 'Guess a Number';
  
  constructor(gameId, name) {
    this.state = 'play';
    this.gameId = gameId;
    this.name = name;
    this.address = '';
    this.accept = '';
    this.cash = '';
    this.hourA = '';
    this.hourB = '';
    this.minutes = ''; 
  }
  
  get welcomeMessage() {
    const message =
    "Ahora tu dirección";
    return message;
  }
  
  handleUserResponse(userMessage) {
    const message = userMessage;
    if (this.hourA === '') {
      let date = new Date();
      this.hourA = date.getHours() + 1;
      this.minutes = date.getMinutes()
      this.hourB = date.getHours() + 2;
    }
  
    if (typeof message !== 'string') {
      return `Invalido`;
      // return `✋ ${number} is not a valid answer!`;
    }

    if (this.address === '') {
      this.address = message;
      return `Tu garrafa llegará hoy entre las ${this.hourA}:${this.minutes} - ${this.hourB}:${this.minutes}. Costo: $XXX\n *1* - Confirmar efectivo\n *2* - Confirmar débito/crédito\n*3* - Cancelar`
    }
    console.log("antesd el 3");

    if (this.accept === '') {
      if (message === '3') {
        this.accept = false;
        this.state = 'gameover';
        return 'Su solicitud ha sido cancelada con éxito.'
      }
      this.accept = true;
      if (message === '1'){
        this.cash = true;
        this.state = 'gameover';
        return `La solicitud se ingresó correctamente ✅\n\n*Nombre:* ${this.name}\n*Dirección:* ${this.address}\n*Costo:* $XXX\n*Horario de entrega:* ${this.hourA}:${this.minutes} - ${this.hourB}:${this.minutes}\n\nPor cualquier consulta comunicarse al XXX`
      }
      if (message === '2'){
        this.cash = false;
        this.state = 'gameover';

        return `La solicitud se ingresó correctamente ✅\n\n*Nombre:* ${this.name}\n*Dirección:* ${this.address}\n*Costo:* $XXX\n*Horario de entrega:* ${this.hourA}:${this.minutes} - ${this.hourB}:${this.minutes}\n\nPor cualquier consulta comunicarse al XXX`
      }
    }
  }
}

module.exports = GuessNumber;
