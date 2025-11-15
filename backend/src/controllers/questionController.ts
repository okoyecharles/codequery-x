import { Request, Response } from "express";
import { AuthorizedRequest } from "../types/request";
import Question from "../models/Question";
import User from "../models/User";

export const getDetailedQuestion = async (id: string) => {
  return Question.findById(id)
    .populate({
      path: "answers",
      options: { sort: { createdAt: -1 } },
      populate: { path: "user" },
    })
    .populate("user");
};

/*
 * @route GET /questions
 * @desc Get all questions
 * @access Public
 */
export const getQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await Question.find().populate(["user"]);
    const sortedQuestions = questions.sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
    res.status(200).json({ questions: sortedQuestions });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong... Please try again" });
  }
};

/*
 * @route GET /questions/search?q=question
 * @desc Search for a question
 * @access Public
 */
export const searchQuestions = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    const questions = await Question.find({
      question: { $regex: q, $options: "i" },
    }).populate(["user"]);
    res.status(200).json({ questions });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong... Please try again" });
  }
};

/*
 * @route GET /questions/:id
 * @desc Get a question
 * @access Public
 */
export const getQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const question = await getDetailedQuestion(id);

    if (!question) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    res.status(200).json({ question });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong... Please try again" });
  }
};

/*
 * @route POST /questions
 * @desc Create a new question
 * @access Public
 */
export const askQuestion = async (
  req: AuthorizedRequest<any>,
  res: Response,
) => {
  const { question } = req.body;

  try {
    const user = await User.findById(req.user);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const newQuestion = new Question({ question, answers: [], user: user._id });
    await newQuestion.save();
    const savedQuestion = await getDetailedQuestion(newQuestion._id.toString());
    res
      .status(201)
      .json({
        message: "Question created successfully",
        question: savedQuestion,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong... Please try again" });
  }
};

/*
 * @route PUT /questions/:id
 * @desc Update a question
 * @access Public
 */
export const updateQuestion = async (
  req: AuthorizedRequest<any>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { question } = req.body;

    const questionExists = await Question.findById(id);
    const user = await User.findById(req.user);

    if (!questionExists) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (questionExists.user.toString() !== user._id.toString()) {
      res
        .status(401)
        .json({ message: "You are not authorized to update this question" });
      return;
    }

    if (question) questionExists.question = question;
    await questionExists.save();
    const updatedQuestion = await getDetailedQuestion(id);

    res
      .status(200)
      .json({
        question: updatedQuestion,
        message: "Question updated successfully",
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong... Please try again" });
  }
};

/*
 * @route DELETE /questions/:id
 * @desc Delete a question
 * @access Public
 */
export const deleteQuestion = async (
  req: AuthorizedRequest<any>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const questionExists = await Question.findById(id);
    const user = await User.findById(req.user);

    if (!questionExists) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (questionExists.user.toString() !== user._id.toString()) {
      res
        .status(401)
        .json({ message: "You are not authorized to delete this question" });
      return;
    }

    await Question.deleteOne({ _id: id });
    const questions = await Question.find();

    res
      .status(200)
      .json({ questions, message: "Question deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong... Please try again" });
  }
};
