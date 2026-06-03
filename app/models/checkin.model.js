
module.exports = mongoose => {
  const Checkin = mongoose.Schema(
    {
      staffId: String,
      company_id: String,
      scanDate: { type: Date, default: Date.now }
    },
    { timestamps: true }
  );

  return mongoose.model("Checkin", Checkin);
};