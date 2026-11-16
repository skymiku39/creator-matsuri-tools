import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseProject } from './parseProject.mjs'
import { projectToPlainText } from './textExport.mjs'
import { projectToDot } from './flowchart.mjs'

const root = dirname(fileURLToPath(import.meta.url))
const fixtureRaw = readFileSync(join(root, '../fixtures/simpleFaq.json'), 'utf8')
const project = JSON.parse(fixtureRaw)

const text = projectToPlainText(project)
assert.match(text, /預設說話者：攤位店員/)
assert.match(text, /## 人物設定/)
assert.match(text, /- 攤位店員：主線接待/)
assert.match(text, /說話者：攤位店員/)

const dot = projectToDot(project)
assert.match(dot, /攤位店員/)

// CLI 路徑必須保留 meta.characters（先前 parseProject 會丟掉）
const viaCli = parseProject(fixtureRaw)
assert.ok(Array.isArray(viaCli.meta.characters))
assert.equal(viaCli.meta.characters.length, project.meta.characters.length)
const viaText = projectToPlainText(viaCli)
assert.match(viaText, /## 人物設定/)
assert.match(viaText, /- 攤位店員：主線接待/)

console.log('speaker export tests passed')

// 結束行為：fixture 的離開選項接「結束對話」，一般選項沒接結束節點 → 預設回到選單
assert.match(text, /【結束】→ 結束對話/)
assert.match(text, /未接結束節點，預設回到選單/)
assert.match(dot, /結束\\\\n■ 結束對話/)

// 明確指定優先於預設；舊版標題「結束／返回」不再照抄
const flipped = structuredClone(project)
for (const n of flipped.nodes) {
  if (n.data.kind === 'end') {
    n.data.endAction = 'menu'
    n.data.title = '結束／返回'
  }
}
const flippedText = projectToPlainText(flipped)
assert.match(flippedText, /【結束】→ 回到選單/)
assert.doesNotMatch(flippedText, /結束／返回/)
assert.match(projectToDot(flipped), /結束\\\\n↩ 回到選單/)

// 舊版 JSON（沒有 endAction）：依所屬選項推定
const legacy = structuredClone(project)
for (const n of legacy.nodes) {
  if (n.data.kind === 'end') delete n.data.endAction
}
assert.match(projectToPlainText(legacy), /【結束】→ 結束對話/)

// 自訂標題保留，並附上行為
const custom = structuredClone(project)
for (const n of custom.nodes) {
  if (n.data.kind === 'end') n.data.title = '送客'
}
assert.match(projectToPlainText(custom), /【結束】送客（→ 結束對話）/)

console.log('end action export tests passed')
