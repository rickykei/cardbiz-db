const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const moment = require('moment-timezone');

const schemaOptions = {
  toObject: { getters: true, virtuals: true, versionKey: false },
  toJSON: { getters: true, virtuals: true, versionKey: false },
  runSettersOnQuery: true,
  timestamps: true
};

const attendanceSchema = new mongoose.Schema({
  staff_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'staff',
    required: true
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company',
    required: true
  },
  type: {
    type: String,
    enum: ['in', 'out'],
    required: true
  },
    // 新增 ↓
  location: {
    type: String,
    required: true
  },
  // 正确关联 location 表
  location_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',  // 👈 对应你的地点 model 名称
    default: null
  }
}, schemaOptions);

attendanceSchema.index({ company_id: 1, createdAt: -1 });

attendanceSchema.path('createdAt').get(v => moment(v).format('YYYY-MM-DD HH:mm:ss'));
attendanceSchema.path('updatedAt').get(v => moment(v).format('YYYY-MM-DD HH:mm:ss'));

attendanceSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

attendanceSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Attendance', attendanceSchema, 'attendance');