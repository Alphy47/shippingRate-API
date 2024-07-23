const { sql, poolPromise } = require('../config/db.jsx');

const updatePendingToApproved = async (req, res) => {
  try {
    const { refNumber } = req.body;
    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    const request = pool.request();
    request.input('refNumber', sql.VarChar, refNumber);
    const response = await request.execute('updatePendingToApproved');

    console.log('Updated Successfully:', response);
    res.json({ message: 'Updated Successfully', response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

const updatePendingToDisapproved = async (req, res) => {
  try {
    const { refNumber } = req.body;
    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    const request = pool.request();
    request.input('refNumber', sql.VarChar, refNumber);
    const response = await request.execute('updatePendingToDisapproved');

    console.log('Updated Successfully:', response);
    res.json({ message: 'Updated Successfully', response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateTrackingNumber = async (req, res) => {
  try {
    const { refNumber, trackingNumber } = req.body;
    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    const request = pool.request();
    request.input('trackingNumber', trackingNumber);
    request.input('refNumber', refNumber);
    
    const response = await request.query('UPDATE tblPdfs SET trackingNumber = @trackingNumber WHERE refNumber = @refNumber');

    console.log('Updated Successfully:', response);
    res.json({ message: 'Updated Successfully', response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  updatePendingToApproved,
  updatePendingToDisapproved,
  updateTrackingNumber
};
