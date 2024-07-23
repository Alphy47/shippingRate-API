const express = require('express');
const router = express.Router();
const { selectImportDocuments,
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
        selectDisapprovedList} = require('../controllers/selectController.jsx');


router.post('/selectImportDocuments', selectImportDocuments);
router.post('/selectImportPackages', selectImportPackages);
router.post('/selectImportSamples', selectImportSamples);
router.post('/selectExportDocuments', selectExportDocuments);
router.post('/selectExportPackages', selectExportPackages);
router.post('/selectExportSamples', selectExportSamples);
router.post('/selectEComDocuments', selectEComDocuments);
router.post('/selectEComPackages', selectEComPackages);
router.post('/selectEComSamples', selectEComSamples);
router.post('/selectPDFs', selectTblPdfs);
router.post('/selectPendingList', selectPendingList);
router.post('/selectDisapprovedList', selectDisapprovedList);

module.exports = router;
