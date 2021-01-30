# openapi

Collection of common [OpenAPI 3] specs.

These common specifications are shared between projects.

All specs here are defined using [YAML format].

For each spec, a usage is demonstrated in the top level [`index.yaml`] file, for demonstration purposes, and to make it
possible to validate the common specs.

The purpose of each spec is described in the [OpenAPI 3] `description` field of each spec, or in markdown files close to
the spec.

Although [OpenAPI 3] is a standard, support for some features differs between tools. We use [ReDoc] as the main target
for our [OpenAPI 3] spec. [ReDoc] formats and stylizes the specification in-browser.

## Usage

There is no "deployed" version of these specs. Stable versions are tagged in this repository using [semantic
versioning], in the format `version/<MAJOR>/<MINOR>/<PATCH>`.

To use the common specs, add this repository as a _git submodule_ to the repository containing your [OpenAPI 3]
specification:

    > git submodule add https://bitbucket.org/ppwcode/openapi.git common/ppwcode

Go to the checked out submodule, and choose the required version:

    > cd common/ppwcode
    > git checkout version/<MAJOR>/<MINOR>/<PATCH>
    > cd ../..

Commit the submodule definition

    > git add .gitmodules
    > git add common/ppwcode
    > git commit […]

In your [OpenAPI 3] specification, refer to the common [OpenAPI 3] specs using the `$ref` syntax supported by [OpenAPI
3], e.g.,

```yaml
[…]
  type: object
  […]
  properties:
    […]
    interval:
      allOf:
        - $ref: '../..[…]/common/ppwcode/time/DayDateInterval.yaml'
        - description: Override the description of the common spec
    […]
  […]
[…]
```

To change the version of these common [OpenAPI 3] specs you use

    > cd common/ppwcode
    > git fetch
    > git checkout version/<MAJOR>/<MINOR>/<PATCH>
    > cd ../..
    > git add common/ppwcode
    > git commit […]

## Development

Execute

    > npm install

to install development tools.

### Formatting

This repository is set up for use in IntelliJ IDEAs. [file watchers] will format YAML and Markdown files when saved
using [Prettier].

### Continuous developer feedback

As a developer, open [`index.html`] in a browser. This file loads [ReDoc] from a CDN (no dependencies in this
repository), and [ReDoc] loads [`index.yaml`] and referenced files.

If [`index.yaml`] contains syntax errors, [ReDoc] shows error messages and warnings.

[`index.html`] is set up to reload frequently, providing continuous feedback.

### Linting

Linting is done with [Redocly openapi-cli].

You can execute this test locally with

    > npm test

During development, keep a console open:

    > npm run OpenAPI:watch

This will run the linter each time a spec file is changed, providing continuous feedback.

On each push, linting is done in [CI].

### Changes and pull requests

_You cannot push commits, or create pull requests, from the submodule in your specification repository._

To make changes to this collection, clone this repository or a fork separately, and make your changes in that copy.

## License

Copyright 2021 - 2021 PeopleWare n.v.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the
License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](apachev2)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific
language governing permissions and limitations under the License.

[openapi 3]: http://spec.openapis.org/oas/v3.0.3
[yaml format]: http://spec.openapis.org/oas/v3.0.3#format
[`index.yaml`]: index.yaml
[`index.html`]: index.html
[semantic versioning]: https://semver.org/
[file watchers]: https://www.jetbrains.com/help/idea/using-file-watchers.html
[prettier]: https://www.npmjs.com/package/prettier
[ci]: bitbucket-pipelines.yml
[redoc]: https://github.com/Redocly/redoc
[redocly openapi-cli]: https://github.com/Redocly/openapi-cli
[apachev2]: LICENSE
