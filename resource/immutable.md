This API is geared to the use of immutable data: once a resource is created, it cannot be changed or deleted.

Combined with time stamped and attributed data, this enables full audit. When data is added to the system, with the data
is recorded when the data was added, and by whom. Since the system does not support changing or deleting data, all
changes can be reviewed over the entire lifetime of the system.

## Changing knowledge about the real-world: knowledge time

Of course, the real-world objects the data represents often do change, and the system needs to be able to record those
changes. Furthermore, the data in the system only represents the real-world object, and this representation might be
incorrect, due to administrative errors, or other mistakes. In general, data in a computer system at any time _is not_
the real-world object, nor _a representation_ of the real-world object, but _a representation of what the system knows
or believes to be true about the real-world object at that time_. This can change both because the properties of the
real-world object change in reality, or because the knowledge in the system about the real-world object is corrected or
updated, without a change in the real-world object itself. Even if the change in the represented knowledge is a
consequence of a change in reality, that change is not recorded at the same time the change happens in reality (except
when the data in the system defines the reality, and changes take immediate effect). The system cannot know anything
about the real-world object directly, but only its knowledge about it at a given time. Whether a change in the system's
knowledge occured because of a correction of a “wrong” representation, or because of a change in the represented
real-world object, is irrelevant.

The time axis over which the knowledge the system has about a real-time object is called _knowledge time_, represented
as t<sub>γ</sub>.

Consider the evolution of the knowledge the system has about the first name, date-of-birth, and a score of a person as
an example:

| t<sub>γ</sub>               | id      | first name | date-of-birth | score | version |
| --------------------------- | ------- | ---------- | ------------- | ----- | ------- |
| 2018-04-22T22:04:45.005489Z | 8763478 | John       | 1940-11-09    | 9     | 1       |
| 2020-10-12T14:22:10.125680Z | 8763478 | John       | 1940-12-09    | 9     | 2       |
| 2021-03-30T10:58:11.448841Z | 8763478 | Paul       | 1940-12-09    | 9     | 3       |
| 2021-05-01T16:00:04.789958Z | 8763478 | John       | 1940-10-09    | 9     | 4       |
| 2022-11-16T08:36:56.558557Z | 8763478 | Ringo      | 1940-10-09    | 9     | 5       |
| 2022-12-14T12:08:09.545187Z | 8763478 | Ringo      | 1943-02-25    | 9     | 6       |
| 2022-12-24T11:13:06.668900Z | 8763478 | George     | 1943-02-25    | 9     | 7       |

Note that _t<sub>γ</sub> < `now`_.

We say that the properties `first name`, `date-of-birth` and `score`, are _zeitlich_, denoted _χ_, i.e., their values
are a function of t<sub>γ</sub>:

> p.χ(t<sub>γ</sub>) → (`first name`, `date-of-birth`, `score`)

[_Unzeitliche properties_](https://mickindex.sakura.ne.jp/wittgenstein/witt_tlp_gm.html#LocalLink-c6.4311), such as the
`id`, have no time parameter in the function:

> p() → (`id`)

This is different from a property that _is_ a function of t<sub>γ</sub>, yet happens to have the same value for all
values of t<sub>γ</sub> _until now_, such as `score` in the example. The values for _unzeitliche_ properties are set at
creation, and can never change. This always applies to business keys, and occasionally to other properties.

Note that changes in our knowledge about a property of a real-world object might propagate over the system. When
decisions were made that are _persisted or communicated_, we need to revisit those decisions. We now believe the
information those decisions were based on is different from what we thought it was when we made the decision. We should
re-evaluate the decision based on the updated information, and possibly take corrective actions, recursively. The system
is [_non-monotonic_](https://en.wikipedia.org/wiki/Non-monotonic_logic). Since this propagation is recursive, and
corrective actions might be difficult or impossible, decisions should be made as little as possible, i.e., just-in-time,
and not be persisted if there is no need to communicate them outside the system.

### API

In this system, a resource conceptually represents _not_ the real-world object, but the knowledge the system has about
the real world object at a given t<sub>γ</sub>, i.e., a _version_ of the representation of the real-world object.

1 particular resource is identified by a URI with the query parameter `at` that has a knowledge date as value. E.g.,

```http request
GET /api/person/8763478?at=2021-07-03T09:54:54.005480Z
```

returns version `4` from the example above. The default value for `at` is `now`. Thus,

```http request
GET /api/person/8763478
```

returns version `7`.

```http request
GET /api/person/8763478/history
```

returns a list of all the versions the system has.

Knowledge about the real-world object is updated with `PUT`, and adds a version to the history:

```http request
PUT /api/person/8763478
```

Knowledge about a new object is added to the system with `PUT` when a business key exists and can be used.

```http request
PUT /api/person/ac13118
```

If not, knowledge about new objects is added using `POST`, and the system returns the URI of the new resource in the
`location` header:

```http request
POST /api/person

location: /api/person/4fbfafe
```

## Evolution of real-world objects: applicability time

Often, the system functionally not only requires the most up-to-date knowledge about a real-world object, but also how
its properties evolved over time. In the example above, changes in the `date-of-birth` would only represent changes in
our knowledge about a real-world property. Changes in the `first name` or `score` could represent both changes in our
knowledge about it (and thus represent administrative errors and corrections), or _a change of the first name of the
person in the real world_.

These changes happen on another time axis, the _applicability time_, t<sub>ε</sub>, and is always interval-based: the
`first name` and `score` of a person are applicable during a certain interval. The applicability intervals form a
sequence. The value of the property of the resource is _not a simple value_, but _a sequence of values_.

> p.χ(t<sub>γ</sub>) → (sequence(`first name`), `date-of-birth`, sequence(`score`)).

| t<sub>γ</sub>               | id      | first name start | first name end | first name | date-of-birth | score start | score end   | score | version |
| --------------------------- | ------- | ---------------- | -------------- | ---------- | ------------- | ----------- | ----------- | ----- | ------- |
| 2018-04-22T22:04:45.005489Z | 8763478 | [1940-11-09      | …[             | John       | 1940-11-09    |             |             |       | 1       |
| 2020-10-12T14:22:10.125680Z | 8763478 | [1940-12-09      | …[             | John       | 1940-12-09    |             |             |       | 2       |
| 2021-03-30T10:58:11.448841Z | 8763478 | [1940-12-09      | …[             | Paul       | 1940-12-09    | [1961-02-11 | …[          | 9     | 3       |
| 2021-05-01T16:00:04.789958Z | 8763478 | [1940-10-09      | …[             | John       | 1940-10-09    | [1961-02-09 | …[          | 9     | 4       |
| 2022-11-16T08:36:56.558557Z | 8763478 | [1940-10-09      | 1982-08-08[    | John       | 1940-10-09    | [1961-02-09 | …[          | 9     | 5       |
|                             |         | [1982-08-08      | …[             | Ringo      |               |             |             |       |         |
| 2022-12-14T12:08:09.545187Z | 8763478 | [1940-10-09      | 1982-08-08[    | John       | 1943-02-25    | [1961-02-09 | 1969-01-30[ | 9     | 6       |
|                             |         | [1982-08-08      | …[             | Ringo      |               |             |             |       |         |
| 2022-12-24T11:13:06.668900Z | 8763478 | [1943-02-25      | 1982-08-08[    | John       | 1943-02-25    | [1961-02-09 | 1969-01-30[ | 9     | 7       |
|                             |         | [1982-08-08      | …[             | George     |               |             |             |       |         |

The `first name`, or `score`, the system believes the person has, is a function of both t<sub>γ</sub> and t<sub>ε</sub>.

> p.χ(t<sub>γ</sub>)(t<sub>ε</sub>) → (`first name`, `score`)

In the example, this person changed his `first name` at t<sub>ε</sub> = `1982-08-08`, but the change was only recorded
at t<sub>γ</sub> = `2022-11-16T08:36:56.558557Z`. The changes to the `first name` in version `3` and `7` are
administrative corrections to our knowledge.

Note that it is now also possible that administrative mistakes are made in the `start` or `end` dates of the
applicability intervals, which can evolve with t<sub>γ</sub> (e.g., regarding the `score`, in version `4`).

Note that t<sub>ε</sub> ≥ `now` is possible, representing a planned change in the real world.

The last interval might be right-half-open, representing the fact that the interval is applicable still as far as we
know at that time. When the property is mandatory, the sequence must be gapless. In the example, the `score` is not
mandatory. It does not have a value for t<sub>ε</sub> ≥ `1969-01-30`.

### API

In the API, the t<sub>ε</sub> intervals are not separate resources. Rather, a version of the representation of the
real-world object is always updated atomically, as a whole. If something in the sequence changes, the sequence as a
whole changes.

The t<sub>ε</sub> axis should only be used for properties for which the evolution is relevant to the functionality of
the system. If the `first name` in the example is only used as address in letters, it is irrelevant when the person
changed his `first name`. The most up-to-date value is only used when a letter is printed.

## Created in error

When the representation of knowledge in the system is found to be wrong, it can be corrected with the addition of a new
version resource. This is more difficult when the object was created in error in the first place.

In the example, suppose we discover at `2022-12-28T10:14:12.165554Z` this person did not exist, or was irrelevant to the
system, and should never have been added to the system.

We cannot simply delete the representations of the object. In a system with full auditing, we must live up to our
mistakes, and keep track of the mistakes that were made, and when, and how, they were corrected. Furthermore, these
resources have lived in the system, and might have other resources referring to them (also in error). Business decisions
might have been made for, or based on, the object representations, and might have propagated over the system. These need
to be revisited, and corrective action might need to be taken.

We therefor need a way to _mark_ an object as created in error starting from a given t<sub>γ</sub>. A version `8` needs
to be added to the system at `2022-12-28T10:14:12.165554Z` that expresses this.

A naive way to do this is to add an extra boolean property `created in error`:

| t<sub>γ</sub>               | id      | first name start | first name end | first name | date-of-birth | score start | score end   | score | created in error | version |
| --------------------------- | ------- | ---------------- | -------------- | ---------- | ------------- | ----------- | ----------- | ----- | ---------------- | ------- |
| 2018-04-22T22:04:45.005489Z | 8763478 | [1940-11-09      | …[             | John       | 1940-11-09    |             |             |       | false            | 1       |
| 2020-10-12T14:22:10.125680Z | 8763478 | [1940-12-09      | …[             | John       | 1940-12-09    |             |             |       | false            | 2       |
| 2021-03-30T10:58:11.448841Z | 8763478 | [1940-12-09      | …[             | Paul       | 1940-12-09    | [1961-02-11 | …[          | 9     | false            | 3       |
| 2021-05-01T16:00:04.789958Z | 8763478 | [1940-10-09      | …[             | John       | 1940-10-09    | [1961-02-09 | …[          | 9     | false            | 4       |
| 2022-11-16T08:36:56.558557Z | 8763478 | [1940-10-09      | 1982-08-08[    | John       | 1940-10-09    | [1961-02-09 | …[          | 9     | false            | 5       |
|                             |         | [1982-08-08      | …[             | Ringo      |               |             |             |       |                  |         |
| 2022-12-14T12:08:09.545187Z | 8763478 | [1940-10-09      | 1982-08-08[    | John       | 1943-02-25    | [1961-02-09 | 1969-01-30[ | 9     | false            | 6       |
|                             |         | [1982-08-08      | …[             | Ringo      |               |             |             |       |                  |         |
| 2022-12-24T11:13:06.668900Z | 8763478 | [1943-02-25      | 1982-08-08[    | John       | 1943-02-25    | [1961-02-09 | 1969-01-30[ | 9     | false            | 7       |
|                             |         | [1982-08-08      | …[             | George     |               |             |             |       |                  |         |
| 2022-12-28T10:14:12.165554Z | 8763478 |                  |                |            |               |             |             |       | true             | 8       |

<p style="background-color: lightgray; color: darkorchid; padding: 3mm;"><strong>Note:</strong> This concept is similar
to a <def>soft-delete</def>. A different term is used to avoid misunderstandings in subtle nuances.</p>

This however has a large technical impact. We now have in fact 2 polymorph representations of the resource: a nominal
version, with a number of χ-properties, and `created in error = false`, and one without those properties, with
`created in error = true`. `created in error` acts like a discriminator of 2 different types. These 2 different types
must be realized in persistent storage, data access code, service model code, DTOs, tests, and clients, such as the user
interface, in all layers, up to the visual representation.

### Applicability

In most relevant cases however, there will be _mandatory properties on the t<sub>ε</sub> axis_. If the sequence of
values for these properties is _empty_ at a given t<sub>γ</sub> (i.e., there are _no_ applicability intervals in the
sequence at t<sub>γ</sub>), this implies the object is _not applicable_, which is a correct representation of a
representation of a real-world object created in error. It the does not matter what values other properties have.

In the example, we can choose the `first name` property to express applicability of the object. If there is no
`first name`, we consider the object to be non-applicable:

| t<sub>γ</sub>               | id      | first name start | first name end | first name | date-of-birth | score start | score end   | score | version |
| --------------------------- | ------- | ---------------- | -------------- | ---------- | ------------- | ----------- | ----------- | ----- | ------- |
| 2018-04-22T22:04:45.005489Z | 8763478 | [1940-11-09      | …[             | John       | 1940-11-09    |             |             |       | 1       |
| 2020-10-12T14:22:10.125680Z | 8763478 | [1940-12-09      | …[             | John       | 1940-12-09    |             |             |       | 2       |
| 2021-03-30T10:58:11.448841Z | 8763478 | [1940-12-09      | …[             | Paul       | 1940-12-09    | [1961-02-11 | …[          | 9     | 3       |
| 2021-05-01T16:00:04.789958Z | 8763478 | [1940-10-09      | …[             | John       | 1940-10-09    | [1961-02-09 | …[          | 9     | 4       |
| 2022-11-16T08:36:56.558557Z | 8763478 | [1940-10-09      | 1982-08-08[    | John       | 1940-10-09    | [1961-02-09 | …[          | 9     | 5       |
|                             |         | [1982-08-08      | …[             | Ringo      |               |             |             |       |         |
| 2022-12-14T12:08:09.545187Z | 8763478 | [1940-10-09      | 1982-08-08[    | John       | 1943-02-25    | [1961-02-09 | 1969-01-30[ | 9     | 6       |
|                             |         | [1982-08-08      | …[             | Ringo      |               |             |             |       |         |
| 2022-12-24T11:13:06.668900Z | 8763478 | [1943-02-25      | 1982-08-08[    | John       | 1943-02-25    | [1961-02-09 | 1969-01-30[ | 9     | 7       |
|                             |         | [1982-08-08      | …[             | George     |               |             |             |       |         |
| 2022-12-28T10:14:12.165554Z | 8763478 |                  |                |            | 1943-02-25    | [1961-02-09 | 1969-01-30[ |       | 8       |

Note that there still is a `date-of-birth`, and a `score` sequence in version `8` in the example. In general, the
`date-of-birth` is mandatory at every t<sub>γ</sub>, but it does not make sense when the object is not applicable.
Rather than making the property optional, or devising complex validation without separate types for applicability and
non-applicability versions, it is more simple to allow a dummy value in this case. A better formulation might be that
the value of this property will not be used anywhere when the object is not applicable, and thus its value is
irrelevant. The `score` sequence cannot be used to indicate applicability of the object, since it is optional: the empty
sequence is a valid value, as shown in version `1` and `2`. Again, we allow dummy values when the object is
non-applicable.

The latter might be misleading in some cases, but we believe the possible confusion does not outweigh the high technical
impact of separate types in all layers. In practice, it turns out that there are few representations where there is a
mix of property types that might be confusing.

#### API

If there are properties with values that have no meaning when there are no applicability intervals, the JSON
representation communicated from the service to clients might make the effort not to include meaningless property
values, i.e., be defined as a variant record, depending on there being or not being applicability intervals.

Note that we can also undo marking the object as inapplicable, just be adding a version `9` with new values for the
properties.

<p style="background-color: lightgray; color: darkorchid; padding: 3mm;"><strong>TODO:</strong> A far better example
would be membership intervals, but there are slight nuances. Consider revising the example to that, or adding
membership intervals.</p>

### Derived applicability

In some cases, the objects do not have any direct mandatory properties on the t<sub>ε</sub> axis, but they do have
derived mandatory properties on the t<sub>ε</sub> axis.

Take, e.g., a company that defines roles, with some benefits that evolve over the t<sub>ε</sub> axis. People are
employees during certain intervals. When a person has a role, an `Employee Role` resource is created that refers to 1
employee and 1 role. The benefits for the employee, over t<sub>ε</sub>, are defined by the _derived_ intersection
sequence of the benefit intervals in the associated `Role`, and the employment intervals in the associated `Employee`.

```
   +------------------------------------+
   |              Employee              |
   +------------------------------------+
   | <<χ>> employments: Interval [0..*] |
   +------------------------------------+
                     | 0..1
                     |
                     |
                   * |
+------------------------------------------+
|              Employee Role               |
+------------------------------------------+
| <<χ>> / benefits: BenefitInterval [0..*] |
+------------------------------------------+
                     | 0..1
                     |
                     |
                   * |
 +----------------------------------------+
 |                  Role                  |
 +----------------------------------------+
 | <<χ>> benefits: BenefitInterval [0..*] |
 +----------------------------------------+
```

When we discover at t<sub>γ1</sub> that the `Employee` is created in error, it is updated with an empty `employments`
sequence. As a result, the `Employee Role` derived `benefits` interval intersection sequence will be empty too for any
t<sub>γ</sub> > t<sub>γ1</sub> , meaning that the person does not have the right to any benefits. When the `Role` is
created in error, it is updated with an empty benefit sequence, with the same effect on the `Employee Role`'s
applicability. In both cases, an empty `Employee Role` derived benefit interval intersection sequence signals there are
no benefits. In essence, the `Employee Role` is inapplicable.

The `Employee Role` has no direct properties, other than its association with an `Employee` and a `Role`. Its mere
existence is its only relevant aspect in the system. There is no persistent property in the system that can be changed
to reflect that the object was created in error.

In this case, there is little other recourse than marking the object as “created in error” in persistent storage, one
way or another.

<p style="background-color: lightgray; color: darkorchid; padding: 3mm;"><strong>NOTE:</strong> The current patterns
applied in service code and relational databases store t<sub>γ</sub> as an interval, with a `start` and an `end` on each
version, instead of only a `start` as represented above. This is redundant, but applied because of performance reasons.
With this pattern, filling out the `end` of version `7` in the example above can be used to signal inapplicability
starting from a certain t<sub>γ</sub>, instead of adding a version `8` with an exta boolean column.</p>

#### API

Information retrieved via the API contains the derived property in these cases. Thus, an empty sequence can be used to
signal inapplicability to clients as in the more straightforward cases.

Since derived properties are read-only in the API however, a client cannot use this property to mark an object as
inapplicable. In this case, and only in this case, the API adds a `DELETE` method, that asks the service to mark the
object as inapplicable:

```http request
DELETE /api/person/8763478
```

After this, the API returns 1 more version in the `history`, and the returned representation will have the empty
sequence as property value for the derived applicability sequence.

<p style="background-color: lightgray; color: darkorchid; padding: 3mm;"><strong>IDEA:</strong> These are
exceptional measures, which make the API more difficult. We should consider generalizing this for all resources in
some way.</p>

### Extra property

When the above fails, we have no other recourse than to add an extra property to signal inapplicability. It practice,
this has not yet occurred.
