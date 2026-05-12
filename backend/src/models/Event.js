import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  session_id: {
    type: String,
    required: true,
  },

  event_type: {
    type: String,
    required: true,
  },

  page_url: {
    type: String,
    required: true,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },

  coordinates: {
    x: Number,
    y: Number,
  },

  viewport: {
    width: Number,
    height: Number,
  },

  user_agent: {
    type: String,
  },
});

const Event = mongoose.model("Event", EventSchema);

export default Event;