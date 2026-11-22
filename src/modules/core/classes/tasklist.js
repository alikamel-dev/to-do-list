import { validateDataType } from "../../utils/validateDataType";
import { publishTopic, subscribeToTopic } from "../TopicPubSub";
import { TasklistPrototype } from "./base/base";

import { generateId } from "./base/generateId";
import { Task } from "./task/task";
import { generateTaskMovedTopic, publishTaskMovedTopic, taskMovedTopic } from "./taskManager/topic_taskMoved";

const Tasklist = class extends TasklistPrototype {
  // Private elements commented out are those inherited from `TasklistPrototype`.

  #id;

  // #title;
  // #description;

  #tasks;

  constructor({ title, description = null }) {
    super();

    this.#id = generateId();

    // `Object.assign` invokes setters on the target object when overwriting existing properties. This is intentional, to enforce argument validation on instantiation.
    Object.assign(this, { title, description });

    // `Object.assign` does not perform deep cloning of objects, which is acceptable for this class.

    this.#tasks = [];

    // Initiate subscriptions of some private methods to relevant PubSub topics.
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

  // Accessors for ID

  get id() {
    return this.#id;
  }

  // Accessors for tasks

  get tasks() {
    return Array.from(this.#tasks);
  }

  get numberOfTasks() {
    return this.#tasks.length;
  }

  getTask(id) {
    validateDataType(id, 'id', ['String']);

    return this.#tasks.find(task => task.id === id) ?? null;
  }

  containsTask(task) {
    validateDataType(task, 'task', ['Task', 'String']);

    return this.#tasks.includes(task);
  }

  containsTaskOfID(id) {
    validateDataType(id, 'id', ['String']);

    return this.#tasks.some(task => task.id === id);
  }

  // Subscriber methods called using PubSub

  #subscriber_addTask(msg, data) {
    const { task, sourceTasklist, destinationTasklist } = data;

    const isNotDestinationTasklist = this.id !== (destinationTasklist?.id ?? null);
    const containsTask = this.containsTask(task);

    const cannotAddTask = (isNotDestinationTasklist || containsTask);

    if (cannotAddTask)
      return;

    this.#tasks.push(task);

    publishTaskMovedTopic(task, sourceTasklist, destinationTasklist, true);
  }

  #subscriber_removeTask(msg, data) {
    const { task, sourceTasklist, destinationTasklist } = data;

    const isNotSourceTasklist = this.id !== (sourceTasklist?.id ?? null);
    const doesNotContainTask = !this.containsTask(task);

    const cannotRemoveTask = (isNotSourceTasklist || doesNotContainTask);

    if (cannotRemoveTask)
      return;

    const indexOfTask = this.#tasks.indexOf(task);
    this.#tasks.splice(indexOfTask, 1);

    publishTaskMovedTopic(task, sourceTasklist, destinationTasklist, true);
  }

  // Initiates subscriptions of subscriber methods to relevant PubSub topics.
  #initiateSubscriptions() {
    subscribeToTopic(this.#subscriber_addTask.bind(this), taskMovedTopic);
    subscribeToTopic(this.#subscriber_removeTask.bind(this), taskMovedTopic);
  }

  // JSON-related methods

  // Used internally by `JSON.stringify()`.
  toJSON() {
    return JSON.stringify({
      // Facilitates the identification of the type of the source object.
      type: 'tasklist',

      id: this.id,

      title: this.title,
      description: this.description,

      tasks: this.tasks,
    });
  }

  static fromJSON(JSONTasklist) {
    const JSONTasklistObject = JSON.parse(JSONTasklist);

    const tasklist = new Tasklist(JSONTasklistObject);

    // Private elements are visible in the class scope, not the class instance scope, so a method of a class can access the private elements of any instance of this class.    
    tasklist.#id = JSONTasklistObject.id;

    tasklist.#tasks = JSONTasklistObject.tasks.map(JSONTaskObject => Task.fromJSON(JSONTaskObject));

    return tasklist;
  }
}

export { Tasklist }
