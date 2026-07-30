#!/usr/bin/env node
/**
 * CLI：dialogue-json-export <專案.json> [輸出根目錄]
 *
 * 輸出結構（自動建資料夾，避免散落）：
 *   <輸出根>/<攤位名>_<時間戳>/
 *     台詞.txt
 *     流程圖.svg
 *     流程圖.png
 *     來源.json   （複本）
 *     README.txt
 */

import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
} from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseProject } from './parseProject.mjs'
import { projectToPlainText } from './textExport.mjs'
import { projectToDot, renderDot } from './flowchart.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

function usage() {
  console.log(`用法：
  node src/cli.mjs <專案.json> [輸出根目錄]

請給「完整路徑」或相對於「本工具目錄」的路徑。
檔案可在任何資料夾；編輯器匯出的 booth_XX_flow.json 皆可。

範例：
  node src/cli.mjs ./fixtures/simpleFaq.json
  node src/cli.mjs "D:\\path\\to\\booth_01_flow.json"
  npm run export -- "D:\\path\\to\\booth_01_flow.json"

或把 JSON 拖到「匯出.bat」上（拖曳會帶完整路徑，最省事）。
`)
}

function sanitizeFolderName(name) {
  return String(name)
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, 60)
    .replace(/_+$/g, '') || 'dialogue'
}

function stamp() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
}

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== '--')
  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    usage()
    process.exit(args.length === 0 ? 1 : 0)
  }

  const inputPath = resolve(args[0])
  if (!existsSync(inputPath)) {
    console.error(`找不到檔案：${inputPath}`)
    process.exit(1)
  }

  const outRoot = resolve(args[1] ?? join(__dirname, '..', 'exports'))

  const project = parseProject(readFileSync(inputPath, 'utf8'))
  const folderName = sanitizeFolderName(
    `${project.meta.boothId || 'booth'}_${project.meta.boothName || basename(inputPath, '.json')}_${stamp()}`,
  )
  const outDir = join(outRoot, folderName)
  mkdirSync(outDir, { recursive: true })

  console.log(`讀取：${inputPath}`)
  console.log(`輸出：${outDir}`)

  const text = projectToPlainText(project)
  writeFileSync(join(outDir, '台詞.txt'), text, 'utf8')

  const dot = projectToDot(project)
  writeFileSync(join(outDir, '流程圖.dot'), dot, 'utf8')

  console.log('正在排版流程圖（避免線段重疊）…')
  const { svg, png } = await renderDot(dot)
  writeFileSync(join(outDir, '流程圖.svg'), svg, 'utf8')
  writeFileSync(join(outDir, '流程圖.png'), png)

  copyFileSync(inputPath, join(outDir, '來源.json'))

  writeFileSync(
    join(outDir, 'README.txt'),
    `本資料夾由 dialogue-json-export 產生

內容：
- 台詞.txt     純文字流程（含分支）
- 流程圖.png   流程圖圖片（可直接貼文件／簡報）
- 流程圖.svg   向量圖（可再編輯）
- 流程圖.dot   Graphviz 原始檔
- 來源.json    匯入用的專案複本

來源檔：${basename(inputPath)}
產生時間：${new Date().toLocaleString('zh-TW')}
`,
    'utf8',
  )

  console.log('')
  console.log('完成：')
  console.log(`  ${join(outDir, '台詞.txt')}`)
  console.log(`  ${join(outDir, '流程圖.png')}`)
  console.log(`  ${join(outDir, '流程圖.svg')}`)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
