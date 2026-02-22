import { Schema, model, models } from "mongoose";

const CharacterSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    race: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      required: true,
    },
    background: {
      type: String,
      default: "",
    },
    stats: {
      str: Number,
      dex: Number,
      con: Number,
      int: Number,
      wis: Number,
      cha: Number,
    },
  },
  { timestamps: true }
);

export const Character =
  models.Character || model("Character", CharacterSchema);