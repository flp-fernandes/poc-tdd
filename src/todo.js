const uuid = require('uuid');

class Todo {
  constructor({ text, when }) {
    this.text = text;
    this.when = when;
    this.status = '';
    this.id = uuid.v4();
  }

  isValid () {
    // 0 or "" or false converts to false
    return !!this.text && !isNaN(this.when.valueOf());
  }
}

module.exports = Todo;