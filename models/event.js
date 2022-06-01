const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  fee: {
    type: String,
    required: true,
  },
  startingDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
});

// converting _id of mongoDB to id for more usable at frontend
eventSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
eventSchema.set("toJSON", { virtuals: true });

exports.Event = mongoose.model("Event", eventSchema);
exports.eventSchema = eventSchema;
