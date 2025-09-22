const Invoice = require('../models/invoice');
const demoInvoices = require('../data/demo.json');

exports.CreateInvoice = async (req, res) => {
    try {
      const invoice = new Invoice({
        senderInfo: req.body.senderInfo,
        clientInfo: req.body.clientInfo,
        itemInfo: req.body.itemInfo,
        invoiceInfo: req.body.invoiceInfo,
        status: req.body.status || "draft"
      });

      await invoice.save();
  
      res.status(201).json({ success: true, message: "Invoice created successfully", data: invoice });
    } catch (error) {
      console.error("Error creating invoice:", error);
      res.status(500).json({ success: false, message: "Failed to create invoice", error: error.message });
    }
  };

exports.GetAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find()
        return res.status(200).json({success: true, data: invoices})
    } catch (error) {
        res.status(500).json({ success: false });
    }
}

exports.GetInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findOne({invoiceId: req.params.id})
        res.status(201).json({ success: true, message: "Invoice created successfully", invoice: invoice });

    } catch (error) {
        res.status(500).json({ success: false });
    }
}

exports.MarkAsPaid = async (req, res) => {
    try {
        const invoice = await Invoice.updateOne(
            {invoiceId: req.params.id},
            {$set: {status: "paid"}}
        )
        if (!invoice) {
            return res.status(404).json({success: false, message: "Invoice not found"})
        }
        return res.status(200).json({success: true})
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false });
    }
}

exports.UpdateInvoice = async (req, res) => {
    try {
        console.log(req.params.id);
        
        const invoice = await Invoice.findOneAndUpdate(
            { invoiceId: req.params.id },
            { $set: {
                senderInfo: req.body.senderInfo,
                clientInfo: req.body.clientInfo,
                itemInfo: req.body.itemInfo,
                invoiceInfo: req.body.invoiceInfo,
                totalAmount: req.body.totalAmount
            }},
            { new: true } 
        );
        
          if (invoice.modifiedCount === 0) {
            return res.status(404).json({success: false, message: 'Invoice not found or not updated'})
          }
          res.status(200).json({ success: true, message: "Invoice updated successfully" });

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false });
    }
}

exports.DeleteInvoice = async (req, res) => {
    try {
        const result = await Invoice.deleteOne({invoiceId : req.params.id})
    
        if (result.deletedCount === 1) {
            res.status(200).json({ success: true, message: "Invoice deleted successfully." });
          } else {
            res.status(404).json({ message: "Invoice not found" });
          }
    } catch (error) {
        res.status(500).json({ success: false });
    }
}

exports.ResetDemo = async (req, res) => {
    try {
        
        const deleteInvoices = await Invoice.deleteMany();
        console.log(deleteInvoices.deletedCount, 'invoices deleted')
        const insertDemo = await Invoice.insertMany(demoInvoices);

       if (!insertDemo) {
        return res.status(500).json({success: false})
       }

       return res.status(201).json({success: true})

    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false})
    }
}