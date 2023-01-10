Notes regarding the use of a search index for storing and searching relationships.

## Search index for entities

As described elsewhere, a search index is used for searching entities. A general approach is used for storing entities
in the index, as documented in the specifications for the `search-document` and the search api.

As an example, take an entity `X`:

```
+------------------+
|        Y         |
+------------------+
| registrationId   |
| <<χ>> name       |
| <<χ>> category   |
| <<χ>> ranking    |
| since            |
| <<χ>> popularity |
| <<χ>> note       |
+------------------+
```

### Core points

The main points are the following:

- there is one search index that supports all types of searchable entities
- the search index is kept up-to-date using the following general flow
  - searchable entity is updated
  - event is pushed on the search queue with a reference to the `search-document` of the entity
  - search handler processes the event
    - fetches the `search-document` that has the same structure for all entities
    - builds a record for the search index using the `search-document`
    - registers the record in the search index
- the record for the search index has the following fields
  - `discriminator`: the type of entity, can be filtered upon with exact match
  - `href`: a reference to the entity, can be filtered upon with exact match
  - `exact`: a list of strings that are searchable in an exact match manner
  - `fuzzy`: a list of strings that are searchable in a non-exact match manner
  - `content`: a JSON string with a representation of the entity, content is entity type specific, and thus
    `discriminator` specific

E.g.:

```json
{
  "discriminator": "Y",
  "href": "/y/abc",
  "exact": ["0123456789"],
  "fuzzy": ["wizzy", "woozy"],
  "content": {
    "name": "wizzy",
    "category": "woozy",
    "registrationId": "0123456789",
    "ranking": 4,
    "since": "2023-01-10"
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

### Display information through `content`

The `content` field in the search record is introduced as an optimization. Without the `content` field, the client would
first need to perform the search on the search index and would then subsequently need to retrieve the content of each
found entity using the `href` field.

The client often needs to show a limited amount of data as part of the search result and adding that information in the
`content` field saves a call to the backend for _each_ record in the search results. This makes the search for entities
faster for the client and additionally reduces load on the backend services.

Do note that what is stored inside the `content` field is specific for each entity type. Exactly what must be stored,
depends on the needs of the client or UI for that specific entity type.

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
+-----+            +-----+            +-----+
|  X  |-1-----0..*-|  R  |-0..*-----1-|  Y  |
+-----+            +-----+            +-----+
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

#### Supported search criteria

At the bare minimum, the following criteria must be supported:

- `discriminator`: filter on specific types of relationships
- `exact`: must contain the `href` of each participating entity

These criteria only support searching on the relationship itself.

To find all `R` instances for a given `X` with `href = /x/123` in the example:

- `discriminator`: filter on type `R`
- `exact`: must contain the `href` of `X`

```
search({discriminator: 'R', exact: ['/x/123`]})
```

To find all `R` instances for a given `Y` with `href = /y/abc` in the example:

- `discriminator`: filter on type `R`
- `exact`: must contain the `href` of `Y`

```
search({discriminator: 'R', exact: ['/y/abc`]})
```

The record in the search index for `R` looks like:

E.g.:

```json
{
  "discriminator": "R",
  "href": "/x/123/y/abc",
  "exact": ["/x/123", "/y/abc"],
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

When search terms for one of the participating entities must be added in the search record, the system needs to retrieve
the `search-document` of that participating entity. In this case, the `search-document` for `Y` is needed to obtain the
search terms of `Y`.

The record in the search index for `R` looks like:

E.g.:

```json
{
  "discriminator": "R",
  "href": "/x/123/y/abc",
  "exact": ["/x/123", "/y/abc", "0123456789"],
  "fuzzy": ["wizzy", "woozy"],
  "content": …
}
```

Using this it is possible to search on relationship `R` using search terms that refer to `Y`, for a given `X`.

```
search({
  discriminator: 'R',
  // must match '/x/123` and '0123456789', which is a property value of Y
  exact: ['/x/123`, '0123456789'],
  // fuzzy match properties of related Y
  fuzzy: ['wizzy', 'woo']
})
```

This is useful in a relationship where you expect dozens of relationships `R` for a given entity `X`: the amount of
relationships found can be further restricted by adding search terms that apply to `Y`.

Whether it is useful to add search terms of the participating entities depends on context. It makes little sense to add
search functionality when we expect less than 20 relationships. For each type of relationship `R` it needs to be
determined whether search terms for either `X` or `Y`, or both or none of them, must be added.

### Display information through `content`

The general search record contains a `content` field, as was discussed in the section on entity types. The `content`
field is introduced as an optimization: it contains the information that the client can use to visualize a search result
without the need for extra backend calls.

The contents of the `content` field are specific for the relationship type and depend on the needs of the UI for the
instance of that relationship type. The `content` of a relationship field can contain some metadata of the relationship
itself. In many cases however, the `content` field of a relationship `R` will also contain data from either `X` and/or
`Y`.

Note that it is possible that `X` or `Y` are also relationships, and that in that case, data is also needed from the
participating entities of that relationship, such as `Ya` and `Yb`. This is possible and must be evaluated case-by-case.
If data is needed from `Ya` and `Yb`, it is recommended to also add the `href` of these entities to the `exact` field
(or, see further, a `dependencies` field), to make the relationships where entities are used, discoverable through the
search index.

(REMARK: Relationships in the search index as currently described do not work for directional relationships between
entities of the same type. Suppose that we have the relationship `is-parent-of` on the entity `person`. With the current
model, it is impossible to handle this because the direction of the relationship is not stored in the index and the
direction cannot be derived from the types of the participating entities. When `a` is parent of `b` and `b` is parent of
`c` would be stored in the search index in the same way as when `b` is parent of both `a` and `c`, and also in the same
way as when `a` and `c` are both parents of `b`. The reason is that the relationship is directional and between entities
of the same type.)

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
`Y` itself a relationship with participation entities `Ya` and `Yb`. Suppose that `content` of `R` contains data of all
entities. When `Yb` is updated, all search records of `Y` that have that `Yb` as participating entity, need to be
updated. For each of those `Y` relationships, all search records of `R` that have that `Y` as participating entity, need
to be updated.

### How to approach _dependent_ updates

With dependent updates, we refer to the fact that the update of an entity (or relationship) triggers not only an update
of the search record for that entity (or relationship), but also for all search records that use information of that
entity (or relationship) either in the search fields `exact` and `fuzzy`, or in the `content` field. In this section, we
describe how these updates can be processed.

#### Trigger dependents in the backend services

In this approach, the search update events for the _dependents_ are triggered in the backend service during the update
of the original entity.

Take the example of relationship `R` with participating entities `X` and `Y`. When `Y` is updated, the update will
create a search update event for `Y` itself. During the update, the backend will also find all instances of `R` where
this instance of `Y` is a participating entity and create search update events for each of the found `R` instances.

This is not a good solution:

- finding the needed updates is done synchronously during the update of `Y`
- `Y` would need to know everything that depends on it, which is not always possible because of dependency direction (if
  `Y` is part of system `A` and system `B` depends on system `A` and contains relationships that reference `Y`, these
  relationships cannot be found starting from `Y`)

We will not follow this approach.

#### Trigger dependents inside the search event handler

In this approach, the backend service triggers only one search update event, specifically for the entity that was
updated. In that case, the search update event contains a reference to the `search-document` of the updated entity. The
search handler will retrieve the `search-document` (with a general structure) and will create or update the search
record.

Subsequently, the search handler must find all dependent relationships. This can be done by searching the index with
exact match on the `exact` field with the value of the `href` of the updated entity. For each record in the search
results, a new search update event needs to be created with a reference to the `search-document` of that entity (or
relationship).

Since the reference to the `search-document` is needed, this reference must be stored in the search record in the index.
The property `source` is added for this: it contains the (versioned) `href` to the `search-document` that was used to
create the search record.

It makes sense to apply an extra filter on the relationships that must be searched in the index. The `search-document`
of an entity will be extended with a property `dependents`. This property contains an array of discriminators that must
be added as extra filter when searching the `href` on the `exact` field.

This approach is preferable because it keeps the backend code simple for an update (only one search update event for the
updated entity itself).

#### Retrieving `content` in the context of relationships

In the context of relationships, the `content` field can contain some properties of the relationship itself, and in
addition some data of the participating entities, and if those entities are also relationships, potentially some
information of those participating entities too.

One approach for filling up the `content` field is to make it the responsibility of the backend service that implements
the `search-document`: whenever a `search-document` is requested, it is always complete and the content is also
complete. The search handler retrieves the `search-document`, transforms the incoming data and registers the search
record.

An alternative approach would be that the backend service does not add the complete content in the `search-document`,
but instead adds references to parts of the content that still need to be fetched by the search event handler. For a
relationship `R` with participating entities `X` and `Y`, the `search-document` for `R` would then contain references to
the `search-document` for `X` and `Y` for the content for `X` and `Y`.

It is also possible to envision a combination of both approaches. It would make sense that the backend service adds all
content that is readily available within that backend service (participating entities that are available in the same
service) and only adds references for content that must be fetched from another service. A data structure could be
created to handle this in a transparent way.

This is the approach that we will follow. The `search-document` is extended with the field `referencedContent`. This
field contains an object. The value of each property of this object is a (versioned) `href` to a `search-document`. The
`content` object that is retrieved from the original `search-document` must be enriched with properties matching the
properties of `referencedContent`. The value of these properties must be the value of the `content` of the referenced
`search-document`. Aside from that, for each `search-document` in `referencedContent`, both the `exact` and `fuzzy`
fields must be taken and added to the `exact` and `fuzzy` fields of the original `search-document`.

To summarize, the `referencedContent` must be merged in the original `search-document` that can then be used as the base
for the new search record in the index. The `exact` and `fuzzy` terms in the referenced `search-document`s must be added
in the original `exact` and `fuzzy` terms, and the `content` from the original must be enriched with the `content` of
the referenced `search-document`s.
