/**
 * 解析編輯器匯出的專案 JSON（保留 meta.characters 與節點 speaker 欄位）。
 * @param {string} raw
 */
export function parseProject(raw) {
  const data = JSON.parse(raw)
  if (!data || typeof data !== 'object') throw new Error('JSON 不是物件')
  if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
    throw new Error('缺少 nodes／edges（請使用編輯器匯出的專案 JSON）')
  }
  const meta = data.meta && typeof data.meta === 'object' ? data.meta : {}
  const characters = Array.isArray(meta.characters)
    ? meta.characters
        .filter((c) => c && typeof c === 'object')
        .map((c) => ({
          id: String(c.id ?? ''),
          name: String(c.name ?? ''),
          ...(c.note != null && String(c.note).trim()
            ? { note: String(c.note) }
            : {}),
        }))
        .filter((c) => c.id && c.name.trim())
    : []

  return {
    version: data.version ?? 1,
    meta: {
      boothId: String(meta.boothId ?? ''),
      boothName: String(meta.boothName ?? ''),
      locale: String(meta.locale ?? 'zh_TW'),
      speakerName:
        meta.speakerName != null ? String(meta.speakerName) : undefined,
      ...(characters.length > 0 ? { characters } : {}),
    },
    nodes: data.nodes,
    edges: data.edges,
  }
}
