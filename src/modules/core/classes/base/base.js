import { descriptionMixin, idMixin, isCompleteMixin, titleMixin } from "./mixins";

const TaskPrototype = isCompleteMixin(descriptionMixin(titleMixin()));

const SubtaskPrototype = isCompleteMixin(titleMixin());

const TasklistPrototype = descriptionMixin(titleMixin());

export { TaskPrototype, SubtaskPrototype, TasklistPrototype };
