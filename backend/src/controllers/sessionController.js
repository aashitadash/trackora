import Event from "../models/Event.js";

export const getSessions = async (req, res) => {
  try {
    const sessions = await Event.aggregate([
      {
        $group: {
          _id: "$session_id",

          total_events: {
            $sum: 1,
          },

          last_activity: {
            $max: "$timestamp",
          },
        },
      },

      {
        $sort: {
          last_activity: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: sessions,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};