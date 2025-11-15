import { optionalProtect, protect } from './../middleware/authMiddleware';
import express from 'express';
import { askQuestion, deleteQuestion, getQuestion, getQuestions, searchQuestions, updateQuestion } from '../controllers/questionController';
import { answerQuestion, deleteAnswer, downvoteAnswer, getAIAnswer, getAnswers, updateAnswer, upvoteAnswer } from '../controllers/answerController';

const router = express.Router();

// Question routes
router.get('/', getQuestions);
router.get('/search', searchQuestions);
router.post('/', protect, askQuestion);
router.get('/:id', getQuestion);
router.delete('/:id', protect, deleteQuestion);
router.put('/:id', protect, updateQuestion);

// Answer routes
router.get('/:id/answers', getAnswers);
router.post('/:id/answers', optionalProtect, answerQuestion);
router.put('/:id/answers/intelligent', protect, getAIAnswer);
router.delete('/:id/answers/:answerId', protect, deleteAnswer);
router.put('/:id/answers/:answerId', protect, updateAnswer);
router.put('/:id/answers/:answerId/upvote', protect, upvoteAnswer);
router.put('/:id/answers/:answerId/downvote', protect, downvoteAnswer);

export default router;
