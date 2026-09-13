import { TaskPrototype } from "../base/base";

import { getDataTypeOf, validateDataType, validateDataTypeOfArrayValues } from "../../utils/validateDataType";
import { markAsCode } from "../../utils/formatCode";

import PubSub from "pubsub-js";

const Task = class extends TaskPrototype {
  // Private elements commented out are those inherited from `TaskPrototype`.

  // #title;
  // #description;

  #dueDate;
  #priority;

  #notes;

  #subtasks;

  #tasklist;

  // #isCompleted;

  constructor(title, description = null, dueDate = null, priority = null, notes = null, subtasks = null, tasklist = null) {
    super();

    // `Object.assign` invokes setters on the target object when overwriting existing properties. This is intentional, to enforce argument validation on instantiation.
    Object.assign(this, { title, description, dueDate, priority, notes, subtasks, tasklist });

    // `Object.assign` does not perform deep cloning of objects, which is acceptable for this class.

    // Make class and objects instantiated from it immutable except for changing values of properties.
    Object.seal(this);
  }

  // Makes a call of `Object.prototype.toString.call` on an instance of `Task` return `[Object Task]`. Required for type validation.
  get [Symbol.toStringTag]() {
    return 'Task';
  }

  // Accessors
  // ---------

  // Accessors for due date

  get dueDate() {
    // Return a deep copy of the `Date` object to prevent mutations.
    return structuredClone(this.#dueDate);
  }

  set dueDate(newDueDate = null) {
    this.#dueDate = validateDataType(newDueDate, 'dueDate', ['Date', 'Null']);
  }

  // Accessors for priority

  get priority() {
    return this.#priority;
  }

  set priority(newPriority = null) {
    validateDataType(newPriority, 'priority', ['Number', 'Null']);

    // Validate that `newPriority` represents an integer number.
    if (getDataTypeOf(newPriority) === 'Number' && !Number.isInteger(newPriority))
      throw new TypeError(`priority can only be represented by a ${markAsCode('Number')} representing an integer.`);

    // `Number.isInteger` returns `true` for some floating point numbers. Refer to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger#description
    this.#priority = Math.trunc(newPriority);
  }

  // Accessors for notes

  get notes() {
    return this.#notes;
  }

  set notes(newNotes = null) {
    this.#notes = validateDataType(newNotes, 'notes', ['String', 'Null']);
  }

  // Accessors for subtasks

  get subtasks() {
    // Return a copy of the array to prevent mutation
    return Array.from(this.#subtasks);
  };

  set subtasks(newSubtasks = null) {
    const subtasksArray = validateDataType(newSubtasks, 'subtasks', ['Array', 'Null']);

    if (subtasksArray)
      validateDataTypeOfArrayValues(subtasksArray, 'subtasks', ['Subtask']);

    this.#subtasks = subtasksArray;
  }
}

export { Task };
