import { find_id } from "."

export function findBlockRoute(date: string, db: IControls[]) {
    const cIdx = find_id('_id', 'Controls', db)
    if (cIdx < 0) return [[], -1, -1]
    let blocks = db[cIdx].blocks
    return [blocks, find_id('date', date, blocks), cIdx]
}