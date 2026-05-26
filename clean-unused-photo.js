// clean-unused-photos.js
const db = require("./app/models");

const PhotoFile = db.photos;
const PhotoChunk = db.photosChunks;

// 你提供的「要刪除的 photo _id 清單」
const DELETE_IDS = [
  "6629fd18accd5a58dff7eb79",
  "662b5418accd5a58dff7ee5b",
  "663062b8accd5a58dff7f146",
  "6646b84c3913f85782ca544e",
  "6655872e3913f85782ca67de",
  "666972e63913f85782caacb4",
  "66697cde3913f85782caad46",
  "6669805c3913f85782caae4f",
  "666a5e243913f85782cab0f8",
  "667e2a87a748190f716fad57",
  "66bdd559925f3e37b82fb335",
  "66becbdb925f3e37b82fb694",
  "6711d13effe951f085b59bb9",
  "67286479d7a512aa80ee5466",
  "673b20638bc9d137bef28c29",
  "676258fa6fc5420dc421bff4",
  "6784bb1e6fc5420dc4223037",
  "67ea6c22c8a5b3727c91a50b",
  "6814664ea655495586585bd8",
  "681b0fdca655495586586559",
  "682d55fb91108a033928de80",
  "683e761618f0308f29c53dd8",
  "683ea1c618f0308f29c53ec9",
  "683ea7d218f0308f29c53f95",
  "683ea7d618f0308f29c53f99",
  "683fc38d18f0308f29c546a1",
  "683fc40f18f0308f29c546fb",
  "683fc42118f0308f29c54700",
  "683fc43718f0308f29c54705",
  "683fc44618f0308f29c5470a",
  "683fc49018f0308f29c5470f",
  "683fc4b118f0308f29c54713",
  "684c020418f0308f29c55ede",
  "684c025418f0308f29c55ee3",
  "684c02bf18f0308f29c55ee7",
  "684c02ee18f0308f29c55eeb",
  "684c02ef18f0308f29c55ef0",
  "684c032318f0308f29c55ef8",
  "684c03c318f0308f29c55f1c",
  "684c03ea18f0308f29c55f20",
  "6881ec872e714f63b9d484df",
  "6881ed622e714f63b9d484fe",
  "68955fa92e714f63b9d49f45",
  "68ba9d972e714f63b9d5170f",
  "68baa8982e714f63b9d51c07",
  "68d503ed2e714f63b9d5675a",
  "68ec7f572e714f63b9d5bee5",
  "68ec7f952e714f63b9d5bef5",
  "68ec7f972e714f63b9d5bf07",
  "68ec7fb32e714f63b9d5bf19",
  "68ec81ab2e714f63b9d5bf64",
  "690b0fff2e714f63b9d5f739",
  "690b10022e714f63b9d5f743",
  "6961c3ce78d3ecf3ad12992d",
  "69675a3c78d3ecf3ad12a31e",
  "69675a6378d3ecf3ad12a331",
  "696769ef78d3ecf3ad12a457",
  "696769ef78d3ecf3ad12a45a",
  "69676acf78d3ecf3ad12a4a6",
  "69676acf78d3ecf3ad12a4a9",
  "69676b7678d3ecf3ad12a4d4",
  "69676b7678d3ecf3ad12a4d7",
  "69676bb478d3ecf3ad12a4ec",
  "69684cb978d3ecf3ad12a584",
  "69b0e65278d3ecf3ad132a7f",
  "69b764ee78d3ecf3ad1337d2"
];

// 主執行
async function deleteSelectedPhotos() {
  await db.mongoose.connect(db.url);
  console.log("✅ 連線成功\n");

  let successCount = 0;

  for (const id of DELETE_IDS) {
    try {
      // 1. 刪除 chunks
      await PhotoChunk.deleteMany({ files_id: id });
      // 2. 刪除 photos 主檔
      await PhotoFile.deleteOne({ _id: id });

      console.log("✅ 已刪除: " + id);
      successCount++;
    } catch (e) {
      console.log("❌ 失敗: " + id, e.message);
    }
  }

  console.log("\n🎉 全部完成！");
  console.log("🗑️ 成功刪除數量: " + successCount);

  await db.mongoose.disconnect();
}

// 執行
deleteSelectedPhotos();