const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice');

router.post('/create/invoice', invoiceController.CreateInvoice);
router.put('/invoice/:id/paid', invoiceController.MarkAsPaid);
router.put('/update/invoice/:id', invoiceController.UpdateInvoice);
router.delete('/invoice/:id', invoiceController.DeleteInvoice);
router.get('/invoices', invoiceController.GetAllInvoices);
router.get('/invoice/:id', invoiceController.GetInvoice);
router.get('/reset/demo', invoiceController.ResetDemo);

module.exports = router;