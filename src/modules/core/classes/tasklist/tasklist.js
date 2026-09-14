import { validateDataType, validateDataTypeOfArrayValues } from "../../../utils/validateDataType";
import { TasklistPrototype } from "../base/base";

import PubSub from "pubsub-js";
import { topic_taskAddedTo, topic_taskRemovedFrom } from "../topics";

const Tasklist = class extends TasklistPrototype {
  // Private elements commented out are those inherited from `TasklistPrototype`

  // #id;

  // #title;
  // #description;

  #tasks;

  constructor(title, description = null) {
    super();

    // `Object.assign` invokes setters on the target object when overwriting existing properties. This is intentional, to enforce argument validation on instantiation.
    Object.assign(this, { title, description });

    // `Object.assign` does not perform deep cloning of objects, which is acceptable for this class.

    this.#tasks = [];

    this.#initiateSubscriptions();

    // Make class and objects instantiated from it immutable except for changing values of properties.
    Object.seal(this);
  }

  // Makes a call of `Object.prototype.toString.call` on an instance of `Tasklist` return `[Object Tasklist]`. Required for type validation.
  get [Symbol.toStringTag]() {
    return 'Tasklist';
  }

  // Accessors
  // ---------

  get tasks() {
    return Array.from(this.#tasks);
  }

  get numberOfTasks() {
    return this.#tasks.length;
  }

  contains(task) {
    validateDataType(task, 'task', ['Task']);

    return this.#tasks.includes(task);
  }

  // Setter `Task.prototype.tasklist` causes the old tasklist and the new tasklist to remove and add the task, respectively, by sending a message to both using the `PubSub` module.
  // `Tasklist` class is thus tightly coupled to `Task` class, but the simplicity achieved by this outweighs the insignificant advantages offered by making `Tasklist` objects also send a message to `Task` objects.

  addTasks(newTasks) {
    const parameterName = 'newTasks';

    validateDataType(newTasks, parameterName, ['Array']);

    newTasks.forEach((task, taskIndex) => {
      validateDataType(task, `${parameterName}[${taskIndex}]`, ['Task']);

      task.tasklist = this;
    });
  }

  removeTasks(tasks = Array.from(this.#tasks), newTasklist = null) {
    const parameterName = 'tasks';

    validateDataType(tasks, parameterName, ['Array']);
    validateDataType(newTasklist, parameterName, ['Tasklist', 'Null']);

    tasks.forEach((task, taskIndex) => {
      validateDataType(task, `${parameterName}[${taskIndex}]`, ['Task']);

      // Prevent one tasklist from removing tasks from another tasklist
      if (!this.contains(task))
        throw new ReferenceError(`Cannot remove task of index ${taskIndex} in arguments (ID is ${task.id}). It does not exist in this tasklist of ID ${this.id}.`);

      task.tasklist = newTasklist;
    });
  }

  addTasksFromTasklist(tasklist) {
    validateDataType(tasklist, 'tasklist', ['Tasklist']);

    this.addTasks(tasklist.tasks);
  }

  removeAllTasks() {
    this.removeTasks();
  }

  set tasks(newTasks) {
    // TODO: Improve the performance of this method.

    this.removeAllTasks();
    this.addTasks(newTasks);
  }

  // The following two private methods simply modify the tasks array without making any additional changes, such as changing the value of the `tasklist` property of added/removed `Task`s.

  #subscriber_taskAdded(msg, task) {
    if (this.contains(task))
      return;

    this.#tasks.push(task);
  }

  #subscriber_taskRemoved(msg, task) {
    if (!this.contains(task))
      return;

    const indexOfTask = this.#tasks.indexOf(task);
    this.#tasks.splice(indexOfTask, 1);
  }

  // Method to initiate subscriptions on class instantiation.
  #initiateSubscriptions() {
    PubSub.subscribe(topic_taskAddedTo(this), this.#subscriber_taskAdded.bind(this));
    PubSub.subscribe(topic_taskRemovedFrom(this), this.#subscriber_taskRemoved.bind(this));
  }
}

export { Tasklist }
