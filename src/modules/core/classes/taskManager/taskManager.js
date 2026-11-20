import { validateDataType, validateDataTypeOfArrayValues } from "../../../utils/validateDataType";
import { Tasklist } from "../tasklist";
import { publishTaskMovedTopic } from "./topic_taskMoved";

const TaskManager = class {
  #defaultTasklist = new Tasklist({
    title: 'Default Tasklist',
    description: 'Contains tasks not assigned to another tasklist',
  });

  #tasklists = [ this.#defaultTasklist ];

  // Validation methods used in the task manager operations (addition and removal of tasklists and tasks). No errors thrown for attempt to add an already existing tasklist or task; the addition method simply returns.
  #validationMethods = {
    validateTasklistIsInTaskManager: (tasklist) => {
      const isTasklistInTaskManager = this.containsTasklist(tasklist);

      if (!isTasklistInTaskManager)
        throw new Error(`Tasklist of ID ${tasklist.id} does not exist in the task manager.`);
    },

    validateTaskIsInTaskManager: (task) => {
      const isTaskInTaskManager = this.containsTask(task);

      if (!isTaskInTaskManager)
        throw new Error(`Task of ID ${task.id} does not exist in the task manager.`);
    },

    validateTasklistIsNotDefaultTasklist: (tasklist) => {
      const isTasklistDefaultTasklist = tasklist === this.#defaultTasklist;

      if (isTasklistDefaultTasklist)
        throw new Error(`Cannot remove the default tasklist from the task manager.`)
    },
  }

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
      this.#validationMethods.validateTasklistIsInTaskManager(tasklist);
      this.#validationMethods.validateTasklistIsNotDefaultTasklist(tasklist);

      const tasklistIndex = this.#tasklists.indexOf(tasklist);
      this.#tasklists.splice(tasklistIndex, 1);
    });
  }

  // Methods to add, remove, and move tasks to or from tasklists

  // Adds tasks that are in or not in the task manager to the destination tasklist (if equal to `null`, tasks are removed from the task manager).
  addTasksTo(destinationTasklist, ...tasks) {
    validateDataType(destinationTasklist, 'destinationTasklist', ['Tasklist', 'Null']);
    validateDataTypeOfArrayValues(tasks, 'tasks', ['Task']);

    const isDestinationTasklistNull = (destinationTasklist === null);

    if (!isDestinationTasklistNull)
      this.#validationMethods.validateTasklistIsInTaskManager(destinationTasklist);

    tasks.forEach((task) => {
      const sourceTasklist = task.tasklist;
      publishTaskMovedTopic(task, sourceTasklist, destinationTasklist);
    });
  }

  // Adds tasks that are in or not in the task manager to the default tasklist.
  addTasksToDefaultTasklist(...tasks) {
    this.addTasksTo(this.#defaultTasklist, ...tasks);
  }

  // Adds tasks that are not in the task manager to the default tasklist.
  addTasks(...tasks) {
    tasks.forEach(task => {
      const isTaskInTaskManager = this.containsTask(task);

      // TODO: Throw an error if more appropriate.
      if (isTaskInTaskManager)
        return;

      this.addTasksTo(this.#defaultTasklist, task);
    });
  }

  // Removes tasks from the task manager.
  removeTasks(...tasks) {
    tasks.forEach(task => {
      this.#validationMethods.validateTaskIsInTaskManager(task);

      this.addTasksTo(null, task);
    });
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
