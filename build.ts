import { encode } from 'https://deno.land/std@0.132.0/encoding/base64.ts'
import { parse } from 'https://deno.land/std@0.132.0/flags/mod.ts'
import { basename } from 'https://deno.land/std@0.132.0/path/mod.ts'

import { template } from './template_text.ts'

function walkDir(filePath: string, prefix: string, callback: (filePath: string, prefix: string) => void) {
  const stat = Deno.statSync(filePath)
  if (stat.isFile) {
    callback(filePath, prefix)
    return
  }
  if (stat.isDirectory) {
    const list = Deno.readDirSync(filePath)
    for (const entry of list) {
      if (entry.isDirectory) {
        walkDir(filePath + '/' + entry.name, prefix + entry.name + '/', callback)
      } else {
        callback(filePath + '/' + entry.name, prefix)
      }
    }
  }
}

function getOptions(): { input: string; output: string } {
  const arg = parse(Deno.args)
  let input = ''
  let output = ''

  if (arg.input && !Array.isArray(arg.input)) {
    input = String(arg.input)
  }
  if (arg.output && !Array.isArray(arg.output)) {
    output = String(arg.output)
  }
  if (!input) {
    console.error('input is required')
    Deno.exit(1)
  }
  if (!output) {
    console.error('output is required')
    Deno.exit(1)
  }

  return {
    input,
    output
  }
}

function main() {
  const options = getOptions()

  try {
    Deno.statSync(options.input)
  } catch (_) {
    console.error(`${options.input} is not found`)
    Deno.exit(1)
  }

  try {
    const stat = Deno.statSync(options.output)
    if (stat.isDirectory) {
      throw new Error('output is directory')
    }
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      console.error(err)
      Deno.exit(1)
    }
  }

  const outFile = Deno.openSync(options.output, { write: true, create: true, truncate: true })

  const prefixText = template.split(`// insert code here`)[0]
  const suffixText = template.split(`// insert code here`)[1]

  outFile.writeSync(new TextEncoder().encode(prefixText))

  walkDir(options.input, '/', (filePath, prefix) => {
    const name = basename(filePath)
    const data = Deno.readFileSync(filePath)
    const str = `ASSETS.push({path: '${prefix}${name}', data: '${encode(data)}'})\n`
    outFile.writeSync(new TextEncoder().encode(str))
  })

  outFile.writeSync(new TextEncoder().encode(suffixText))
}

main()
