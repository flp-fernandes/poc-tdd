const { describe, it, before, afterEach } = require("mocha");
const { expect } = require("chai");
const { createSandbox } = require('sinon');

const TodoService = require('../src/todoService');
const Todo = require('../src/todo');

describe('todoService', () => {
  let sandbox;

  before(() => {
    sandbox = createSandbox();
  });

  afterEach(() => sandbox.restore());

  describe('#list', () => {
    const mockDatabase = [
      {
        name: 'Xuxa Da Silva',
        age: 90,
        meta: { revision: 0, created: 1712862133143, version: 0 },
        '$loki': 1
      },
    ]

    let todoService;
    beforeEach(() => {
      const dependencies = {
        todoRepository: {
          list: sandbox.stub().returns(mockDatabase)
        }
      };

      todoService = new TodoService(dependencies);
    });

    it('should return data on a specific format', () => {
      const result = todoService.list();
      const [{ meta, $loki, ...expected }] = mockDatabase;

      expect(result).to.be.deep.equal([expected]);
    })
  })

  describe('#create', () => {
    let todoService;
    beforeEach(() => {
      const dependencies = {
        todoRepository: {
          create: sandbox.stub().returns(true)
        }
      };

      todoService = new TodoService(dependencies);
    });

    it('should not save todo item with invalid data', () => {
      const data = new Todo({
        text: '',
        when: ''
      })

      Reflect.deleteProperty(data, 'id');

      const expected = {
        error: {
          message: 'invalid data',
          data: data
        }
      }

      const result = todoService.create(data);

      expect(result).to.be.deep.equal(expected);
    });

    it('should save todo item with late status when property is further than today', () => {
      const properties = {
        text: 'I must walk with my dog',
        when: new Date('2024-04-11 12:00:00 GMT-0')
      }

      const data = new Todo(properties);
      Reflect.set(data, 'id', '00001');

      const today = new Date('2024-04-13');
      sandbox.useFakeTimers(today.getTime());

      todoService.create(data);

      const expectedCallWith = {
        ...properties,
        id: data.id,
        status: "late"
      };

      expect(todoService.todoRepository.create.calledOnceWithExactly(expectedCallWith)).to.be.ok
    });

    it('should save todo item with with pending status', () => {
      const properties = {
        text: 'I must walk with my dog',
        when: new Date('2024-04-14 12:00:00 GMT-0')
      }

      const data = new Todo(properties);
      Reflect.set(data, 'id', '00001');

      const today = new Date('2024-04-13');
      sandbox.useFakeTimers(today.getTime());

      todoService.create(data);

      const expectedCallWith = {
        ...properties,
        id: data.id,
        status: "pending"
      };

      expect(todoService.todoRepository.create.calledOnceWithExactly(expectedCallWith)).to.be.ok
    });
  });
});