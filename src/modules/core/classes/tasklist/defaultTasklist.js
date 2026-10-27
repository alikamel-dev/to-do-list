import { validateDataType } from "../../../utils/validateDataType";
import { Tasklist } from "./tasklist";

const DEFAULT_TASKLIST_ARGS = Object.freeze({
  title: 'DEFAULT',
  description: 'Default tasklist. Contains tasks not assigned to another tasklist.',
});

const DEFAULT_TASKLIST = new Tasklist(DEFAULT_TASKLIST_ARGS);

export { DEFAULT_TASKLIST };
