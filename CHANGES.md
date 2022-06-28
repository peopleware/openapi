# Changes

# 1

## 1.1

### 1.1.1

- we now use much more strict OpenAPI linting rules, after a redocly `update`
  - added examples
  - fixed some regular expressions
  - some rules are ignored, because we believe they are wrong (until now — these rules are young); see
    [`.redocly.yaml`](.redocly.yaml)
  - some reported errors are ignored (see [`.redocly.lint-ignore.yaml`](.redocly.lint-ignore.yaml))
    - because they occur in exceptional places where they do not apply
    - because we believe the reporting is wrong (or, in other words, we can't find the error; please fix if you do)

### 1.1.0

- add Joi schemata for some data structures

## 1.0

### 1.0.3

- tweak raa/2 claim

### 1.0.2

- upgrade common scripts

### 1.0.1

- bulk additions

### 1.0.0

- first stable release
