import { SubtaskPrototype } from "../base/base";
import { generateId } from "../base/generateId";

const Subtask = class extends SubtaskPrototype {
  // Private elements commented out are those inherited from `SubtaskPrototype`.

  #id;

  // #title;

  // #isComplete;

  constructor({ title }) {
    super();

    this.#id = generateId();

    // `Object.assign` invokes setters on the target object when overwriting existing properties. This is intentional, to enforce argument validation on instantiation.
    Object.assign(this, { title });

    // `Object.assign` does not perform deep cloning of objects, which is acceptable for this class.

    // Make class and objects instantiated from it immutable except for changing values of writable properties.
    Object.seal(this);
  }

  // Makes a call of `Object.prototype.toString.call` on an instance of `Subtask` return `[Object Subtask]`. Required for type validation.
  get [Symbol.toStringTag]() {
    return 'Subtask';
  }

  // Accessors
  // ---------

  get id() {
    return this.#id;
  }

  // JSON-related methods

  // Used internally by `JSON.stringify()`.
  toJSON() {
    return JSON.stringify({
      type: 'subtask',

      id: this.id,

      title: this.title,

      isComplete: this.isComplete,
    });
  }

  static fromJSON(JSONSubtask) {
    const JSONSubtaskObject = JSON.parse(JSONSubtask);

    const subtask = new Subtask(JSONSubtaskObject);

    // Private elements are visible in the class scope, not the class instance scope, so a method of a class can access the private elements of any instance of this class.    
    subtask.#id = JSONSubtaskObject.id;

    subtask.isComplete = JSONSubtaskObject.isComplete;

    return subtask;
  }
}

export { Subtask };
