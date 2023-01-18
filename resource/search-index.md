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
|              |<---------------------| Search Index Handler |
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
- Events on the _search topic_ are handled by a _search event handler_, which creates or updates the appropriate search
  index documents in the search index. There is 1 general search event handler.
- _Clients_ send search requests to the search service, and get a paged collection of _search results_ for matches.
- The _search service_ delegates search requests to the search index, and applies authentication and authorization, and
  possibly some other work. There is 1 general search service.

Each of the components can evolve over time, with immutable deploy. At a given time several versions of each component
might exist with different _build numbers_.
