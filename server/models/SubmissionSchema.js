import mongoose from "mongoose";
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
    quiz: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answers: [{
        questionId: {
            type: Schema.Types.ObjectId,
            ref: 'Question'
        },
        selectedAnswer: String
    }],
    score: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;