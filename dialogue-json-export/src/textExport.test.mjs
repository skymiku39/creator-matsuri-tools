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
