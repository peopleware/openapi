Notes regarding the use of a search index for storing and searching relationships.

## Search index for entities

As described elsewhere, a search index is used for searching entities. A general approach is used for storing entities
in the index, as documented in the specifications for the `search-document` and the search api.

As an example, take an entity `X`:

```
+----------------------+
|          Y           |
+----------------------+
| id                   |
| <<χ>> registrationId |
| <<χ>> name           |
| <<χ>> category       |
| <<χ>> ranking        |
| <<χ>> class          |
| since                |
| <<χ>> popularity     |
| <<χ>> note           |
+----------------------+
```

### Core points

There is one search index that supports all types of searchable entities.

The search index is kept up-to-date using the following general flow:

- A searchable entity is updated

- An event is pushed on the search queue with a reference to the `search-document` of the entity. This contains

  - the reference to the service,
  - the build number (so we can be sure that the search document exists as intended when the search handler processes
    the request),
  - the `mode`,
  - the reference to the entity in the service with the given `mode`, and
  - the `flowId` of the request that initiated the event.

- The search handler processes the event:
  - fetches the `search-document` that has the same structure for all entities
  - builds a document for the search index using the `search-document`
  - registers the search index document in the search index

The search index document has the following fields:

- `id`: The search index technology we use requires a unique identifier`id` of the search index document, so it can be
  updated later. Some syntax rules apply.
- `mode`: any search request happens for an exact mode
- `flowId`: added to be able to cross-reference the search index document with logs.
- `discriminator`: the type of entity, can be filtered upon with exact match
- `href`: A reference to the entity. This is used for authorization with RAAs when a search is initiated from a client.
- `exact`: a list of strings that are searchable in an exact match manner
- `fuzzy`: a list of strings that are searchable in a non-exact match manner
- `content`: A JSON string with a representation of the entity. `content` is entity type specific, and thus
  `discriminator` specific.

E.g.: A service posts an event concerning a change in a `Y` instance:

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
    "href": "/my-service/00123/v1/y/abc/search-document"
  }
}
```

The search handler retrieves the search document from the service, at the event’s `MessageBody.href`, for the given
`CustomProperties.mode`, and uses the `CustomProperties.flowId`:

```json
{
  "structureVersion": 1,
  "exact": ["0123456789"],
  "fuzzy":  ["wizzy", "woozy", "wuzzy"],
  "content": {
    "structureVersion": 1,
    "discriminator": "Y",
    "name": "wizzy",
    "category": "woozy",
    "registrationId": "0123456789",
    "ranking": 4,
    "class": "wuzzy",
    "since": "2023-01-10"
    "href": "?at=2020-01-23T15:22:39.212Z",
  }
}
```

The `content` is, more or less, what will be returned to a client when a search matches. The client uses the `content`
to show search results quickly, without additional service calls, allowing to click through to the details of a found
resource. The `content` contains the `discriminator`, so the client knows the type of the found resource. The `content`
contains the `href`, so the client knows where to get the details of the found resource.

The `href` in the search document is relative.

The search handler converts this information into a search index document. It copies the `discriminator` from the
`content` to the top level, because we need to provide the possibility for clients to search for resources of an exact
type. It creates a variant of the `href`, the _canonical_ URI, based on the relative URI in the search document
`content` and the URI of the search document from the event, where the client can find the details of the resource. The
canonical URI

- is used as `href` on the top level of the search index document, where it is used for authorization, matching a RAA,
  and
- replaces the `content.href` for the client.

The canonical URI does not include a build number of the service, since the client determines what build to use for
itself (it might not be compatible with another build). The `content.href` does add the `createdAt` of the search
document as query parameter. In the client, the user would navigate to the indexed version of the entity, and not
necessarily the latest. The search index is eventually consistent, and we want to show the user the same information as
was used in finding the entity.

An `id` with an allowed syntax is calculated from the canonical URI and the `mode`.

The `mode` is not included in the `content`. The client supplies a `mode` in a search request, and only index search
documents with that exact mode are returned.

```json
{
  "id": "my-service_v1_y_abc_example",
  "discriminator": "Y",
  "href": "/my-service/v1/y/abc",
  "flowId": "9fc6ad82-6626-4ac3-bc1c-17a3fbd5dc3f",
  "mode": "example",
  "exact": ["0123456789"],
  "fuzzy": ["wizzy", "woozy", "wuzzy"],
  "content": {
    "structureVersion": 1,
    "discriminator": "Y",
    "name": "wizzy",
    "category": "woozy",
    "registrationId": "0123456789",
    "ranking": 4,
    "class": "wuzzy",
    "since": "2023-01-10",
    "href": "/my-service/v1/y/abc?at=2020-01-23T15:22:39.212Z"
  }
}
```

### Supported search criteria

When performing a search for an entity, the following criteria can be used:

- `discriminator`: filter on specific types of entities
- `exact`: filter exact, the given term must match exactly one in the `exact` fields, used for business keys,
  identifiers, custom references, ...
- `fuzzy`: a contains search, the given term must appear as part of a member of the `fuzzy` field, used for names,
  descriptions, ...

For all search requests,

- the `mode` of the request is used with an exact match on the `mode` in the search index document, and
- the RAAs of the request’s authenticated subject are converted to a regular expression that must match the `href` of
  the search index document.

### Display information through `content`

The `content` field in the search record is introduced as an optimization. Without the `content` field, the client would
first need to perform the search on the search index and would then subsequently need to retrieve the content of each
found entity using the `href` field.

The client often needs to show a limited amount of data as part of the search result and adding that information in the
`content` field saves a call to the service for _each_ record in the search results. This makes the search for entities
faster for the client and additionally reduces load on the services.

Do note that what is stored inside the `content` field is specific for each entity type. Exactly what must be stored,
depends on the needs of the client or UI for that specific entity type.

In the example, the client would receive the `content` of the search index document:

```json
{
  "structureVersion": 1,
  "discriminator": "Y",
  "name": "wizzy",
  "category": "woozy",
  "registrationId": "0123456789",
  "ranking": 4,
  "class": "wuzzy",
  "since": "2023-01-10",
  "href": "/my-service/v1/y/abc?at=2020-01-23T15:22:39.212Z"
}
```

### When to update the search index?

As described earlier, the search record for a specific entity must be updated whenever the entity itself is updated.

Note however that strictly speaking, the search record must only be updated whenever the data that is inside the search
record changes. In practice this means that an update is needed when any of the following fields changes:

- `exact`
- `fuzzy`
- `content`

So, in other words, the search record for an entity must be updated whenever there is a change in something that can be
searched on or something that is stored in the `content` field.

It would be possible to write code for doing fine-grained updates on the search index, but in practice this is not done
because it would be a lot of (possibly brittle) work for little benefit.

## Search index for relationships

Relationships can be seen as a separate type of entity that can be stored in the search index in the same way as other
types of entities. Some conventions are needed to make this usable.

As an example, take relationship of type `R` with participating entities of type `X` and `Y`.

```
+-----+            +---------------+            +----------------------+
|  X  |-1-----0..*-|  R            |-0..*-----1-|          Y           |
+-----+            +---------------+            +----------------------+
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
```

### Core requirements

A relationship can be a one-to-one, a one-to-many, or a many-to-many relationship. Each record in the search index
should represent a specific instance of the relationship between 2 entities. The core requirement for a relationship in
the search index is that it can be used to find all relationships in which a given entity participates.

Since entities are identified by their `href`, the `href` property of each participating entity should be stored in the
search record of a relationship. Furthermore, these `href`s should be stored in the `exact` field of the search record,
since the search on a relationship will always be done based on an exact match of the `href` of one of the participating
entities.

Search for a relationship will typically filter both on the `exact` field with a `href` value and on the `discriminator`
field with the type of the relationship.

#### Remark: roles

Note that relations in the search index as currently described, do not have the concept of a "role". This means that if
the `exact` contains 2 `href`s, it is not clear which `href` fulfills which role of the relation. In practice, this is
not an issue when each side of the relation is a different entity type as the structure of the `href` is different for
each entity type.

In the case where the structure of the `href` is the same, because it is a (directed) relation between entities of the
same type, it is not clear which one of the `href`s fulfills which role. A solution to this is it to add the `href` of a
participating entity 2 times in the `exact` list: once as before (just the plain `href`) and once with the role as a
prefix.

Suppose we want to store the relation `is-parent-of` in the search index. This relation is between 2 instances of the
type `person`. The exact list would then look as follows:

- /persons/v1/person/105
- /persons/v1/person/719
- parent:/persons/v1/person/105
- child:/persons/v1/person/719

With this information, one can still use queries in the same way as before, but when it is needed, one can also take
into account the role. It is both possible to search where `/persons/v1/person/105` participates in the relation
`is-parent-of` (no matter the role) and where `/persons/v1/person/105` fulfills the specific roles of `parent` or
`child`.

As long as all participating entities in a relation are of a different type, the addition of a specific `role` is not
needed. We believe that as long as there is no need for this, the role should not be added. Whenever the need is there,
the role can be added on an as-needed basis.

#### Supported search criteria

At the bare minimum, the following criteria must be supported:

- `discriminator`: filter on specific types of relationships
- `exact`: must contain the `href` of each participating entity

These criteria only support searching on the relationship itself.

To find all `R` instances for a given `X` with `href = /x/123` in the example:

- `discriminator`: filter on type `R`
- `exact`: must contain the `href` of `X`

```javascript
search({ discriminator: 'R', exact: ['/my-service/v1/x/123'] })
```

To find all `R` instances for a given `Y` with `href = /y/abc` in the example:

- `discriminator`: filter on type `R`
- `exact`: must contain the `href` of `Y`

```javascript
search({ discriminator: 'R', exact: ['/my-service/v1/y/abc'] })
```

The search index document for `R` looks like:

E.g.:

```json
{
  "id": "my-service_v1_x_123_y_abc_example",
  "discriminator": "R",
  "href": "/my-service/v1/x/123/y/abc",
  "flowId": "5c10b07f-4327-4dfb-9913-12338123900f",
  "mode": "example",
  "exact": ["/my-service/v1/x/123", "/my-service/v1/y/abc"],
  "fuzzy": …,
  "content": …
}
```

To go one step further and support searching within relationships using terms that refer to the participating entities
in the relationship, search terms for the participating entities we want to filter need to be added. For consistency
reasons, it is recommended to support all search terms that are available when search on the entity itself.

To support searching within the relationship `R` on properties of `Y`, the search terms of `Y` must be added in the
search record. The following is needed:

- `discriminator`: filter on type `R`
- `exact`: contains the `href` of `X`, contains the _exact_ search terms of `Y`
- `fuzzy`: contains _fuzzy_ search terms of `Y`

When search terms for one of the participating entities must be added in the search record, somewhere the system needs
to retrieve the `search-document` of that participating entity. In this case, the `search-document` for `Y` is needed to
obtain the search terms of `Y`.

E.g., with a search index document for `R` that looks like:

```json
{
  "id": "my-service_v1_x_123_y_abc_example",
  "discriminator": "R",
  "href": "/my-service/v1/x/123/y/abc",
  "flowId": "5c10b07f-4327-4dfb-9913-12338123900f",
  "mode": "example",
  "exact": ["/my-service/v1/x/123", "/my-service/v1/y/abc", "0123456789"],
  "fuzzy": ["wizzy", "woozy"],
  "content": …
}
```

it is possible to search on relationship `R` using search terms that refer to `Y`, for a given `X`.

```javascript
search({
  discriminator: 'R',
  // must match '/x/123` and '0123456789', which is a property value of Y
  exact: ['/my-service/v1/x/123', '0123456789']
})

search({
  discriminator: 'R',
  // must match '/x/123`
  exact: ['/my-service/v1/x/123'],
  // fuzzy match properties of related Y
  fuzzy: ['wizzy', 'woo']
})
```

This is useful in a relationship where you expect dozens of relationships `R` for a given entity `X`: the amount of
relationships found can be further restricted by adding search terms that apply to `Y`.

Whether it is useful to add search terms of the participating entities depends on context. It makes little sense to add
search functionality when we expect less than 20 relationships. For each type of relationship `R` it needs to be
determined whether search terms for either `X` or `Y`, or both or none of them, must be added. In the example, we
imagine there are only a few instances of `X` related to an instance of `Y`, which makes searching superfluous, but many
instances of `Y` related to an instance of `X`, which makes searching functionaly relevant.

### Display information through `content`

The general search record contains a `content` field, as was discussed in the section on entity types. The `content`
field is introduced as an optimization: it contains the information that the client can use to visualize a search result
without the need for extra service calls.

The contents of the `content` field are specific for the relationship type and depend on the needs of the UI for the
instance of that relationship type. The `content` of a relationship field can contain some metadata of the relationship
itself. In many cases however, the `content` field of a relationship `R` will also contain data from either `X` and/or
`Y`.

E.g.,

```json
{
  "id": "my-service_v1_x_123_y_abc_example",
  "discriminator": "R",
  "href": "/my-service/v1/x/123/y/abc",
  "flowId": "5c10b07f-4327-4dfb-9913-12338123900f",
  "mode": "example",
  "exact": ["/my-service/v1/x/123", "/my-service/v1/y/abc", "0123456789"],
  "fuzzy": ["wizzy", "woozy"],
  "content": {
    "layer": "optimized",
    "premium": 7457,
    "yName": "wizzy",
    "yCategory": "woozy",
    "yRegistrationId": "0123456789"
  }
}
```

Note that it is possible that `X` or `Y` are also relationships, and that in that case, data is also needed from the
participating entities of that relationship, such as `YA` and `YB`. This is possible and must be evaluated case-by-case.
If data is needed from `YA` and `YB`, it is recommended to also add the `href` of these entities to the `exact` field,
to make the relationships where entities are used, discoverable through the search index.

### When to update the search index?

The core rules for when a search record for a relationship must be updated, are the same as for an entity. So, a search
record must be updated whenever the data that is inside the search record changes. This means that an update is needed
when any of the following fields changes:

- `exact`
- `fuzzy`
- `content`

As discussed earlier, when the relationship itself changes, the search index must be updated.

The search index must also be updated when any of the fields contains data from a participating entity and that
participating entity is updated. If one of the participating entities is a relationship, and the `content` field
contains data from one of the participating entities of that relationship, then the search record must also be updated
when that participating entity is updated.

Take the example from earlier on to make this concrete: relationship `R` with participating entities `X` and `Y`, with
`X` itself a relationship with participation entities `YA` and `YB`. Suppose that `content` of `R` contains data of all
entities. When `YB` is updated, all search records of `Y` that have that `YB` as participating entity, need to be
updated. For each of those `Y` relationships, all search records of `R` that have that `Y` as participating entity, need
to be updated.

The example explicitly does not contain data related to `X`. If it would, the relationship search index record would
need to be updated to when that information in `/x/123` changes. Since we imagine in the example that there are only a
few instances of `X` related to an instance of `Y`, search for properties of `X` is functionally irrelevant. Since we
imagine many instances of `Y` related to an instance of `X`, there would be many instance of `R` for a given `X`,
resulting in many necessary updates. Not having information about `X` that can change in the search index record for `R`
avoids this issue.

### How to approach _dependent_ updates

With dependent updates, we refer to the fact that the update of an entity (or relationship) triggers not only an update
of the search record for that entity (or relationship), but also for all search records that use information of that
entity (or relationship) either in the search fields `exact` and `fuzzy`, or in the `content` field. In this section, we
describe how these updates can be processed.

#### Trigger dependents in the service (bad idea)

In this approach, the search update events for the _dependents_ are triggered in the service during the update of the
original entity.

Take the example of relationship `R` with participating entities `X` and `Y`. When `Y` is updated, the update will
create a search update event for `Y` itself. During the update, the backend will also find all instances of `R` where
this instance of `Y` is a participating entity and create search update events for each of the found `R` instances.

This is not a good solution:

- finding the needed updates is done synchronously during the update of `Y`
- `Y` would need to know everything that depends on it, which is not always possible because of dependency direction (if
  `Y` is part of system `A` and system `B` depends on system `A` and contains relationships that reference `Y`, these
  relationships cannot be found starting from `Y`)

We will not follow this approach.

#### Trigger dependents inside the search event handler (better)

In this approach, the service triggers only one search update event, specifically for the entity that was updated. In
that case, the search update event contains a reference to the `search-document` of the updated entity.

Suppose, in the example, `Y` gets updated:

```json
{
  "MessageProperties": {
    "CustomProperties": {
      "flowId": "a2d890b1-fa83-4bbf-bc26-15ab282b2e00",
      "mode": "example"
    }
  },
  "MessageBody": {
    "structureVersion": 1,
    "href": "/my-service/00123/v1/y/abc/search-document"
  }
}
```

The search handler will retrieve the `search-document` for `Y` (with a general structure) and will create or update the
search index document, as described above.

```json
{
  "structureVersion": 1,
  "exact": ["0123456789"],
  "fuzzy":  ["wizzy", "woozy", "wuzzy"],
  "content": {
    "structureVersion": 1,
    "discriminator": "Y",
    "name": "wizzy",
    "category": "woozy",
    "registrationId": "0123456789",
    "ranking": 4,
    "class": "wuzzy",
    "since": "2023-01-10"
    "href": "?at=2023-01-173T15:22:39.212Z"
  }
}
```

```json
{
  "id": "my-service_v1_y_abc_example",
  "discriminator": "Y",
  "href": "/my-service/v1/y/abc",
  "flowId": "a2d890b1-fa83-4bbf-bc26-15ab282b2e00",
  "mode": "example",
  "exact": ["0123456789"],
  "fuzzy": ["wizzy", "woozy", "wuzzy"],
  "content": {
    "structureVersion": 1,
    "discriminator": "Y",
    "name": "wizzy",
    "category": "woozy",
    "registrationId": "0123456789",
    "ranking": 4,
    "class": "wuzzy",
    "since": "2023-01-10",
    "href": "/my-service/v1/y/abc?at=2023-01-173T15:22:39.212Z"
  }
}
```

Subsequently, the search handler must find all dependent entities (`R` in the example). This can be done by searching
the _index_ with exact match on the `exact` field (and the `mode` from the event) with the value of the `href` of the
updated entity (`Y`).

```javascript
search({
  exact: ['/my-service/v1/y/abc']
})
```

The search result will contain search index documents for instances of `R` related to `/my-service/v1/y/abc`, but also
of other relationships dependent on `Y` (e.g., `S`, `T`, `U`, …).

For each record in the search results, a new search update event needs to be created with a reference to the
`search-document` of that entity (or relationship).

For `R`:

```json
{
  "MessageProperties": {
    "CustomProperties": {
      "flowId": "a2d890b1-fa83-4bbf-bc26-15ab282b2e00",
      "mode": "example"
    }
  },
  "MessageBody": {
    "structureVersion": 1,
    "href": "/my-service/00068/v1/x/123/y/abc/search-document"
  }
}
```

Since the reference to the `search-document` is needed, this reference must be stored in the search record in the index.
The property `source` is added for this: it contains the `href` of the `search-document` , _including the build number
of the service_, from which the search index record was created.

<div style="background-color: red; color: yellow; padding: 5mm;"><strong>// MUDO: </strong> Don’t agree: this could
be a very old build that no longer exists. Use
the
build number from the original event? But that will not work cross-service.</div>

```json
{
  "id": "my-service_v1_x_123_y_abc_example",
  "discriminator": "R",
  "href": "/my-service/v1/x/123/y/abc",
  "flowId": "5c10b07f-4327-4dfb-9913-12338123900f",
  "mode": "example",
  "exact": ["/my-service/v1/x/123", "/my-service/v1/y/abc", …],
  "fuzzy": […],
  "content": {
    "layer": "optimized",
    "premium": 7457,
    …
  },
  "source": "my-service/00068/v1/x/123/y/abc/search-document"
}
```

It makes sense to apply an extra filter on the relationships that must be searched in the index. The `search-document`
and search index document of an entity will be extended with a property `dependents`. This property contains an array of
discriminators that must be added as extra filter when searching the `href` on the `exact` field.

```json
{
  "structureVersion": 1,
  "exact": ["0123456789"],
  "fuzzy":  ["wizzy", "woozy", "wuzzy"],
  "content": {
    "structureVersion": 1,
    "discriminator": "Y",
    "name": "wizzy",
    "category": "woozy",
    "registrationId": "0123456789",
    "ranking": 4,
    "class": "wuzzy",
    "since": "2023-01-10"
    "href": ".?at=2023-01-173T15:22:39.212Z"
  },
  "dependents": ["R"]
}
```

```javascript
search({
  discriminator: 'R',
  exact: ['/my-service/v1/y/abc']
})
```

<div style="background-color: red; color: yellow; padding: 5mm;"><strong>// MUDO: </strong> Contentious: this seems
brittle. Is it worth the effort? What if this is cross-service? Now we have a dependency loop between 2 services.
Isn’t it better to split `exact`, and use a new field `dependencies`, where we store `["/my-service/v1/x/123",
"/my-service/v1/y/abc"]`, separate from `exact`? This is also a form of meta-information, but `R` stays in control.
</div>

This approach is preferable because it keeps the service code simple for an update (only one search update event for the
updated entity itself), and cascade updates are handled asynchronously.

##### Optimization

It is clear that this process could cause recursion if we are not careful. A good architecture and design should not
contain dependency cycles, but an extra stop criterion will protect us. To prevent running into update loops and
optimize the updates that are executed on the search index, an extra field `updatedAt` is added to the search index
document, that contains the value found in the `x-date` headers that is returned with the `search-document` request from
which the search index document is created.

```json
{
  "id": "my-service_v1_x_123_y_abc_example",
  "discriminator": "R",
  "href": "/my-service/v1/x/123/y/abc",
  "flowId": "5c10b07f-4327-4dfb-9913-12338123900f",
  "mode": "example",
  "exact": ["/my-service/v1/x/123", "/my-service/v1/y/abc", "0123456789"],
  "fuzzy": ["wizzy", "woozy"],
  "content": {
    "layer": "optimized",
    "premium": 7457,
    …
  },
  "source": "my-service/00068/v1/x/123/y/abc/search-document",
  "dependents": [],
  "updatedAt": "2022-12-27T03:14:22.212775Z"
}
```

When searching for dependents, an extra filter is added on this new `updatedAt` field: only those dependents are
considered that are older than the `updatedAt`.

```javascript
search({
  discriminator: 'R',
  exact: ['/my-service/v1/y/abc'],
  updatedAt: '2023-01-173T15:22:39.212800Z'
})
```

When creating search update events in the context of _dependents processing_, this timestamp should also be added in the
event.

```json
{
  "MessageProperties": {
    "CustomProperties": {
      "flowId": "a2d890b1-fa83-4bbf-bc26-15ab282b2e00",
      "mode": "example"
    }
  },
  "MessageBody": {
    "structureVersion": 1,
    "href": "/my-service/00068/v1/x/123/y/abc/search-document",
    "updatedAt": "2023-01-173T15:22:39.212800Z"
  }
}
```

#### Retrieving `content`, `fuzzy`, and `exact`, in the context of relationships

In the context of relationships, the `content`, `fuzzy`, and `exact` fields can contain some properties of the
relationship itself, and in addition some data of the participating entities (and if those entities are also
relationships, potentially some information of those participating entities too, recursively). In the example above, the
search index record `content` for `R` contains information about `Y`:

```json
{
  "id": "my-service_v1_x_123_y_abc_example",
  "discriminator": "R",
  "href": "/my-service/v1/x/123/y/abc",
  "flowId": "5c10b07f-4327-4dfb-9913-12338123900f",
  "mode": "example",
  "exact": ["/my-service/v1/x/123", "/my-service/v1/y/abc", "0123456789"],
  "fuzzy": ["wizzy", "woozy"],
  "content": {
    "layer": "optimized",
    "premium": 7457,
    "yName": "wizzy",
    "yCategory": "woozy",
    "yRegistrationId": "0123456789"
  },
  "dependents": [],
  "source": "my-service/00068/v1/x/123/y/abc/search-document",
  "updatedAt": "2022-12-27T03:14:22.212775Z"
}
```

One approach for filling up the `content` field is to make it the responsibility of the service that implements the
`search-document`: whenever a `search-document` is requested, it is always complete and the content is also complete.
The search handler retrieves the `search-document`, transforms the incoming data and registers the search index
document.

An alternative approach would be that the service does not add the complete content in the `search-document`, but
instead adds references to parts of the content that still need to be fetched by the search event handler. For a
relationship `R` with participating entities `X` and `Y`, the `search-document` for `R` would then contain references to
the `search-document` for `X` and / or `Y` for information from `X` and / or `Y`.

It is also possible to envision a combination of both approaches. It would make sense that the service adds all content
that is readily available within that service (participating entities that are available in the same service) and only
adds references for content that must be fetched from another service. A data structure could be created to handle this
in a transparent way.

This is the approach that we will follow. The `search-document` is extended with the field `referencedContent`. This
field contains an object. The value of each property of this object is a `href` to a `search-document`, including the
build number of the service to use.

<div style="background-color: red; color: yellow; padding: 5mm;"><strong>// MUDO: </strong> Impossible with the
currect approach: `my-service` does not know what build to use for `your-service`. That’s in bookmarkable in the
current way of working.</div>

```json
{
  "structureVersion": 1,
  "href": "/my-service/v1/x/123/y/abc",
  "exact": ["/my-service/v1/x/123", "/my-service/v1/y/abc"],
  "fuzzy": ["wizzy", "woozy"],
  "content": {
    "structureVersion": 1,
    "discriminator": "R",
    "layer": "optimized",
    "premium": 7457,
    "href": "?at=2023-01-173T15:22:39.212Z"
  },
  "dependents": [],
  "referencedContent": {
    "y": "/my-service/00068/v1/y/abc/search-document"
  }
}
```

The `content` object that is retrieved from the original `search-document` must be enriched with properties matching the
properties of `referencedContent`. The value of these properties must be the value of the `content` of the referenced
`search-document`. Aside from that, for each `search-document` in `referencedContent`, both the `exact` and `fuzzy`
fields must be taken and added to the `exact` and `fuzzy` fields of the original `search-document`.

To summarize, the `referencedContent` must be merged in the original `search-document` that can then be used as the base
for the new search index document. The `exact` and `fuzzy` terms in the referenced `search-document`s must be added in
the original `exact` and `fuzzy` terms, and the `content` from the original must be enriched with the `content` of the
referenced `search-document`s.

```json
{
  "id": "my-service_v1_x_123_y_abc_example",
  "discriminator": "R",
  "href": "/my-service/v1/x/123/y/abc",
  "flowId": "5c10b07f-4327-4dfb-9913-12338123900f",
  "mode": "example",
  "exact": ["/my-service/v1/x/123", "/my-service/v1/y/abc", "0123456789"],
  "fuzzy": ["wizzy", "woozy"],
  "content": {
    "layer": "optimized",
    "premium": 7457,
    "y": {
      "name": "wizzy",
      "category": "woozy",
      "registrationId": "0123456789",
      "ranking": 4,
      "class": "wuzzy",
      "since": "2023-01-10"
    }
  },
  "dependents": [],
  "source": "my-service/00068/v1/x/123/y/abc/search-document",
  "updatedAt": "2022-12-27T03:14:22.212775Z"
}
```
