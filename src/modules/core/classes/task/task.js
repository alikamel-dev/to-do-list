import { TaskPrototype } from "../base/base";

import { getDataTypeOf, validateDataType, validateDataTypeOfArrayValues } from "../../../utils/validateDataType";
import { markAsCode } from "../../../utils/formatCode";
import { generateId } from "../base/generateId";
import { taskManager } from "../taskManager";
import { Subtask } from "./subtask";

const Task = class extends TaskPrototype {
  // Private elements commented out are those inherited from the mixin.

  #id;

  // #title;
  // #description;

  #dueDate;
  #priority;

  #notes;

  #subtasks;

  // Read-only field whose value is the tasklist to which the task belongs, or `null` if none. The value is internally updated when the tasklist is added or removed from a tasklist.
  #tasklist = null;

  // #isComplete;

  constructor({ title, description = null, dueDate = null, priority = null, notes = null, subtasks = null }) {
    super();

    this.#id = generateId();

    // `Object.assign` invokes setters on the target object when overwriting existing properties. This is intentional, to enforce argument validation on instantiation.
    Object.assign(this, { title, description, dueDate, priority, notes, subtasks });

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

  // Accessors for ID

  get id() {
    return this.#id;
  }

  // Accessors for due date

  // TODO: Improve date format if needed.

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

    // `Number.isInteger` returns `true` for some floating point numbers. Refer to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger#description.
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

  // Accessors for tasklist

  get tasklist() {
    return this.#tasklist;
  }

  // JSON-related methods

  // Used internally by `JSON.stringify()`.
  toJSON() {
    return {
      // Facilitates identification of type of source object.
      type: 'task',

      id: this.id,

      title: this.title,
      description: this.description,

      dueDate: this.dueDate,
      priority: this.priority,

      notes: this.notes,

      subtasks: this.subtasks,

      isComplete: this.isComplete,

      // If the task is in a tasklist, serialize the tasklist ID, else, serialize `null`.
      tasklist: this.tasklist?.id ?? null,
    }
  }

  static fromJSON(JSONTask) {
    const JSONTaskObject = JSON.parse(JSONTask);

    // Convert plain objects representing class instances to the correct class before construction.
    JSONTaskObject.subtasks = JSONTaskObject.subtasks.map(JSONSubtaskObject => Subtask.fromJSON(JSON.stringify(JSONSubtaskObject)));

    const task = new Task(JSONTaskObject);

    // Private elements are visible in the class scope, not the class instance scope, so a method of a class can access the private elements of any instance of this class.    
    task.#id = JSONTaskObject.id;

    task.isComplete = JSONTaskObject.isComplete;

    task.#tasklist = task.tasklist !== null ? taskManager.getTasklist(JSONTaskObject.tasklist) : null;

    return task;
  }
}

export { Task };
