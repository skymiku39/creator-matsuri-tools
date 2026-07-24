# 創作者的文化祭｜工具集

與主專案 **[creator-matsuri](https://github.com/skymiku39/creator-matsuri)**（攤位台詞流程編輯器）連動的個人／輔助工具。

主專案透過 Git submodule 掛在 `tools/`：

```text
creator-matsuri/
  dialogue-editor/     ← 編輯器
  tools/               ← 本倉庫（submodule）
    dialogue-json-export/
```

## 工具一覽

| 資料夾 | 說明 |
|--------|------|
| [dialogue-json-export](./dialogue-json-export/) | 將編輯器匯出的 JSON 反編成純文字＋不重疊流程圖 |

## 在主專案裡更新 tools

```bash
cd creator-matsuri
git submodule update --init --remote tools
git add tools
git commit -m "git: 🐙 [AI] 更新 tools submodule"
```

## 單獨 clone 本倉庫

```bash
git clone https://github.com/skymiku39/creator-matsuri-tools.git
cd creator-matsuri-tools/dialogue-json-export
npm install
```
