# Changes

# 1

## 1.6

### 1.6.1

- removed cache control header requirement from 400 response (this does not make sense)

### 1.6.0

- fix an issue in `shouldBeSeriousSchema`
- correct typo's and misleading examples
- add Joi schemata for `Prefix`, `RAX`, and `RAA2`

The validation in the `RAX` schema is limited at this time, but may become stricter in future versions.

## 1.5

### 1.5.0

- add schema for common response headers

## 1.4

### 1.4.0

- Add `400` response for reuse, and demonstrate in all resources explicitly. Previously this was considered implicit.
- Specify behavior when required `x-flow-id` or `x-mode` headers are missing or malformed, especially in the case if
  authNZ issues (authNZ takes precedence)

## 1.3

### 1.3.0

- add Joi schemata for Mode, UUID, CacheControlNoCache

## 1.2

### 1.2.0

- add Joi schemata for health

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
