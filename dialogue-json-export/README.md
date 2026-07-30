# 台詞 JSON 匯出工具

> 所屬倉庫：[creator-matsuri-tools](https://github.com/skymiku39/creator-matsuri-tools)  
> 連動編輯器：[creator-matsuri](https://github.com/skymiku39/creator-matsuri)

把編輯器匯出的 **專案 JSON** 反編成：

- 純文字台詞（含分支）
- 流程圖圖片（Graphviz 排版，線盡量不重疊）

全部放進**一個資料夾**，不會散落。

## 怎麼用（最快）

1. 首次在本資料夾執行一次：`npm install`
2. 把編輯器匯出的 `booth_XX_flow.json` **拖到 `匯出.bat` 上**（拖曳會帶完整路徑）
3. 到本工具目錄下的 `exports/<攤位_時間>/` 看結果

命令列請給**絕對路徑**，或相對「本工具目錄」的路徑（檔案不必放進本資料夾）：

```bash
cd dialogue-json-export
npm install
npm run export -- "D:\path\to\booth_01_flow.json"
```

若 JSON 在工作區根目錄（與 `creator-matsuri-tools` 同層）：

```bash
npm run export:booth-sample
# 等同：node src/cli.mjs ../../booth_01_flow.json
```

指定輸出根目錄：

```bash
node src/cli.mjs "D:\path\to\booth.json" "D:\my-exports"
```

常見錯誤：`找不到檔案：...\dialogue-json-export\booth_01_flow.json`  
→ 相對路徑是相對本工具目錄；請改絕對路徑，或把檔案拖到 `匯出.bat`。

內建自測：

```bash
npm test
```

## 說話者／人物設定

支援編輯器匯出的：

- `meta.speakerName`：預設說話者
- `meta.characters[]`：人物設定（id／name／note）
- 節點 `data.speakerId`／`data.speakerName`：本句覆寫

純文字會輸出人物表與每句「說話者：」；流程圖節點標籤也會帶說話者名稱。

## 輸出內容

```
exports/
  01_01攤位_20260724_183000/
    台詞.txt      ← 純文字
    流程圖.png    ← 可直接貼文件
    流程圖.svg
    流程圖.dot
    來源.json
    README.txt
```

## 說明

- 流程圖用 Graphviz `dot` + `splines=true`，階層排版，降低線段交叉覆蓋
- 不需安裝系統 Graphviz（內建 WASM）
- 僅供本機個人使用，不依賴編輯器 GUI
