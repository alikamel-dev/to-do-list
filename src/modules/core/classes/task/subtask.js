import { SubtaskPrototype } from "../base/base";

const Subtask = class extends SubtaskPrototype {
  // Private elements commented out are those inherited from `SubtaskPrototype`.

  // #id;
  // #title;
  
  // #isComplete;

  constructor(title) {
    super(title);

    // Make class and objects instantiated from it immutable except for changing values of writable properties.
    Object.seal(this);
  }

  // Makes a call of `Object.prototype.toString.call` on an instance of `Subtask` return `[Object Subtask]`. Required for type validation.
  get [Symbol.toStringTag]() {
    return Subtask.name;
  }
}

export { Subtask };
