const { BrandedCallList } = require('twilio/lib/rest/preview/trusted_comms/brandedCall');
const { messages } = require('../messages');

class GuessNumber {
  static name = 'Guess a Number';

  constructor(gameId, req) {
    this.state = 'play';
    this.step = 'init';
    this.gameId = gameId;
    this.amount = '';
    this.name = req.Body;
    this.phone = req.WaId
    this.note = ''
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

  storeUser(name, address, phone, cash, delivered, deliveryTime, note) {
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
      const result = connection.query('insert into requests (name, address, phone, cash, delivered, delivery_time, date, note) values (?,?,?,?,?,?,?,?);',
        [name, address, phone, cash, delivered, deliveryTime, date, note], function (error, results, fields) {
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
      switch (this.step) {
        case 'init':
          this.askForAmount(resolve);
          break;
        case 'amount':
          if (this.handleAmountResponse(message, resolve)) {
            this.askForName(resolve);
          };
          break;
        case 'name':
          if (this.handleNameResponse(message, resolve)) {
            this.askForAddress(resolve);
          }
          break;
        case 'address':
          if (this.handleAddressResponse(message, resolve)) {
            this.askForConfirmationOrNote(resolve);
          };
          break;
        case 'confirmOrNote':
          if (this.handleConfirmationOrNoteResponse(message, resolve)) {
            this.askForNote(resolve);
          }
          break;
        case 'note':
          if (this.handleNoteResponse(message, resolve)) {
            this.askForConfirmation(resolve);
          };
          break;
        case 'confirm':
          this.handleConfirmationResponse(message, resolve);
          break;
      };
    });
  }

  askForAmount(resolve) {
    this.step = 'amount'
    resolve(messages.askForAmountMsg);
  }

  handleAmountResponse(message, resolve) {
    if (message === '1' || message === '2') {
      this.amount = message;
      this.step = 'name';
      return true;
    } else {
      resolve(messages.invalidOption + messages.amount);
      return false;
    }
  }

  askForName(resolve) {
    resolve(messages.askForName);
  }

  handleNameResponse(message, resolve) {
    if (typeof message !== 'string' || message === '') {
      resolve(`Mensaje inválido. Intente de nuevo.`);
      return false;
    } else {
      this.name = message;
      this.step = 'address';
      return true;
    }
  }

  askForAddress(resolve) {
    resolve(messages.askForAddress);
  }

  handleAddressResponse(message, resolve) {
    if (typeof message !== 'string' || message === '') {
      resolve(`Mensaje inválido. Intente de nuevo.`);
      return false;
    } else {
      this.address = message;
      this.step = 'confirmOrNote';
      return true;
    }
  }

  askForConfirmationOrNote(resolve) {
    var mysql = require('mysql')
    var connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'whatsapp'
    })
    connection.connect();
    connection.query('select value from settings where `key`="delivery_delay"', (error, results, fields) => {
      var date = new Date();
      var hourA = date.getHours() + (+results[0].value);
      var minutes = date.getMinutes();
      if (minutes <= 9) {
        minutes = '0' + minutes;
      }
      this.deliveryTime = hourA + ':' + minutes;
      resolve(messages.askForConfirm(this.deliveryTime));

      if (error) {
        reject(error);
        console.log(error);
      } else {

      }
      connection.end();
    });

  }

  handleConfirmationOrNoteResponse(message, resolve) {

    if (message === '4') {
      this.state = 'gameover';
      resolve(messages.cancelled);
    } else if (message === '1') {
      this.storeUser(this.name, this.address, this.phone, this.cash, 0, this.deliveryTime).then(response => {
        this.cash = true;
        this.state = 'gameover';
        console.log("Antes de resolve message === 1");
        resolve(messages.confirmMessage(this.name, this.address, this.deliveryTime, this.note));
      }).catch(error => {
        console.log("Catch message === 1");
        this.state = 'gameover';
        resolve(serverErrorMsg);
      })
    } else if (message === '2') {
      this.storeUser(this.name, this.address, this.phone, this.cash, 0, this.deliveryTime).then(response => {
        this.cash = false;
        this.state = 'gameover';
        resolve(messages.confirmMessage(this.name, this.address, this.deliveryTime, this.note));
      }).catch(error => {
        this.state = 'gameover';
        resolve(serverErrorMsg);
      })
    } else if (message === '3') {
      this.step = 'note';
      return true;
    } else {
      resolve(messages.invalidOption + messages.confirmOptions);
    }
    return false;
  }

  askForNote(resolve) {
    resolve(messages.askForNote);
  }

  handleNoteResponse(message, resolve) {
    if (typeof message !== 'string' || message === '') {
      resolve(messages.invalidMessage);
      return false;
    } else {
      this.note = message;
      this.step = 'confirm';
      return true;
    }
  }

  askForConfirmation(resolve) {
    resolve(messages.noteSaved + messages.confirmOptionsWithoutNote);
  }

  handleConfirmationResponse(message, resolve) {
    if (message === '1') {
      this.storeUser(this.name, this.address, this.phone, this.cash, 0, this.deliveryTime, this.note).then(response => {
        this.cash = true;
        this.state = 'gameover';
        console.log("Antes de resolve message === 1");
        resolve(`Su solicitud se ingresó correctamente ✅\n\n*Nombre:* ${this.name}\n*Dirección:* ${this.address}\n*Precio:* $XXX\n*Horario de entrega:* ${this.deliveryTime}\n\nPor cualquier consulta comunicarse al XXX`);
      }).catch(error => {
        console.log("Catch message === 1");
        this.state = 'gameover';
        resolve(serverErrorMsg);
      })
    } else if (message === '2') {
      this.storeUser(this.name, this.address, this.phone, this.cash, 0, this.deliveryTime, this.note).then(response => {
        this.cash = false;
        this.state = 'gameover';
        resolve(`Su solicitud se ingresó correctamente ✅\n\n*Nombre:* ${this.name}\n*Dirección:* ${this.address}\n*Precio:* $XXX\n*Horario de entrega:* ${this.deliveryTime}\n\nPor cualquier consulta comunicarse al XXX`)
      }).catch(error => {
        this.state = 'gameover';
        resolve(serverErrorMsg);
      })
    } else if (message === '3') {
      this.state = 'gameover';
      resolve(messages.cancelled);
    } else {
      resolve(messages.invalidOption + messages.confirmOptionsWithoutNote);
    }
    return false;
  }
}

module.exports = GuessNumber;
