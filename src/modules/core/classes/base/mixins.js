import { markAsCode } from "../../../utils/formatCode";
import { validateDataType } from "../../../utils/validateDataType";

// Mixins for shared functionality across classes

// TODO: Improve mixins.

// Error to be thrown on attempt to call a mixin with the `new` keyword
const newMixinError = (Mixin) => {
  return new TypeError(`Mixin ${markAsCode(Mixin.name)} can only be instantiated as a base class.`);
}

// `super(...arguments)` was used in the constructors for the following mixins to ensure that the base class constructor is called with any arguments it needs, but it led to incorrect argument assignment.
// The solution is to make mixin constructors have no arguments, with private fields that should have the same value for all objects being initialized with this value within mixin constructors, and other private fields being initialized using setters in the inheriting classes instead of the mixins.

// Read more in section "Constructors and Initialization" of the following article: https://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/.

// Mixin for ID field
const idMixin = (Base = class {}) => class IdMixin extends Base {
  #id;

  constructor() {
    if (new.target === IdMixin)
      throw newMixinError(IdMixin);

    super();

    this.#id = crypto.randomUUID();
  }

  get id() { return this.#id; }
}

// Mixin for title field
const titleMixin = (Base = class {}) => class TitleMixin extends Base {
  #title;

  constructor() {
    if (new.target === TitleMixin)
      throw newMixinError(TitleMixin);

    super();
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

  constructor() {
    if (new.target === DescriptionMixin)
      throw newMixinError(DescriptionMixin);

    super();
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

    super();

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
