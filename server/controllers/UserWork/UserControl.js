import Quiz from "../../models/QuizSchema.js";
import Submission from "../../models/SubmissionSchema.js";

export const getActiveQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isActive: true })
      .select("title description createdAt")
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: quizzes.length,
      quizzes,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const startQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate({
      path: "questions",
      select: "questionText options", // Don't send correct answers
    });

    if (!quiz || !quiz.isActive) {
      return res.status(404).json({ message: "Quiz not found or inactive" });
    }

    res.json({
      success: true,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        totalQuestions: quiz.questions.length,
        questions: quiz.questions,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // Array of { questionId, selectedAnswer }
    const quizId = req.params.id;

    // Check if user already submitted this quiz
    const existingSubmission = await Submission.findOne({
      quiz: quizId,
      user: req.user.id,
    });

    if (existingSubmission) {
      return res.status(400).json({
        message: "You have already submitted this quiz",
        previousScore: existingSubmission.score,
      });
    }

    // Get quiz with questions and correct answers
    const quiz = await Quiz.findById(quizId).populate("questions");

    if (!quiz || !quiz.isActive) {
      return res.status(404).json({ message: "Quiz not found or inactive" });
    }

    // Calculate score
    let score = 0;
    const totalQuestions = quiz.questions.length;
    const answersMap = new Map();

    // Create map of user answers
    answers.forEach((answer) => {
      answersMap.set(answer.questionId, answer.selectedAnswer);
    });

    // Check each question and prepare detailed results
    const detailedResults = [];
    quiz.questions.forEach((question) => {
      const userAnswer = answersMap.get(question._id.toString());
      const isCorrect = userAnswer === question.correctAnswer;

      if (isCorrect) {
        score++;
      }

      detailedResults.push({
        questionId: question._id,
        questionText: question.questionText,
        options: question.options,
        userAnswer: userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect: isCorrect,
      });
    });

    // Calculate percentage
    const scorePercentage = Math.round((score / totalQuestions) * 100);

    // Save submission
    const submission = new Submission({
      quiz: quizId,
      user: req.user.id,
      answers: answers,
      score: scorePercentage,
    });

    await submission.save();

    res.json({
      success: true,
      message: "Quiz submitted successfully",
      results: {
        score: scorePercentage,
        correctAnswers: score,
        totalQuestions: totalQuestions,
        percentage: scorePercentage,
        submissionId: submission._id,
        detailedResults: detailedResults,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user.id })
      .populate("quiz", "title description")
      .select("quiz score createdAt")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getSubmissionDetails = async (req, res) => {
  try {
    const submission = await Submission.findOne({
      _id: req.params.id,
      user: req.user.id,
    })
      .populate("quiz", "title description")
      .populate("answers.questionId", "questionText options correctAnswer");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Format detailed results
    const detailedResults = submission.answers.map((answer) => {
      const question = answer.questionId;
      return {
        questionText: question.questionText,
        options: question.options,
        userAnswer: answer.selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect: answer.selectedAnswer === question.correctAnswer,
      };
    });

    res.json({
      success: true,
      submission: {
        _id: submission._id,
        quiz: submission.quiz,
        score: submission.score,
        submittedAt: submission.createdAt,
        totalQuestions: submission.answers.length,
        correctAnswers: detailedResults.filter((r) => r.isCorrect).length,
        detailedResults: detailedResults,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
