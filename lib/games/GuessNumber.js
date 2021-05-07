class GuessNumber {
  static name = 'Guess a Number';


  constructor(gameId, req) {
    this.state = 'play';
    this.gameId = gameId;
    this.name = req.Body;
    this.phone = req.WaId 
    this.address = '';
    this.accept = '';
    this.cash = '';
    this.deliveryTime = '';
    this.mistakes = 0;
  }

  get welcomeMessage() {
    const message =
      "Ahora su *dirección de entrega* incluyendo la esquina más cercana.";
    return message;
  }

  storeUser(name, address, phone, cash, delivered, deliveryTime) {
    var mysql = require('mysql')
    var connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'whatsapp'
    })
    // Stores current date
    var date = new Date();
    
    connection.connect();
    connection.query('insert into Users (name, address, phone, cash, delivered, delivery_time, date) values (?,?,?,?,?,?,?);', [name, address, phone, 1, 0, deliveryTime, date], function (error, results, fields) {
      if (error) throw error;
    });
    connection.end()
  }

  handleUserResponse(userMessage) {

    const message = userMessage;
    if (this.deliveryTime === '') {
      var date = new Date();
      var hourA = date.getHours() + 1;
      var minutes = date.getMinutes();
      if(minutes <= 9) {
        minutes = '0' + minutes;
      }
      var hourB = date.getHours() + 2;
      this.deliveryTime = hourA + ':' + minutes + '-' + hourB + ':' + minutes;
    }

    if (typeof message !== 'string') {
      return `Invalido`;
    }
    if (this.address === '') {
      this.address = message;
      return `Su garrafa llegará hoy entre las *${this.deliveryTime}.* Precio: $XXX\n *1* - Confirmar efectivo\n *2* - Confirmar débito/crédito\n*3* - Cancelar`
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
        this.storeUser(this.name, this.address, this.phone, this.cash, 0, this.deliveryTime);
        return `Su solicitud se ingresó correctamente ✅\n\n*Nombre:* ${this.name}\n*Dirección:* ${this.address}\n*Precio:* $XXX\n*Horario de entrega:* ${this.deliveryTime}\n\nPor cualquier consulta comunicarse al XXX`
      }
      if (message === '2') {
        this.cash = false;
        this.state = 'gameover';
        this.storeUser(this.name, this.address, this.phone, this.cash, 0, this.deliveryTime);
        return `Su solicitud se ingresó correctamente ✅\n\n*Nombre:* ${this.name}\n*Dirección:* ${this.address}\n*Precio:* $XXX\n*Horario de entrega:* ${this.deliveryTime}\n\nPor cualquier consulta comunicarse al XXX`
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
