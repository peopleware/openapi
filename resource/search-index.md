The system uses a search index to support search for resources in the UI, and to support the visualization of to-many
associations in the UI. When a resource is a participant in many associations, the user can search in this large
collection too. Other clients can use this functionality to, if appropriate.

In this text, we will illustrate the behavior of the system in the context of an example:

```
                                                         +----+
                                                         | YA |
                                                         +----+
                                                           | 1
                                                           |
                                                           |
                                                      0..* |
+-----+ 1          +---------------+          1 +----------------------+
|  X  |------------|  R            |------------|          Y           |
+-----+       0..* +---------------+ 0..*       +----------------------+
                   | layer         |            | id                   |
                   | <<χ>> premium |            | <<χ>> registrationId |
                   +---------------+            | <<χ>> name           |
                                                | <<χ>> category       |
                                                | <<χ>> ranking        |
                                                | <<χ>> class          |
                                                | since                |
                                                | <<χ>> popularity     |
                                                | <<χ>> note           |
                                                +----------------------+
                                                      0..* |
                                                           |
                                                           |
                                                           | 1
                                                         +----+
                                                         | YB |
                                                         +----+
```

A resource `Y` has a number of _zeitliche_ (χ) and _unzeitliche_ properties. We will first discuss searching globally
for instances of `Y`. `Y` is in a many-to-many relationship with `X`, which is reified in `R`: each instance of `R` is
associated with exactly one instance of `X` and `Y`, and `X` and `Y` can optionally participate in many instances of
`R`. A resource `R` has a number of _zeitliche_ and _unzeitliche_ properties. We will discuss showing the collection of
instances of `R` in which an instance of `X`, or `Y`, participates, in the detail representation of `X`, respectively
`Y`, in the UI. We will discuss searching in this collection of `X`. For this, we will need to revisit searching for
instances of `Y` in the context of the relationship. `YA` and `YB` are used as illustration in this discussing for the
recursive behavior of this issue.

## Architecture

There are several components in this architecture.

```
        +--------------------------------------------------+
        v                                                  |
  +------------+                         +--------------+  |
  | My Service +-------------+---------->| Search Topic |  |
  +------------+             |           +--------------+  |
                             |                   ^         |
+--------------+             |                   |         |
| Your Service +-------------         +----------+---------+-+
|              |<---------------------| Search Topic Handler |
+--------------+                      +----------+-----------+
                                                 |
                                                 v
+----------+      +----------------+      +--------------+
| Client P +----->| Search Service +----->| Search Index |
+----------+      +----------------+      +--------------+
                          ^
+----------+              |
| Client Q +--------------+
+----------+
```

- Resources are managed in _services_, of which there are several.
- There is 1 central _search index_, which contains _search index documents_ for resources that can be found. This data
  is _eventually consistent_.
- When a resource is created or changes, the service that manages the resource, posts an _event_ on a _search topic_.
- Events on the _search topic_ are handled by a _search topic handler_, which creates or updates the appropriate search
  index documents in the search index. There is 1 general search event handler.
- _Clients_ send search requests to the search service, and get a paged collection of _search results_ for matches.
- The _search service_ delegates search requests to the search index, and applies authentication and authorization, and
  possibly some other work. There is 1 general search service.

Each of the components can evolve over time, with immutable deploy. At a given time several versions of each component
might exist with different _build numbers_. Each component supports several `mode`s.

Note that the architecture is acyclic.

## General process

_Services_ are triggered from outside, by a client, to create or update a resource in a particular `mode`, with a
`flowId`. After this is done and committed, the service posts a minimal event on the _search topic_ for asynchronous
processing.

The _search topic handler_ picks up the event, and requests the _search document_ for the resource from the originating
service. This contains the most up-to-date search-relevant information at this time, and contains general data
structures, and data structure specific for the resource at hand. For the search index handler, search index, and search
service, the latter is opaque. Based on this data, the search index handler builds a _search index document_, and
creates or updates it in the search index.

_Clients_ send _search requests_ to the _search service_ for a given `mode`. The search service handles authentication,
and supports different, but limited, kinds of search. The search service creates appropriate search paramaters in the
syntax of the search index, including parameters that make sure only results for which the subject of the call has read
permissions are returned. It post-processes the results it receives from the search service, and sends the _search
results_ to the client, paged. The search results are only the opaque data structures for matching resources that were
retrieved from the originating service, and put in to the search index by the search handler.

The search-relevant information is not included in the event, but requested by the search index handler JIT, because the
handling of events on the topic is not guaranteed to be in the order of posting (which is typical in asynchronous
distributed systems). This way, if an earlier event is processed after a later event for a same resource, both will work
with the same version of the data, and the second handling will be idempotent.

If the search document tells the search topic handler that the changed resource has dependencies, it posts additional
events on the search topic to update the search index documents for those resources eventually. This is a recursive
process.

## Canonical and fully qualified URI

In the example, a specific resource of type `Y` has _canonical URI_ `/my-service/v1/y/abc`, and a specific resource of
type `R` has canonical URI `/my-service/v1/x/123/y/abc`.

A _canonical URI_ is the URI where are resource can be interacted with, without the scheme and authority (see [RFC 3986
Uniform Resource Identifier (URI): Generic Syntax ;3. Syntax Components](https://www.rfc-editor.
org/rfc/rfc3986#section-3)), and without the build number. By convention, the canonical URI’s first segment is the name
of the service in which the URI resides, followed by the relative URI of the resource in the API of that service.

- service name: `my-service`
- relative URI of the resource in the API of the service:
  - `/v1/y/abc` for the specific instance of `Y`
  - `/v1/x/123/y/abc` for the specific instance of `R`

To actually interact with these resources, clients need create a _fully qualified URI_ based on this and other
information. The fully qualified URI of the resource uses `https` as scheme, adds the authority (which is different in
different environments), adds the service name, then the build number, and then the relative URI of the resource in the
API of that service. E.g.:

- `https://dev-gateway.org:8899/my-service/00456/v1/y/abc` for the specific instance of `Y`
- `https://dev-gateway.org:8899/my-service/00456/v1/x/123/y/abc` for the specific instance of `R`

The authority is always the authority where the client itself is working under (the gateway of a particular
environment).

Different clients use different methods to determine the build number to use. This often depends on the build of the
client, and / or the `mode` for which the interaction takes place. `LATEST` is a special build number, that refers to
the latest deployed build of the service.

The UI, accessed as `immutable` build, uses `LATEST` as build number for each service, apart from some temporary
exceptions where some build numbers are hard coded. Accessed as `bookmarkable` build, the UI contains a configuration
that explicitly lists the build numbers of all services to use.

When a service, such as `your-service`, or the search topic handler, accesses other services, e.g., `my-service`, the
build number is determined from the `mode` using _deployment configuration_. Deployment parameters might mention that
build number `00432` of `my-service` must be used in a `qa-023` `mode`, and build `LATEST` must be used in mode
`dev-experiment`. The deployment configuration can differ between different deployed builds of the dependent service,
and can evolve without a new build or deploy. It is the resonsibility of the deployment configuration to make sure that
the build of the dependent service is compatible with the version of the API the build of the service that is called
offers.

## Events

Events have the following properties:

- `structureVersion`: an integer describing the version of this data structure

- `mode`: The `mode` in which the resource that was created or updated resides.

- `build`: The build number of the service that posts the event.

- `flowId`: The `flowId` of the request to the service that triggered the creation or update of the resource. This is
  added to make it possible to cross-reference events, search document requests, and search index documents with each
  other and logs.

- `href`: The canonical URI where the search document for the created or changed resource can be retrieved.

When a resource of type `Y` is created or updated in `my-service`, and event is posted on the search topic that looks
like:

```json
{
  "MessageProperties": {
    "CustomProperties": {
      "flowId": "9fc6ad82-6626-4ac3-bc1c-17a3fbd5dc3f",
      "mode": "example",
      "build": "00456"
    }
  },
  "MessageBody": {
    "structureVersion": 1,
    "href": "/my-service/v1/y/abc/search-document"
  }
}
```

## Search topic handler

### Pick up event, and get the search document

When the search topic handler picks up an event, and retrieves the search document indicated by the `href` in the event.
With this request, it uses the `flowId` and `mode` found in the event. The fully qualified URI for the request is
determined from the `href` and `mode` found in the event as described above.

It is possible that this request will be made to a different build of the service from which the event originated than
the build that posted the event (mentioned in the event). As long as the resource exists, and the API of the search
documents is compatible between the builds, this is not an issue. If the different builds use different persistent
stores, the updated search index document will not reflect the state of the resource in the build from which the event
was posted. This can only occur in `dev-experiment` `mode`, since it is the only mode in which different persistent
stores should exist for different builds. If the build used for the request is different from the build number in the
event, this is logged as a warning.

In a highly dynamic environment and `mode`, such as `dev-experiment`, it is possible that the build of the service that
is interacted with no longer exists, or that the API is incompatible, due to configuration errors. In this case, the
handler logs this as an error, mentioning the `build` from the `event` and the build number used in the request, and
considers the event handled. When this would occur in stable environments or `mode`s, this is still the best approach to
deal with a configuration error.

## Search documents

The search documents a service offer are specializations of a common structure. They have the following properties:

- `structureVersion`: an integer describing the version of this data structure

- `href`: The _relative_ canonical URI where the version of the resource this search document represents can be
  retrieved from, with the start-of-transaction of the request for the search document as knowledge time (`at` query
  parameter). Given the conventions, this is always of the form `.?at=2023-01-173T15:22:39.212889Z`

- `exact`: array of strings on which the represented resource is to be found with an exact match

- `fuzzy`: array of strings on which the represented resource is to be found with a fuzzy match

- `dependencies`: array of canonical URIs of the search document of resources for which the search index document needs
  to be updated too when the search index document for this resource is updated

- `content`: A data structure that is different for each resource, but has some common properties:
  - `structureVersion`: an integer describing the version of this data structure
  - `discriminator`: the type of represented resource

The `content` is, more or less, what will be returned to a client when a search matches. The client uses the `content`
to show search results quickly, without additional service calls. The `content` contains the `discriminator`, so the
client knows the type of the found resource, and type specific extra fields or nested data structures. The exact
structure of the `content` property data structure is opaque for the search topic, search topic handler, search index,
and search service. It is a dependency of clients on the service API, expressed by the discriminator.

Below is the example of the search document for a resource of type `Y`:

```json
{
  "structureVersion": 1,
  "href": ".?at=2023-01-173T15:22:39.212889Z",
  "exact": ["0123456789"],
  "fuzzy": ["wizzy", "woozy", "wuzzy"],
  "dependencies": ["/my-service/v1/x/123/y/abc/search-document"],
  "content": {
    "structureVersion": 1,
    "discriminator": "Y",
    "name": "wizzy",
    "category": "woozy",
    "registrationId": "0123456789",
    "ranking": 4,
    "class": "wuzzy",
    "since": "2023-01-10"
  }
}
```

## Search index document

With this information, the search topic handler builds the new or updated search index document for the resource.

Search index documents have the following properties:

- `id`: The search index technology we use requires a unique identifier `id` of the search index document, so it can be
  updated later. Some syntax rules apply.

- `mode`: any search request happens for an exact `mode`

- `flowId`: to be able to cross-reference the search index document with logs

- `discriminator`: the type of resource; can be filtered upon with exact match

- `href`: The canonical URI of the resource. This is used for authorization with RAAs when a search is initiated from a
  client.

- `exact`: a list of strings that are searchable in an exact match manner

- `fuzzy`: a list of strings that are searchable in with a fuzzy match

- `content`: A JSON string with a representation of the resource. `content` is entity type specific, and thus
  `discriminator` specific. Common properties are:

  - `structureVersion`: an integer describing the version of this data structure
  - `discriminator`: the type of represented resource
  - `href`: canonical URI where the resource can be found, with the time the search document was generated as knowledge
    time (`?at`)

- `createdAt`:

Note that this is similar, but different, from the structure of the search document.

### Canonical URI and id

The search topic handler creates the canonical URI of the resource, based on the relative `href` in the search document
and the URI of the search document from the event (it strips of the last `/search-document` segment, and adds the `at`
query parameter). This is inserted as `href` _without the `at` query parameter_ in the index search document at the top
level, and as `href` in the search index document `content`, with the `at` query parameter.

### Content

The `content` is what will be returned to a client when a search matches. The client uses the `content` to show search
results quickly, without, or with limited extra service calls, and to allow click-through to the details of a found
resource. It is the `content` of the retrieved search document, with the addition of a `href` property, so the client
knows where to get the details of the found resource.

The `content.href` is the canonical URI calculated above, including the `at` query parameter. In the client, the user
would navigate to the indexed version of the resource, and not necessarily the latest. The search index is eventually
consistent, and we want to show the user the same information as was used in finding the resource.

The exact structure of the `content` property data structure is opaque for the search index and search service. It is a
dependency of clients on the service API, expressed by the discriminator.

The `mode` is not included in the `content`. The client supplies a `mode` in a search request, and only index search
documents with that exact mode are returned.

### Other properties

The `id` is the canonical URI, with `/` replaced by `_`, because of syntax constraints, and appended with the `mode`.
This is a stable and unique identification of the search index document in the search index, accross all services and
`mode`s.

The search index document contains the `mode`, because each search should only return matches from an exact `mode`.

The `flowId` is added to easily cross-reference search index document instances with logs, events, and recorded changes
in resources.

The search topic handler copies the `discriminator` from the `searchDocument.content` to the top level, because we need
to provide the possibility for clients to search for resources of an exact type.

The top level `href` is used in authorization (described later).

`exact` and `fuzzy` are used in different kinds of search requests.

### Example

The above example event and search document for a resource of type `Y` would result in the following search index
document:

```json
{
  "id": "my-service_v1_y_abc_example",
  "mode": "example",
  "flowId": "a2d890b1-fa83-4bbf-bc26-15ab282b2e00",
  "discriminator": "Y",
  "href": "/my-service/v1/y/abc",
  "exact": ["0123456789"],
  "fuzzy": ["wizzy", "woozy", "wuzzy"],
  "content": {
    "structureVersion": 1,
    "discriminator": "Y",
    "href": "/my-service/v1/y/abc?at=2023-01-173T15:22:39.212Z",
    "name": "wizzy",
    "category": "woozy",
    "registrationId": "0123456789",
    "ranking": 4,
    "class": "wuzzy",
    "since": "2023-01-10"
  }
}
```
