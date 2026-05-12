import Event from "../models/Event.js";

export const getSessionEvents = async (req, res) => {

  try {

    const { sessionId } = req.params;

    const events = await Event.find({
      session_id: sessionId,
    }).sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      data: events,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};