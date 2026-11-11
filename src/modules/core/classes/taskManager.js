import { validateDataType } from "../../utils/validateDataType";
import { Tasklist } from "./tasklist";

const TaskManager = class {
  #defaultTasklist = new Tasklist({
    title: 'Default Tasklist',
    description: 'Contains tasks not assigned to another tasklist',
  });

  #tasklists = [ this.#defaultTasklist ];

  get [Symbol.toStringTag]() {
    return 'TaskManager';
  }

  // Accessors
  // ---------

  // TODO: Improve performance of the counting and searching methods.

  // Accessors for tasklists

  get tasklists() {
    return Array.from(this.#tasklists);
  }

  get defaultTasklist() {
    return this.#defaultTasklist;
  }

  get numberOfTasklists() {
    return this.#tasklists.length;
  }

  // Returns the number of tasklists excluding the default tasklist.
  get numberOfUserTasklists() {
    return this.#tasklists.length - 1;
  }

  // Accessors for tasks

  get tasks() {
    // TODO: Improve performance of the task getter.

    let allTasks = [];

    this.#tasklists.forEach(tasklist => allTasks = allTasks.concat(tasklist.tasks));

    // Prevent mutations to the original array while allowing changing properties of objects within it.
    return Array.from(allTasks);
  }

  get numberOfTasks() {
    return this.#tasklists.reduce((totalNumberOfTasks, currentTasklist) => totalNumberOfTasks + currentTasklist.numberOfTasks, 0);
  }

  // Search methods

  getTasklist(id) {
    validateDataType(id, 'id', ['String']);

    return this.#tasklists.find(tasklist => tasklist.id === id) ?? null;
  }

  getTask(id) {
    validateDataType(id, 'id', ['String']);

    for (const tasklist in this.#tasklists) {
      const task = tasklist.getTask(id);

      if (task)
        return task;
    }

    return null;
  }

  containsTasklist(id) {
    validateDataType(id, 'id', ['String']);

    return this.getTasklist(id) !== null;
  }

  containsTask(id) {
    validateDataType(id, 'id', ['String']);

    return this.getTask(id) !== null;
  }

  // JSON-related methods

  // Used internally by `JSON.stringify()`.
  toJSON() {
    return {
      // Facilitates identification of type of source object.
      type: 'taskManager',

      tasklists: this.#tasklists,
      defaultTasklist: this.#defaultTasklist.id,
    };
  }

  fromJSON(JSONTaskManager) {
    const JSONTaskManagerObject = JSON.parse(JSONTaskManager);

    // There is supposed to be exactly one task manager for the entire application, so constructing a new `TaskManager` object makes no sense.

    this.#tasklists = JSONTaskManagerObject.tasklists.map(JSONTasklistObject => Tasklist.fromJSON(JSON.stringify(JSONTasklistObject)));
    this.#defaultTasklist = this.getTasklist(JSONTaskManagerObject.defaultTasklist);

    return this;
  }
}

const taskManager = new TaskManager();

export { taskManager };
