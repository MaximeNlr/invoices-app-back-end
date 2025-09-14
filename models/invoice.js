const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
    invoiceId: {
        type: String,
        unique: true,
      },
  senderInfo: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  clientInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  itemInfo: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      total: { type: Number, required: true },
    }
  ],
  invoiceInfo: {
    terms: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
  },
  totalAmount: { type: Number, default: 0 },
  paymentDue: { type: Date },
  status: {
    type: String,
    enum: ["draft", "pending", "paid"],
  }
}, { timestamps: true });

invoiceSchema.pre("save", async function (next) {
    if (this.itemInfo && this.itemInfo.length > 0) {
      this.totalAmount = this.itemInfo.reduce(
        (sum, item) => sum + Math.round(item.total * 100),
        0
      );
    } else {
      this.totalAmount = 0;
    }
  
    if (!this.invoiceId) {
      const randomLetters = Math.random().toString(36).substring(2, 4).toUpperCase();
      const randomNumbers = Math.floor(1000 + Math.random() * 9000);
      this.invoiceId = `${randomLetters}${randomNumbers}`;
    }
  
    if (this.invoiceInfo?.date && this.invoiceInfo?.terms) {
      const baseDate = new Date(this.invoiceInfo.date);
      const termsDays = parseInt(this.invoiceInfo.terms, 10) || 0;
      baseDate.setDate(baseDate.getDate() + termsDays);
      this.paymentDue = baseDate;
    }
  
    next();
  });
  
  invoiceSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
  
    if (update.$set?.itemInfo) {
      const itemInfo = update.$set.itemInfo;
      update.$set.totalAmount =
        itemInfo && itemInfo.length > 0
          ? itemInfo.reduce((sum, item) => sum + Math.round(item.total * 100), 0)
          : 0;
    }
  
    if (update.$set?.invoiceInfo?.date && update.$set?.invoiceInfo?.terms) {
      const baseDate = new Date(update.$set.invoiceInfo.date);
      const termsDays = parseInt(update.$set.invoiceInfo.terms, 10) || 0;
      baseDate.setDate(baseDate.getDate() + termsDays);
      update.$set.paymentDue = baseDate;
    }
  
    next();
  });
  

module.exports = mongoose.model("Invoice", invoiceSchema);
