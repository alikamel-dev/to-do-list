import { taskManager } from "../core/classes/taskManager/taskManager";

const taskManagerLocalStorageItem = 'taskManager';

const saveTaskManagerToLocalStorage = () => {
  const JSONTaskManager = taskManager.toJSON();

  localStorage.setItem(taskManagerLocalStorageItem, JSONTaskManager);

  return JSONTaskManager;
};

const loadTaskManagerFromLocalStorage = () => {
  let JSONTaskManager = localStorage.getItem(taskManagerLocalStorageItem);

  // `Storage.setItem()` (in `saveTaskManagerToLocalStorage()`) creates the item of the given key if it does not exist.
  if (JSONTaskManager === null)
    JSONTaskManager = saveTaskManagerToLocalStorage();

  const JSTaskManager = taskManager.fromJSON(JSONTaskManager);

  return JSTaskManager;
}

export {
  saveTaskManagerToLocalStorage,
  loadTaskManagerFromLocalStorage,
}
