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
    this.mistakes = 0;
  }

  get welcomeMessage() {
    const message =
      "Ahora su *dirección de entrega* incluyendo la esquina más cercana.";
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
    }
    if (this.address === '') {
      this.address = message;
      return `Su garrafa llegará hoy entre las *${this.hourA}:${this.minutes} - ${this.hourB}:${this.minutes}.* Precio: $XXX\n *1* - Confirmar efectivo\n *2* - Confirmar débito/crédito\n*3* - Cancelar`
    }

    if (this.accept === '' && this.mistakes < 2) {
      if (message === '3') {
        this.accept = false;
        this.state = 'gameover';
        return 'Su solicitud ha sido cancelada con éxito.'
      }
      this.accept = true;
      if (message === '1') {
        this.cash = true;
        this.state = 'gameover';
        var mysql = require('mysql')
        var connection = mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: '',
          database: 'whatsapp'
        })

        connection.connect();
        connection.query('insert into Users (name, address, phone, cash, delivered, delivery_time, date) values (?,?,?,?,?,?,?);', [this.name, this.address, '123', 1, 0, '12:50-13:50', '2010-12-31 01:15:00'], function (error, results, fields) {
          if (error) throw error;
          console.log("dentro de la query");
        });
        connection.end()

        return `Su solicitud se ingresó correctamente ✅\n\n*Nombre:* ${this.name}\n*Dirección:* ${this.address}\n*Precio:* $XXX\n*Horario de entrega:* ${this.hourA}:${this.minutes} - ${this.hourB}:${this.minutes}\n\nPor cualquier consulta comunicarse al XXX`
      }
      if (message === '2') {
        this.cash = false;
        this.state = 'gameover';
        return `Su solicitud se ingresó correctamente ✅\n\n*Nombre:* ${this.name}\n*Dirección:* ${this.address}\n*Precio:* $XXX\n*Horario de entrega:* ${this.hourA}:${this.minutes} - ${this.hourB}:${this.minutes}\n\nPor cualquier consulta comunicarse al XXX`
      }
      this.accept = '';
      this.mistakes++;
      return `La opción ingresada es inválida.\n\n Ingrese una opción válida.\n*1* - Confirmar efectivo\n*2* - Confirmar débito/crédito\n*3* - Cancelar`
    }
    if (this.mistakes == 2) {
      this.state = 'gameover';
      // ver que hacer
    }
  }
}

module.exports = GuessNumber;
