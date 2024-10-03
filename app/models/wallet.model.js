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
   
   company_id: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "company"
      },
   wallet_field1: String,   
   wallet_field2: String,   
   wallet_field3: String,   
   wallet_logo: String,
   wallet_banner: String,
   wallet_qrcode_option: 
   wallet_status: Boolean,  
   updatedAt: {type: Date, default: Date.now,get: v => moment(v).format('YYYY-MM-DD HH:mm:ss') },
   createdAt: {type: Date, default: Date.now,get: v => moment(v).format('YYYY-MM-DD HH:mm:ss') } 
    },schemaOptions
	 
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
