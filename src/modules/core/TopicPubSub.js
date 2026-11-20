import PubSub from "pubsub-js";

// Methods dedicated for publishing and subscribing to topics, to avoid direct dependency on PubSub, and to ensure topic publishing is always synchronous.

const publishTopic = (topicMessage, topicData) => {
  PubSub.publishSync(topicMessage, topicData);
}

const subscribeToTopic = (subscriber, topicMessage) => {
  PubSub.subscribe(topicMessage, subscriber);
}

// TODO: Create a method to initiate subscriptions using a list of topic-subscriber list pairs, and use it in the `#initiateSubscriptions` method of each class.

export { publishTopic, subscribeToTopic };
