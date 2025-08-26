import mongoose from "mongoose";
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    questionText: {
        type: String,
        required: true
    },
    options: [{
        type: String,
        required: true
    }],
    correctAnswer: {
        type: String,
        required: true
    },
    quiz: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz'
    }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
