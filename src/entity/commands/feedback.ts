import { FeedbackInput } from "src/resolvers/Feedback";
import { Feedback } from "../Feedback";
import { User } from "../User";

const createFeedback = async (
  author: User,
  feedback: FeedbackInput
): Promise<Feedback> => {
  const newFeedback = new Feedback();
  newFeedback.message = feedback.message;
  newFeedback.feedbackType = feedback.feedbackType;
  newFeedback.user = author;
  await newFeedback.save();
  return newFeedback;
};

export { createFeedback };
