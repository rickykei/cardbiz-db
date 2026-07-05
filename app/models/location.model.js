const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const moment = require('moment-timezone');

const schemaOptions = {
  toObject: { getters: true, virtuals: true, versionKey: false },
  toJSON: { getters: true, virtuals: true, versionKey: false },
  runSettersOnQuery: true,
  timestamps: true
};

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company',
    required: true
  },
  status: {
    type: String,
    default: 'active'
  }
}, schemaOptions);

locationSchema.index({ company_id: 1, name: 1 });

locationSchema.path('createdAt').get(v => moment(v).format('YYYY-MM-DD HH:mm:ss'));
locationSchema.path('updatedAt').get(v => moment(v).format('YYYY-MM-DD HH:mm:ss'));

locationSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

locationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Location', locationSchema, 'location');