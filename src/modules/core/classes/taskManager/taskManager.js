import { validateDataType, validateDataTypeOfArrayValues } from "../../../utils/validateDataType";
import { Tasklist } from "../tasklist";
import { publishTaskMovedTopic } from "./topic_taskMoved";

const TaskManager = class {
  #defaultTasklist = new Tasklist({
    title: 'Default Tasklist',
    description: 'Contains tasks not assigned to another tasklist',
  });

  #tasklists = [ this.#defaultTasklist ];

  // TODO: Create validation methods to throw required errors.

  // Makes a call of `Object.prototype.toString.call` on an instance of `TaskManager` return `[Object TaskManager]`. Required for type validation.
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

  containsTasklist(tasklist) {
    validateDataType(tasklist, 'tasklist', ['Tasklist']);

    return this.#tasklists.includes(tasklist);
  }

  containsTask(task) {
    validateDataType(task, 'task', ['Task']);

    return this.#tasklists.some(tasklist => tasklist.containsTask(task));
  }

  containsTasklistOfID(id) {
    validateDataType(id, 'id', ['String']);

    return this.getTasklist(id) !== null;
  }

  containsTaskOfID(id) {
    validateDataType(id, 'id', ['String']);

    return this.getTask(id) !== null;
  }

  // Methods to add and remove tasklists

  addTasklists(...tasklists) {
    validateDataTypeOfArrayValues(tasklists, 'tasklists', ['Tasklist']);

    tasklists.forEach(tasklist => {
      const isTasklistInTaskManager = this.containsTasklist(tasklist);

      // TODO: Throw an error if more appropriate.
      if (isTasklistInTaskManager)
        return;

      this.#tasklists.push(tasklist);
    });
  }

  removeTasklists(...tasklists) {
    validateDataTypeOfArrayValues(tasklists, 'tasklists', ['Tasklist']);

    tasklists.forEach((tasklist) => {
      const isTasklistInTaskManager = this.containsTasklist(tasklist);
      const isTasklistNotTheDefaultTasklist = (tasklist !== this.#defaultTasklist);

      const isTasklistValid = isTasklistInTaskManager && isTasklistNotTheDefaultTasklist;

      // TODO: Throw an error if more appropriate.
      if (!isTasklistValid)
        return;

      const tasklistIndex = this.#tasklists.indexOf(tasklist);
      this.#tasklists.splice(tasklistIndex, 1);
    });
  }

  // Methods to add, remove, and move tasks to or from tasklists

  moveTasksTo(destinationTasklist, ...tasks) {
    validateDataType(destinationTasklist, 'destinationTasklist', ['Tasklist', 'Null']);
    validateDataTypeOfArrayValues(tasks, 'tasks', ['Task']);

    const isDestinationTasklistNull = (destinationTasklist === null);

    const isDestinationTasklistValid = isDestinationTasklistNull || this.containsTasklist(destinationTasklist);

    // TODO: Throw an error if more appropriate.
    if (!isDestinationTasklistValid)
      return;

    tasks.forEach((task) => {
      const sourceTasklist = task.tasklist;
      publishTaskMovedTopic(task, sourceTasklist, destinationTasklist);
    });
  }

  moveTasksToDefaultTasklist(...tasks) {
    this.moveTasksTo(this.#defaultTasklist, ...tasks);
  }

  addTasks(...tasks) {
    this.moveTasksTo(this.#defaultTasklist, ...tasks);
  }

  removeTasks(...tasks) {
    this.moveTasksTo(null, ...tasks);
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
