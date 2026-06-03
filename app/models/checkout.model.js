module.exports = mongoose => {
  const Checkout = mongoose.Schema(
    {
      staffId: String,
      company_id: String,
      scanDate: { type: Date, default: Date.now }
    },
    { timestamps: true }
  );

  return mongoose.model("Checkout", Checkout);
};