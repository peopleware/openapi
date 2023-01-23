## Canonical URI

In the example, a specific resource of type `Y` has _canonical URI_ `/my-service/v1/y/abc`, and a specific resource of
type `R` has canonical URI `/my-service/v1/x/123/y/abc`.

A _canonical URI_ is the URI where are resource can be interacted with, without the scheme and authority (see
[RFC 3986 Uniform Resource Identifier (URI): Generic Syntax ;3. Syntax Components](https://www.rfc-editor.org/rfc/rfc3986#section-3)),
and without the build number. By convention, the canonical URI’s first segment is the name of the service in which the
URI resides, followed by the relative URI of the resource in the API of that service.

- service name: `my-service`
- relative URI of the resource in the API of the service:
  - `/v1/y/abc` for the specific instance of `Y`
  - `/v1/x/123/y/abc` for the specific instance of `R`

## Fully qualified URI

To actually interact with these resources, clients need create a _fully qualified URI_ based on this and other
information. The fully qualified URI of the resource uses `https` as scheme, adds the authority (which is different in
different environments), adds the service name, then the build number, and then the relative URI of the resource in the
API of that service. E.g.:

- `https://dev-gateway.org:8899/my-service/00456/v1/y/abc` for the specific instance of `Y`
- `https://dev-gateway.org:8899/my-service/00456/v1/x/123/y/abc` for the specific instance of `R`

The authority is always the authority where the client itself is working under (the gateway of a particular
environment).
