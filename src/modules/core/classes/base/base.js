import { descriptionMixin, idMixin, isCompleteMixin, titleMixin } from "./mixins";

const TaskPrototype = isCompleteMixin(descriptionMixin(titleMixin(idMixin())));

const SubtaskPrototype = isCompleteMixin(titleMixin(idMixin()));

const TasklistPrototype = descriptionMixin(titleMixin(idMixin()));

export { TaskPrototype, SubtaskPrototype, TasklistPrototype };
