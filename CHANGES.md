# Changes

## 4

### 4.0

#### 4.0.1

- tweak SigedisRegulationIdentification description

#### 4.0.0

`3.1.0` introduced a stronger validation for `INSS`. This was a breaking change, which was labeled _minor_ in error.
This release labels `3.1.0` as `4.0.0`.

## 3

### 3.1

#### 3.1.0

**This was a breaking change, which was labeled _minor_ in error. Do not use this version.** Use `3.0.4` or `4.0.0`
instead.

- add custom validation to `INSS` that verifies the last 2 check digits in the INSS

### 3.0

#### 3.0.4

- add `'.'` before `'?at=…'` in `HistoryVersion.href` examples

This makes sure it is a correct relative URI.

#### 3.0.3

- switch base development version to Node 18 (LTS)

#### 3.0.2

- fix CRN validation

#### 3.0.1

- make it implicit in documentation that strings must be trimmed, and are not empty

#### 3.0.0

- CRN validation is now more restrictive
- update dependencies
- fix JWKS definition

## 2

### 2.0

#### 2.0.0

- change the property names of DayDateInterval from `from` and `until` to `start` and `end`, to be more compatible and
  avoid friction with existing libraries in different languages

## 1

### 1.22

#### 1.22.1

- correct `SearchDocument`: fuzzy search only searches in values given in `fuzzy`

#### 1.22.0

- add to description of paging HateOAS and other preload or prefetch links
- add `SearchResults` schema and OpenAPI model, and `/search` demonstration

### 1.21

#### 1.21.0

- `SearchDocumentBase` is deprecated. It is replaced by:

  - `SearchDocument`, which

    - contains array properties for `fuzzy` and `exact` match at the top level, and
    - data to be sent to the ui for visualization and navigation in the nested property `content`, of type

  - `SearchResultBase`, which always contains a `href` and `discriminator`, and is extended per type with all data that
    can be used for visualization.

  `SearchResultBase` is the old `SearchDocumentBase`, under a new name. It is now wrapped in `SearchDocument`.

- Change the default value of `per_page` query parameter to 50

### 1.20

#### 1.20.3

- fix: `flowId`, `mode`, `id` properties should not have been added to `SearchDocumentBase`

`mode` and `flowId` appear in the request and response headers. `id` can be derived (with the algorithm described).

#### 1.20.2

- add examples to SearchDocumentBase properties, to make Redoc happy

#### 1.20.1

- specify that health `Status` values are strings
- add security to examples and demonstration

#### 1.20.0

- add `flowId`, `mode`, `id` properties to searchDocumentBase
- rename searchDocumentBase `type` property to `discriminator`

### 1.19

#### 1.19.0

- add Sigedis identification schemata

### 1.18

#### 1.18.1

- add `.meta({ readOnly: true })` to readOnly properties directly, not only in alterations

#### 1.18.0

- add `.meta({readOnly: true})` to `readOnlyAlteration`

This is aimed at use with [joi-to-json](https://www.npmjs.com/package/joi-to-json). Properties annotated as such turn up
as `readOnly` in the OpenAPI spec.

### 1.17

#### 1.17.1

- fix broken patterns in YAMLs and Joi schema for `AccountId` and `RAX`

#### 1.17.0

- fix: 1.16 did not export modeExamples by mistake
- now also several mode regexp patterns are exported

### 1.16

#### 1.16.0

- `migration-YYYY-MM-DDTHH:MM:SS` is now also allowed as mode

### 1.15

#### 1.15.0

Is the same as 1.14, and was published in error.

### 1.14

#### 1.14.0

- add required `type` to `SearchDocumentBase`s

This will result in a non-compatible change in the projects that use this. (For this package however, the change is
compatible).

### 1.13

#### 1.13.1

- fix `ToOneFromχ.yaml`

#### 1.13.0

- tweak `SearchDocumentBase` schema
- add `SearchDocumentBase` model

### 1.12

#### 1.12.3

- fix History item `href` example

#### 1.12.2

- fix DateTime schema (it truncated precision, and it should not do that)

#### 1.12.1

- add description and alteration to `HREFHistory`

#### 1.12.0

- add `persistenceId` path parameter spec
- add `label` path parameter spec
- add `CommonResponseHeaders` spec, with specializations for `PUT`, `POST 201`, and `GET` with several cache variations
- add reusable model for a `href` property with a reference to a `/history`, and, optionally, a `/searchDocument`
- add reusable definition of a relative URI data type, and a version with a description of a χ (spec and schemata)
  to-one reference

### 1.11

#### 1.11.0

- add schema for `DayDateInterval`

### 1.10

#### 1.10.1

- fix plain wrongness of OAuth2 `401` and `403` reponse decriptions
  - the body we decribed was a representation of an old accidental realization, not something important
  - the `www-authenticate` header was replaced by `x-www-authenticate`, because of support issue with AWS API Gateway;
    this is reverted
  - the description of the `www-authenticate` header now clearly describes our intentions, and reasons

#### 1.10.0

- CRN
  - add schema for `CRN`
  - add reusable definition of `CRN` as path parameter
- `time/DateTime` now allows a higher-then-ms precision
- stuff now also contains untrimmed strings, and a string with only spaces
- resource history:
  - validate in schema that history versions in a history must be sorted
  - add common OpenAPI YAML for history schemata, and add demonstration of use

### 1.9

### 1.9.3

- update the regex pattern for INSS number: should be _exactly_ 11 digits

### 1.9.2

- fine-tune `400`, `401`, and `403` response descriptions in the context of a missing or invalid `x-mode`
- tweak `CommonResponseHeaders` schema

The change to `CommonResponseHeaders` is backward compatible but users should be aware that we are no longer checking
for `cache-control` in the schema. `cache-control` requirements might be too diverse to handle with alterations (this
might be added back later).

#### 1.9.1

- Made clear in documentation that we will never return a faulty value. This is of particular importance for `x-mode`,
  which might be invalid in a `400`, `401`, or `403` response. In those cases, no `x-mode` header will be returned.
- add missing _required_ annotation to all response headers, except for `x-mode` for the reason described above
- add missing response headers to list example

#### 1.9.0

- add `CacheControlPrivateImmutable` response header schema
- add constants for cache control `no-store` and private immutable
- add OpenAPI and Joi schemata for `location` response header

### 1.8

#### 1.8.0

- add accept header schema
- fix test coverage

### 1.7

#### 1.7.0

- add constants and `consolidate` functionality to `health/Status`
- add validateSchema to `util`

### 1.6

#### 1.6.4

- fix typo in `health/Status.js` allowed statuses

#### 1.6.3

- add missing `x-date` to 412 response

#### 1.6.2

- add missing `vary` in mode-dependent responses
- fix and tweak some descriptions
- add 2 missing cache-controls in demonstration

#### 1.6.1

- removed cache control header requirement from 400 response (this does not make sense)

#### 1.6.0

- fix an issue in `shouldBeSeriousSchema`
- correct typo's and misleading examples
- add Joi schemata for `Prefix`, `RAX`, and `RAA2`

The validation in the `RAX` schema is limited at this time, but may become stricter in future versions.

### 1.5

#### 1.5.0

- add schema for common response headers

### 1.4

#### 1.4.0

- Add `400` response for reuse, and demonstrate in all resources explicitly. Previously this was considered implicit.
- Specify behavior when required `x-flow-id` or `x-mode` headers are missing or malformed, especially in the case if
  authNZ issues (authNZ takes precedence)

### 1.3

#### 1.3.0

- add Joi schemata for Mode, UUID, CacheControlNoCache

### 1.2

#### 1.2.0

- add Joi schemata for health

### 1.1

#### 1.1.1

- we now use much more strict OpenAPI linting rules, after a redocly `update`
  - added examples
  - fixed some regular expressions
  - some rules are ignored, because we believe they are wrong (until now — these rules are young); see
    [`.redocly.yaml`](.redocly.yaml)
  - some reported errors are ignored (see [`.redocly.lint-ignore.yaml`](.redocly.lint-ignore.yaml))
    - because they occur in exceptional places where they do not apply
    - because we believe the reporting is wrong (or, in other words, we can't find the error; please fix if you do)

#### 1.1.0

- add Joi schemata for some data structures

### 1.0

#### 1.0.3

- tweak raa/2 claim

#### 1.0.2

- upgrade common scripts

#### 1.0.1

- bulk additions

#### 1.0.0

- first stable release
