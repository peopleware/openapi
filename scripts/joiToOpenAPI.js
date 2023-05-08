#!/usr/bin/env node

const { join } = require('path')
const dirTree = require('directory-tree')
const { isSchema } = require('joi')
const parse = require('joi-to-json')
const { dump } = require('js-yaml')
const { writeFile, readFile } = require('fs/promises')
const { clean } = require('./clean')

const basePath = join(__dirname, '..', 'id', 'sigedis')

const license = `# Copyright 2021 - 2023 PeopleWare n.v.
#
# Licensed under the Apache License, Version 2.0 (the “License”);
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an “AS IS” BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

`

async function writeFileIfDifferent(path, data) {
  const existingData = await readFile(path, { encoding: 'utf-8' })
  if (existingData === data) {
    return
  }

  return writeFile(path, data)
}

async function transformSchemataIn(path) {
  const module = require(path)
  const dirPath = join(path, '..')
  return Promise.all(
    Object.keys(module).reduce((acc, name) => {
      if (isSchema(module[name])) {
        const result = parse(module[name], 'open-api')
        const cleaned = clean(result)
        const yaml = dump(cleaned, { lineWidth: 120, noCompatMode: true })
        const yamlWithLicense = license + yaml
        acc.push(writeFileIfDifferent(join(dirPath, `${name}.yaml`), yamlWithLicense))
      }
      return acc
    }, [])
  )
}

async function transformNodeRecursively(node) {
  if (!node.children) {
    return transformSchemataIn(node.path)
  }

  return Promise.all(node.children.map(transformNodeRecursively))
}

async function exec() {
  const tree = dirTree(basePath, { extensions: /\.js/ })
  return Promise.all([
    transformNodeRecursively(tree),
    transformSchemataIn(join(__dirname, '..', 'resource', 'SearchResultBase')),
    transformSchemataIn(join(__dirname, '..', 'resource', 'SearchDocument')),
    transformSchemataIn(join(__dirname, '..', 'resource', 'SearchResults')),
    transformSchemataIn(join(__dirname, '..', 'resource', 'SearchDocumentContentBase2')),
    transformSchemataIn(join(__dirname, '..', 'resource', 'SearchDocument2')),
    transformSchemataIn(join(__dirname, '..', 'money', 'CurrencyCode')),
    transformSchemataIn(join(__dirname, '..', 'money', 'MonetaryValue')),
    transformSchemataIn(join(__dirname, '..', 'money', 'NegativeMonetaryValue')),
    transformSchemataIn(join(__dirname, '..', 'money', 'NonPositiveMonetaryValue')),
    transformSchemataIn(join(__dirname, '..', 'money', 'NonNegativeMonetaryValue')),
    transformSchemataIn(join(__dirname, '..', 'money', 'PositiveMonetaryValue')),
    transformSchemataIn(join(__dirname, '..', 'time', 'DateTime')),
    transformSchemataIn(join(__dirname, '..', 'time', 'DayDate')),
    transformSchemataIn(join(__dirname, '..', 'time', 'DayDateInterval')),
    transformSchemataIn(join(__dirname, '..', 'time', 'Month'))
  ])
}

exec()
