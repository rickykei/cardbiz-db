const moment = require('moment-timezone');
 const schemaOptions = {
  toObject: {
    getters: true,    
	virtuals: true,
    versionKey: false,
  },
  toJSON: {
    getters: true,
    virtuals: true,
    versionKey: false,
  },
  runSettersOnQuery: true,
  };

module.exports = (mongoose, mongoosePaginate) => {
  var schema = mongoose.Schema(
    {
      files_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "photos.files"
      },
      n:Number,
	    data: Buffer,
	    deleteOK: Boolean
    },schemaOptions
    
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  schema.plugin(mongoosePaginate);
  const Photoschunks = mongoose.model("photos.chunks", schema);
  return Photoschunks;
};
