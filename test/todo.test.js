const { describe, it, before } = require("mocha");
const { expect } = require("chai");
const Todo = require('../src/todo');

describe("Todo", () => {
  describe("#isValid", () => {
    const dataValid = {
      text: 'Hello World',
      when: new Date('2024-04-11')
    }

    it('should return invalid when creating an object without text', () => {
      const dataEdited = { ...dataValid, text: '' };

      const todo = new Todo(dataEdited);
      const result = todo.isValid();

      expect(result).to.be.not.ok;
    });

    it('should return invalid when creating an object using "when" property invalid', () => {

      const dataEdited = {
        ...dataValid,
        when: new Date('20-04-11')
      };

      const todo = new Todo(dataEdited);
      const result = todo.isValid();

      expect(result).to.be.not.ok;
    });

    it('should have "id", "text", "when" and "status" properties after creating object', () => {
      const todo = new Todo(dataValid);
      const result = todo.isValid();

      expect(result).to.be.ok;
    });
  })
});