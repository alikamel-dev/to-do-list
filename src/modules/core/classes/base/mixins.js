import { markAsCode } from "../../utils/formatCode";
import { validateDataType } from "../../utils/validateDataType";

// Mixins for shared functionality across classes

// TODO: Improve mixins.

// Error to be thrown on attempt to call a mixin with the `new` keyword
const newMixinError = (Mixin) => {
  return new TypeError(`Mixin ${markAsCode(Mixin.name)} can only be instantiated as a base class.`);
}

// `super(...arguments)` is used in the constructors for the following mixins to ensure that the base class constructor is called with any arguments it needs.

// Mixin for ID field
const idMixin = (Base = class {}) => class IdMixin extends Base {
  #id;

  constructor() {
    if (new.target === IdMixin)
      throw newMixinError(IdMixin);

    super(...arguments);

    this.#id = crypto.randomUUID();
  }

  get id() { return this.#id; }
}

// Mixin for title field
const titleMixin = (Base = class {}) => class TitleMixin extends Base {
  #title;

  constructor(title) {
    if (new.target === TitleMixin)
      throw newMixinError(TitleMixin);

    super(...arguments);

    this.title = title;
  }

  get title() {
    return this.#title;
  }

  set title(newTitle) {
    this.#title = validateDataType(newTitle, 'title', ['String']);
  }
}

// Mixin for description field
const descriptionMixin = (Base = class {}) => class DescriptionMixin extends Base {
  #description;

  constructor(description = null) {
    if (new.target === DescriptionMixin)
      throw newMixinError(DescriptionMixin);

    super(...arguments);

    this.description = description;
  }

  get description() {
    return this.#description;
  }

  set description(newDescription) {
    this.#description = validateDataType(newDescription, 'description', ['String', 'Null']);
  }
}

// Mixin for completion status field
const isCompleteMixin = (Base = class {}) => class IsCompleteMixin extends Base {
  #isComplete;

  constructor() {
    if (new.target === IsCompleteMixin)
      throw newMixinError(IsCompleteMixin);

    super(...arguments);

    this.isComplete = false;
  }

  get isComplete() {
    return this.#isComplete;
  }

  set isComplete(isComplete) {
    this.#isComplete = validateDataType(isComplete, 'isComplete', ['Boolean']);
  }

  markAsComplete() {
    this.#isComplete = true;
  }

  markAsIncomplete() {
    this.#isComplete = false;
  }

  toggleCompletionStatus() {
    this.#isComplete = !this.isComplete;
  }
}

export {
  idMixin,
  titleMixin,
  descriptionMixin,
  isCompleteMixin,
};
