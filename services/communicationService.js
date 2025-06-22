const Communication = require('../models/communication');

const createCommunication = async (data) => {
  return await Communication.create(data);
};

const getCommunications = async (filter = {}) => {
  return await Communication.find(filter).populate('lead').populate('admin');
};

const getCommunicationById = async (id) => {
  return await Communication.findById(id).populate('lead').populate('admin');
};

const updateCommunication = async (id, data) => {
    const log = await Communication.findById(id);
    if (!log) {
        return null;
    }
    Object.assign(log, data);
    return await log.save();
};

const deleteCommunication = async (id) => {
    const log = await Communication.findById(id);
    if (!log) {
        return null;
    }
    await log.deleteOne();
    return log;
};

module.exports = {
  createCommunication,
  getCommunications,
  getCommunicationById,
  updateCommunication,
  deleteCommunication,
};
