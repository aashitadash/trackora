import Event from "../models/Event.js";

export const getHeatmapData = async (req, res) => {

  try {

    const clicks = await Event.find({
      event_type: "click",
    });

    res.status(200).json({
      success: true,
      data: clicks,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};