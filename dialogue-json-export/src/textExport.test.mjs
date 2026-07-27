import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { projectToPlainText } from './textExport.mjs'
import { projectToDot } from './flowchart.mjs'

const root = dirname(fileURLToPath(import.meta.url))
const project = JSON.parse(
  readFileSync(join(root, '../fixtures/simpleFaq.json'), 'utf8'),
)

const text = projectToPlainText(project)
assert.match(text, /預設說話者：攤位店員/)
assert.match(text, /## 人物設定/)
assert.match(text, /- 攤位店員：主線接待/)
assert.match(text, /說話者：攤位店員/)

const dot = projectToDot(project)
assert.match(dot, /攤位店員/)

console.log('speaker export tests passed')
