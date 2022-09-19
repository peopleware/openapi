#!/usr/bin/env node

const { join } = require('path')
const dirTree = require('directory-tree')
const { isSchema } = require('joi')
const parse = require('joi-to-json')
const { dump } = require('js-yaml')
const { writeFile } = require('fs/promises')
const { clean } = require('./clean')

const basePath = join(__dirname, '..', 'id', 'sigedis')

async function transformSchemataIn (path) {
  const module = require(path)
  const dirPath = join(path, '..')
  return Promise.all(
    Object.keys(module).reduce((acc, name) => {
      if (isSchema(module[name])) {
        const result = parse(module[name], 'open-api')
        const cleaned = clean(result)
        const yaml = dump(cleaned, { lineWidth: 120, noCompatMode: true })
        acc.push(writeFile(join(dirPath, `${name}.yaml`), yaml))
      }
      return acc
    }, [])
  )
}

async function transformNodeRecursively (node) {
  if (!node.children) {
    return transformSchemataIn(node.path)
  }

  return Promise.all(node.children.map(transformNodeRecursively))
}

async function exec () {
  const tree = dirTree(basePath, { extensions: /\.js/ })
  return Promise.all([
    transformNodeRecursively(tree),
    transformSchemataIn(join(__dirname, '..', 'resource', 'SearchDocumentBase'))
  ])
}

exec()
