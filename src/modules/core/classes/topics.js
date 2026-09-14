import { validateDataType } from "../../utils/validateDataType";

// Constants and functions for PubSub topics.

const topicWithObjectId = (topicName, object) => {
  return `${topicName}.${object.id}`;
}

const topic_taskAddedTo = (tasklist) => {
  validateDataType(tasklist, 'tasklist', ['Tasklist']);

  const topicName = 'taskAddedTo';

  return topicWithObjectId(topicName, tasklist);
}

const topic_taskRemovedFrom = (tasklist) => {
  validateDataType(tasklist, 'tasklist', ['Tasklist']);

  const topicName = 'taskRemovedFrom';

  return topicWithObjectId(topicName, tasklist);
}

export {
  topic_taskAddedTo,
  topic_taskRemovedFrom,
};
