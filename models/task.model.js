import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "normal", "medium", "high", "urgent"],
      default: "normal",
    },

    stage: {
      type: String,
      enum: ["todo", "in progress", "done"],
      default: "todo",
    },

    activities: {
      type: {
        type: String,
        default: "assigned",
        enum: [
          "assigned",
          "started",
          "in progress",
          "bug",
          "completed",
          "commented",
          "reopened",
        ],
      },
      activity: {
        type: String,
        date: Date,
        default: new Date(),
      },
      by: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },

    subTasks: [
      {
        title: {
          type: String,
          date: Date,
          tag: String,
        },
      },
    ],
    assets: [String],
    team: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isTrashed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Task", taskSchema);
