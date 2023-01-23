The system uses a search index to support search for resources in the UI, and to support the visualization of to-many
associations in the UI. When a resource is a participant in many associations, the user can search in this large
collection too. Other clients can use this functionality to, if appropriate.

In this text, we will illustrate the behavior of the system in the context of an example:

```
+-------------+            +---------------+            +----------------------+
|      X      | 1          |  R            |          1 |          Y           |
+-------------+------------+---------------+------------+----------------------+
| <<χ>> title |       0..* | layer         | 0..*       | id                   |
+-------------+            | <<χ>> premium |            | <<χ>> registrationId |
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
                                                                 | YA |
                                                                 +----+
```

A resource `Y` has a number of _zeitliche_ (χ) and _unzeitliche_ properties. We will first discuss searching globally
for instances of `Y`. `Y` is in a many-to-many relationship with `X`, which is reified in `R`: each instance of `R` is
associated with exactly one instance of `X` and `Y`, and `X` and `Y` can optionally participate in many instances of
`R`. A resource `R` has a number of _zeitliche_ and _unzeitliche_ properties. We will discuss showing the collection of
instances of `R` in which an instance of `X`, or `Y`, participates, in the detail representation of `X`, respectively
`Y`, in the UI. We will discuss searching in this collection of `X`. For this, we will need to revisit searching for
instances of `Y` in the context of the relationship. `YA` is used as illustration in discussing the recursive behavior
of this issue. We imagine, in this example, many related `Y` instances for a given `X` resource, and just a few related
`X` instances for a given `Y` instance.

## Architecture

There are several components in this architecture.

```
        +--------------------------------------------------+
        v                                                  |
  +------------+                         +--------------+  |
  | My Service +-------------+---------->| Search Topic |  |
  +------------+             |           +--------------+  |
        ^                    |                   ^         |
        |                    |                   |         |
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

To make the example as expressive as possible, we will assume that `Y` resource are managed by `my-service`, and `R`
resources are managed by `your-service`. This means that `your-service` depends on `my-service`. A good architecture and
design should not contain dependency cycles, which means that code or data structures managed in `my-service` should not
have any knowledge of `your-service`. The process is also intended for dependencies beween resources in the same
service.

## Process overview

_Services_ are triggered from outside, by a client, to create or update a resource in a particular `mode`, with a
`flowId`. After this is done and committed, the service posts a minimal event on the _search topic_ for asynchronous
processing.

The _search topic handler_ picks up the event, and requests the _search document_ for the resource from the originating
service. This contains the most up-to-date search-relevant information at this time, and contains general data
structures, and data structure specific for the resource at hand. For the search index handler, search index, and search
service, the latter is opaque. Based on this data, the search index handler builds a _search index document_, and
creates or updates it in the search index. The topic handler determines whether the changed search index document is
referenced by other search index documents that embed information from it. If so, it posts additional events on the
search topic to update those search index documents eventually. This is a recursive process.

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

## Events

Events have the following properties:

- `structureVersion`: an integer describing the version of this data structure

- `mode`: The `mode` in which the resource that was created or updated resides.

- `build`: The build number of the service that posts the event.

- `flowId`: The `flowId` of the request to the service that triggered the creation or update of the resource. This is
  added to make it possible to cross-reference events, search document requests, and search index documents with each
  other and logs.

- `href`: The canonical URI where the search document for the created or changed resource can be retrieved.

- `createdBefore`: optional property, that signals to only consider possible embedding search index documents that are
  not already updated

When a resource of type `Y`, respectively `R`, is created or updated in `my-service`, and event is posted on the search
topic that looks like:

```json
{
  "MessageProperties": {
    "CustomProperties": {
      "flowId": "74551439-d945-41c9-89ab-0805087c4ec0",
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

```json
{
  "MessageProperties": {
    "CustomProperties": {
      "flowId": "0a170f19-e545-4699-9495-ff2e8067f710",
      "mode": "example",
      "build": "00789"
    }
  },
  "MessageBody": {
    "structureVersion": 1,
    "href": "/your-service/v1/x/123/y/abc/search-document"
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

Depending on the results returned from the retrieved search document, the search topic handler retrieves extra content
from the search engine to embed in the search index document it creates, and might create new events for other search
index documents that embedded content from this search index document to be updated eventually too.

### Search documents

The search documents a service offer are specializations of a common structure. They have the following properties:

- `structureVersion`: an integer describing the version of this data structure, this should be set to a value of 2 or
  higher

- `href`: The _relative_ canonical URI where the version of the resource this search document represents can be
  retrieved from, with the start-of-transaction of the request for the search document as knowledge time (`at` query
  parameter). Given the conventions, this is always of the form `.?at=2022-12-27T03:14:22.212775Z`, and has the same
  value as the `x-date` response header.

- `exact`: array of strings on which the represented resource is to be found with an exact match

- `fuzzy`: array of strings on which the represented resource is to be found with a fuzzy match

- `toOneAssociations`: array of canonical URIs of the resources the represented resource has a to-one association to;
  used to find the represented resource as element of the to-many association of the referenced resource

- `content`: A data structure that is different for each resource, but has some common properties:

  - `structureVersion`: an integer describing the version of this data structure
  - `discriminator`: the type of represented resource

- `embedded`: Dictionary of property names to canonical URIs of other resources. Information from the search index
  document of the referenced resources will be embedded into this search index document by the search topic handler.
  When the search index document of which information is embedded is updated, the search index document for the
  represented resource needs to be updated too.

The `content` is, more or less, what will be returned to a client when a search matches. The client uses the `content`
to show search results quickly, without additional service calls. The `content` contains the `discriminator`, so the
client knows the type of the found resource, and type specific extra fields or nested data structures. The exact
structure of the `content` property data structure is opaque for the search topic, search topic handler, search index,
and search service. It is a dependency of clients on the service API, expressed by the discriminator.

Below is the example of the search document for a resource of type `Y` and `R`:

```json
{
  "structureVersion": 2,
  "href": ".?at=2022-12-27T03:14:22.212775Z",
  "exact": ["0123456789"],
  "fuzzy": ["wizzy", "woozy", "wuzzy"],
  "toOneAssociations": [],
  "content": {
    "structureVersion": 1,
    "discriminator": "Y",
    "name": "wizzy",
    "category": "woozy",
    "registrationId": "0123456789",
    "ranking": 4,
    "class": "wuzzy",
    "since": "2023-01-10"
  },
  "embedded": {}
}
```

Note that there is no mention of `your-service` in this representation.

```json
{
  "structureVersion": 2,
  "href": ".?at=2022-12-28T12:48:09.558745Z",
  "exact": ["7457"],
  "fuzzy": [],
  "toOneAssociations": ["/some-service/v1/x/123", "/my-service/v1/y/abc"],
  "content": {
    "structureVersion": 1,
    "discriminator": "R",
    "layer": "optimized",
    "premium": 7457,
    "x": "/some-service/v1/x/123"
  },
  "embedded": {
    "y": "/my-service/v1/y/abc"
  }
}
```

Note that in the content of the search document for `R`, the property `x` is the canonical URI of the resource of type
`X` that this resource of type `R` has a to-one association to. The client can use this to get that resource. This
specification is opaque for the search topic, search topic handler, search index, and search service. It is a dependency
of clients on the service API, expressed by the discriminator.

Note further that this data structure contains implicit references to `my-service`. This data structure is under control
of `your-service` in the example, and `your-service` has a known dependency on `my-service`, so that is allowed.

### Search index documents

With this information, the search topic handler builds the new or updated search index document for the resource, and
adds it to the search index.

Search index documents have the following properties:

- `id`: The search index technology we use requires a unique identifier `id` of the search index document, so it can be
  updated later. Some syntax rules apply.

- `mode`: any search request happens for an exact `mode`

- `source`: canonical URI where the search document from which this search index document was build was retrieved

- `flowId`: to be able to cross-reference the search index document with logs

- `build`: the build number of the service from which we got the search document this search index document is based on;
  used to be able to cross-reference in case of errors

- `createdAt`: the value of the `x-date` header that is returned with the search document request from which the search
  index document is created.

- `discriminator`: the type of resource; can be filtered upon with exact match

- `href`: The canonical URI of the resource. This is used for authorization with RAAs when a search is initiated from a
  client.

- `toOneAssociations`: array of canonical URIs of the resources the represented resource has a to-one association to;
  used to find the represented resource as element of the to-many association of the referenced resource

- `embedded`: array of canonical URIs of the resources this search index document embeds information of; when the search
  index document for the referenced resources is updated, the search index document for the represented resource needs
  to be updated too

- `exact`: a list of strings that are searchable in an exact match manner

- `fuzzy`: a list of strings that are searchable in with a fuzzy match

- `content`: A JSON string with a representation of the resource. `content` is entity type specific, and thus
  `discriminator` specific. Common properties are:

  - `structureVersion`: an integer describing the version of this data structure
  - `discriminator`: the type of represented resource
  - `href`: canonical URI where the resource can be found, with the time the search document was generated as knowledge
    time (`?at`)

Note that this is similar, but different, from the structure of the search document.

#### Canonical URI and id

The search topic handler creates the canonical URI of the resource, based on the relative `href` in the search document
and the URI of the search document from the event (it strips of the last `/search-document` segment, and adds the `at`
query parameter). This is inserted as `href` _without the `at` query parameter_ in the index search document at the top
level, and as `href` in the search index document `content`, with the `at` query parameter.

#### Other properties

The `id` is the canonical URI, with `/` replaced by `_`, because of syntax constraints, and appended with the `mode`.
This is a stable and unique identification of the search index document in the search index, accross all services and
`mode`s.

The search index document contains the `mode`, because each search should only return matches from an exact `mode`.

`source` is added for handling updates of embedding resources (described later). It is the value of the `href` in the
event.

The `flowId` is added to easily cross-reference search index document instances with logs, events, and recorded changes
in resources.

`createdAt` is introduced as a safeguard against infinite update loops, discussed later. Note that this value is the
same as the value in the `at` query parameter for a simple update, of an isolated changed resource.

The search topic handler copies the `discriminator` from the `searchDocument.content` to the top level, because we need
to provide the possibility for clients to search for resources of an exact type.

The top level `href` is used in authorization (described later).

The top level `embedded` property is related to the `embed` property in the search document. It is described below.

`toOneAssociations` is used so this search index document can be found from resources that have a to-many association
with it (described later). The `toOneAssociations` value is copied from the search document. `exact` and `fuzzy` are
used in different kinds of search requests. These are copied from the retrieved search document, and possibly extended
with embedded content.

#### Content

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

#### Example

The above example event and search document for a resource of type `Y` would result in the following search index
document:

```json
{
  "id": "my-service_v1_y_abc_example",
  "mode": "example",
  "source": "/my-service/v1/y/abc/search-document",
  "flowId": "74551439-d945-41c9-89ab-0805087c4ec0",
  "build": "00456",
  "createdAt": "2022-12-27T03:14:22.212775Z",
  "discriminator": "Y",
  "href": "/my-service/v1/y/abc",
  "toOneAssociations": [],
  "embedded": [],
  "exact": ["0123456789"],
  "fuzzy": ["wizzy", "woozy", "wuzzy"],
  "content": {
    "structureVersion": 1,
    "discriminator": "Y",
    "href": "/my-service/v1/y/abc?at=2022-12-27T03:14:22.212775Z",
    "name": "wizzy",
    "category": "woozy",
    "registrationId": "0123456789",
    "ranking": 4,
    "class": "wuzzy",
    "since": "2023-01-10"
  }
}
```

#### Embedded content, exact, and fuzzy

When the search document contains entries in the `embed` dictionary, the search topic handler splices extra information
into the new search index `content`, `exact`, and `fuzzy`. For every entry `(key, value)` in the dictionary, it

- retrieves the search index documents _from the search index_ with an exact match of `value` on `href` (canonical URI)
  for the same `mode`, and
- splices the returned search index document’s `content` in the new search index document’s `content` with as property
  with name `key`.
- concatenates the `exact` of the returned search index document to the `exact` of the new search index document, and
  removes duplicates (`nub()`)
- concatenates the `fuzzy` of the returned search index document to the `fuzzy` of the new search index document, and
  removes duplicates (`nub()`)
- adds the `value` to the new search index document’s `embedded` property

The example search document for type `R` above results in the following search index document, after splicing in
information from the search index document of `/my-service/v1/y/abc` as embedded content:

```json
{
  "id": "my-service_v1_z_123_y_abc_example",
  "mode": "example",
  "source": "/your-service/v1/x/123/y/abc/search-document",
  "flowId": "0a170f19-e545-4699-9495-ff2e8067f710",
  "build": "00789",
  "createdAt": "2022-12-28T12:48:09.558745Z",
  "discriminator": "R",
  "href": "/your-service/v1/x/123/y/abc",
  "toOneAssociations": ["/some-service/v1/x/123", "/my-service/v1/y/abc"],
  "embedded": ["/my-service/v1/y/abc"],
  "exact": ["7457", "0123456789"],
  "fuzzy": ["wizzy", "woozy", "wuzzy"],
  "content": {
    "structureVersion": 1,
    "discriminator": "R",
    "href": "/your-service/v1/x/123/y/abc?at=2022-12-28T12:48:09.558745Z",
    "layer": "optimized",
    "premium": 7457,
    "x": "/my-service/v1/x/123",
    "y": {
      "structureVersion": 1,
      "discriminator": "Y",
      "href": "/my-service/v1/y/abc?at=2022-12-27T03:14:22.212775Z",
      "name": "wizzy",
      "category": "woozy",
      "registrationId": "0123456789",
      "ranking": 4,
      "class": "wuzzy",
      "since": "2023-01-10"
    }
  }
}
```

Since the search index document (`/your-service/v1/x/123/y/abc`) now contains information from another resource
(`/my-service/v1/y/abc`), this search index document needs to be updated when the search index document of the other
resource changes to.

## Global search

A client can search for matching resources by sending a search request to the search service, with paging parameters. A
`mode` has to be supplied with each search request. Clients can issue search requests with any combination of

- `discriminators`: Array of discriminators. Matching search index documents must have a `discriminator` that exactly
  matches on of the entries in the array. Used to filter on specific resource types.

- `exact`: String. Matching search index documents must have an entry in `exact` that exactly matches this string. Used
  for business keys, identifiers, ...

- `fuzzy`: String. The given term must appear as part of a member of the `fuzzy` field of matching search index
  documents. Used for names, descriptions, ...

- `toOneAssociation`: Canonical URI. Matching search index documents must have an entry in `toOneAssociations` that
  exactly matches this value. Used to retrieve to-many associations.

The search service will

- determine wether the request is authenticated
- retrieve the RAAs for the `mode` of the request, for the authenticated subject
- convert the `GET` RAAs to a regular expression
- do a search on the search index with the necessary parameters

The common parameters are always:

- an exact match on `mode` with the `mode` of the request
- a regular expression match on the search index document `href` (canonical URI of the resource) with the converted
  `GET` RAAs; this way, only resources the subject is authorized to read will be returned
- paging parameters

If `discriminators`, an `exact`, a `fuzzy`, or `toOneAssociation` exists in the search request, these are added to the
search index search to perform as described.

The `contents` values of the found results are doctored a bit, and returned to the client.

Examples for searches, applied to the 2 examples above, follow. The call returns all matching resources the subject is
authorized for, paged.

```javascript
search({
  authorization: 'Bearer XXXXX',
  mode: 'example',
  flowId: 'b5a9f49a-cf7e-4607-94a4-0c61f3821c4f',
  exact: '0123456789'
})
// returns `/my-service/v1/y/abc` and `/your-service/v1/x/123/y/abc`

search({
  authorization: 'Bearer XXXXX',
  mode: 'example',
  flowId: 'bd865481-ad8a-4205-9670-dc9548461004',
  discriminators: ['Y'],
  exact: '0123456789'
})
// returns `/my-service/v1/y/abc`

search({
  authorization: 'Bearer XXXXX',
  mode: 'example',
  flowId: '04e3156a-14da-423a-a9ec-676e7d08af3d',
  discriminators: ['R'],
  exact: '0123456789'
})
// returns `/your-service/v1/x/123/y/abc`

search({
  authorization: 'Bearer XXXXX',
  mode: 'example',
  flowId: 'b5a9f49a-cf7e-4607-94a4-0c61f3821c4f',
  discriminators: ['X', 'Y', 'R'],
  exact: '0123456789'
})
// returns `/my-service/v1/y/abc` and `/your-service/v1/x/123/y/abc`

search({
  authorization: 'Bearer XXXXX',
  mode: 'example',
  flowId: 'f17dc656-8061-416d-aaa8-6dd1452c2654',
  fuzzy: 'wizzy woo'
})
// returns `/my-service/v1/y/abc` and `/your-service/v1/x/123/y/abc`

search({
  authorization: 'Bearer XXXXX',
  mode: 'example',
  flowId: '9038754c-f750-4f23-83b8-626372047895',
  discriminators: ['Y'],
  fuzzy: 'wizzy woo'
})
// returns `/my-service/v1/y/abc`

search({
  authorization: 'Bearer XXXXX',
  mode: 'example',
  flowId: '10a9a88d-bf17-4ce7-b1da-88ff493d3911',
  discriminators: ['R'],
  fuzzy: 'wizzy woo'
})
// returns `/your-service/v1/x/123/y/abc`

search({
  authorization: 'Bearer XXXXX',
  mode: 'example',
  flowId: 'b5a9f49a-cf7e-4607-94a4-0c61f3821c4f',
  discriminators: ['X', 'Y', 'R'],
  fuzzy: 'wizzy woo'
})
// returns `/my-service/v1/y/abc` and `/your-service/v1/x/123/y/abc`
```

The use of an exact match on `toOneAssociation` is discussed below.

### Embedded

In the example, the search index document for resources of type `R` embeds `content`, `exact`, and `fuzzy` entries of
the resource of type `Y`. It is clear that, when the resource `/my-service/v1/y/abc` changes, the search index document
for `/my-service/v1/x/123/y/abc` must be updated too.

The search topic handler will therefore, after having done the work describe above in response to an event, search in
the search index for search index documents that have

- an entry in `embedded` with an exact match on the calculated canonical URI of the newly created search index document,
  and where
- `createdAt` is smaller than `createdBefore`.

`createdBefore` is the value from the event, if it exists. If not, it is the value of the `x-date` response header of
the retrieved search document.

For all results of this search, for all pages, the search topic handler will build and post new events, with the same
`mode` and `flowId` of the original request, the `createdBefore` value, and the `source` of the found search index
document as `href`. `build` is the value the service determines for the service the `source` refers to as first
`segment`, in the used `mode`. Eventually, the search topic handler will handle these new events, so that eventually the
embedding search index documents will be brought up to date too. Those search index documents might be embedded in other
resource’s search index documents too, making the process recursive.

Consider a second, later event for `Y` in the example:

```json
{
  "MessageProperties": {
    "CustomProperties": {
      "flowId": "410ae3c3-2a74-4318-9ca6-ea85c8e4c23a",
      "mode": "example",
      "build": "00544"
    }
  },
  "MessageBody": {
    "structureVersion": 1,
    "href": "/my-service/v1/y/abc/search-document"
  }
}
```

After building and updating the search index document for `/my-service/v1/y/abc`, the search topic handler will execute
the following search, with the `mode` of the `event`:

```javascript
indexSearch({
  mode: 'example',
  embedded: '/my-service/v1/y/abc',
  createdBefore: '2023-01-18T16:12:12.008500Z'
})
// returns search index document for `/my-service/v1/x/123y/abc`
```

Note that the search on `embedded` is not exposed by the search service API.

The search index document that is returned, is the one represented above for `/my-service/v1/x/123/y/abc`. It must be
updated. The value of its `source` is `/my-service/v1/x/123/y/abc/search-document`. `The following event is posted on
the search topic:

```json
{
  "MessageProperties": {
    "CustomProperties": {
      "flowId": "410ae3c3-2a74-4318-9ca6-ea85c8e4c23a",
      "mode": "example",
      "build": "00890"
    }
  },
  "MessageBody": {
    "structureVersion": 1,
    "href": "/your-service/v1/x/123/y/abc/search-document",
    "createdBefore": "2023-01-18T16:12:12.008500Z"
  }
}
```

Note that the build number might be different from the originating event.

For the recursion, imagine in the example that the `Y` resource embeds information of a `YA` resource, and that the `YA`
resource is updated. After the update of the search index document for the `YA` resource, the `Y` resource is discovered
as referencing, and eventually handled. After the update of the search index document for the `Y` resource, the `R`
resource is discovered as referencing, and eventually handled.

### Infinite loops

When creating recursive processes such as the above, we must make sure the process ends eventually. A good architecture
and design should not contain dependency cycles, but an extra stop criterion will protect us. This is why the
`createdAt` property is added to the search index document and the `createdBefore` parameter when used in determining
the next embedding resources to post events for. When, after this process started, an embedding search index document is
updated before we require it, a new event is not created. If the update that happened in the meantime, whether it was
triggered by an outside force, or by this process in a bad loop, it has been updated already with the up-to-date
embbeded information.

Note that, because the search index is eventually consistent, that a fast handling of a later event might not see an
earlier update yet. When there is a loop, new events would be created, although they should not be. In extreme cases, we
could loop 1, or a small number of times, but eventually the first update would be seen, and the loop would stop. Since
this is only a back-stop for infinite loops, and repeated updates are idemponent, this is acceptable.

### Cross-service embeddings

Embedding resources might live in a different service than the resources of which they embed information. Embedding is a
form of dependency. In the example, `Y` lives in `my-service`, and `R` is managed by `your-service`. It is clear in that
example that `your-service` depends on `my-service`, because a resource in it depends on a resource in `my-service`. In
a clean architecture, there are no cyclic dependencies. In other words, in resources and code of `your-service`,
references to resources, APIs, or structures of `my-service` are allowed, but not the other way around. This is upheld
by this architecture.

### Exponential explosion

This process can propagate over the entire system.

Imagine a resource that has direct and indirect referents `N` levels deep, where each level has `~M` referents. An event
for such a resource will result in <code>∑<sub>i&nbsp;=&nbsp;0..N</sub>&nbsp;M<sup>i</sup> &gt; M<sup>N</sup></code>
events. With `N = 5`, and `M = 100`, the result is > 10<sup>2⋅5</sup> = 10<sup>10</sup> = 10&nbsp;000&nbsp;000&nbsp;000
(> 10 billion) events. With <code>M<sub>1</sub> = 1000</code>, <code>M<sub>2</sub> = 1.5</code>, <code>M<sub>3</sub> =
500</code>, <code>M<sub>4</sub> = 2</code> (a realistic example), there are <code>1 + 1000 + (1000&nbsp;⋅&nbsp;1.5) +
(1000&nbsp;⋅&nbsp;1.5&nbsp;⋅&nbsp;500) + (1000&nbsp;⋅&nbsp;1.5&nbsp;⋅&nbsp;500&nbsp;⋅&nbsp;2) =
(1&nbsp;+&nbsp;1000&nbsp;⋅&nbsp;(1&nbsp;+&nbsp;1.5&nbsp;⋅&nbsp;(1&nbsp;+&nbsp;500&nbsp;⋅&nbsp;(1&nbsp;+&nbsp;2)))) =
2&nbsp;252&nbsp;501</code> events.

While these are extreme cases, we must take this into account.

The system we are applying this in can handle ~ 1000 events per minute (because of other infrastructure choices). In the
realistic case mentioned above, handling a change to a root resource would take ~ 2&nbsp;252 minutes = ~37 hours.
Eventually consistent is nice, but that is pushing it.

Such cases must be avoided. This will be discussed below.

## Displaying to-many associations with search for large collections

Clients, such as the UI, need to find resources that are associated with a resource that is presented, and display
information about it. This enables the user to recognize an associated resource, and navigate to it.

When the association is to-one, this is simple. The associated resource is mentioned in the resource’s `href`, as
HATEOAS link. As an example, consider a UI that displays the details of `R` resource `/your-service/v1/x/123/y/abc`. The
UI wants to display information about the one associated `X` resource `/some-service/v1/x/123`, and the one associated
`Y` resource `/my-service/v1/y/abc`. Both canonical URIs are mentioned in `R`’s `href`. The UI can retrieve both
associated resources, and display some information about the associated `X` and `Y` in the representation of `R`. Both
representations can be fitted with a clickable link, to navigate to one of the associated resources, for which the UI
knows the canonical URI (it is the one it just used, and the response to which, by the way, is probably cached).

When the association is to-many, this is more complex. Consider the UI displaying the details of `X` resource
`/some-service/v1/x/123`. The UI wants to display the collection of associated `R` resources, clickable, as part of the
details. For this, it requires information that makes it possible for the user to recognize an element of that
collection, and the URI of the represented associated resource.

In our example, `R` reifies a many-to-many relationship between `X` and `Y`. In this case, most often, the resources of
type `R` or only identified, both programmatically, as to humans, by the identity or properties of the associated `X`
and `Y`. In the example, imagine `Y` resources are identified by humans by the `name` property. When the associated `R`
resources of `X` resource `/some-service/v1/x/123` are shown in its details, the user needs to see the `name` of the `Y`
resource to which the represented `R` resource has a to-one association.

The UI can get the collection of to-many associated resources for given resource by executing a search request, with a
`mode`, on the search service, with

- `discriminators` set to the discriminator of the resource type of the elements of the collection, and
- `toOneAssociation` set to the canonical URI of the given resource.

In the example, to get the collection of associated `R` resources for `/some-service/v1/x/123`, the UI executes the
search request

```javascript
search({
  authorization: 'Bearer XXXXX',
  mode: 'example',
  flowId: '383007df-8b0f-4db3-9d4b-a17227ab7c03',
  discriminators: ['R'],
  toOneAssociation: '/some-service/v1/x/123'
})
// returns `/your-service/v1/x/123/y/abc`
```

The returned results contains information about `R` resources `/your-service/v1/x/123/y/abc` and nested information
about the associated `Y` resource `/my-service/v1/y/abc`. The UI can use this information directly to show the
instances, using, e.g., the `name` of the associated `Y` resource, without any additional requests. In the example,
there is no information about the associated `X` resources, but in this case we are displaying the collection of `R`
resources associated with 1 specific `X` `/some-service/v1/x/123`, of which we are displaying the detail, so there is no
need for this information.

The results returned from the search request are paged. The UI should offer some mechanism to navigate between the
pages.

When the collection of associated resources is large (> 20), it is difficult for users to visually find the relationship
they need. In this case, it makes sense to offer the user the possibility to limit the collection of associated
resources with search functionality. The architecture described here supports that, if the relationship search index
document has entries in `exact` or `fuzzy`. These can be entries directly from the search document of the relationship
resources, or from `embedded` resources.

In the example, search index documents with discriminator `R` support exact search on `R`’s `premium`, and `Y`’s
`registrationId`, and fuzzy search on `Y`’s `name`, `category`, and `class`.

```javascript
search({
  authorization: 'Bearer XXXXX',
  mode: 'example',
  flowId: '383007df-8b0f-4db3-9d4b-a17227ab7c03',
  discriminators: ['R'],
  toOneAssociation: '/some-service/v1/x/123',
  exact: '0123456789'
})

search({
  authorization: 'Bearer XXXXX',
  mode: 'example',
  flowId: '383007df-8b0f-4db3-9d4b-a17227ab7c03',
  discriminators: ['R'],
  toOneAssociation: '/some-service/v1/x/123',
  fuzzy: ['wuzzy', 'woo']
})
```

## Displaying to-many associations for small collections

Consider the example where the UI displays the details of `Y` resource `/my-service/v1/y/abc`. In the example, imagine
`X` resources are identified by humans by the `title` property. When the associated `R` resources of `Y` resource
`/my-service/v1/y/abc` are shown in its details, the user needs to see the `title` of the `X` resource to which the
represented `R` resource has a to-one association.

The UI can get the collection of associated `R` resources for `/my-service/v1/y/abc` with search request

```javascript
search({
  authorization: 'Bearer XXXXX',
  mode: 'example',
  flowId: '383007df-8b0f-4db3-9d4b-a17227ab7c03',
  discriminators: ['R'],
  toOneAssociation: '/my-service/v1/y/abc'
})
```

In the example, in this case, the `R` `premium` and `layer` are included in the search result, but the `X` `title` is
not. This is deliberate. The search result does contain an `x` property, with the canonical URI of the associated `X`
resource as value. The intention of this is for the UI to now retrieve the details of the associated `X` resource from
the service directly, asynchronously for each entry in the search result, and to fill out the missing information in the
visualization when the responses arive. The UI should deduplicate requests for the same `X` resource mentioned in the
collection. Note that the responses will be cached.

This is more than feasible when number of associated resources is small (< 20), or collections of medium size (< 100),
since the results are paged, and more information must only be retrieved when a new page is shown. Actually, the
inclusion of any `content` in search index documents of any resource is an optimization, that makes displaying search
results faster for the client, and reduces load on the services. The process described here for small collections, with
paging, is scaleable. It does not offer, however, a possibility to search in large collections of related resources.

Note that in the example, the UI could still offer the user the functionality to search on `R`’s `premium` with exact
search. However, if the number of associated resources is small, this functionality would never be used.

We advise to not offer search on small collections.

## Too many updates, asymmetry hypothesis

In the example, the search index document for `R` does not include information about the associated `X` resource because
this illustrates our main mitigation of the exponential explosion issue exposed above.

Imagine that, for every `X` resource we expect a large collection of related `Y` resources, but that for every `Y`
resource, the collection of related `X` resources is expected to be small (< 20).

In the example, where the `R` search index document embeds `Y` information, the `R` search index document needs to be
updated too when a `Y` resource from which information is embedded changes. Since we expect the collection of related
`X` resources for a `Y` resource is small, there will be only a few `R` search index documents that have to be updated.

When the `R` search index document would embed `X` information, it needs to be updated too when an `X` resource changes.
Since we expect the collection of related `Y` resources for a `X` to be large (imagine 10<sup>5</sup> relationships),
there would be many `R` search index documents that have to be updated. In the example, the `R` search index document
does not embed `X` information to avoid this issue, deliberately.

We hypothesize that, in practice, most many-to-many relationships have a small multiplicitly on both sides, or have
asymmetric multiplicitly: if the relationship is big in one direction, it is small in the other direction. Consider
people who are members of a club. Each club might have a large set of members, but each person will only be a member in
a small number of clubs. A bank holds accounts for many customers, but each person only has account with a limited
number of banks.

An example of a large symmetric many-to-many relationship might be international payments between banks. Every bank has
a large collection of payments (> 10<sup>10</sup>) to most other banks. In this case, the issue might not present
itself, because it seems like a far-fetched idea to create a UI where you want to show all outgoing and incoming
payments to and from another bank. If you encounter large symmetric many-to-many relationships in the business domain at
hand, other solutions must be found.

## Notes and rejected alternatives

### Move load from services to search index as much as possible

The process described above is optimized to use the search index as much as possible, where some requests could also be
replaced with calls to a life resource in a service. In the infrastructure we use, the search index is a separate
powerfull resource. It makes sense to move load from the services to the search index as much as possible.

### Limit the number of events posted

Strictly speaking, a search index document must only be updated whenever the data that is stored in it changes. In
practice this means that an update is only needed when data changes that appears in the search document’s `exact`,
`fuzzy`, or `content` (the data in `toOneAssociations` can never change with immutable relationships).

It would be possible to write code in the originating service that only posts events when data used in these search
document properties changes. In practice this is not done because it would be a lot of (possibly brittle) work for
little benefit.

### Roles in toOneAssociations

Relations in the search index as currently described, do not have the concept of a _role_. If the `toOneAssociations`
contains 2 or more canonical URIs, it is not clear what element expresses what role of the relationships. This is not an
issue when each side of the relationship is a different resource type as the structure of the canonical URI is different
for each resource type.

When the structure of the canonical URIs are the same, because the resource is the reification of a directed
relationship between resources of the same type, it is not clear what canonical URI expresses what role.

A solution to this is it to add the canonical URI of a participating resource 2 times in the `toOneAssociations`: once
as before (just the plain canonical URI) and once with the role as a prefix.

Suppose we want to store the relation `is-parent-of` in a search index document. This relation is between 2 resources of
the type person. The `toOneAssociations` list would then look as follows:

- `/persons/v1/person/105`
- `/persons/v1/person/719`
- `parent:/persons/v1/person/105`
- `child:/persons/v1/person/719`

With this information, one can still search in the same way as before, but when it is needed, one can also take into
account the role. It is both possible to search resources where `/persons/v1/person/105` participates in the relation
`is-parent-of` (no matter the role) and where `/persons/v1/person/105` fulfills the specific roles of `parent` or
`child`.

As long as all participating resources in a relationship are of a different type, the addition of a specific `role` is
not needed.

As long as there is no need for this, the role should not be added. Whenever the need is there, the role can be added on
an as-needed basis.

### Trigger updates of referencing resources in the service

In the described process, the events for _referencing_ resources are triggered by the search topic handler when handling
the original event, recursively.

Alternatively, we considered to have the service post not only the original event, but also events for all referencing
resources, recursively.

In the example, when a resource of type `Y` is updated, the service creates an event for that resource. But the service
could also, during the update, find all instances of `R` for which the search document embeds information of this
instance of `Y` and create events for each of the found `R` instances too, immediately.

This is not a good solution.

- Finding the associated referencing resources (recursively) is done synchronously during the update of the `Y`
  resource. All synchronous actions should be as fast as possible..

- The service managing the updated resource would need to know everything that embeds information of it. If an embedding
  resource is managed by another service, this creates a dependency loop between the services. If `R` embeds information
  of `Y`, this implies that the service managing `R` (`your-service`) depends on the service managing `Y`
  (`my-service`). But now the update code for `Y` in `my-service` needs to know about `R` in `your-service`, making
  `my-service` dependent on `your-service`. This is a bad architecture for distributed systems, but the reasoning also
  applies between different logical components and code constructs within one service.

We will not follow this approach.

In the described process, the service code for an update is kept simple (only one event for the updated entity itself),
and cascade updates of referencing resources are handled asynchronously, with eventual consistency, even cross-service.

### Embed content on retrieval from the search index instead of before putting it in

In the process as described, `embedded` `content`, `exact`, and `fuzzy` data is spliced in the search index document
before it is put in the search index. This requires recursive updates when an `embedded` search index document changes.

Alternatively, we could not splice this information in the search index document before we put it in the search index,
but rely on the search service to do this when search results are retrieved. This voids the need for recursive updates
when an `embedded` search index document changes, and has the added benefit that the user would always get the latest
version of `embedded` information.

However, the search service returns many matches mostly. The search service would need to retrieve the `embedded` data
for all search results in a page. We want the search to return as fast as possible. It is typical in a distributed
application to do more work when saving data (asynchronously, possibly with redundancy), to make retrieval
straigtforward and fast. Furthermore, the `embedded` content needs to be spliced in all search results _recursively_,
which could lead to exponential explosion in the search request.

Therefore, we choose to make the effort when saving the search index document, and not when retrieving it.
