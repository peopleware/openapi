Resource services in architectures that use RAA based authorization **must** authorize or deny resource actions by
matching the appropriate RAA/2 pattern in this claim, after the Bearer Access Token is verified.

The `raa/2` claim is a _map_ of _URI prefixes_ to _Resource Action eXpressions_ (RAX). To authorize a Resource Action
(RA), i.e., the combination of a HTTP method or _action_ and the URI of the resource the HTTP action is applied to, a
resource service **must**:

- Find the longest `prefix` in this map that matches the start of the _server relative version_ of the request URI (the
  selected prefix). Since there cannot be duplicate `prefix`es in the claim, there is 0 or 1 _selected prefix_.

  - If there is no _selected prefix_, authorization fails.

- Form the _Resource Action_ (_RA_) by concatenating the _request action_ in upper case with the remaining part of the
  _server relative version_ of the request URI after the _selected prefix_, separated by a colon (`':'`).

- Try to match the resulting RA to the RAX that is the value in this claim for the _selected prefix_.

  - If the RA does not match the RAX, authorization fails.

  - If the RA does match the RAX, authorization succeeds.

`prefix`es are the start of _server relative version_ of the request URI, and do not include the origin, to make it
possible to use the same set-up on multiple servers. `prefix`es are introduced to make `glob` matching as quick as
possible, by removing as big a part of the server relative version of the request URI as possible before doing `glob`
matching on the rest. `prefix`es **must** start with a `'/'`, and **must not** end with a `'/'` (constraints on the
`prefix`es cannot be expressed in OpenAPI 3). `prefix`es can be used to provide different RAXes for different services
or partial APIs in a larger API.

_Request actions_ are the actions (a.k.a. methods, verbs) in HTTP. Examples of _resource actions_ are `GET`, `PUT`,
`POST`, and `DELETE`.

The colon (`':'`) is chosen as separator between the action and the URI-part in a _Resource Action_, because it is one
of the characters that is not allowed in URI-segments.

A _Resource Action eXpressions_ (RAX) is a _simplified glob expression_. It combines an expression for the allowed
actions in upper case with an expression for the remaining part of the URI of the resources for which those actions are
authorized, separated by a colon (`':'`). In these expressions, the characters allowed in URL segments
(`/^[\w-.~%!$&''()*+,;=]+$/`) play their regular role, except for `'*'` and `','`. RA authorization does not work if
resource URIs contain `'*'` or `','`. In a RAX,

- `*` stands for any URL segment. It represents the partial regular expression `/[\w-.~%!$&''()+;=]+/`. It requires at
  least one character.

- `**` stands for any sequence of URL segments, separated by a `'/'`. It represents the partial regular expression
  `/[\w-.~%!$&''()+;=/]*/`. The empty string also matches. `**` can be used in the middle of a RAX, but they usually
  appear at the end.

- `{…,…,…}` represents comma-separated options. The entries between the commas are RAXes. There must be at least 2
  entries in such a construct, i.e., at least one comma. One of the entries can be the empty string. It represents the
  partial regular expression `/\{[\w-.~%!$&''()*+,;=/{}]*(,[\w-.~%!$&''()*+,;=/{}]*)+\}/`. Option-constructs can be
  nested, and can contain `*` or `**` constructs. If one of the options is the empty string, it should be the first
  option.

If the part after the colon (`':'`) is the empty string, it means that the `prefix` describes the resource the RAX
applies to in full, and only the authorized actions are mentioned.

As an example, when the resource service receives the HTTP request

      PUT /openapi/common/I/a/path/525253/to/a/resource/63636/child

this would match a `prefix` `/openapi/common/I`. The _Resource Action_ (_RA_) would be:

      PUT:/a/path/525253/to/a/resource/63636/child

If the RAX in this claim associated with the _selected prefix_ `/openapi/common/I` is exactly

      PUT:/a/path/525253/to/a/resource/63636/child

this is an obvious match, and the resource action is authorized. Other examples of matching RAXes are:

- `*:/a/path/525253/to/a/resource/63636/child`: allow any action on this specific resource

- `PUT:/a/path/525253/to/a/resource/63636**`: allow `PUT` on all child resources of
  `/a/path/525253/to/a/resource/63636`, and on `/a/path/525253/to/a/resource/63636` itself, and on all other resources
  that start with `/a/path/525253/to/a/resource/63636`, e.g., `/a/path/525253/to/a/resource/63636769834769347`

- `{GET,PUT}:/a/path/525253/to/a/resource/63636{,/dog,/cat/**}`: allow `GET` and `PUT` on the resource
  `/a/path/525253/to/a/resource/63636` itself, on its specific child resource `/dog`, and all the descendant resources
  of its child resource `/cat`, but not on the child resource `/cat` itself

Examples of RAXes that do not match the RA `PUT:/a/path/525253/to/a/resource/63636/child` are:

- `{GET,PUT}:/a/path/525253/to/a/resource/63636/child`: allow `GET` and `PUT` on the specific child resource, but not,
  e.g., `DELETE`

- `GET:/a/path/525253/to/a/resource/63636/**`: allow `GET` on all child resources of
  `/a/path/525253/to/a/resource/63636`

- `POST:/a/path/*/to/a/resource/63636`: allow `POST` on resources of the form `/a/path/*/to/a/resource/63636`, for all
  possible non-empty values of the URL-segment immediately after `/a/path/`

- `GET:/a/path/525253/{to/a/resource/63636**,to/another/resource/5523/**,and/{yet/another/**,another}}`: allow `GET` on
  many more and less specific resources

- `{GET:/a/path/525253/to/a/resource/63636/**,PUT:/something/else,{GET,PUT}:/something/other/again}`: you can also
  combine complete partial RAXes in one big one

- `{DELETE,GET}:`: allow `GET` and `DELETE` on the resource described by the `prefix`

If authorization fails, the resource service **must** respond with a status code `401 Unauthorized`, and **must not**
give more detail. More detail would give more information to attackers.

If authorization succeeds, the resource service **should** execute the requested resource action.

The contents of this claim is the responsibility of the STS. Therefore, resource services should assume that the syntax
of the RAXes is valid, and does not create catastrophic backtracking.

Note that most globbing libraries, which can handle more complex globbing patterns, will interpret RAXes as intended.
