/**
 * 結束節點行為：與編輯器 dialogue-editor/src/domain/endAction.ts 同一套規則。
 * - data.endAction 明確指定時以它為準（menu＝回到選單、finish＝結束對話）
 * - 未指定時：一般選項之下回到選單，離開選項（或不在選項之下）結束對話
 */

export const END_ACTION_LABEL = {
  menu: '回到選單',
  finish: '結束對話',
}

/** 舊版或自動產生的標題；輸出時改用行為文字 */
const AUTO_END_TITLES = new Set(['', '結束', '結束／返回', '回到選單', '結束對話'])

function isLeaveChoice(choice) {
  const d = choice?.data ?? {}
  if (d.isReturn) return true
  const text = String(d.text ?? '').trim()
  const note = String(d.note ?? '').trim()
  if (/^(返回選項|此為返回選項|返回／離開)$/.test(note)) return true
  return /等一下再過來|稍後再來|返回選單|^返回$|^離開$|^再見$/.test(text)
}

function kindOf(node) {
  return node?.data?.kind ?? node?.type ?? 'message'
}

function findParentChoice(node, byId, edges) {
  let cursor = node
  const visited = new Set()
  while (cursor && !visited.has(cursor.id)) {
    visited.add(cursor.id)
    if (kindOf(cursor) === 'choice') return cursor
    const inbound = edges.find((e) => e.target === cursor.id)
    cursor = inbound ? byId.get(inbound.source) : null
  }
  return null
}

/**
 * @param {object} tip 結束節點，或分支最後一個沒有後繼的節點
 * @param {Map<string, object>} byId
 * @param {object[]} edges
 * @returns {'menu' | 'finish'}
 */
export function resolveEndAction(tip, byId, edges) {
  if (kindOf(tip) === 'end') {
    const explicit = tip.data?.endAction
    if (explicit === 'menu' || explicit === 'finish') return explicit
  }
  const parent = findParentChoice(tip, byId, edges)
  return parent && !isLeaveChoice(parent) ? 'menu' : 'finish'
}

/** 結束節點輸出用標題：自訂標題優先，否則顯示行為 */
export function endDisplayTitle(node, action) {
  const title = String(node?.data?.title ?? '').trim()
  return AUTO_END_TITLES.has(title) ? END_ACTION_LABEL[action] : title
}
