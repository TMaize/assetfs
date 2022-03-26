export const template = `
// deno-fmt-ignore-file
// deno-lint-ignore-file
import { decode } from 'https://deno.land/std@0.132.0/encoding/base64.ts'

interface AssertInfo {
  path: string
  data: string
}

export const ASSETS: Array<AssertInfo> = []

// insert code here

const cache = new Map<string, Uint8Array>()

export function existsSync(filePath: string): boolean {
  const item = ASSETS.find(item => item.path === filePath)
  return !!item
}

export function readFileSync(filePath: string): Uint8Array {
  if (cache.has(filePath)) {
    return cache.get(filePath)!
  }

  const item = ASSETS.find(item => item.path === filePath)
  if (!item) throw new Error(filePath + ' is not found')

  const data = decode(item.data)
  cache.set(filePath, data)
  return data
}
`
