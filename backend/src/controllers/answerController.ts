import dotenv from "dotenv";
import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Question, { QuestionType } from "../models/Question";
import Answer from "../models/Answer";
import { AuthorizedRequest } from "../types/request";
import User from "../models/User";
import { getDetailedQuestion } from "./questionController";
import mongoose from "mongoose";

dotenv.config();

function generatePrompt(question: QuestionType) {
  const preAnswerPrompt = `
    You are meant to help people find answers to programming related questions.
    
    If the question below is not programming related and/or isn't really a question at all, please let the user know that you could not find an answer to the question nicely with 200 character reason. Normal answers have a maximum of 750 characters.

    ${question.intelligentAnswer ? `The question has already been answered. Please provide a new answer, (Previous Answer: ${question.intelligentAnswer}).` : ""}

    RULES ABOUT ANSWER: user interface is rendered in html, please return your answer as HTML (the UI will render what you return in dangerouslySetInnerHTML. if you ever have to add code samples, use escape characters). To render <em> in a code sample you must return &lt;em&gt; (obviously use tags like <br> here to structure the code) but if you simply want to emphasize text go ahead and use <em>, this applies for everything.

		Please do not use \`\`\`html \`\`\` to surround the answer (html won't format that). Never use markdown.

    Please provide an answer to the following question:

    """
    ${question.question}
    """
  `;

  return preAnswerPrompt;
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const genAIModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/*
 * @route GET /questions/:id/answers
 * @desc Get all answers for a question
 * @access Public
 */
export const getAnswers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    const answers = await Answer.find({ question: id }).populate("user");

    res.status(200).json({ answers });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong... Please try again" });
  }
};

/*
 * @route PUT /questions/:id/intelligent
 * @desc Get an answer from Artifitial Intelligence
 * @access Public
 */
export const getAIAnswer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);

    if (!question) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    const prompt = generatePrompt(question);
    const result = await genAIModel.generateContent(prompt);
		let response = result.response.text();

		// strip off ```html and ``` from end of response
		response = response.replace(/```html/g, "");
		response = response.replace(/```/g, "");
		question.intelligentAnswer = response;
    await question.save();
    const updatedQuestion = await getDetailedQuestion(id);

    res
      .status(200)
      .json({
        question: updatedQuestion,
        message: "Intelligent answer added successfully",
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: error || "Something went wrong... Please try again" });
  }
};

/*
 * @route POST /questions/:id/answers
 * @desc Answer a question
 * @access Public
 */
export const answerQuestion = async (
  req: AuthorizedRequest<any>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    const question = await Question.findById(id);
    const answerer = await User.findById(req.user);

    if (!question) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    const newAnswer = new Answer({
      answer,
      user: answerer?._id,
      question: id,
    });
    await newAnswer.save();
    question.answers.push(newAnswer._id);
    await question.save();
    const updatedQuestion = await getDetailedQuestion(id);

    res
      .status(201)
      .json({
        question: updatedQuestion,
        message: "Answer added successfully",
      });
  } catch (error) {
		console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong... Please try again" });
  }
};

/*
 * @route DELETE /questions/:id/answers/:answerId
 * @desc Delete an answer
 * @access Public
 */
export const deleteAnswer = async (
  req: AuthorizedRequest<any>,
  res: Response,
) => {
  try {
    const { id, answerId } = req.params;

    const question = await Question.findById(id);
    const answer = await Answer.findById(answerId);

    if (!question) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    if (!answer) {
      res.status(404).json({ message: "Answer not found" });
      return;
    }

    question.answers = question.answers.filter(
      (ans) => ans.toString() !== answerId,
    );
    await question.save();
    await Answer.deleteOne({ _id: answerId });
    const updatedQuestion = await getDetailedQuestion(id);

    res
      .status(200)
      .json({
        question: updatedQuestion,
        message: "Answer deleted successfully",
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong... Please try again" });
  }
};

/*
 * @route PUT /questions/:id/answers/:answerId
 * @desc Update an answer
 * @access Public
 */
export const updateAnswer = async (
  req: AuthorizedRequest<any>,
  res: Response,
) => {
  try {
    const { id, answerId } = req.params;
    const { answer } = req.body;

    const question = await Question.findById(id);
    const answerExists = await Answer.findById(answerId);

    if (!question) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    if (!answerExists) {
      res.status(404).json({ message: "Answer not found" });
      return;
    }

    if (answerExists) answerExists.answer = answer;
    await answerExists.save();
    const updatedQuestion = await getDetailedQuestion(id);
    res
      .status(200)
      .json({
        question: updatedQuestion,
        message: "Answer updated successfully",
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong... Please try again" });
  }
};

/*
 * @route PUT /questions/:id/answers/:answerId/upvote
 * @desc Upvote an answer
 * @access Public
 */
export const upvoteAnswer = async (
  req: AuthorizedRequest<any>,
  res: Response,
) => {
  try {
    const { id, answerId } = req.params;
    const userId = req.user;

    if (!userId) {
      res
        .status(401)
        .json({ message: "You must be logged in to upvote an answer" });
      return;
    }

    const answer = await Answer.findById(answerId);

    if (!answer) {
      res.status(404).json({ message: "Answer not found" });
      return;
    }

    // If user already upvoted → remove upvote
    const isUpvoted = answer.upvotes.some((u) => u.toString() === userId);

    if (isUpvoted) {
      answer.upvotes = answer.upvotes.filter(
        (uid) => uid.toString() !== userId,
      );
    } else {
      // Add upvote + remove downvote
      answer.upvotes.push(new mongoose.Types.ObjectId(userId));
      answer.downvotes = answer.downvotes.filter(
        (uid) => uid.toString() !== userId,
      );
    }

    await answer.save();

    const updatedQuestion = await getDetailedQuestion(id);

    res.status(200).json({
      question: updatedQuestion,
      message: "Upvote updated successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong... Please try again" });
  }
};

/*
 * @route PUT /questions/:id/answers/:answerId/downvote
 * @desc Downvote an answer
 * @access Public
 */
export const downvoteAnswer = async (
  req: AuthorizedRequest<any>,
  res: Response,
) => {
  try {
    const { id, answerId } = req.params;
    const userId = req.user;

    if (!userId) {
      res
        .status(401)
        .json({ message: "You must be logged in to downvote an answer" });
      return;
    }

    const answer = await Answer.findById(answerId);

    if (!answer) {
      res.status(404).json({ message: "Answer not found" });
      return;
    }

    // If user already upvoted → remove upvote
    const isDownvoted = answer.downvotes.some((u) => u.toString() === userId);

    // If user already downvoted → remove downvote
    if (isDownvoted) {
      answer.downvotes = answer.downvotes.filter(
        (uid) => uid.toString() !== userId,
      );
    } else {
      // Add downvote + remove upvote
      answer.downvotes.push(new mongoose.Types.ObjectId(userId));
      answer.upvotes = answer.upvotes.filter(
        (uid) => uid.toString() !== userId,
      );
    }

    await answer.save();

    const updatedQuestion = await getDetailedQuestion(id);

    res.status(200).json({
      question: updatedQuestion,
      message: "Downvote updated successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong... Please try again" });
  }
};
