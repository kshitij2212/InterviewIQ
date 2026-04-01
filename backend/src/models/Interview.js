const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },

    expectedKeywords: {
      type: [String],
      default: [],
    },

    hint: {
      type: String,
      default: null,
    },

    answer: {
      type: String,
      default: null,
      trim: true,
    },

    score: {
      type: Number,
      min: 0,
      max: 100,
      required: false,
    },

    duration: {
      type: Number,
      default: 0,
    },

    feedback: {
      strengths:    { type: [String], default: [] },
      improvements: { type: [String], default: [] },
      suggestion:   { type: String,   default: null },
    },

    breakdown: {
      content:       { type: Number, default: null },
      keywords:      { type: Number, default: null },
      communication: { type: Number, default: null },
    },
  },
  { _id: true }
)

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },

    level: {
      type: String,
      required: [true, 'Level is required'],
      enum: ['Fresher', 'Junior', 'Senior'],
    },

    type: {
      type: String,
      required: [true, 'Interview type is required'],
      enum: ['Technical', 'HR', 'Mixed'],
    },

    resumeSkills: {
      type: [String],
      default: [],
    },

    questions: {
      type: [questionSchema],
      default: [],
    },

    currentQuestionIndex: {
      type: Number,
      default: 0,
      min: 0
    },

    overallScore: {
      type: Number,
      default: null,
    },

    overallFeedback: {
      strengths:    { type: [String], default: [] },
      improvements: { type: [String], default: [] },
      suggestion:   { type: String,   default: null },
    },

    status: {
      type: String,
      enum: ['in-progress', 'completed'],
      default: 'in-progress',
      index: true
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        ret.id = ret._id.toString()
        delete ret._id
      },
    },
  }
)

interviewSchema.methods.calculateOverallScore = function () {
  const answered = this.questions.filter(q => q.score !== null)
  if (answered.length === 0) return 0
  const total = answered.reduce((sum, q) => sum + q.score, 0)
  return parseFloat((total / answered.length).toFixed(2))
}

interviewSchema.pre('save', function (next) {
  if (this.isModified('questions')) {
    this.overallScore = this.calculateOverallScore()
  }
  next()
})

module.exports = mongoose.model('Interview', interviewSchema)