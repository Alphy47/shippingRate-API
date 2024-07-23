const { sql, poolPromise } = require('../config/db.jsx');

///////////
//UPS Files
///////////

//for UPS zones
const uploadFile = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Start a transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblUPSCountryZones');

      for (const row of jsonData) {
        const { Country, 'Export Zone': ExportZone, 'Import Zone': ImportZone } = row;
        if (!Country || ExportZone === undefined || ImportZone === undefined) {
          console.error('Invalid row data:', row);
          continue; // Skip this row and continue with the next
        }

        const request = transaction.request();
        request.input('Country', sql.VarChar, Country);
        request.input('ExportZone', sql.Int, ExportZone);
        if (isNaN(ImportZone)) {
          request.input('ImportZone', sql.VarChar, ImportZone);
        } else {
          request.input('ImportZone', sql.Int, parseInt(ImportZone));
        }

        await request.execute('InsertDataUPSCountryZone');
        console.log('Uploaded Successfully:', row);
      }

      // Commit transaction
      await transaction.commit();
      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for Export UPS upto 5Kg
const uploadFile1 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Begin transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try{
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblUPSExportsUptoFive');

      //insert new data
      for (const row of jsonData) {
        const { Weight, '1': z1, '2': z2, '3': z3, '4': z4, '5': z5, '6': z6, '7': z7 } = row;
  
        console.log(row)
  
        const request = pool.request();
        request.input('Pweight', Weight);
        request.input('z1', z1);
        request.input('z2', z2);
        request.input('z3', z3);
        request.input('z4', z4);
        request.input('z5', z5);
        request.input('z6', z6);
        request.input('z7', z7);

        await request.execute('InsertDataUPSExportsUptoFive');
        console.log('Uploaded Successfully:', row);
      }
      // Commit transaction
      await transaction.commit();
      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for Export UPS over 5Kg
const uploadFile2 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Begin transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try{
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblUPSExportsOverFive');

      //insert new data
      for (const row of jsonData) {
        const { Weight, '1': z1, '2': z2, '3': z3, '4': z4, '5': z5, '6': z6, '7': z7 } = row;
  
        console.log(row)
  
        const request = pool.request();
        request.input('Pweight', Weight);
        request.input('z1', z1);
        request.input('z2', z2);
        request.input('z3', z3);
        request.input('z4', z4);
        request.input('z5', z5);
        request.input('z6', z6);
        request.input('z7', z7);

        await request.execute('InsertDataUPSExportsOverFive');
        console.log('Uploaded Successfully:', row);
      }
      // Commit transaction
      await transaction.commit();
      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for Export UPS over 70Kg
const uploadFile3 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Begin transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try{
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblUPSExportsOverSeventy');

      //insert new data
      for (const row of jsonData) {
        const { '1': z1, '2': z2, '3': z3, '4': z4, '5': z5, '6': z6, '7': z7 } = row;
  
        console.log(row)
  
        const request = pool.request();
        request.input('z1', z1);
        request.input('z2', z2);
        request.input('z3', z3);
        request.input('z4', z4);
        request.input('z5', z5);
        request.input('z6', z6);
        request.input('z7', z7);

        await request.execute('InsertDataUPSExportsOverSeventy');
        console.log('Uploaded Successfully:', row);
      }
      // Commit transaction
      await transaction.commit();
      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for Special Export UPS upto 5Kg
const uploadFile4 = async (req, res) => {
  try {
    let { jsonData, headers } = req.body;
    console.log(headers);

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    // Process headers
    const processHeaders = (headers) => {
      return headers.map(header => {
        let processedHeader = header.trim().replace(/[^a-zA-Z0-9]/g, ''); // Remove special characters
        if (processedHeader === 'Weight') {
          processedHeader = 'Pweight'; // Replace 'Weight' with 'Pweight'
        }
        return processedHeader;
      });
    };
    

    const processedHeaders = processHeaders(headers);

    // Create SQL queries
    const dropTableQuery = 'DROP TABLE IF EXISTS tblUPSSpecialExportsUptoFive';
    const columns = processedHeaders.map(header => `[${header}] VARCHAR(255)`).join(', ');
    const createTableQuery = `CREATE TABLE tblUPSSpecialExportsUptoFive (${columns})`;

    // Begin transaction
    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Drop old table
      await transaction.request().query(dropTableQuery);

      // Create new table with dynamic columns
      await transaction.request().query(createTableQuery);

      // Prepare insert query
      const insertColumns = processedHeaders.map(header => `[${header}]`).join(', ');
      const insertValues = processedHeaders.map(header => `@${header}`).join(', ');
      const insertQuery = `INSERT INTO tblUPSSpecialExportsUptoFive (${insertColumns}) VALUES (${insertValues})`;

      // Insert data
      for (const row of jsonData) {
        const request = transaction.request();

        // Dynamically add inputs
        processedHeaders.forEach(header => {
          const originalHeader = headers.find(h => h.trim().replace(/[^a-zA-Z0-9]/g, '') === header);
          const value = (header === 'Pweight') ? row['Weight'] : row[originalHeader];
          request.input(header, value);
        });

        await request.query(insertQuery);
        console.log('Uploaded Successfully:', row);
      }

      // Commit transaction
      await transaction.commit();
      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
      
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for Special Export UPS over 5Kg
const uploadFile5 = async (req, res) => {
  try {
    let { jsonData, headers } = req.body;
    console.log(headers);

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    // Process headers
    const processHeaders = (headers) => {
      return headers.map(header => {
        let processedHeader = header.trim().replace(/[^a-zA-Z0-9]/g, ''); // Remove special characters
        if (processedHeader === 'Weight') {
          processedHeader = 'Pweight'; // Replace 'Weight' with 'Pweight'
        }
        return processedHeader;
      });
    };
    

    const processedHeaders = processHeaders(headers);

    // Create SQL queries
    const dropTableQuery = 'DROP TABLE IF EXISTS tblUPSSpecialExportsOverFive';
    const columns = processedHeaders.map(header => `[${header}] VARCHAR(255)`).join(', ');
    const createTableQuery = `CREATE TABLE tblUPSSpecialExportsOverFive (${columns})`;

    // Begin transaction
    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Drop old table
      await transaction.request().query(dropTableQuery);

      // Create new table with dynamic columns
      await transaction.request().query(createTableQuery);

      // Prepare insert query
      const insertColumns = processedHeaders.map(header => `[${header}]`).join(', ');
      const insertValues = processedHeaders.map(header => `@${header}`).join(', ');
      const insertQuery = `INSERT INTO tblUPSSpecialExportsOverFive (${insertColumns}) VALUES (${insertValues})`;

      // Insert data
      for (const row of jsonData) {
        const request = transaction.request();

        // Dynamically add inputs
        processedHeaders.forEach(header => {
          const originalHeader = headers.find(h => h.trim().replace(/[^a-zA-Z0-9]/g, '') === header);
          const value = (header === 'Pweight') ? row['Weight'] : row[originalHeader];
          request.input(header, value);
        });

        await request.query(insertQuery);
        console.log('Uploaded Successfully:', row);
      }

      // Commit transaction
      await transaction.commit();
      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
      
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for Special Export UPS over 70Kg
const uploadFile6 = async (req, res) => {
  try {
    let { jsonData, headers } = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    // Process headers
    const processHeaders = (headers) => {
      return headers.map(header => {
        let processedHeader = header.trim().replace(/[^a-zA-Z0-9]/g, ''); // Remove special characters
        return processedHeader;
      });
    };

    const processedHeaders = processHeaders(headers);

    // Create SQL queries
    const dropTableQuery = 'DROP TABLE IF EXISTS tblUSPSpecialExportsOverSeventy';
    const columns = processedHeaders.map(header => `[${header}] VARCHAR(255)`).join(', ');
    const createTableQuery = `CREATE TABLE tblUSPSpecialExportsOverSeventy (${columns})`;

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Begin transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Drop old table
      await transaction.request().query(dropTableQuery);

      // Create new table with dynamic columns
      await transaction.request().query(createTableQuery);

      // Prepare insert query
      const insertColumns = processedHeaders.map(header => `[${header}]`).join(', ');
      const insertValues = processedHeaders.map(header => `@${header}`).join(', ');
      const insertQuery = `INSERT INTO tblUSPSpecialExportsOverSeventy (${insertColumns}) VALUES (${insertValues})`;

      // Insert data
      for (const row of jsonData) {
        const request = transaction.request();

        // Dynamically add inputs
        processedHeaders.forEach(header => {
          const originalHeader = headers.find(h => h.trim().replace(/[^a-zA-Z0-9]/g, '') === header);
          const value = row[originalHeader];
          request.input(header, value);
        });

        await request.query(insertQuery);
        console.log('Uploaded Successfully:', row);
      }

      // Commit transaction
      await transaction.commit();
      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });

    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};


//for Import UPS upto 5Kg
const uploadFile7 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Begin transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try{
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblUPSImportsUptoFive');

      //insert new data
      for (const row of jsonData) {
        const { Weight, '1': z1, '2': z2, '3': z3, '4': z4, '5': z5, '6': z6, '7': z7, '8': z8, '9': z9, '10': z10 } = row;
  
        console.log(row)
  
        const request = pool.request();
        request.input('Pweight', Weight);
        request.input('z1', z1);
        request.input('z2', z2);
        request.input('z3', z3);
        request.input('z4', z4);
        request.input('z5', z5);
        request.input('z6', z6);
        request.input('z7', z7);
        request.input('z8', z8);
        request.input('z9', z9);
        request.input('z10', z10);

        await request.execute('InsertDataUPSImportsUptoFive');
        console.log('Uploaded Successfully:', row);
      }
      // Commit transaction
      await transaction.commit();
      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for Import UPS over 5Kg
const uploadFile8 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Begin transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try{
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblUPSImportsOverFive');

      //insert new data
      for (const row of jsonData) {
        const { Weight, '1': z1, '2': z2, '3': z3, '4': z4, '5': z5, '6': z6, '7': z7, '8': z8, '9': z9, '10': z10 } = row;
  
        console.log(row)
  
        const request = pool.request();
        request.input('Pweight', Weight);
        request.input('z1', z1);
        request.input('z2', z2);
        request.input('z3', z3);
        request.input('z4', z4);
        request.input('z5', z5);
        request.input('z6', z6);
        request.input('z7', z7);
        request.input('z8', z8);
        request.input('z9', z9);
        request.input('z10', z10);

        await request.execute('InsertDataUPSImportsOverFive');
        console.log('Uploaded Successfully:', row);
      }
      // Commit transaction
      await transaction.commit();
      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for Import UPS over 70Kg
const uploadFile9 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Begin transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try{
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblUPSImportsOverSeventy');

      //insert new data
      for (const row of jsonData) {
        const { '1': z1, '2': z2, '3': z3, '4': z4, '5': z5, '6': z6, '7': z7, '8': z8, '9': z9, '10': z10 } = row;
  
        console.log(row)
  
        const request = pool.request();
        request.input('z1', z1);
        request.input('z2', z2);
        request.input('z3', z3);
        request.input('z4', z4);
        request.input('z5', z5);
        request.input('z6', z6);
        request.input('z7', z7);
        request.input('z8', z8);
        request.input('z9', z9);
        request.input('z10', z10);

        await request.execute('InsertDataUPSImportsOverSeventy');
        console.log('Uploaded Successfully:', row);
      }
      // Commit transaction
      await transaction.commit();
      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};


///////////
//DHL Files
///////////

//for DHL zones
const uploadFile10 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Start a transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblDHLCountryZones');

      for (const row of jsonData) {
        const { Country, 'Zone': Zone, 'EComZone': EComZone } = row;
        if (!Country || Zone === undefined || EComZone === undefined) {
          console.error('Invalid row data:', row);
          continue; // Skip this row and continue with the next
        }

        const request = transaction.request();
        request.input('Country', sql.VarChar, Country);
        request.input('Zone', sql.Int, Zone);
        request.input('EComZone', sql.Int, EComZone);

        await request.execute('InsertDataDHLCountryZone');
        console.log('Uploaded Successfully:', row);
      }

      // Commit transaction
      await transaction.commit();
      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for Export DHL upto 2Kg
const uploadFile11 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Begin transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblDHLExportsUptoTwo');

      // Insert new data
      for (const row of jsonData) {
        const { Weight, '1': z1, '2': z2, '3': z3, '4': z4, '5': z5, '6': z6, '7': z7, '8': z8, '9': z9 } = row;

        console.log(row);

        const request = transaction.request();
        request.input('Pweight', Weight);
        request.input('Z1', z1);
        request.input('Z2', z2);
        request.input('Z3', z3);
        request.input('Z4', z4);
        request.input('Z5', z5);
        request.input('Z6', z6);
        request.input('Z7', z7);
        request.input('Z8', z8);
        request.input('Z9', z9);

        await request.execute('InsertDataDHLExportsUptoTwo');
        console.log('Uploaded Successfully:', row);
      }

      // Commit transaction
      await transaction.commit();

      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for Export DHL over 2Kg
const uploadFile12 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Begin transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblDHLExportsOverTwo');

      // Insert new data
      for (const row of jsonData) {
        const { Weight, '1': z1, '2': z2, '3': z3, '4': z4, '5': z5, '6': z6, '7': z7, '8': z8, '9': z9 } = row;

        console.log(row);

        const request = transaction.request();
        request.input('Pweight', Weight);
        request.input('Z1', z1);
        request.input('Z2', z2);
        request.input('Z3', z3);
        request.input('Z4', z4);
        request.input('Z5', z5);
        request.input('Z6', z6);
        request.input('Z7', z7);
        request.input('Z8', z8);
        request.input('Z9', z9);

        await request.execute('InsertDataDHLExportsOverTwo');
        console.log('Uploaded Successfully:', row);
      }

      // Commit transaction
      await transaction.commit();

      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for Export DHL over 30Kg
const uploadFile13 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Begin transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblDHLExportsOverThirty');

      // Insert new data
      for (const row of jsonData) {
        const { From, To, '1': z1, '2': z2, '3': z3, '4': z4, '5': z5, '6': z6, '7': z7, '8': z8, '9': z9 } = row;

        console.log(row);

        const request = transaction.request();
        request.input('WFrom', From);
        request.input('WTo', To);
        request.input('Z1', z1);
        request.input('Z2', z2);
        request.input('Z3', z3);
        request.input('Z4', z4);
        request.input('Z5', z5);
        request.input('Z6', z6);
        request.input('Z7', z7);
        request.input('Z8', z8);
        request.input('Z9', z9);

        await request.execute('InsertDataDHLExportsOverThirty');
        console.log('Uploaded Successfully:', row);
      }

      // Commit transaction
      await transaction.commit();

      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for E-Commerce Export DHL over 0.5Kg
const uploadFile14 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Begin transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblDHLEComExportsOverPointFive');

      // Insert new data
      for (const row of jsonData) {
        const { Weight, '1': z1, '2': z2, '3': z3, '4': z4, '5': z5, '6': z6, '7': z7, '8': z8, '9': z9, '10': z10, '11': z11, '12': z12 } = row;

        console.log(row);

        const request = transaction.request();
        request.input('Pweight', Weight);
        request.input('Z1', z1);
        request.input('Z2', z2);
        request.input('Z3', z3);
        request.input('Z4', z4);
        request.input('Z5', z5);
        request.input('Z6', z6);
        request.input('Z7', z7);
        request.input('Z8', z8);
        request.input('Z9', z9);
        request.input('Z10', z10);
        request.input('Z11', z11);
        request.input('Z12', z12);

        await request.execute('InsertDataDHLEComExportsOverPointFive');
        console.log('Uploaded Successfully:', row);
      }

      // Commit transaction
      await transaction.commit();

      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for E-Commerce Export DHL over 30Kg
const uploadFile15 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Begin transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblDHLEComExportsOverThirty');

      // Insert new data
      for (const row of jsonData) {
        const { From, To, '1': z1, '2': z2, '3': z3, '4': z4, '5': z5, '6': z6, '7': z7, '8': z8, '9': z9 , '10': z10 ,'11': z11 , '12': z12} = row;

        console.log(row);

        const request = transaction.request();
        request.input('WFrom', From);
        request.input('WTo', To);
        request.input('Z1', z1);
        request.input('Z2', z2);
        request.input('Z3', z3);
        request.input('Z4', z4);
        request.input('Z5', z5);
        request.input('Z6', z6);
        request.input('Z7', z7);
        request.input('Z8', z8);
        request.input('Z9', z9);
        request.input('Z10', z10);
        request.input('Z11', z11);
        request.input('Z12', z12);

        await request.execute('InsertDataDHLEComExportsOverThirty');
        console.log('Uploaded Successfully:', row);
      }

      // Commit transaction
      await transaction.commit();

      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for Import DHL upto 2Kg
const uploadFile16 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Begin transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblDHLImportsUptoTwo');

      // Insert new data
      for (const row of jsonData) {
        const { Weight, '1': z1, '2': z2, '3': z3, '4': z4, '5': z5, '6': z6, '7': z7, '8': z8, '9': z9 } = row;

        console.log(row);

        const request = transaction.request();
        request.input('Pweight', Weight);
        request.input('Z1', z1);
        request.input('Z2', z2);
        request.input('Z3', z3);
        request.input('Z4', z4);
        request.input('Z5', z5);
        request.input('Z6', z6);
        request.input('Z7', z7);
        request.input('Z8', z8);
        request.input('Z9', z9);

        await request.execute('InsertDataDHLImportsUptoTwo');
        console.log('Uploaded Successfully:', row);
      }

      // Commit transaction
      await transaction.commit();

      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for Import DHL upto 2Kg
const uploadFile17 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Begin transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblDHLImportsOverTwo');

      // Insert new data
      for (const row of jsonData) {
        const { Weight, '1': z1, '2': z2, '3': z3, '4': z4, '5': z5, '6': z6, '7': z7, '8': z8, '9': z9 } = row;

        console.log(row);

        const request = transaction.request();
        request.input('Pweight', Weight);
        request.input('Z1', z1);
        request.input('Z2', z2);
        request.input('Z3', z3);
        request.input('Z4', z4);
        request.input('Z5', z5);
        request.input('Z6', z6);
        request.input('Z7', z7);
        request.input('Z8', z8);
        request.input('Z9', z9);

        await request.execute('InsertDataDHLImportsOverTwo');
        console.log('Uploaded Successfully:', row);
      }

      // Commit transaction
      await transaction.commit();

      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for Import DHL over 30Kg
const uploadFile18 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Begin transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblDHLImportsOverThirty');

      // Insert new data
      for (const row of jsonData) {
        const { From, To, '1': z1, '2': z2, '3': z3, '4': z4, '5': z5, '6': z6, '7': z7, '8': z8, '9': z9 } = row;

        console.log(row);

        const request = transaction.request();
        request.input('WFrom', From);
        request.input('WTo', To);
        request.input('Z1', z1);
        request.input('Z2', z2);
        request.input('Z3', z3);
        request.input('Z4', z4);
        request.input('Z5', z5);
        request.input('Z6', z6);
        request.input('Z7', z7);
        request.input('Z8', z8);
        request.input('Z9', z9);

        await request.execute('InsertDataDHLImportsOverThirty');
        console.log('Uploaded Successfully:', row);
      }

      // Commit transaction
      await transaction.commit();

      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};


/////////////
//FeDex Files
/////////////

//for FeDex zones
const uploadFile19 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Start a transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblFedexCountryZones');

      for (const row of jsonData) {
        const { Country, 'Zone': Zone, 'CountryCode': CountryCode } = row;
        if (!Country || Zone === undefined || CountryCode === undefined) {
          console.error('Invalid row data:', row);
          continue; // Skip this row and continue with the next
        }

        const request = transaction.request();
        request.input('Country', sql.VarChar, Country);
        request.input('Zone', sql.VarChar, Zone);
        request.input('CountryCode', sql.VarChar, CountryCode);

        await request.execute('InsertDataFedexCountryZone');
        console.log('Uploaded Successfully:', row);
      }

      // Commit transaction
      await transaction.commit();
      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for Export Fedex Document
const uploadFile20 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Begin transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblFedexExportsDocument');

      // Insert new data
      for (const row of jsonData) {
        const { Weight, 'A': zA, 'B': zB, 'C': zC, 'D': zD, 'E': zE, 'F': zF, 'G': zG, 'H': zH, 'I': zI, 'J': zJ, 'K': zK, 'L': zL, 'M': zM, 'JP': zJP } = row;

        console.log(row);

        const request = transaction.request();
        request.input('Pweight', Weight);
        request.input('ZA', zA);
        request.input('ZB', zB);
        request.input('ZC', zC);
        request.input('ZD', zD);
        request.input('ZE', zE);
        request.input('ZF', zF);
        request.input('ZG', zG);
        request.input('ZH', zH);
        request.input('ZI', zI);
        request.input('ZJ', zJ);
        request.input('ZK', zK);
        request.input('ZL', zL);
        request.input('ZM', zM);
        request.input('ZJP', zJP);

        await request.execute('InsertDataFedexExportsDocument');
        console.log('Uploaded Successfully:', row);
      }

      // Commit transaction
      await transaction.commit();

      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for Export Fedex Package
const uploadFile21 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Begin transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblFedexExportsPackage');

      // Insert new data
      for (const row of jsonData) {
        const { Weight, 'A': zA, 'B': zB, 'C': zC, 'D': zD, 'E': zE, 'F': zF, 'G': zG, 'H': zH, 'I': zI, 'J': zJ, 'K': zK, 'L': zL, 'M': zM, 'JP': zJP } = row;

        console.log(row);

        const request = transaction.request();
        request.input('Pweight', Weight);
        request.input('ZA', zA);
        request.input('ZB', zB);
        request.input('ZC', zC);
        request.input('ZD', zD);
        request.input('ZE', zE);
        request.input('ZF', zF);
        request.input('ZG', zG);
        request.input('ZH', zH);
        request.input('ZI', zI);
        request.input('ZJ', zJ);
        request.input('ZK', zK);
        request.input('ZL', zL);
        request.input('ZM', zM);
        request.input('ZJP', zJP);

        await request.execute('InsertDataFedexExportsPackage');
        console.log('Uploaded Successfully:', row);
      }

      // Commit transaction
      await transaction.commit();

      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for Export Fedex Sample
const uploadFile22 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Begin transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblFedexExportsSample');

      // Insert new data
      for (const row of jsonData) {
        const { Weight, 'A': zA, 'B': zB, 'C': zC, 'D': zD, 'E': zE, 'F': zF, 'G': zG, 'H': zH, 'I': zI, 'J': zJ, 'K': zK, 'L': zL, 'M': zM, 'JP': zJP } = row;

        console.log(row);

        const request = transaction.request();
        request.input('Pweight', Weight);
        request.input('ZA', zA);
        request.input('ZB', zB);
        request.input('ZC', zC);
        request.input('ZD', zD);
        request.input('ZE', zE);
        request.input('ZF', zF);
        request.input('ZG', zG);
        request.input('ZH', zH);
        request.input('ZI', zI);
        request.input('ZJ', zJ);
        request.input('ZK', zK);
        request.input('ZL', zL);
        request.input('ZM', zM);
        request.input('ZJP', zJP);

        await request.execute('InsertDataFedexExportsSample');
        console.log('Uploaded Successfully:', row);
      }

      // Commit transaction
      await transaction.commit();

      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for Export Fedex E-Commerce Document
const uploadFile23 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Begin transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblFedexEComExportsDocument');

      // Insert new data
      for (const row of jsonData) {
        const { Weight, 'A': zA, 'B': zB, 'C': zC, 'D': zD, 'E': zE, 'F': zF, 'G': zG, 'H': zH, 'I': zI, 'J': zJ, 'K': zK, 'L': zL, 'M': zM } = row;

        console.log(row);

        const request = transaction.request();
        request.input('Pweight', Weight);
        request.input('ZA', zA);
        request.input('ZB', zB);
        request.input('ZC', zC);
        request.input('ZD', zD);
        request.input('ZE', zE);
        request.input('ZF', zF);
        request.input('ZG', zG);
        request.input('ZH', zH);
        request.input('ZI', zI);
        request.input('ZJ', zJ);
        request.input('ZK', zK);
        request.input('ZL', zL);
        request.input('ZM', zM);

        await request.execute('InsertDataFedexEComExportsDocument');
        console.log('Uploaded Successfully:', row);
      }

      // Commit transaction
      await transaction.commit();

      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for Export Fedex E-Commerce Package
const uploadFile24 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Begin transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblFedexEComExportsPackage');

      // Insert new data
      for (const row of jsonData) {
        const { Weight, 'A': zA, 'B': zB, 'C': zC, 'D': zD, 'E': zE, 'F': zF, 'G': zG, 'H': zH, 'I': zI, 'J': zJ, 'K': zK, 'L': zL, 'M': zM } = row;

        console.log(row);

        const request = transaction.request();
        request.input('Pweight', Weight);
        request.input('ZA', zA);
        request.input('ZB', zB);
        request.input('ZC', zC);
        request.input('ZD', zD);
        request.input('ZE', zE);
        request.input('ZF', zF);
        request.input('ZG', zG);
        request.input('ZH', zH);
        request.input('ZI', zI);
        request.input('ZJ', zJ);
        request.input('ZK', zK);
        request.input('ZL', zL);
        request.input('ZM', zM);

        await request.execute('InsertDataFedexEComExportsPackage');
        console.log('Uploaded Successfully:', row);
      }

      // Commit transaction
      await transaction.commit();

      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for Export Fedex E-Commerce Sample
const uploadFile25 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Begin transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblFedexEComExportsSample');

      // Insert new data
      for (const row of jsonData) {
        const { Weight, 'A': zA, 'B': zB, 'C': zC, 'D': zD, 'E': zE, 'F': zF, 'G': zG, 'H': zH, 'I': zI, 'J': zJ, 'K': zK, 'L': zL, 'M': zM } = row;

        console.log(row);

        const request = transaction.request();
        request.input('Pweight', Weight);
        request.input('ZA', zA);
        request.input('ZB', zB);
        request.input('ZC', zC);
        request.input('ZD', zD);
        request.input('ZE', zE);
        request.input('ZF', zF);
        request.input('ZG', zG);
        request.input('ZH', zH);
        request.input('ZI', zI);
        request.input('ZJ', zJ);
        request.input('ZK', zK);
        request.input('ZL', zL);
        request.input('ZM', zM);

        await request.execute('InsertDataFedexEComExportsSample');
        console.log('Uploaded Successfully:', row);
      }

      // Commit transaction
      await transaction.commit();

      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for Import Fedex Document
const uploadFile26 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Begin transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblFedexImportsDocument');

      // Insert new data
      for (const row of jsonData) {
        const { Weight, 'A': zA, 'B': zB, 'C': zC, 'D': zD, 'E': zE, 'F': zF, 'G': zG, 'H': zH, 'I': zI, 'J': zJ, 'K': zK, 'L': zL, 'M': zM } = row;

        console.log(row);

        const request = transaction.request();
        request.input('Pweight', Weight);
        request.input('ZA', zA);
        request.input('ZB', zB);
        request.input('ZC', zC);
        request.input('ZD', zD);
        request.input('ZE', zE);
        request.input('ZF', zF);
        request.input('ZG', zG);
        request.input('ZH', zH);
        request.input('ZI', zI);
        request.input('ZJ', zJ);
        request.input('ZK', zK);
        request.input('ZL', zL);
        request.input('ZM', zM);

        await request.execute('InsertDataFedexImportsDocument');
        console.log('Uploaded Successfully:', row);
      }

      // Commit transaction
      await transaction.commit();

      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for Import Fedex Document
const uploadFile27 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Begin transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblFedexImportsPackage');

      // Insert new data
      for (const row of jsonData) {
        const { Weight, 'A': zA, 'B': zB, 'C': zC, 'D': zD, 'E': zE, 'F': zF, 'G': zG, 'H': zH, 'I': zI, 'J': zJ, 'K': zK, 'L': zL, 'M': zM } = row;

        console.log(row);

        const request = transaction.request();
        request.input('Pweight', Weight);
        request.input('ZA', zA);
        request.input('ZB', zB);
        request.input('ZC', zC);
        request.input('ZD', zD);
        request.input('ZE', zE);
        request.input('ZF', zF);
        request.input('ZG', zG);
        request.input('ZH', zH);
        request.input('ZI', zI);
        request.input('ZJ', zJ);
        request.input('ZK', zK);
        request.input('ZL', zL);
        request.input('ZM', zM);

        await request.execute('InsertDataFedexImportsPackage');
        console.log('Uploaded Successfully:', row);
      }

      // Commit transaction
      await transaction.commit();

      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for Import Fedex Document
const uploadFile28 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Begin transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblFedexImportsSample');

      // Insert new data
      for (const row of jsonData) {
        const { Weight, 'A': zA, 'B': zB, 'C': zC, 'D': zD, 'E': zE, 'F': zF, 'G': zG, 'H': zH, 'I': zI, 'J': zJ, 'K': zK, 'L': zL, 'M': zM } = row;

        console.log(row);

        const request = transaction.request();
        request.input('Pweight', Weight);
        request.input('ZA', zA);
        request.input('ZB', zB);
        request.input('ZC', zC);
        request.input('ZD', zD);
        request.input('ZE', zE);
        request.input('ZF', zF);
        request.input('ZG', zG);
        request.input('ZH', zH);
        request.input('ZI', zI);
        request.input('ZJ', zJ);
        request.input('ZK', zK);
        request.input('ZL', zL);
        request.input('ZM', zM);

        await request.execute('InsertDataFedexImportsSample');
        console.log('Uploaded Successfully:', row);
      }

      // Commit transaction
      await transaction.commit();

      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for Import Fedex Over 30Kg
const uploadFile29 = async (req, res) => {
  try {
    let jsonData = req.body;

    // Ensure jsonData is an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    // Begin transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Delete old data from the table
      await transaction.request().query('DELETE FROM tblFedexImportsOverThirty');

      // Insert new data
      for (const row of jsonData) {
        const { WFrom, WTo, 'A': zA, 'B': zB, 'C': zC, 'D': zD, 'E': zE, 'F': zF, 'G': zG, 'H': zH, 'I': zI, 'J': zJ, 'K': zK, 'L': zL, 'M': zM } = row;

        console.log(row);

        const request = transaction.request();
        request.input('WFrom', WFrom);
        request.input('WTo', WTo);
        request.input('ZA', zA);
        request.input('ZB', zB);
        request.input('ZC', zC);
        request.input('ZD', zD);
        request.input('ZE', zE);
        request.input('ZF', zF);
        request.input('ZG', zG);
        request.input('ZH', zH);
        request.input('ZI', zI);
        request.input('ZJ', zJ);
        request.input('ZK', zK);
        request.input('ZL', zL);
        request.input('ZM', zM);

        await request.execute('InsertDataFedexImportsOverThirty');
        console.log('Uploaded Successfully:', row);
      }

      // Commit transaction
      await transaction.commit();

      console.log('All data uploaded successfully.');
      res.status(200).json({ message: 'Data saved to database', data: jsonData });
    } catch (dbError) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

//for save approved docs
const approvedDocs = async (req, res) => {
  try {
    const { pdfData, refNumber, selectedService, selectedRateType, country, weight, currentDate } = req.body;

    if (!pdfData || !refNumber || !selectedService || !selectedRateType || !country || !weight || !currentDate) {
      return res.status(400).send('Not all data provided');
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      // Insert new data
      const request = new sql.Request(transaction);
      request.input('pdfData', sql.Text, pdfData);
      request.input('refNumber', sql.VarChar(100), refNumber);
      request.input('selectedService', sql.VarChar(50), selectedService);
      request.input('selectedRateType', sql.VarChar(50), selectedRateType);
      request.input('country', sql.VarChar(100), country);
      request.input('Nweight', sql.VarChar(50), weight);
      request.input('CurrentDate', sql.VarChar(30), currentDate);

      await request.execute('InsertDatatoTblPdfs');

      await transaction.commit();
      console.log('PDF Uploaded Successfully for', currentDate);

      res.status(200).json({ message: 'PDF data saved successfully' });
    } catch (dbError) {
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error saving PDF data:', error);
    res.status(500).send('Server error');
  }
};

//for save approved docs
const pendingDocs = async (req, res) => {
  try {
    const { pdfData, refNumber, selectedService, selectedRateType, country, weight, currentDate } = req.body;

    if (!pdfData || !refNumber || !selectedService || !selectedRateType || !country || !weight || !currentDate) {
      return res.status(400).send('Not all data provided');
    }

    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection failed.');
      return res.status(500).json({ error: 'Database connection failed.' });
    }

    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      // Insert new data
      const request = new sql.Request(transaction);
      request.input('pdfData', sql.Text, pdfData);
      request.input('refNumber', sql.VarChar(100), refNumber);
      request.input('selectedService', sql.VarChar(50), selectedService);
      request.input('selectedRateType', sql.VarChar(50), selectedRateType);
      request.input('country', sql.VarChar(100), country);
      request.input('Nweight', sql.VarChar(50), weight);
      request.input('CurrentDate', sql.VarChar(30), currentDate);

      await request.execute('InsertDatatoTblPending');

      await transaction.commit();
      console.log('PDF Uploaded Successfully for', currentDate);

      res.status(200).json({ message: 'PDF data saved successfully' });
    } catch (dbError) {
      await transaction.rollback();
      console.error('Database error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  } catch (error) {
    console.error('Error saving PDF data:', error);
    res.status(500).send('Server error');
  }
};

module.exports = {
  uploadFile,
  uploadFile1,
  uploadFile2,
  uploadFile3,
  uploadFile4,
  uploadFile5,
  uploadFile6,
  uploadFile7,
  uploadFile8,
  uploadFile9,
  uploadFile10,
  uploadFile11,
  uploadFile12,
  uploadFile13,
  uploadFile14,
  uploadFile15,
  uploadFile16,
  uploadFile17,
  uploadFile18,
  uploadFile19,
  uploadFile20,
  uploadFile21,
  uploadFile22,
  uploadFile23,
  uploadFile24,
  uploadFile25,
  uploadFile26,
  uploadFile27,
  uploadFile28,
  uploadFile29,
  approvedDocs,
  pendingDocs
};
