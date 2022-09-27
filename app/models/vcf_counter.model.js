module.exports = (mongoose, mongoosePaginate) => {
  var schema = mongoose.Schema(
    {
      staff_id: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "staffs"
      },
      ip: String,
	  user_agent: String
    },
    { timestamps: true }
  );
  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  schema.plugin(mongoosePaginate);
  const Vcf_counter = mongoose.model("vcf_counters", schema, "vcf_counters");
  return Vcf_counter;
};

