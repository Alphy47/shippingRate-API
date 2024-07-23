const { sql, poolPromise } = require('../config/db.jsx');

/////////////
//-IMPORTS-//
/////////////


//selectImportDocuments
const selectImportDocuments = async (req, res) => {
    try {
        const { weight, country } = req.body;

        if (!weight || !country) {
            return res.status(400).json({ error: 'Weight and country zone are required.' });
        }

        const pool = await poolPromise;

        if (!pool) {
            console.error('Database connection failed.');
            return res.status(500).json({ error: 'Database connection failed.' });
        }

        const request = pool.request();
        request.input('country', sql.VarChar(100), country);

        const result = await request.execute('selectCountryZone');
        const Services = result.recordset.map(record => record.Source);
        const ImportZones = {};
        result.recordset.forEach(record => {
            ImportZones[record.Source] = record.Import_Zone;
        });

        console.log("Country:", country);
        console.log("Import Zones: ",ImportZones);

        let UPSRate = null;
        let DHLRate = null;
        let FedexRate = null;

        for (const record of result.recordset) {
            const { Source, Import_Zone } = record;
            

            if (Source === 'UPS') {
                const importZoneOfUPS = Import_Zone;
                

                if (importZoneOfUPS !== 'NS') {

                    if (weight > 0 && weight <= 5 ){
                        // Search for rate
                        const request = pool.request();
                        request.input('Pweight', sql.VarChar(20), weight);
                        request.input('Zone', sql.VarChar(20), importZoneOfUPS);
                        request.output('Rate', sql.Float);

                        const result = await request.execute('SelectUPSImportRateUptoFive');
                        UPSRate = result.output.Rate
                        // console.log('UPS Import Rate upto 5Kg:', result.output.Rate);
                    }else if(weight > 5 && weight <= 70 ){
                        // Search for rate
                        const request = pool.request();
                        request.input('Pweight', sql.VarChar(20), weight);
                        request.input('Zone', sql.VarChar(20), importZoneOfUPS);
                        request.output('Rate', sql.Float);
                
                        const result = await request.execute('SelectUPSImportRateOverFive');
                        // console.log('UPS Import Rate over 5Kg:', result.output.Rate);
                        UPSRate = result.output.Rate

                    }else if(weight > 70){
                        // Search for rate
                        const request = pool.request();
                        request.input('zone', sql.VarChar(20), importZoneOfUPS);
                        request.output('Rate', sql.Float);

                        const result = await request.execute('selectUPSImportsOverSeventy');
                        // console.log('UPS Import Rate over 70Kg: ', result.output.Rate);

                        const FinalRate = weight * result.output.Rate;
                        // console.log('UPS Rate over 70Kg: ',FinalRate);
                        UPSRate = FinalRate
                    }
                }
                console.log('UPS Rate: ',UPSRate);
            } if (Source === 'DHL') {
                const importZoneOfDHL = Import_Zone; 
                     
                if (weight > 0 && weight <= 2 ){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), importZoneOfDHL);
                    request.output('Rate', sql.Float);

                    const result = await request.execute('SelectDHLImportRateUptoTwo');
                    // console.log('DHL Import Rate upto 2Kg:', result.output.Rate);
                    DHLRate = result.output.Rate;
                }
                else if(weight > 2 && weight <= 30 ){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), importZoneOfDHL);
                    request.output('Rate', sql.Float);
            
                    const result = await request.execute('SelectDHLImportRateOverTwo');
                    // console.log('DHL Import Rate over 2Kg:', result.output.Rate);
                    DHLRate = result.output.Rate;

                }
                else if(weight > 30){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), importZoneOfDHL);
                    request.output('Rate', sql.Float);

                    const result = await request.execute('selectDHLImportsOverThirty');
                    // console.log('DHL Import Rate over 30Kg: ', result.output.Rate);

                    const FinalRate = weight * result.output.Rate;
                    // console.log('DHL Rate over 30Kg: ',FinalRate);
                    DHLRate = FinalRate;
                }
                console.log('DHL Rate: ', DHLRate);
            } if (Source === 'FedEx') {
                const importZoneOfFedex = Import_Zone;
                
                if (weight > 0 && weight <= 0.5 ){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), importZoneOfFedex);
                    request.output('Rate', sql.Float);

                    const result = await request.execute('SelectFedexImportRateDocument');
                    // console.log('Fedex Import Rate Document:', result.output.Rate);
                    FedexRate = result.output.Rate
                }
                console.log('FedEx Rate: ',FedexRate);
            }
            
        }
        const ratesWithSources = [
            { rate: UPSRate, source: 'UPS' },
            { rate: DHLRate, source: 'DHL' },
            { rate: FedexRate, source: 'FedEx' }
        ].filter(item => item.rate !== null);
        
        if (ratesWithSources.length > 0) {
            // Find the rate object with the minimum rate
            const lowestRateObject = ratesWithSources.reduce((min, current) => (current.rate < min.rate ? current : min));
            console.log(`The lowest rate is: ${lowestRateObject.rate} from ${lowestRateObject.source}`);
            res.json({  rate: lowestRateObject.rate.toFixed(2), 
                        source: lowestRateObject.source,
                        rateList:  ratesWithSources });
        } else {
            console.log('No valid rates available');
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};

//selectImportPackages
const selectImportPackages = async (req, res) => {
    try {
        const { weight, country } = req.body;

        if (!weight || !country) {
            return res.status(400).json({ error: 'Weight and country zone are required.' });
        }

        const pool = await poolPromise;

        if (!pool) {
            console.error('Database connection failed.');
            return res.status(500).json({ error: 'Database connection failed.' });
        }

        const request = pool.request();
        request.input('country', sql.VarChar(100), country);

        const result = await request.execute('selectCountryZone');
        const Services = result.recordset.map(record => record.Source);
        const ImportZones = {};
        result.recordset.forEach(record => {
            ImportZones[record.Source] = record.Import_Zone;
        });

        console.log("Country:", country);
        console.log("Import Zones: ",ImportZones);

        let UPSRate = null;
        let DHLRate = null;
        let FedexRate = null;

        for (const record of result.recordset) {
            const { Source, Import_Zone } = record;
            

            if (Source === 'UPS') {
                const importZoneOfUPS = Import_Zone;

                if (importZoneOfUPS !== 'NS') {

                    if(weight >= 0.5 && weight <= 70 ){
                        // Search for rate
                        const request = pool.request();
                        request.input('Pweight', sql.VarChar(20), weight);
                        request.input('Zone', sql.VarChar(20), importZoneOfUPS);
                        request.output('Rate', sql.Float);
                
                        const result = await request.execute('SelectUPSImportRateOverFive');
                        // console.log('UPS Import Rate over 5Kg:', result.output.Rate);
                        UPSRate = result.output.Rate

                    }else if(weight > 70){
                        // Search for rate
                        const request = pool.request();
                        request.input('zone', sql.VarChar(20), importZoneOfUPS);
                        request.output('Rate', sql.Float);

                        const result = await request.execute('selectUPSImportsOverSeventy');
                        // console.log('UPS Import Rate over 70Kg: ', result.output.Rate);

                        const FinalRate = weight * result.output.Rate;
                        // console.log('UPS Rate over 70Kg: ',FinalRate);
                        UPSRate = FinalRate
                    }
                }
                console.log('UPS Rate: ',UPSRate);
            } if (Source === 'DHL') {
                const importZoneOfDHL = Import_Zone; 
                     
                if(weight > 0 && weight <= 30 ){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), importZoneOfDHL);
                    request.output('Rate', sql.Float);
            
                    const result = await request.execute('SelectDHLImportRateOverTwo');
                    // console.log('DHL Import Rate over 2Kg:', result.output.Rate);
                    DHLRate = result.output.Rate;

                }
                else if(weight > 30){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), importZoneOfDHL);
                    request.output('Rate', sql.Float);

                    const result = await request.execute('selectDHLImportsOverThirty');
                    // console.log('DHL Import Rate over 30Kg: ', result.output.Rate);

                    const FinalRate = weight * result.output.Rate;
                    // console.log('DHL Rate over 30Kg: ',FinalRate);
                    DHLRate = FinalRate;
                }
                console.log('DHL Rate: ', DHLRate);
            } if (Source === 'FedEx') {
                const importZoneOfFedex = Import_Zone;
                
                if (weight > 0 && weight <= 2.5 ){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), importZoneOfFedex);
                    request.output('Rate', sql.Float);

                    const result = await request.execute('SelectFedexImportRatePackage');
                    // console.log('Fedex Import Rate Document:', result.output.Rate);
                    FedexRate = result.output.Rate
                }
                console.log('FedEx Rate: ',FedexRate);
            }
            
        }
        const ratesWithSources = [
            { rate: UPSRate, source: 'UPS' },
            { rate: DHLRate, source: 'DHL' },
            { rate: FedexRate, source: 'FedEx' }
        ].filter(item => item.rate !== null);
        
        if (ratesWithSources.length > 0) {
            // Find the rate object with the minimum rate
            const lowestRateObject = ratesWithSources.reduce((min, current) => (current.rate < min.rate ? current : min));
            console.log(`The lowest rate is: ${lowestRateObject.rate} from ${lowestRateObject.source}`);
            res.json({  rate: lowestRateObject.rate, 
                        source: lowestRateObject.source,
                        rateList:  ratesWithSources });
        } else {
            console.log('No valid rates available');
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};

//selectImportSamples
const selectImportSamples = async (req, res) => {
    try {
        const { weight, country } = req.body;

        if (!weight || !country) {
            return res.status(400).json({ error: 'Weight and country zone are required.' });
        }

        const pool = await poolPromise;

        if (!pool) {
            console.error('Database connection failed.');
            return res.status(500).json({ error: 'Database connection failed.' });
        }

        const request = pool.request();
        request.input('country', sql.VarChar(100), country);

        const result = await request.execute('selectCountryZone');
        const Services = result.recordset.map(record => record.Source);
        const ImportZones = {};
        result.recordset.forEach(record => {
            ImportZones[record.Source] = record.Import_Zone;
        });

        console.log("Country:", country);
        console.log("Import Zones: ",ImportZones);

        let UPSRate = null;
        let DHLRate = null;
        let FedexRate = null;

        for (const record of result.recordset) {
            const { Source, Import_Zone } = record;
            

            if (Source === 'UPS') {
                const importZoneOfUPS = Import_Zone;

                if (importZoneOfUPS !== 'NS') {

                    if(weight >= 0.5 && weight <= 70 ){
                        // Search for rate
                        const request = pool.request();
                        request.input('Pweight', sql.VarChar(20), weight);
                        request.input('Zone', sql.VarChar(20), importZoneOfUPS);
                        request.output('Rate', sql.Float);
                
                        const result = await request.execute('SelectUPSImportRateOverFive');
                        // console.log('UPS Import Rate over 5Kg:', result.output.Rate);
                        UPSRate = result.output.Rate

                    }else if(weight > 70){
                        // Search for rate
                        const request = pool.request();
                        request.input('zone', sql.VarChar(20), importZoneOfUPS);
                        request.output('Rate', sql.Float);

                        const result = await request.execute('selectUPSImportsOverSeventy');
                        // console.log('UPS Import Rate over 70Kg: ', result.output.Rate);

                        const FinalRate = weight * result.output.Rate;
                        // console.log('UPS Rate over 70Kg: ',FinalRate);
                        UPSRate = FinalRate
                    }
                }
                console.log('UPS Rate: ',UPSRate);
            } if (Source === 'DHL') {
                const importZoneOfDHL = Import_Zone; 
                     
                if(weight > 0 && weight <= 30 ){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), importZoneOfDHL);
                    request.output('Rate', sql.Float);
            
                    const result = await request.execute('SelectDHLImportRateOverTwo');
                    // console.log('DHL Import Rate over 2Kg:', result.output.Rate);
                    DHLRate = result.output.Rate;

                }
                else if(weight > 30){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), importZoneOfDHL);
                    request.output('Rate', sql.Float);

                    const result = await request.execute('selectDHLImportsOverThirty');
                    // console.log('DHL Import Rate over 30Kg: ', result.output.Rate);

                    const FinalRate = weight * result.output.Rate;
                    // console.log('DHL Rate over 30Kg: ',FinalRate);
                    DHLRate = FinalRate;
                }
                console.log('DHL Rate: ', DHLRate);
            } if (Source === 'FedEx') {
                const importZoneOfFedex = Import_Zone;
                
                if (weight > 0 && weight <= 29.5 ){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), importZoneOfFedex);
                    request.output('Rate', sql.Float);

                    const result = await request.execute('SelectFedexImportRateSample');
                    // console.log('Fedex Import Rate Document:', result.output.Rate);
                    FedexRate = result.output.Rate
                } else if (weight > 29.5 ){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), importZoneOfFedex);
                    request.output('Rate', sql.Float);

                    const result = await request.execute('selectFedexImportsOverThirty');
                    // console.log('DHL Import Rate over 30Kg: ', result.output.Rate);

                    const FinalRate = weight * result.output.Rate;
                    // console.log('DHL Rate over 30Kg: ',FinalRate);
                    FedexRate = FinalRate;
                }
                console.log('FedEx Rate: ',FedexRate);
            }
            
        }
        const ratesWithSources = [
            { rate: UPSRate, source: 'UPS' },
            { rate: DHLRate, source: 'DHL' },
            { rate: FedexRate, source: 'FedEx' }
        ].filter(item => item.rate !== null);
        
        if (ratesWithSources.length > 0) {
            // Find the rate object with the minimum rate
            const lowestRateObject = ratesWithSources.reduce((min, current) => (current.rate < min.rate ? current : min));
            console.log(`The lowest rate is: ${lowestRateObject.rate} from ${lowestRateObject.source}`);
            res.json({  rate: lowestRateObject.rate, 
                        source: lowestRateObject.source,
                        rateList:  ratesWithSources });
        } else {
            console.log('No valid rates available');
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};

/////////////
//-EXPORTS-//
/////////////

//selectExportDocuments
const selectExportDocuments = async (req, res) => {
    try {
        const { weight, country } = req.body;

        if (!weight || !country) {
            return res.status(400).json({ error: 'Weight and country zone are required.' });
        }

        const pool = await poolPromise;

        if (!pool) {
            console.error('Database connection failed.');
            return res.status(500).json({ error: 'Database connection failed.' });
        }

        const request1 = pool.request();


        request1.input('country', sql.VarChar(100), country);

        const result = await request1.execute('selectCountryZone');
        
        
        const Services = result.recordset.map(record => record.Source);
        const ExportZones = {};
        result.recordset.forEach(record => {
            ExportZones[record.Source] = record.Export_Zone;
        });

        console.log("Country:", country);
        console.log("Export Zones: ",ExportZones);

        let UPSRate = null;
        let DHLRate = null;
        let FedexRate = null;

        for (const record of result.recordset) {
            const { Source, Export_Zone } = record;
            

            if (Source === 'UPS') {
                const request2 = pool.request();
                const SPCountries = await request2.execute('SelectAllUPSSpecialCountries')
                const normalizedCountry = country.replace(/\s+/g, '');

                const isCountryInList = SPCountries.recordset.some(item => item.SPCountries.includes(normalizedCountry));

                //if country in the special list
                if (isCountryInList) {
                    console.log("Special Country");
                    if (weight > 0 && weight <= 5 ){
                        // Search for rate
                        const request = pool.request();
                        request.input('Pweight', sql.VarChar(20), weight);
                        request.input('Country', sql.VarChar(20), normalizedCountry);
                        request.output('Rate', sql.Float);

                        const result = await request.execute('SelectUPSSpecialExportRateUptoFive');
                        UPSRate = result.output.Rate;
                        //console.log('UPS Export Rate upto 5Kg:', result.output.Rate);
                    } else if(weight > 5 && weight <= 70 ){
                        // Search for rate
                        const request = pool.request();
                        request.input('Pweight', sql.VarChar(20), weight);
                        request.input('Country', sql.VarChar(20), normalizedCountry);
                        request.output('Rate', sql.Float);
                
                        const result = await request.execute('SelectUPSSpecialExportRateOverFive');
                        // console.log('UPS Export Rate over 5Kg:', result.output.Rate);
                        UPSRate = result.output.Rate
    
                    } else if(weight > 70){
                        // Search for rate
                        const request = pool.request();
                        request.input('Country', sql.VarChar(20), normalizedCountry);
                        request.output('Rate', sql.Float);
    
                        const result = await request.execute('SelectUPSSpecialExportRateOverSeventy');
                        // console.log('UPS Export Rate over 70Kg: ', result.output.Rate);
    
                        const FinalRate = weight * result.output.Rate;
                        // console.log('UPS Rate over 70Kg: ',FinalRate);
                        UPSRate = FinalRate
                    }
                } 
                //if country is not in the special list
                else {
                    const exportZoneOfUPS = Export_Zone;
                
                    if (weight > 0 && weight <= 5 ){
                        // Search for rate
                        const request = pool.request();
                        request.input('Pweight', sql.VarChar(20), weight);
                        request.input('Zone', sql.VarChar(20), exportZoneOfUPS);
                        request.output('Rate', sql.Float);

                        const result = await request.execute('SelectUPSExportRateUptoFive');
                        UPSRate = result.output.Rate
                        // console.log('UPS Export Rate upto 5Kg:', result.output.Rate);
                    }else if(weight > 5 && weight <= 70 ){
                        // Search for rate
                        const request = pool.request();
                        request.input('Pweight', sql.VarChar(20), weight);
                        request.input('Zone', sql.VarChar(20), exportZoneOfUPS);
                        request.output('Rate', sql.Float);
                
                        const result = await request.execute('SelectUPSExportRateOverFive');
                        // console.log('UPS Export Rate over 5Kg:', result.output.Rate);
                        UPSRate = result.output.Rate

                    }else if(weight > 70){
                        // Search for rate
                        const request = pool.request();
                        request.input('zone', sql.VarChar(20), exportZoneOfUPS);
                        request.output('Rate', sql.Float);

                        const result = await request.execute('selectUPSExportsOverSeventy');
                        // console.log('UPS Export Rate over 70Kg: ', result.output.Rate);

                        const FinalRate = weight * result.output.Rate;
                        // console.log('UPS Rate over 70Kg: ',FinalRate);
                        UPSRate = FinalRate
                    }
                
                }

                console.log('UPS Rate: ', UPSRate);  
            } if (Source === 'DHL') {
                const exportZoneOfDHL = Export_Zone; 
                     
                if (weight > 0 && weight <= 2 ){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), exportZoneOfDHL);
                    request.output('Rate', sql.Float);

                    const result = await request.execute('SelectDHLExportRateUptoTwo');
                    // console.log('DHL Import Rate upto 2Kg:', result.output.Rate);
                    DHLRate = result.output.Rate;
                }
                else if(weight > 2 && weight <= 30 ){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), exportZoneOfDHL);
                    request.output('Rate', sql.Float);
            
                    const result = await request.execute('SelectDHLExportRateOverTwo');
                    // console.log('DHL Import Rate over 2Kg:', result.output.Rate);
                    DHLRate = result.output.Rate;

                }
                else if(weight > 30){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), exportZoneOfDHL);
                    request.output('Rate', sql.Float);

                    const result = await request.execute('selectDHLExportsOverThirty');
                    // console.log('DHL Import Rate over 30Kg: ', result.output.Rate);

                    const FinalRate = weight * result.output.Rate;
                    // console.log('DHL Rate over 30Kg: ',FinalRate);
                    DHLRate = FinalRate;
                }
                console.log('DHL Rate: ', DHLRate);
            } if (Source === 'FedEx') {
                const exportZoneOfFedex = Export_Zone;
                
                if (weight > 0 && weight <= 0.5 ){
                    // Search for rate
                    const request = pool.request();
                    request.input('Country', sql.VarChar(100),country)
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), exportZoneOfFedex);
                    request.output('Rate', sql.Float);

                    const result = await request.execute('SelectFedexExportRateDocument');
                    // console.log('Fedex Import Rate Document:', result.output.Rate);
                    FedexRate = result.output.Rate
                }
                console.log('FedEx Rate: ',FedexRate);
            }
            
        }
        const ratesWithSources = [
            { rate: UPSRate, source: 'UPS' },
            { rate: DHLRate, source: 'DHL' },
            { rate: FedexRate, source: 'FedEx' }
        ].filter(item => item.rate !== null);
        
        if (ratesWithSources.length > 0) {
            // Find the rate object with the minimum rate
            const lowestRateObject = ratesWithSources.reduce((min, current) => (current.rate < min.rate ? current : min));
            console.log(`The lowest rate is: ${lowestRateObject.rate} from ${lowestRateObject.source}`);
            res.json({  rate: lowestRateObject.rate, 
                        source: lowestRateObject.source,
                        rateList:  ratesWithSources });
        } else {
            console.log('No valid rates available');
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};

//selectExportPackages
const selectExportPackages = async (req, res) => {
    try {
        const { weight, country } = req.body;


        if (!weight || !country) {
            return res.status(400).json({ error: 'Weight and country zone are required.' });
        }

        const pool = await poolPromise;

        if (!pool) {
            console.error('Database connection failed.');
            return res.status(500).json({ error: 'Database connection failed.' });
        }

        const request1 = pool.request();


        request1.input('country', sql.VarChar(100), country);

        const result = await request1.execute('selectCountryZone');
        
        
        const Services = result.recordset.map(record => record.Source);
        const ExportZones = {};
        result.recordset.forEach(record => {
            ExportZones[record.Source] = record.Export_Zone;
        });

        console.log("Country:", country);
        console.log("Export Zones: ",ExportZones);

        let UPSRate = null;
        let DHLRate = null;
        let FedexRate = null;

        for (const record of result.recordset) {
            const { Source, Export_Zone } = record;
            

            if (Source === 'UPS') {
                const request2 = pool.request();
                const SPCountries = await request2.execute('SelectAllUPSSpecialCountries')

                const normalizedCountry = country.replace(/\s+/g, '');


                const isCountryInList = SPCountries.recordset.some(item => item.SPCountries.includes(normalizedCountry));

                //if country in the special list
                if (isCountryInList) {
                    console.log("Special Country");
                    if (weight > 0 && weight <= 70 ){
                        // Search for rate
                        const request = pool.request();
                        request.input('Pweight', sql.VarChar(20), weight);
                        request.input('Country', sql.VarChar(20), normalizedCountry);
                        request.output('Rate', sql.Float);

                        const result = await request.execute('SelectUPSSpecialExportRateOverFive');
                        UPSRate = result.output.Rate;
                        //console.log('UPS Export Rate upto 5Kg:', result.output.Rate);
                    } else if(weight > 70){
                        // Search for rate
                        const request = pool.request();
                        request.input('Country', sql.VarChar(20), normalizedCountry);
                        request.output('Rate', sql.Float);
    
                        const result = await request.execute('SelectUPSSpecialExportRateOverSeventy');
                        // console.log('UPS Export Rate over 70Kg: ', result.output.Rate);
    
                        const FinalRate = weight * result.output.Rate;
                        // console.log('UPS Rate over 70Kg: ',FinalRate);
                        UPSRate = FinalRate
                    }
                } 
                //if country is not in the special list
                else {
                    const exportZoneOfUPS = Export_Zone;
                
                    if (weight > 0 && weight <= 70 ){
                        // Search for rate
                        const request = pool.request();
                        request.input('Pweight', sql.VarChar(20), weight);
                        request.input('Zone', sql.VarChar(20), exportZoneOfUPS);
                        request.output('Rate', sql.Float);

                        const result = await request.execute('SelectUPSExportRateOverFive');
                        UPSRate = result.output.Rate
                        // console.log('UPS Export Rate upto 5Kg:', result.output.Rate);
                    }else if(weight > 70){
                        // Search for rate
                        const request = pool.request();
                        request.input('zone', sql.VarChar(20), exportZoneOfUPS);
                        request.output('Rate', sql.Float);

                        const result = await request.execute('selectUPSExportsOverSeventy');
                        // console.log('UPS Export Rate over 70Kg: ', result.output.Rate);

                        const FinalRate = weight * result.output.Rate;
                        // console.log('UPS Rate over 70Kg: ',FinalRate);
                        UPSRate = FinalRate
                    }
                
                }

                console.log('UPS Rate: ', UPSRate);  
            } if (Source === 'DHL') {
                const exportZoneOfDHL = Export_Zone; 
                     
                if(weight >= 0.5 && weight <= 30 ){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), exportZoneOfDHL);
                    request.output('Rate', sql.Float);
            
                    const result = await request.execute('SelectDHLExportRateOverTwo');
                    // console.log('DHL Import Rate over 2Kg:', result.output.Rate);
                    DHLRate = result.output.Rate;

                }
                else if(weight > 30){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), exportZoneOfDHL);
                    request.output('Rate', sql.Float);

                    const result = await request.execute('selectDHLExportsOverThirty');
                    // console.log('DHL Import Rate over 30Kg: ', result.output.Rate);

                    const FinalRate = weight * result.output.Rate;
                    // console.log('DHL Rate over 30Kg: ',FinalRate);
                    DHLRate = FinalRate;
                }
                console.log('DHL Rate: ', DHLRate);
            } if (Source === 'FedEx') {
                const exportZoneOfFedex = Export_Zone;
                
                if (weight > 0 && weight <= 2.5 ){
                    // Search for rate
                    const request = pool.request();
                    request.input('Country', sql.VarChar(100),country)
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), exportZoneOfFedex);
                    request.output('Rate', sql.Float);

                    const result = await request.execute('SelectFedexExportRatePackage');
                    // console.log('Fedex Import Rate Document:', result.output.Rate);
                    FedexRate = result.output.Rate
                }
                console.log('FedEx Rate: ',FedexRate);
            }
            
        }
        const ratesWithSources = [
            { rate: UPSRate, source: 'UPS' },
            { rate: DHLRate, source: 'DHL' },
            { rate: FedexRate, source: 'FedEx' }
        ].filter(item => item.rate !== null);
        
        if (ratesWithSources.length > 0) {
            // Find the rate object with the minimum rate
            const lowestRateObject = ratesWithSources.reduce((min, current) => (current.rate < min.rate ? current : min));
            console.log(`The lowest rate is: ${lowestRateObject.rate} from ${lowestRateObject.source}`);
            res.json({  rate: lowestRateObject.rate, 
                        source: lowestRateObject.source,
                        rateList:  ratesWithSources });
        } else {
            console.log('No valid rates available');
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};

//selectExportSamples
const selectExportSamples = async (req, res) => {
    try {
        const { weight, country } = req.body;

        if (!weight || !country) {
            return res.status(400).json({ error: 'Weight and country zone are required.' });
        }

        const pool = await poolPromise;

        if (!pool) {
            console.error('Database connection failed.');
            return res.status(500).json({ error: 'Database connection failed.' });
        }

        const request1 = pool.request();


        request1.input('country', sql.VarChar(100), country);

        const result = await request1.execute('selectCountryZone');
        
        
        const Services = result.recordset.map(record => record.Source);
        const ExportZones = {};
        result.recordset.forEach(record => {
            ExportZones[record.Source] = record.Export_Zone;
        });

        console.log("Country:", country);
        console.log("Export Zones: ",ExportZones);

        let UPSRate = null;
        let DHLRate = null;
        let FedexRate = null;

        for (const record of result.recordset) {
            const { Source, Export_Zone } = record;
            

            if (Source === 'UPS') {
                const request2 = pool.request();
                const SPCountries = await request2.execute('SelectAllUPSSpecialCountries')

                const normalizedCountry = country.replace(/\s+/g, '');


                const isCountryInList = SPCountries.recordset.some(item => item.SPCountries.includes(normalizedCountry));

                //if country in the special list
                if (isCountryInList) {
                    console.log("Special Country");
                    if (weight > 0 && weight <= 70 ){
                        // Search for rate
                        const request = pool.request();
                        request.input('Pweight', sql.VarChar(20), weight);
                        request.input('Country', sql.VarChar(20), normalizedCountry);
                        request.output('Rate', sql.Float);

                        const result = await request.execute('SelectUPSSpecialExportRateOverFive');
                        UPSRate = result.output.Rate;
                        //console.log('UPS Export Rate upto 5Kg:', result.output.Rate);
                    } else if(weight > 70){
                        // Search for rate
                        const request = pool.request();
                        request.input('Country', sql.VarChar(20), normalizedCountry);
                        request.output('Rate', sql.Float);
    
                        const result = await request.execute('SelectUPSSpecialExportRateOverSeventy');
                        // console.log('UPS Export Rate over 70Kg: ', result.output.Rate);
    
                        const FinalRate = weight * result.output.Rate;
                        // console.log('UPS Rate over 70Kg: ',FinalRate);
                        UPSRate = FinalRate
                    }
                } 
                //if country is not in the special list
                else {
                    const exportZoneOfUPS = Export_Zone;
                
                    if (weight > 0 && weight <= 70 ){
                        // Search for rate
                        const request = pool.request();
                        request.input('Pweight', sql.VarChar(20), weight);
                        request.input('Zone', sql.VarChar(20), exportZoneOfUPS);
                        request.output('Rate', sql.Float);

                        const result = await request.execute('SelectUPSExportRateOverFive');
                        UPSRate = result.output.Rate
                        // console.log('UPS Export Rate upto 5Kg:', result.output.Rate);
                    }else if(weight > 70){
                        // Search for rate
                        const request = pool.request();
                        request.input('zone', sql.VarChar(20), exportZoneOfUPS);
                        request.output('Rate', sql.Float);

                        const result = await request.execute('selectUPSExportsOverSeventy');
                        // console.log('UPS Export Rate over 70Kg: ', result.output.Rate);

                        const FinalRate = weight * result.output.Rate;
                        // console.log('UPS Rate over 70Kg: ',FinalRate);
                        UPSRate = FinalRate
                    }
                
                }

                console.log('UPS Rate: ', UPSRate);  
            } if (Source === 'DHL') {
                const exportZoneOfDHL = Export_Zone; 
                     
                if(weight >= 0.5 && weight <= 30 ){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), exportZoneOfDHL);
                    request.output('Rate', sql.Float);
            
                    const result = await request.execute('SelectDHLExportRateOverTwo');
                    // console.log('DHL Import Rate over 2Kg:', result.output.Rate);
                    DHLRate = result.output.Rate;

                }
                else if(weight > 30){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), exportZoneOfDHL);
                    request.output('Rate', sql.Float);

                    const result = await request.execute('selectDHLExportsOverThirty');
                    // console.log('DHL Import Rate over 30Kg: ', result.output.Rate);

                    const FinalRate = weight * result.output.Rate;
                    // console.log('DHL Rate over 30Kg: ',FinalRate);
                    DHLRate = FinalRate;
                }
                console.log('DHL Rate: ', DHLRate);
            } if (Source === 'FedEx') {
                const exportZoneOfFedex = Export_Zone;
                
                if (weight > 0 && weight <= 50 ){
                    // Search for rate
                    const request = pool.request();
                    request.input('Country', sql.VarChar(100),country)
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), exportZoneOfFedex);
                    request.output('Rate', sql.Float);

                    const result = await request.execute('SelectFedexExportRateSample');
                    // console.log('Fedex Import Rate Document:', result.output.Rate);
                    FedexRate = result.output.Rate
                }
                console.log('FedEx Rate: ',FedexRate);
            }
            
        }
        const ratesWithSources = [
            { rate: UPSRate, source: 'UPS' },
            { rate: DHLRate, source: 'DHL' },
            { rate: FedexRate, source: 'FedEx' }
        ].filter(item => item.rate !== null);
        
        if (ratesWithSources.length > 0) {
            // Find the rate object with the minimum rate
            const lowestRateObject = ratesWithSources.reduce((min, current) => (current.rate < min.rate ? current : min));
            console.log(`The lowest rate is: ${lowestRateObject.rate} from ${lowestRateObject.source}`);
            res.json({  rate: lowestRateObject.rate, 
                        source: lowestRateObject.source,
                        rateList:  ratesWithSources });
        } else {
            console.log('No valid rates available');
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};

////////////////
//-E-Commerce-//
////////////////

//select E-Com Document
const selectEComDocuments = async (req, res) => {
    try {
        const { weight, country } = req.body;

        if (!weight || !country) {
            return res.status(400).json({ error: 'Weight and country zone are required.' });
        }

        const pool = await poolPromise;

        if (!pool) {
            console.error('Database connection failed.');
            return res.status(500).json({ error: 'Database connection failed.' });
        }

        const request1 = pool.request();


        request1.input('country', sql.VarChar(100), country);

        const result = await request1.execute('selectCountryZone');
        
        
        const Services = result.recordset.map(record => record.Source);
        const EComZones = {};
        result.recordset.forEach(record => {
            EComZones[record.Source] = record.ECom_Zone;
        });

        console.log("Country:", country);
        console.log("E-Commerce Zones: ",EComZones);

        let UPSRate = null;
        let DHLRate = null;
        let FedexRate = null;

        for (const record of result.recordset) {
            const { Source, ECom_Zone } = record;
            

            if (Source === 'UPS') {
                const request2 = pool.request();
                const SPCountries = await request2.execute('SelectAllUPSSpecialCountries')

                const normalizedCountry = country.replace(/\s+/g, '');


                const isCountryInList = SPCountries.recordset.some(item => item.SPCountries.includes(normalizedCountry));

                //if country in the special list
                if (isCountryInList) {
                    console.log("Special Country");
                    if (weight > 0 && weight <= 5 ){
                        // Search for rate
                        const request = pool.request();
                        request.input('Pweight', sql.VarChar(20), weight);
                        request.input('Country', sql.VarChar(20), normalizedCountry);
                        request.output('Rate', sql.Float);

                        const result = await request.execute('SelectUPSSpecialExportRateUptoFive');
                        UPSRate = result.output.Rate;
                        //console.log('UPS Export Rate upto 5Kg:', result.output.Rate);
                    } else if(weight > 5 && weight <= 70 ){
                        // Search for rate
                        const request = pool.request();
                        request.input('Pweight', sql.VarChar(20), weight);
                        request.input('Country', sql.VarChar(20), normalizedCountry);
                        request.output('Rate', sql.Float);
                
                        const result = await request.execute('SelectUPSSpecialExportRateOverFive');
                        // console.log('UPS Export Rate over 5Kg:', result.output.Rate);
                        UPSRate = result.output.Rate
    
                    } else if(weight > 70){
                        // Search for rate
                        const request = pool.request();
                        request.input('Country', sql.VarChar(20), normalizedCountry);
                        request.output('Rate', sql.Float);
    
                        const result = await request.execute('SelectUPSSpecialExportRateOverSeventy');
                        // console.log('UPS Export Rate over 70Kg: ', result.output.Rate);
    
                        const FinalRate = weight * result.output.Rate;
                        // console.log('UPS Rate over 70Kg: ',FinalRate);
                        UPSRate = FinalRate
                    }
                } 
                //if country is not in the special list
                else {
                    const eComZoneOfUPS = ECom_Zone;
                
                    if (weight > 0 && weight <= 5 ){
                        // Search for rate
                        const request = pool.request();
                        request.input('Pweight', sql.VarChar(20), weight);
                        request.input('Zone', sql.VarChar(20), eComZoneOfUPS);
                        request.output('Rate', sql.Float);

                        const result = await request.execute('SelectUPSExportRateUptoFive');
                        UPSRate = result.output.Rate
                        // console.log('UPS Export Rate upto 5Kg:', result.output.Rate);
                    }else if(weight > 5 && weight <= 70 ){
                        // Search for rate
                        const request = pool.request();
                        request.input('Pweight', sql.VarChar(20), weight);
                        request.input('Zone', sql.VarChar(20), eComZoneOfUPS);
                        request.output('Rate', sql.Float);
                
                        const result = await request.execute('SelectUPSExportRateOverFive');
                        // console.log('UPS Export Rate over 5Kg:', result.output.Rate);
                        UPSRate = result.output.Rate

                    }else if(weight > 70){
                        // Search for rate
                        const request = pool.request();
                        request.input('zone', sql.VarChar(20), eComZoneOfUPS);
                        request.output('Rate', sql.Float);

                        const result = await request.execute('selectUPSExportsOverSeventy');
                        // console.log('UPS Export Rate over 70Kg: ', result.output.Rate);

                        const FinalRate = weight * result.output.Rate;
                        // console.log('UPS Rate over 70Kg: ',FinalRate);
                        UPSRate = FinalRate
                    }
                
                }

                console.log('UPS Rate: ', UPSRate);  
            } if (Source === 'DHL') {
                const eComZoneOfDHL = ECom_Zone; 
                     
                if (weight > 0 && weight <= 30 ){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), eComZoneOfDHL);
                    request.output('Rate', sql.Float);

                    const result = await request.execute('SelectDHLEComRateOverPointFive');
                    // console.log('DHL Import Rate upto 2Kg:', result.output.Rate);
                    DHLRate = result.output.Rate;
                }
                else if(weight > 30){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), eComZoneOfDHL);
                    request.output('Rate', sql.Float);

                    const result = await request.execute('selectDHLEComOverThirty');
                    // console.log('DHL Import Rate over 30Kg: ', result.output.Rate);

                    const FinalRate = weight * result.output.Rate;
                    // console.log('DHL Rate over 30Kg: ',FinalRate);
                    DHLRate = FinalRate;
                }
                console.log('DHL Rate: ', DHLRate);
            } if (Source === 'FedEx') {
                const eComZoneOfFedex = ECom_Zone;
                
                if (weight > 0 && weight <= 0.5 ){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), eComZoneOfFedex);
                    request.output('Rate', sql.Float);

                    const result = await request.execute('SelectFedexEComRateDocument');
                    // console.log('Fedex Import Rate Document:', result.output.Rate);
                    FedexRate = result.output.Rate
                }
                console.log('FedEx Rate: ',FedexRate);
            }
            
        }
        const ratesWithSources = [
            { rate: UPSRate, source: 'UPS' },
            { rate: DHLRate, source: 'DHL' },
            { rate: FedexRate, source: 'FedEx' }
        ].filter(item => item.rate !== null);
        
        if (ratesWithSources.length > 0) {
            // Find the rate object with the minimum rate
            const lowestRateObject = ratesWithSources.reduce((min, current) => (current.rate < min.rate ? current : min));
            console.log(`The lowest rate is: ${lowestRateObject.rate} from ${lowestRateObject.source}`);
            res.json({  rate: lowestRateObject.rate, 
                        source: lowestRateObject.source,
                        rateList:  ratesWithSources });
        } else {
            console.log('No valid rates available');
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};

//select E-Com Package
const selectEComPackages = async (req, res) => {
    try {
        const { weight, country } = req.body;

        if (!weight || !country) {
            return res.status(400).json({ error: 'Weight and country zone are required.' });
        }

        const pool = await poolPromise;

        if (!pool) {
            console.error('Database connection failed.');
            return res.status(500).json({ error: 'Database connection failed.' });
        }

        const request1 = pool.request();


        request1.input('country', sql.VarChar(100), country);

        const result = await request1.execute('selectCountryZone');
        
        
        const Services = result.recordset.map(record => record.Source);
        const EComZones = {};
        result.recordset.forEach(record => {
            EComZones[record.Source] = record.ECom_Zone;
        });

        console.log("Country:", country);
        console.log("E-Commerce Zones: ",EComZones);

        let UPSRate = null;
        let DHLRate = null;
        let FedexRate = null;

        for (const record of result.recordset) {
            const { Source, ECom_Zone } = record;
            

            if (Source === 'UPS') {
                const request2 = pool.request();
                const SPCountries = await request2.execute('SelectAllUPSSpecialCountries')

                const normalizedCountry = country.replace(/\s+/g, '');


                const isCountryInList = SPCountries.recordset.some(item => item.SPCountries.includes(normalizedCountry));

                //if country in the special list
                if (isCountryInList) {
                    console.log("Special Country");
                    if (weight > 0 && weight <= 70 ){
                        // Search for rate
                        const request = pool.request();
                        request.input('Pweight', sql.VarChar(20), weight);
                        request.input('Country', sql.VarChar(20), normalizedCountry);
                        request.output('Rate', sql.Float);

                        const result = await request.execute('SelectUPSSpecialExportRateOverFive');
                        UPSRate = result.output.Rate;
                        //console.log('UPS Export Rate upto 5Kg:', result.output.Rate);
                    } else if(weight > 70){
                        // Search for rate
                        const request = pool.request();
                        request.input('Country', sql.VarChar(20), normalizedCountry);
                        request.output('Rate', sql.Float);
    
                        const result = await request.execute('SelectUPSSpecialExportRateOverSeventy');
                        // console.log('UPS Export Rate over 70Kg: ', result.output.Rate);
    
                        const FinalRate = weight * result.output.Rate;
                        // console.log('UPS Rate over 70Kg: ',FinalRate);
                        UPSRate = FinalRate
                    }
                } 
                //if country is not in the special list
                else {
                    const eComZoneOfUPS = ECom_Zone;
                
                    if (weight > 0 && weight <= 70 ){
                        // Search for rate
                        const request = pool.request();
                        request.input('Pweight', sql.VarChar(20), weight);
                        request.input('Zone', sql.VarChar(20), eComZoneOfUPS);
                        request.output('Rate', sql.Float);

                        const result = await request.execute('SelectUPSExportRateOverFive');
                        UPSRate = result.output.Rate
                        // console.log('UPS Export Rate upto 5Kg:', result.output.Rate);
                    }else if(weight > 70){
                        // Search for rate
                        const request = pool.request();
                        request.input('zone', sql.VarChar(20), eComZoneOfUPS);
                        request.output('Rate', sql.Float);

                        const result = await request.execute('selectUPSExportsOverSeventy');
                        // console.log('UPS Export Rate over 70Kg: ', result.output.Rate);

                        const FinalRate = weight * result.output.Rate;
                        // console.log('UPS Rate over 70Kg: ',FinalRate);
                        UPSRate = FinalRate
                    }
                
                }

                console.log('UPS Rate: ', UPSRate);  
            } if (Source === 'DHL') {
                const eComZoneOfDHL = ECom_Zone; 
                     
                if(weight >= 0.5 && weight <= 30 ){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), eComZoneOfDHL);
                    request.output('Rate', sql.Float);
            
                    const result = await request.execute('SelectDHLEComRateOverPointFive');
                    // console.log('DHL Import Rate over 2Kg:', result.output.Rate);
                    DHLRate = result.output.Rate;

                }
                else if(weight > 30){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), eComZoneOfDHL);
                    request.output('Rate', sql.Float);

                    const result = await request.execute('selectDHLEComOverThirty');
                    // console.log('DHL Import Rate over 30Kg: ', result.output.Rate);

                    const FinalRate = weight * result.output.Rate;
                    // console.log('DHL Rate over 30Kg: ',FinalRate);
                    DHLRate = FinalRate;
                }
                console.log('DHL Rate: ', DHLRate);
            } if (Source === 'FedEx') {
                const eComZoneOfFedex = ECom_Zone;
                
                if (weight > 0 && weight <= 2.5 ){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), eComZoneOfFedex);
                    request.output('Rate', sql.Float);

                    const result = await request.execute('SelectFedexEComRatePackage');
                    // console.log('Fedex Import Rate Document:', result.output.Rate);
                    FedexRate = result.output.Rate
                }
                console.log('FedEx Rate: ',FedexRate);
            }
            
        }
        const ratesWithSources = [
            { rate: UPSRate, source: 'UPS' },
            { rate: DHLRate, source: 'DHL' },
            { rate: FedexRate, source: 'FedEx' }
        ].filter(item => item.rate !== null);
        
        if (ratesWithSources.length > 0) {
            // Find the rate object with the minimum rate
            const lowestRateObject = ratesWithSources.reduce((min, current) => (current.rate < min.rate ? current : min));
            console.log(`The lowest rate is: ${lowestRateObject.rate} from ${lowestRateObject.source}`);
            res.json({  rate: lowestRateObject.rate, 
                        source: lowestRateObject.source,
                        rateList:  ratesWithSources });
        } else {
            console.log('No valid rates available');
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};

//select E-Com Sample
const selectEComSamples = async (req, res) => {
    try {
        const { weight, country } = req.body;

        if (!weight || !country) {
            return res.status(400).json({ error: 'Weight and country zone are required.' });
        }

        const pool = await poolPromise;

        if (!pool) {
            console.error('Database connection failed.');
            return res.status(500).json({ error: 'Database connection failed.' });
        }

        const request1 = pool.request();


        request1.input('country', sql.VarChar(100), country);

        const result = await request1.execute('selectCountryZone');
        
        
        const Services = result.recordset.map(record => record.Source);
        const EComZones = {};
        result.recordset.forEach(record => {
            EComZones[record.Source] = record.ECom_Zone;
        });

        console.log("Country:", country);
        console.log("E-Commerce Zones: ",EComZones);

        let UPSRate = null;
        let DHLRate = null;
        let FedexRate = null;

        for (const record of result.recordset) {
            const { Source, ECom_Zone } = record;
            

            if (Source === 'UPS') {
                const request2 = pool.request();
                const SPCountries = await request2.execute('SelectAllUPSSpecialCountries')

                const normalizedCountry = country.replace(/\s+/g, '');


                const isCountryInList = SPCountries.recordset.some(item => item.SPCountries.includes(normalizedCountry));

                //if country in the special list
                if (isCountryInList) {
                    console.log("Special Country");
                    if (weight > 0 && weight <= 70 ){
                        // Search for rate
                        const request = pool.request();
                        request.input('Pweight', sql.VarChar(20), weight);
                        request.input('Country', sql.VarChar(20), normalizedCountry);
                        request.output('Rate', sql.Float);

                        const result = await request.execute('SelectUPSSpecialExportRateOverFive');
                        UPSRate = result.output.Rate;
                        //console.log('UPS Export Rate upto 5Kg:', result.output.Rate);
                    } else if(weight > 70){
                        // Search for rate
                        const request = pool.request();
                        request.input('Country', sql.VarChar(20), normalizedCountry);
                        request.output('Rate', sql.Float);
    
                        const result = await request.execute('SelectUPSSpecialExportRateOverSeventy');
                        // console.log('UPS Export Rate over 70Kg: ', result.output.Rate);
    
                        const FinalRate = weight * result.output.Rate;
                        // console.log('UPS Rate over 70Kg: ',FinalRate);
                        UPSRate = FinalRate
                    }
                } 
                //if country is not in the special list
                else {
                    const eComZoneOfUPS = ECom_Zone;
                
                    if (weight > 0 && weight <= 70 ){
                        // Search for rate
                        const request = pool.request();
                        request.input('Pweight', sql.VarChar(20), weight);
                        request.input('Zone', sql.VarChar(20), eComZoneOfUPS);
                        request.output('Rate', sql.Float);

                        const result = await request.execute('SelectUPSExportRateOverFive');
                        UPSRate = result.output.Rate
                        // console.log('UPS Export Rate upto 5Kg:', result.output.Rate);
                    }else if(weight > 70){
                        // Search for rate
                        const request = pool.request();
                        request.input('zone', sql.VarChar(20), eComZoneOfUPS);
                        request.output('Rate', sql.Float);

                        const result = await request.execute('selectUPSExportsOverSeventy');
                        // console.log('UPS Export Rate over 70Kg: ', result.output.Rate);

                        const FinalRate = weight * result.output.Rate;
                        // console.log('UPS Rate over 70Kg: ',FinalRate);
                        UPSRate = FinalRate
                    }
                
                }

                console.log('UPS Rate: ', UPSRate);  
            } if (Source === 'DHL') {
                const eComZoneOfDHL = ECom_Zone; 
                     
                if(weight >= 0.5 && weight <= 30 ){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), eComZoneOfDHL);
                    request.output('Rate', sql.Float);
            
                    const result = await request.execute('SelectDHLEComRateOverPointFive');
                    // console.log('DHL Import Rate over 2Kg:', result.output.Rate);
                    DHLRate = result.output.Rate;

                }
                else if(weight > 30){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), eComZoneOfDHL);
                    request.output('Rate', sql.Float);

                    const result = await request.execute('selectDHLEComOverThirty');
                    // console.log('DHL Import Rate over 30Kg: ', result.output.Rate);

                    const FinalRate = weight * result.output.Rate;
                    // console.log('DHL Rate over 30Kg: ',FinalRate);
                    DHLRate = FinalRate;
                }
                console.log('DHL Rate: ', DHLRate);
            } if (Source === 'FedEx') {
                const eComZoneOfFedex = ECom_Zone;
                
                if (weight > 0 && weight <= 30 ){
                    // Search for rate
                    const request = pool.request();
                    request.input('Pweight', sql.VarChar(20), weight);
                    request.input('Zone', sql.VarChar(20), eComZoneOfFedex);
                    request.output('Rate', sql.Float);

                    const result = await request.execute('SelectFedexEComRateSample');
                    // console.log('Fedex Import Rate Document:', result.output.Rate);
                    FedexRate = result.output.Rate
                }
                console.log('FedEx Rate: ',FedexRate);
            }
            
        }
        const ratesWithSources = [
            { rate: UPSRate, source: 'UPS' },
            { rate: DHLRate, source: 'DHL' },
            { rate: FedexRate, source: 'FedEx' }
        ].filter(item => item.rate !== null);
        
        if (ratesWithSources.length > 0) {
            // Find the rate object with the minimum rate
            const lowestRateObject = ratesWithSources.reduce((min, current) => (current.rate < min.rate ? current : min));
            console.log(`The lowest rate is: ${lowestRateObject.rate} from ${lowestRateObject.source}`);
            res.json({  rate: lowestRateObject.rate, 
                        source: lowestRateObject.source,
                        rateList:  ratesWithSources });
        } else {
            console.log('No valid rates available');
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};






//for select all data from tblPdfs
const selectTblPdfs = async (req, res) => {
    try {
      const pool = await poolPromise;
      if (!pool) {
        console.error('Database connection failed.');
        return res.status(500).json({ error: 'Database connection failed.' });
      }
  
      const request = pool.request();
      const allPdfs = await request.query('SELECT * FROM tblPdfs ORDER BY id DESC;');
      res.json({ DataSet: allPdfs });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  };

//for select all data from tblPendingList
const selectPendingList = async (req, res) => {
    try {
      const pool = await poolPromise;
      if (!pool) {
        console.error('Database connection failed.');
        return res.status(500).json({ error: 'Database connection failed.' });
      }
  
      const request = pool.request();
      const allPdfs = await request.query('SELECT * FROM tblPendingList ORDER BY currentDate DESC;');
      res.json({ DataSet: allPdfs });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  };

//for select all data from tblDisapproved
const selectDisapprovedList = async (req, res) => {
    try {
      const pool = await poolPromise;
      if (!pool) {
        console.error('Database connection failed.');
        return res.status(500).json({ error: 'Database connection failed.' });
      }
  
      const request = pool.request();
      const allPdfs = await request.query('SELECT * FROM tblDisapprovedList ORDER BY id DESC;');
      res.json({ DataSet: allPdfs });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  };
  

module.exports = {
    selectImportDocuments,
    selectImportPackages,
    selectImportSamples,
    selectExportDocuments,
    selectExportPackages,
    selectExportSamples,
    selectEComDocuments,
    selectEComPackages,
    selectEComSamples,
    selectTblPdfs,
    selectPendingList,
    selectDisapprovedList
};
