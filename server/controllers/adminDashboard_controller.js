import BandUser from "../models/BandUser.js";

// GET all bands
export const getAllBands = async (req, res) => {
  try {
    const bands = await BandUser.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(bands);
  } catch (error) {
    console.error("Error fetching bands:", error);
    res.status(500).json({ message: "Server error while fetching bands" });
  }
};

// PATCH verify or reject band
export const verifyBandStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Use 'approved' or 'rejected'." });
    }

    const updatedBand = await BandUser.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedBand) {
      return res.status(404).json({ message: "Band not found" });
    }

    res.status(200).json({
      message: `Band status updated to ${status}`,
      band: updatedBand
    });
  } catch (error) {
    console.error("Error updating band status:", error);
    res.status(500).json({ message: "Server error while updating status" });
  }
};
