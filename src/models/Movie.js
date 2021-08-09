const { Schema, model } = require('mongoose');

const movieSchema = new Schema(
  {
    Title: { type: String, trim: true , unique: true , required: true},
    Released: { type: Date , required: true},
    Genre: { type: String , required: true},
    Director: { type: String },
    Actors: { type: String, required: true },
    Plot: { type: String },
    Ratings: { type: Array },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Movie", movieSchema);