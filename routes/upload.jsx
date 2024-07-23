const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController.jsx');

//ups
router.post('/uploadUPSZones.jsx', uploadController.uploadFile);
router.post('/uploadUPSExportsUptoFive.jsx', uploadController.uploadFile1);
router.post('/uploadUPSExportsOverFive.jsx', uploadController.uploadFile2);
router.post('/uploadUPSExportsOverSeventy.jsx', uploadController.uploadFile3);
router.post('/uploadUPSSpecialExportsUptoFive.jsx', uploadController.uploadFile4);
router.post('/uploadUPSSpecialExportsOverFive.jsx', uploadController.uploadFile5);
router.post('/uploadUPSSpecialExportsOverSeventy.jsx', uploadController.uploadFile6);
router.post('/uploadUPSImportsUptoFive.jsx', uploadController.uploadFile7);
router.post('/uploadUPSImportsOverFive.jsx', uploadController.uploadFile8);
router.post('/uploadUPSImportsOverSeventy.jsx', uploadController.uploadFile9);

//dhl
router.post('/uploadDHLZones.jsx', uploadController.uploadFile10);
router.post('/uploadDHLExportsUptoTwo.jsx', uploadController.uploadFile11);
router.post('/uploadDHLExportsOverTwo.jsx', uploadController.uploadFile12);
router.post('/uploadDHLExportsOverThirty.jsx', uploadController.uploadFile13);
router.post('/uploadDHLEComExportsOverPointFive.jsx', uploadController.uploadFile14);
router.post('/uploadDHLEComExportsOverThirty.jsx', uploadController.uploadFile15);
router.post('/uploadDHLImportsUptoTwo.jsx', uploadController.uploadFile16);
router.post('/uploadDHLImportsOverTwo.jsx', uploadController.uploadFile17);
router.post('/uploadDHLImportsOverThirty.jsx', uploadController.uploadFile18);

//fedex
router.post('/uploadFedexZones.jsx', uploadController.uploadFile19);
router.post('/uploadFedexExportsDocument.jsx', uploadController.uploadFile20);
router.post('/uploadFedexExportsPackage.jsx', uploadController.uploadFile21);
router.post('/uploadFedexExportsSample.jsx', uploadController.uploadFile22);
router.post('/uploadFedexEComExportsDocument.jsx', uploadController.uploadFile23);
router.post('/uploadFedexEComExportsPackage.jsx', uploadController.uploadFile24);
router.post('/uploadFedexEComExportsSample.jsx', uploadController.uploadFile25);
router.post('/uploadFedexImportsDocument.jsx', uploadController.uploadFile26);
router.post('/uploadFedexImportsPackage.jsx', uploadController.uploadFile27);
router.post('/uploadFedexImportsSample.jsx', uploadController.uploadFile28);
router.post('/uploadFedexImportsOverThirty.jsx', uploadController.uploadFile29);


//documents(pdf) saving
router.post('/addToApprovedList.jsx', uploadController.approvedDocs);
router.post('/addToPendingList.jsx', uploadController.pendingDocs);

module.exports = router;
