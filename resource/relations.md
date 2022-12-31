Notes regarding the use of a search index for storing and searching relations.

## Search index for entities

As described elsewhere, a search index is used for searching entities. A general approach is used for storing entities
in the index, as documented in the specifications for the search-document and the search api.

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

### Supported search criteria

When performing a search for an entity, the following criteria can be used:

- `discriminator`: filter on specific types of entities
- `exact`: filter exact, the given term must match exactly one in the `exact` field, used for business keys,
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

Do note that what is stored inside the `content` field is specific for each entity type. What is stored will depend on
the needs of the UI when displaying an entity of that type.

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

## Search index for relations

Relations can be seen as a separate type of entity and can be stored in the search index in the same way as other types
of entities. Some conventions are used to make this usable.

### Core requirements

A relation can be a one-to-one, a one-to-many, or a many-to-many relation. Each record in the search index should
represent a specific instance of the relation between 2 entities. The core requirement for a relation in the search
index is that it can be used to find all relations in which a given entity participates.

Since entities are identified by their `href`, the `href` property of each participating entity should be stored in the
search record of a relation. Furthermore, these `href`s should be stored in the `exact` field of the search record,
since the search on a relation will always be done based on an exact match of the `href` of one of the participating
entities.

Search for a relation will typically filter both on the `exact` field with a `href` value and on the `discriminator`
field with the type of the relation.

#### Supported search criteria

At the bare minimum, the following criteria must be supported:

- `discriminator`: filter on specific types of relations
- `exact`: must contain the `href` of each participating entity

These criteria only support searching on the relation itself.

To support searching within relations, the search terms from one or both participating entities need to be added. For
consistency reasons, all supported search terms for the type of the participating entity should be supported within the
relation too.

As an example, take relation of type `R` with participating entities of type `X` and `Y`. To find the instances of `R`
given a `href` of an instance of `X`, the following is needed:

- `discriminator`: filter on type `R`
- `exact`: must contain the `hrefs` of both `X` and `Y`

To support searching with the relation `R` on properties of `X`, the search terms of `X` must be added in the search
record. The following is needed:

- `discriminator`: filter on type `R`
- `exact`: contains the `href`s of both `X` and `Y`, contains _exact_ search terms of `X`
- `fuzzy`: contains _fuzzy_ search terms of `X`

When search terms for one of the participating entities must be added in the search record, the system needs to retrieve
the `search-document` of that participating entity. In this case, the `search-document` for `X` is needed to obtain the
search terms of `X`.

Note that whether search terms for `X` or `Y` must be supported, depends on context and for each type of relation `R`,
it needs to be determined whether search terms for either `X` or `Y`, or both or none of them, must be supported.

### Display information through `content`

The general search record contains a `content` field, as was discussed in the section on entity types. The `content`
field is introduced as an optimization: it contains the information that the client can use to visualize a search result
without the need for extra backend calls.

The contents of the `content` field are specific for the relation type and depend on the needs of the UI for the
instance of that relation type. In the case of a relation, the `content` field can contain some metadata of the relation
itself. In many cases however, the `content` field of a relation `R` will also contain data from either `X` and/or `Y`.

Note that it is possible that `X` or `Y` are also relations, and that in that case, data is also needed from the
participating entities of that relation, such as `Ya` and `Yb`. This is possible and must be evaluated on a case-by-case
basis. If data is needed from `Ya` and `Yb`, it is recommended to also add the `href` of these entities to the `exact`
field, to make the relations searchable where these entities are used.

(REMARK: Relations as currently described works as long as a relation is not directional between entities of the same
type. Suppose that we have the relation `is-parent-of` on the entity `person`. With the current model, it is not
possible to handle this. The concrete case where `a` is parent of `b` and `b` is parent of `c`, would be stored in the
search index in exactly the same way as the case where `b` is parent of both `a` and `c`, and also in exactly the same
way as the case were `a` and `c` are both parents of `b`. The reason is that the relation is directional and between
entities of the same type.)

### When to update the search index?

The core rules for when a search record for a relation must be updated, are the same as for an entity. So, a search
record must be updated whenever the data that is inside the search record changes. This means that an update is needed
when any of the following fields changes:

- `exact`
- `fuzzy`
- `content`

As discussed earlier, when the relation itself changes, the search index must obviously be updated.

The search index must also be updated when any of the fields contains data from a participating entity and that
participating entity is updated. If one of the participating entities is a relation, and the `content` field contains
data from one of the participating entities of that relation, then the search record must also be updated when that
participating entity is updated.

Take the example from earlier on to make this concrete: relation `R` with participating entities `X` and `Y`, with `Y`
itself a relation with participation entities `Ya` and `Yb`. Suppose that `content` of `R` contains data of all
entities. When `Yb` is updated, all search records of `Y` that have that `Yb` as participating entity, need to be
updated. For each of those `Y` relations, all search records of `R` that have that `Y` as participating entity, need to
be updated.

### How approach _dependent_ updates

With dependent updates, we refer to the fact that the update of an entity (or relation) triggers not only an update of
the search record for that entity (or relation), but also for all search records that use information of that entity (or
relation) either in the search fields `exact` and `fuzzy`, or in the `content` field. In this section, we describe how
these updates can be triggered.

#### Trigger dependents in the backend services

In this approach, the search update events for the _dependents_ are triggered in the backend service during the update
of the original entity.

Take the example of relation `R` with participating entities `X` and `Y`. When `Y` is updated, the update will create a
search update event for `Y` itself. During the update, the backend will also find all instances of `R` where this
instance of `Y` is a participating entity and create search update events for each of the found `R` instances.

This is not a good solution:

- finding the needed updates is done synchronously during the update
- `Y` would need to know everything that depends on it, which is not always possible because of dependency direction (if
  `Y` is part of system `A` and system `B` depends on system `A` and contains relations that reference `Y`, these
  relations cannot be found starting from `Y`)

#### Trigger dependents inside the search event handler

In this approach, the backend service triggers only one search update event, specifically for the entity that was
updated. In that case, the search update event contains a reference to the `search-document` of the updated entity. The
search handler will retrieve the `search-document` (with a general structure) and will create or update the search
record.

Subsequently, the search handler must find all dependent relations. This can be done by searching the index with exact
match on the `exact` field with the value of the `href` of the updated entity. For each record in the search results, a
new search update event needs to be created with a reference to the search-document of that entity (or relation).

(REMARK: It might be better to introduce a new exact match field in the search record structure. This field could be
called `dependencies` and should be a list of the `href` of all entities that are needed for the data in the search
record. This would make it very easy to find all search records that need to be updated.)

This approach is preferable because it keeps the backend code simple for an update (only one search update event),

(REMARK: The search record probably should contain the `href` to the search document that was used to generate the
search record in the first place.)

#### Retrieving `content` in the context of relations

In the context of relations, the `content` field can contain some properties of the relation itself, and in addition
some data of the participating entities, and if those entities are also relations, potentially some information of those
participating entities too.

One approach for filling up the `content` field is to make it the responsibility of the backend service that implements
the `search-document`: whenever a `search-document` is requested, it is always complete and the content is also
complete. The search handler retrieves the `search-document`, transforms the incoming data and registers the search
record.

An alternative approach would be that the backend service does not add the complete content in the `search-document`,
but instead adds references to parts of the content that still need to be fetched by the search event handler. For a
relation `R` with participating entities `X` and `Y`, the `search-document` for `R` would then contain references to the
`search-document` for `X` and `Y` for the content for `X` and `Y`.

It is also possible to envision a combination of both approaches. It would make sense that the backend service adds all
content that is available within the backend service and only adds references for content that must be fetched from
another service.
