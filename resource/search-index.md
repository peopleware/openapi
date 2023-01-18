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

A resource `Y` has a number of _zeitliche_ (χ) and _unzeitliche_ properties. We will first discuss searching for
instances of `Y` in isolation. `Y` is in a many-to-many relationship with `X`, which is reified in `R`: each instance of
`R` is associated with exactly one instance of `X` and `Y`, and `X` and `Y` can optionally participate in many instances
of `R`. A resource `R` has a number of _zeitliche_ and _unzeitliche_ properties. We will discuss showing the collection
of instances of `R` in which an instance of `X`, or `Y`, participates, in the detail representation of `X`, respectively
`Y`, in the UI. Next, we will discuss searching in this collection of `X`. For this, we will need to revisit searching
for instances of `Y` in the context of the relationship. `YA` and `YB` are used as illustration in this discussing for
the recursive behavior of this issue.

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

_Services_ are triggered from outside, by a client, to create or update a resource in a given `mode`. After this is done
and committed, the service posts a minimal event on the _search topic_ for asynchronous processing.

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

When a service, such as `your-service` , or the search topic handler, accesses other services, e.g., `my-service`, the
build number is determined from the `mode` using _deployment configuration_. Deployment parameters might mention that
build number `00432` of `my-service` must be used in a `qa-023` mode, and build `LATEST` must be used in mode
`dev-experiment`.

## Events

Events have the following properties:

- `structureVersion`: an integer describing the version of this data structure

- `mode`: The `mode` in which the resource that was created or updated resides.

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
      "mode": "example"
    }
  },
  "MessageBody": {
    "structureVersion": 1,
    "href": "/my-service/v1/y/abc/search-document"
  }
}
```
