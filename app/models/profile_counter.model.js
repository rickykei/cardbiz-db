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
  const Profile_counter = mongoose.model("profile_counters", schema, "profile_counters");
  return Profile_counter;
};

