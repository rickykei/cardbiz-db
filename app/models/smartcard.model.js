 
 
module.exports = (mongoose, mongoosePaginate) => {

  var schema = mongoose.Schema(
   {
   uid: String,
   company_id: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "company"
      }
    ,
   status: Boolean,
  },
  { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  schema.plugin(mongoosePaginate);
  const Smartcard = mongoose.model("smartcard", schema);
  return Smartcard;
};
