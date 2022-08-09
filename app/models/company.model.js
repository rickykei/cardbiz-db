module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      name: String,
      code: String,
      no_of_license: Number,
      no_of_admin: Number,
      status: Boolean
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Company = mongoose.model("company", schema);
  return Company;
};

