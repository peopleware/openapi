# Changes

- upgrade dependencies

## 11

### 11.0

#### 11.0.0

- Remove regex constraint from `AccountId` (used by the `CreatedBy` property on the `Audited` schema)

## 10

### 10.0

#### 10.0.1

- Downgrade dependency `joi` to `17.13.1` to avoid
  [breaking changes in version `17.13.2`](https://github.com/hapijs/joi/pull/3037).

#### 10.0.0

- Fix high vulnerabilities
- Upgrade dependencies

## 9

### 9.1

#### 9.1.0

- add `ConstrainedMonetaryValue` resource schema

### 9.0

#### 9.0.0

- upgrade dependencies
- upgrade to [`OpenAPI@3.1.0`](https://spec.openapis.org/oas/v3.1.0)
- add `@ppwcode/mocha-ssst`

## 8

### 8.1

#### 8.1.0

- moved repository from `https://bitbucket.org/peopleware/openapi` to `https://bitbucket.org/peopleware/openapi` due to
  licensing change at Bitbucket
- upgrade dependencies
- add `_util/assert`
- removed dependency on `node:assert`, which gave difficulties in browsers since Angular 17

`joi-to-json` is limited to version `3.1.2` for now, due to [#49](https://github.com/kenspirit/joi-to-json/issues/49). A
fix exists in `4.2.0` (“Adds 'open-api-3.1' format support.”), but introduces other errors. This needs some diagnosis
and work.

`@redocly/cli` is fixed to `1.0.0-beta.128`, and should be upgrade asap, but is not in this release. A new install
upgraded to @redocly/cli 1.8.1 automatically, which has some issues. It reports errors that take some work to
investigate and fix, and currently another release is more pressing.

### 8.0

#### 8.0.0

- add `.d.ts` for all string Joi schemata
- add d.ts for `shouldBeSeriousSchema`
- `shouldBeSeriousSchema` now also rejects when schema has duplicate examples (BREAKING)
- deprecate TS types `TrimmedString`, `CleanedString`, and `Language`; replace with `T…` variant
- add `Decimal`
- add function to constrain `Decimal`
- add YAML files for all `string` types
- add `CreatedInError` resource schema
- add `MonetaryValue2` as extended `Decimal` and deprecate `MonetaryValue`
- add function to constrain `MonetaryValue2`

## 7

### 7.4

#### 7.4.0

- add
  - `time/Month`
  - `time/Quarter`
  - `time/Year`

### 7.3

#### 7.3.3

- add better TS typing for `extendDescription`

#### 7.3.2

- add npm `version` script, that automatically changes the version in `index.yaml`, so it stays in sync with the npm
  version

#### 7.3.1

- add `.d.ts` for DayDateInterval
- add TS types `TDateTime` and `TDayDate`, and tweak the TS type of its schemata
  - deprecate TS types `DateTime` and `DayDate`

Declaring TS types in `.d.ts` files with the same name as the Joi schema for the type should work, but seems to confuse
the IDE when working in JS. For that reason, in the future, we will prepend a `'T'` to the name of the type. Ugly, I
know. Waiting for better solutions.

#### 7.3.0

- add
  - `money/NegativeMonetaryValue`
  - `money/NonPositiveMonetaryValue`
  - `money/NonNegativeMonetaryValue`
  - `money/PositiveMonetaryValue`

### 7.2

#### 7.2.1

- fix `monetaryValueExamples` type

#### 7.2.0

- add `money/CurrencyCode` and `money/MonetaryValue`
  - this includes a first experiment with consistent TS typing
- `money/MoneyAmount.yaml` is now deprecated
- `addExamples` typing is tweaked
- add filter `notInteger`

### 7.1

#### 7.1.0

- add `simulation` `mode`
- `MixedSearchResults` is now exported

### 7.0

#### 7.0.2

- tweak text and spec of `SearchDocument2.embedded`

#### 7.0.1

- fix bug in `SearchDocument2`

#### 7.0.0

- removed top level `href` property from `SearchDocument2`, since it is implicit

## 6

### 6.0

#### 6.0.0

##### Breaking changes (major)

- replace description of search, relationships in search (rename file to
  [`search-and-to-many-associations.md`](resource/search-and-to-many-associations.md))

##### New features (minor)

- add description of [Canonical and fully qualified URI](string/canonical-and-fq-uri.md)
- add first text about [determining build number](resource/determining-build-number.md)
- `SearchDocument` is deprecated; start switching to `SearchDocument2`
- `searchResults/Results` now also allows `SearchResultBase2` elements
- add `extendDescription` utility function
- add `filters` utility functions (for tests)

##### Other changes (patch)

- minor changes in some examples and descriptions

## 5

### 5.0

#### 5.0.10

- move `browser-safe.js` to `_util` folder
- rename `browser-safe.js` to `getDescription.js`

#### 5.0.9

- _really_ include `md` files in package files

#### 5.0.8

_Breaking. Do not use._

- also include `md` files in package files

#### 5.0.7

_Breaking. Do not use._

- also include `yaml` files in package files

#### 5.0.6

_Breaking. Do not use._

- include all required files in package files

#### 5.0.5

_Breaking. Do not use._

- include `browser-safe.js` script in package files

#### 5.0.4

- add `extendDescription` utility function
- add `getDescription` utility function
- avoid use of `describe()` in browser since it is not supported here

#### 5.0.3

_This version is breaking, and should not be used. A later version will add this functionality with corrections in a
backward compatible way._

- Updated search document to structureVersion 2, including properties href, toOneAssociations and embedded

#### 5.0.2

_This was never released, and contains only documentation changes._

- Searchdocument DTO should have version 2 because the structure is incompatible
- Embed in Searchdocument is renamed to embedded to be uniform with SearchIndexDocument

#### 5.0.1

- minor tweaks

#### 5.0.0

- renamed `id/sigedis/SigedisRegulationIdentification` to `SigedisRegistrantRegulationIdentification`
- fix regexp syntax for OpenAPI in `CleanedString` (and simplify the pattern, and make the description complete)

## 4

### 4.3

#### 4.3.0

- add description of relationships in a search index

### 4.2

#### 4.2.0

- add description of immutable data

### 4.1

#### 4.1.1

- stricter regex on cleaned string

#### 4.1.0

- add cleaned string concept

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
