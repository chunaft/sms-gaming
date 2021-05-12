const { serverErrorMsg } = require('../messages');

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
    this.stored = false;
    this.mistakes = 0;
  }

  get welcomeMessage() {
    const message =
      "Ahora su *dirección de entrega* incluyendo la esquina más cercana.";
    return message;
  }

  storeUser(name, address, phone, cash, delivered, deliveryTime) {
    var date = new Date();

    var mysql = require('mysql')
    var connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'whatsapp'
    })
    connection.connect();

    return new Promise((resolve, reject) => {
      const result = connection.query('insert into requests (name, address, phone, cash, delivered, delivery_time, date) values (?,?,?,?,?,?,?);', [name, address, phone, cash, delivered, deliveryTime, date], function (error, results, fields) {
        if (error) {
          reject(error);
          console.log(error);
        } else {
          resolve();
        }
        connection.end();
      });
    });
  }


  handleUserResponse(message) {
    return new Promise((resolve, reject) => {

      if (this.deliveryTime === '') {
        var date = new Date();
        var hourA = date.getHours() + 1;
        var minutes = date.getMinutes();
        if (minutes <= 9) {
          minutes = '0' + minutes;
        }
        var hourB = date.getHours() + 2;
        this.deliveryTime = hourA + ':' + minutes + '-' + hourB + ':' + minutes;
      }

      if (typeof message !== 'string' || message === '') {
        return resolve(`Mensaje inválido. Intente de nuevo.`);
      }
      if (this.address === '') {
        this.address = message;
        console.log("ENTRA")
        return resolve(`Su garrafa llegará hoy entre las *${this.deliveryTime}.* Precio: $XXX\n*1* - Confirmar efectivo\n*2* - Confirmar débito/crédito\n*3* - Cancelar`);
      }

      if (this.accept === '' && this.mistakes < 2) {
        if (message === '3') {
          this.accept = false;
          this.state = 'gameover';
          return resolve('Su solicitud ha sido cancelada con éxito.');
        }
        this.accept = true;
        if (message === '1') {
          this.storeUser(this.name, this.address, this.phone, this.cash, 0, this.deliveryTime).then(response => {
            this.cash = true;
            this.state = 'gameover';
            console.log("Antes de resolve message === 1");
            return resolve(`Su solicitud se ingresó correctamente ✅\n\n*Nombre:* ${this.name}\n*Dirección:* ${this.address}\n*Precio:* $XXX\n*Horario de entrega:* ${this.deliveryTime}\n\nPor cualquier consulta comunicarse al XXX`);
          }).catch(error => {

            console.log("Catch message === 1");
            this.state = 'gameover';
            return resolve(serverErrorMsg);
          })
        }else if (message === '2') {
          this.storeUser(this.name, this.address, this.phone, this.cash, 0, this.deliveryTime).then(response => {
            this.cash = false;
            this.state = 'gameover';
            return resolve(`Su solicitud se ingresó correctamente ✅\n\n*Nombre:* ${this.name}\n*Dirección:* ${this.address}\n*Precio:* $XXX\n*Horario de entrega:* ${this.deliveryTime}\n\nPor cualquier consulta comunicarse al XXX`)
          }).catch(error => {
            this.state = 'gameover';
            return resolve(serverErrorMsg);
          })
        } else {
          this.accept = '';
          this.mistakes++;
          if (this.mistakes == 2) {
            this.state = 'gameover';
            // ver que hacer
          }
          return resolve(`La opción ingresada es inválida.\n\nIngrese una opción válida.\n*1* - Confirmar efectivo\n*2* - Confirmar débito/crédito\n*3* - Cancelar`);
        }
      }
    });

  }
}

module.exports = GuessNumber;
