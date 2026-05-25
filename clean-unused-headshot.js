// clean-unused-photos.js
const moment = require('moment-timezone');
const XLSX = require('xlsx');
const db = require("./app/models");

const Staff = db.staffs;
const Company = db.companies;
const PhotoFile = db.photos;
const PhotoChunk = db.photosChunks;

// 1. 連接資料庫
async function connectDB() {
  await db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('✅ MongoDB 連線成功');
}

// 解析圖片類型：第1個-與第2個-中間
function getImageType(filename) {
  if (!filename) return "";
  const parts = filename.split("-");
  if (parts.length >= 3) {
    return parts[1]; 
  }
  return "";
}

// 2. 匯出未使用頭像 → Excel
async function exportUnusedPhotos() {
  await connectDB();
  console.log('\n🔍 正在掃描未被使用的圖片...');

  // ============================
  // 第一步：取出所有「正在使用的圖片檔名」
  // ============================

  // 1. staff 使用的 headshot
  const staffList = await Staff.find({
    headshot: { $exists: true, $ne: null, $ne: "" }
  }, 'headshot');
  const usedStaff = staffList.map(item => item.headshot);

  // 2. company 使用的 logo, banner, profile_theme, wallet_banner ✅ 已加
  const companyList = await Company.find({
    $or: [
      { logo: { $exists: true, $ne: null, $ne: "" } },
      { banner: { $exists: true, $ne: null, $ne: "" } },
      { profile_theme: { $exists: true, $ne: null, $ne: "" } },
      { wallet_banner: { $exists: true, $ne: null, $ne: "" } } // 這裡！
    ]
  }, 'logo banner profile_theme wallet_banner'); // 已加 wallet_banner
  
  const usedCompany = [];
  companyList.forEach(item => {
    if (item.logo) usedCompany.push(item.logo);
    if (item.banner) usedCompany.push(item.banner);
    if (item.profile_theme) usedCompany.push(item.profile_theme);
    if (item.wallet_banner) usedCompany.push(item.wallet_banner); // 已加
  });

  // 3. 全部合併（所有正在使用的圖片）
  const allUsedFilenames = [...new Set([...usedStaff, ...usedCompany])];

  // ============================
  // 第二步：找出「完全沒使用」的圖片
  // ============================
  const unusedPhotos = await PhotoFile.find({
    filename: { $nin: allUsedFilenames }
  }).lean();

  // Excel 輸出
  const excelData = unusedPhotos.map(photo => ({
    圖片ID: photo._id?.toString() || '',
    圖片URL: `https://e-profile.digital/api/files/${photo.filename || ''}`,
    檔名: photo.filename || '',
    圖片類型: getImageType(photo.filename),
    格式: photo.contentType || '',
    大小KB: photo.length ? (photo.length / 1024).toFixed(2) : '0',
    上傳時間: photo.uploadDate 
      ? moment(photo.uploadDate).format('YYYY-MM-DD HH:mm:ss')
      : '',
    備註: '未被員工/公司使用，可安全刪除'
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);
  XLSX.utils.book_append_sheet(wb, ws, "未使用圖片");
  
  XLSX.writeFile(wb, "unused.xlsx");

  console.log(`✅ 匯出完成！共 ${unusedPhotos.length} 筆`);
  console.log('📄 檔案：unused.xlsx\n');

  await db.mongoose.disconnect();
}

// 3. 刪除無效頭像
async function deleteUnusedPhotos() {
  await connectDB();
  console.log('\n🗑️ 開始刪除無效圖片...');

  // 取出所有使用中的圖片
  const staffList = await Staff.find({
    headshot: { $exists: true, $ne: null, $ne: "" }
  }, 'headshot');
  const usedStaff = staffList.map(item => item.headshot);

  const companyList = await Company.find({
    $or: [
      { logo: { $exists: true, $ne: null, $ne: "" } },
      { banner: { $exists: true, $ne: null, $ne: "" } },
      { profile_theme: { $exists: true, $ne: null, $ne: "" } },
      { wallet_banner: { $exists: true, $ne: null, $ne: "" } } // 已加
    ]
  }, 'logo banner profile_theme wallet_banner'); // 已加
  
  const usedCompany = [];
  companyList.forEach(item => {
    if (item.logo) usedCompany.push(item.logo);
    if (item.banner) usedCompany.push(item.banner);
    if (item.profile_theme) usedCompany.push(item.profile_theme);
    if (item.wallet_banner) usedCompany.push(item.wallet_banner); // 已加
  });

  const allUsedFilenames = [...new Set([...usedStaff, ...usedCompany])];
  const unusedPhotos = await PhotoFile.find({ filename: { $nin: allUsedFilenames } });

  let count = 0;
  for (const photo of unusedPhotos) {
    await PhotoChunk.deleteMany({ files_id: photo._id });
    await PhotoFile.deleteOne({ _id: photo._id });
    console.log(`已刪除：${photo.filename}`);
    count++;
  }

  console.log(`\n✅ 刪除完成！共刪除 ${count} 張無效圖片`);
  await db.mongoose.disconnect();
}

// ======================
// 執行
// ======================
exportUnusedPhotos();
// deleteUnusedPhotos();