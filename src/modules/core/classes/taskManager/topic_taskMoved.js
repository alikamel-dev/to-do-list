import { validateDataType } from "../../../utils/validateDataType";
import { publishTopic } from "../../TopicPubSub";

// Functions generate a topic with its message and data, publish it, and return the published data.

// (1) Topic for addition, removal, or moving of a task to/from a tasklist.

const taskMovedTopic = 'taskMoved';

const publishTaskMovedTopic = (task, sourceTasklist, destinationTasklist, includeTaskID = false) => {
  validateDataType(task, 'task', ['Task']);
  
  validateDataType(sourceTasklist, 'sourceTasklist', ['Tasklist', 'Null']);
  validateDataType(destinationTasklist, 'destinationTasklist', ['Tasklist', 'Null']);

  const topicMessage = includeTaskID ? `${taskMovedTopic}.${task.id}` : taskMovedTopic;

  const topicData = Object.freeze({ task, sourceTasklist, destinationTasklist });

  publishTopic(topicMessage, topicData);

  return topicData;
}

export { taskMovedTopic, publishTaskMovedTopic };
