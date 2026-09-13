import { SubtaskPrototype } from "../base/base";

const Subtask = class extends SubtaskPrototype {
  // Private elements commented out are those inherited from `SubtaskPrototype`.

  // #id;
  // #title;
  
  // #isComplete;

  constructor(title) {
    super();

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
}

export { Subtask };
