# Changes

# 1

## 1.9

### 1.9.1

- Made clear in documentation that we will never return a faulty value. This is of particular importance for `x-mode`,
  which might be invalid in a `400`, `401`, or `403` response. In those cases, no `x-mode` header will be returned.
- add missing _required_ annotation to all response headers, except for `x-mode` for the reason described above
- add missing response headers to list example

### 1.9.0

- add `CacheControlPrivateImmutable` response header schema
- add constants for cache control `no-store` and private immutable
- add OpenAPI and Joi schemata for `location` response header

## 1.8

### 1.8.0

- add accept header schema
- fix test coverage

## 1.7

### 1.7.0

- add constants and `consolidate` functionality to `health/Status`
- add validateSchema to `util`

## 1.6

### 1.6.4

- fix typo in `health/Status.js` allowed statuses

### 1.6.3

- add missing `x-date` to 412 response

### 1.6.2

- add missing `vary` in mode-dependent responses
- fix and tweak some descriptions
- add 2 missing cache-controls in demonstration

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
