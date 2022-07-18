const mongoose = require("mongoose");

const eventBookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  persons: {
    type: Number,
    required: true,
  },
  payment: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

// converting _id of mongoDB to id for more usable at frontend
eventBookingSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
eventBookingSchema.set("toJSON", { virtuals: true });

exports.EventBooking = mongoose.model("Event-Booking", eventBookingSchema);
exports.eventBookingSchema = eventBookingSchema;
