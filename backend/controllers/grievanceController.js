const Grievance = require('../models/Grievance');

exports.submitGrievance = async (req, res) => {
    try {
        const grievanceId = await Grievance.create(req.body);
        res.status(201).json({
            message: 'Grievance submitted successfully',
            grievanceId: grievanceId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.trackGrievance = async (req, res) => {
    try {
        const { id } = req.params;
        const grievance = await Grievance.findById(id);

        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found' });
        }

        res.json(grievance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllGrievances = async (req, res) => {
    try {
        const grievances = await Grievance.findAll();
        res.json(grievances);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await Grievance.updateStatus(id, status);

        if (result === 0) {
            return res.status(404).json({ message: 'Grievance not found' });
        }

        res.json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
