import Quiz from "../../models/QuizSchema.js";
import Question from "../../models/QuestionSchema.js";

const createQuiz = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: "Title and description are required",
      });
    }

    const quiz = new Quiz({
      title: title.trim(),
      description: description.trim(),
      createdBy: req.user._id,
      questions: [],
      isActive: false,
    });

    await quiz.save();

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: {
        quiz,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * @desc    Get all quizzes created by admin
 * @route   GET /api/admin/quizzes
 * @access  Private/Admin
 */
const getQuizzes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const quizzes = await Quiz.find({ createdBy: req.user._id })
      .populate("questions", "questionText")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Quiz.countDocuments({ createdBy: req.user._id });

    res.json({
      success: true,
      data: {
        quizzes,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalQuizzes: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findOne({
      _id: quizId,
      createdBy: req.user._id,
    })
      .populate("questions")
      .populate("createdBy", "name email");

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: "Quiz not found or access denied",
      });
    }

    res.json({
      success: true,
      data: {
        quiz,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: "Title and description are required",
      });
    }

    const quiz = await Quiz.findOneAndUpdate(
      { _id: quizId, createdBy: req.user._id },
      {
        title: title.trim(),
        description: description.trim(),
        updatedAt: new Date(),
      },
      { new: true },
    ).populate("questions");

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: "Quiz not found or access denied",
      });
    }

    res.json({
      success: true,
      message: "Quiz updated successfully",
      data: {
        quiz,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
const updateQuizStatus = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        error: "isActive must be a boolean value",
      });
    }

    const quiz = await Quiz.findOne({
      _id: quizId,
      createdBy: req.user._id,
    }).populate("questions");

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: "Quiz not found or access denied",
      });
    }

    if (isActive && (!quiz.questions || quiz.questions.length === 0)) {
      return res.status(400).json({
        success: false,
        error: "Cannot activate quiz without questions",
      });
    }

    quiz.isActive = isActive;
    await quiz.save();

    res.json({
      success: true,
      message: `Quiz ${isActive ? "activated" : "deactivated"} successfully`,
      data: {
        quiz,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findOneAndDelete({
      _id: quizId,
      createdBy: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: "Quiz not found or access denied",
      });
    }

    await Question.deleteMany({ quiz: quizId });

    res.json({
      success: true,
      message: "Quiz and associated questions deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const addQuestionsToQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Questions array is required and must not be empty",
      });
    }

    const quiz = await Quiz.findOne({ _id: quizId, createdBy: req.user._id });
    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: "Quiz not found or access denied",
      });
    }

    const createdQuestions = [];
    const errors = [];

    for (let i = 0; i < questions.length; i++) {
      const qData = questions[i];
      const { questionText, options, correctAnswer } = qData;

      if (
        !questionText ||
        !options ||
        !correctAnswer ||
        !Array.isArray(options) ||
        options.length < 2 ||
        !options.includes(correctAnswer)
      ) {
        errors.push(
          `Question ${i + 1}: Invalid data. Ensure questionText, options (array with >= 2 items), and a valid correctAnswer are provided.`,
        );
        continue;
      }

      try {
        const question = new Question({
          questionText: questionText.trim(),
          options: options.map((opt) => opt.trim()),
          correctAnswer: correctAnswer.trim(),
          quiz: quizId,
        });
        await question.save();
        createdQuestions.push(question);
      } catch (err) {
        errors.push(`Question ${i + 1}: Failed to save. ${err.message}`);
      }
    }

    if (errors.length > 0 && createdQuestions.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No questions were created due to validation errors.",
        details: errors,
      });
    }

    if (createdQuestions.length > 0) {
      const questionIds = createdQuestions.map((q) => q._id);
      quiz.questions.push(...questionIds);
      await quiz.save();
    }

    const response = {
      success: true,
      message: `${createdQuestions.length} of ${questions.length} question(s) added successfully.`,
      data: {
        questions: createdQuestions,
      },
    };

    if (errors.length > 0) {
      response.warnings = errors;
    }

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * @desc    Get questions for a specific quiz
 * @route   GET /api/admin/quiz/:quizId/questions
 * @access  Private/Admin
 */
const getQuizQuestions = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findOne({ _id: quizId, createdBy: req.user._id });
    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: "Quiz not found or access denied",
      });
    }

    const questions = await Question.find({ quiz: quizId }).sort({ _id: 1 });

    res.json({
      success: true,
      data: {
        questions,
        total: questions.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { questionText, options, correctAnswer } = req.body;

    if (
      !questionText ||
      !options ||
      !correctAnswer ||
      !Array.isArray(options) ||
      options.length < 2 ||
      !options.includes(correctAnswer)
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid data. Ensure questionText, options (array with >= 2 items), and a valid correctAnswer are provided.",
      });
    }

    const question = await Question.findById(questionId).populate("quiz");
    if (!question) {
      return res.status(404).json({
        success: false,
        error: "Question not found",
      });
    }

    if (question.quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Access denied to update this question",
      });
    }

    question.questionText = questionText.trim();
    question.options = options.map((opt) => opt.trim());
    question.correctAnswer = correctAnswer.trim();
    await question.save();

    res.json({
      success: true,
      message: "Question updated successfully",
      data: {
        question,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        error: "Question not found",
      });
    }

    const quiz = await Quiz.findById(question.quiz);
    if (!quiz || quiz.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Access denied to delete this question",
      });
    }

    await Quiz.findByIdAndUpdate(question.quiz, {
      $pull: { questions: questionId },
    });
    await Question.findByIdAndDelete(questionId);

    res.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getQuizStats = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findOne({
      _id: quizId,
      createdBy: req.user._id,
    }).populate("questions");

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: "Quiz not found or access denied",
      });
    }

    const stats = {
      totalQuestions: quiz.questions.length,
      isActive: quiz.isActive,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    };

    res.json({
      success: true,
      data: {
        quiz: {
          _id: quiz._id,
          title: quiz.title,
          description: quiz.description,
        },
        stats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  updateQuizStatus,
  deleteQuiz,
  addQuestionsToQuiz,
  getQuizQuestions,
  updateQuestion,
  deleteQuestion,
  getQuizStats,
};
