module.exports = (mongoose, mongoosePaginate) => {

  var schema = mongoose.Schema(
   {
	company_id: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "company"
      }
    ,
    username: String,
    email: String,
    password: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "role"
      }
    ],
    status: Boolean
  },
  { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  schema.plugin(mongoosePaginate);
  const User = mongoose.model("user", schema);
  return User;
};
