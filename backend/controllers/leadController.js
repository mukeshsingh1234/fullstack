
const Lead = require("../models/Lead");

// CREATE NEW INQUIRY
exports.createLead = async (req, res) => {
  try {
    const { name, email, service, budget, timeline, message } = req.body;

    if (!name || !email || !service) {
      return res.status(400).json({
        success: false,
        message: "Name, email and service are required"
      });
    }

    const lead = await Lead.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      service,
      budget: budget || "Not specified",
      timeline: timeline || "Not specified",
      message: message || ""
    });

    return res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
      data: lead
    });

  } catch (error) {
    console.error("CREATE LEAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to submit inquiry"
    });
  }
};

// GET ALL INQUIRIES
exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });

  } catch (error) {
    console.error("GET LEADS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE INQUIRY STATUS
exports.updateLead = async (req, res) => {
  try {
    const { status } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inquiry updated successfully",
      data: lead
    });

  } catch (error) {
    console.error("UPDATE LEAD ERROR:", error);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE INQUIRY
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inquiry deleted successfully"
    });

  } catch (error) {
    console.error("DELETE LEAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
