HTTP cache behavior is specified by [RFC 7234](https://tools.ietf.org/html/rfc7234).

## Cache-Control for GET 200 and 404 responses

In practice, only responses to [safe](https://tools.ietf.org/html/rfc7231#section-4.2.1) HTTP methods (`GET` — and
`HEAD`) are cached (see [RFC 7231 Section 4.2.3](https://tools.ietf.org/html/rfc7231#section-4.2.3)).

The following status code are cacheable: `200`, `203`, `204`, `206`, `300`, `301`, `404`, `405`, `410`, `414`, and `501`
(see [RFC 7231 Section 6](https://tools.ietf.org/html/rfc7231#section-6)).

Responses to `PUT` or `DELETE` are never cached, and, in practice, neither are responses to `POST`.

A `PUT` on a resource invalidates an existing cached response for `GET` on that resource.

See [RFC 7234 Section 5.2.2](https://tools.ietf.org/html/rfc7234#section-5.2.2) for the _directives_ that can be used as
values in the `cache-control` header.

## No other caching headers

If there is a `cache-control` header with the `max-age` or `s-maxage` directive in the response, the Expires header is
ignored (see [RFC 7231 Section 5.3](https://tools.ietf.org/html/rfc7234#section-5.3)).

A [`pragma` header](https://tools.ietf.org/html/rfc7234#section-5.4) should only be used for backward compatibility,
which is irrelevant for new applications on modern infrastructure.

The dated [RFC 2616 Section 13.3.4](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html#sec13.3.4), we should also
add a `last-modified` header. The browser would then includes a `if-modified-since` header in subsequent requests for
the same resource. This and the [`etag` header](https://tools.ietf.org/html/rfc7232#section-2.3) makes little sense for
dynamic resources. The service would need to implement the `HEAD` method for each resource, and get all necessary data
from persistent storage to calculate the Last-Modified date and ETag of the resource to respond to the `HEAD` request,
like it does for the `GET` method, or store these values, keep then up-to-date, and retrieve them. This only makes sense
for large responses, which a service that offers dynamic resources most often avoids. `last-modified` or `etag` headers
are irrelevant for resources that are cached infinitely (immutable resources).

There is no `expires`, `pragma`, nor `etag` header on the response for dynamic resources. The CDN might add an
[`etag`](https://tools.ietf.org/html/rfc7232#section-2.3) or dated `last-modified` header, and realize the `HEAD`
method. This is only relevant for static, mutable resource, which this architecture avoids.

The possible [`etag`](https://tools.ietf.org/html/rfc7232#section-2.3) or `last-modified` header is not mentioned in
this specification.

## Public resources

### Public static resources

Public static resources (the HTML, CSS, JavaScript of user interfaces, images, shared documents, …) are deployed
immutable. The client chooses the appropriate version. Public resources are shared by definition.

These resources should be cached infinitely.

    cache-control: public, max-age=31536000, immutable

The `public` directive indicates that any cache **may** store the response
([RFC 7234 Section 5.2.2.6](https://tools.ietf.org/html/rfc7234#section-5.2.2.6)). This overrides any other limitation.

The [`max-age` directive](https://tools.ietf.org/html/rfc7234#section-5.2.2.8) (1 year) when the resource is immutable
is a fall-back for clients that do not understand the `immutable` directive (see
[RFC 8246](https://tools.ietf.org/html/rfc8246),
["Bits Up!", "Cache-Control: immutable"](https://bitsup.blogspot.com/2016/05/cache-control-immutable.html)). With most
modern browsers, this is superfluous.

### Public dynamic resources

Public dynamic resources typically are read-only, and accessed by many users. Often, public dynamic resources are
aggregate representations, which are costly to calculate. Some public dynamic resources are fast-changing, others update
only once in a long interval (e.g., once a month).

The latter are served as an immutable resource (“the aggregate resource for Februari 2021”), and use the caching
strategy described above:

    cache-control: public, max-age=31536000, immutable

For fast-changing public dynamic resources the user usually expects near-real-time data, that refreshes near
continuously. Caching in the end-user's browser and shared intermediate caches is used to keep the number of requests
forwarded to the service low, to control cost. What interval is “near” enough and what number of requests that reach the
service is “low” enough, depends on the particular semantics of the resource. This is controlled by the
[`max-age` directive](https://tools.ietf.org/html/rfc7234#section-5.2.2.8) directive. It is impossible to define a
general strategy for the `max-age` value. It can range from 5 seconds to an hour. For longer intervals the resource
should be converted to an immutable resource.

    cache-control: public, max-age=<N>

## Private resources

Privacy has to be taken into consideration for non-public resources.

Communication between the client and the service is ultimately secured with TLS between trusted infrastructure (e.g.,
client to trusted CDN, trusted CDN to service), and authorization is realised in the service. The response cannot be
cached by untrusted intermediate caches on the internet, but only by trusted infrastructure and the client under control
of the end user, where communication is unencrypted.

Note that section [RFC 7234 Section 3.2](https://tools.ietf.org/html/rfc7234#section-3.2) prevents a shared cache from
saving and returning a response to a previous request if that request included an `authorization` header, unless a cache
directive that allows such responses to be stored is present in the response (amongst others, `public`).

The `private` directive ensures the response is only cached by the browser's cache
([RFC 7234 Section 5.2.2.6](https://tools.ietf.org/html/rfc7234#section-5.2.2.6)).

Private resources may be private to one authorized user, or shared between a group of authorized users.

### Private static or immutable resources

Private static or immutable resources are cached aggressively in the authorized user's browser.

    cache-control: private, max-age=31536000, immutable

The [`max-age` directive](https://tools.ietf.org/html/rfc7234#section-5.2.2.8) (1 year) when the resource is immutable
is a fall-back for clients that do not understand the `immutable` directive (see
[RFC 8246](https://tools.ietf.org/html/rfc8246),
["Bits Up!", "Cache-Control: immutable"](https://bitsup.blogspot.com/2016/05/cache-control-immutable.html)). With most
modern browsers, this is superfluous.

### Private dynamic resources

Private dynamic resources are cached with a `max-age` as long as functionally possible. The intention is that users, on
the same computer, on the same browser, will not get fresh data from the service when they ask for the same resource
during a short interval, as long as they did not perform an [unsafe](https://tools.ietf.org/html/rfc7231#section-4.2.1)
HTTP action.

As a consequence, other users, or the same user on a different computer, or in a different browser, might see more
recent data during this interval, if the resource was changed by another user, or the same user on a different computer,
or in a different browser. This is because the original user on the original computer and browser is unaware of the fact
that the resource has changed yet.

In most business settings, this has a large beneficial effect on responsiveness when a user returns to a resource. There
is no benefit when several people are inspecting the same resource, because the response is marked `private`. That other
users, or the same user on a different computer, or in a different browser, need to wait a short while before they see a
change made by another user, or the same user on a different computer, or in a different browser, is an acceptable
downside, if changes happen infrequently, chances are low that different users are concurrently working on the changed
resource, and the interval is short on a human time-scale
([2 minutes](https://tools.ietf.org/html/rfc7234#section-5.2.2.8)).

    cache-control: private, max-age=120

Situations where this short human time-scale caching period is unacceptable are usually situations where the client is a
custom program (service or CLI-program). In this case, it is up to the program to decide on caching private resources.
As long as the resource is not cached in intermediate, shared caches, there is nowhere a `max-age` directive has effect.
To make sure a _browser_ will not cache the resource, we use the `no-store` directive
([RFC 7234 Section 5.2.2.3](https://tools.ietf.org/html/rfc7234#section-5.2.2.3)). This implies `private` for
intermediate shared caches.

    cache-control: no-store

## CDN and other trusted, shared caches within the infrastructure

In any cloud infrastructure, a CDN should always be used as access point for clients, while services and static
resources should not be reachable directly from the internet. The main reasons for this are that

- this single access point acts as a simple architectural _api gateway_ (a multiplexing reverse proxy), and the single
  _origin_ for all HTTP requests; that way, _CORS_ is avoided
- CDN access points of the different cloud providers are a massive infrastructure, that is protected against DDoS by its
  massive size, and additional measures by the provider, as part of the service
- a CDN access point makes our architecture far more responsive to clients for many requests (the prime reason of
  existence for CDNs)
- we have relevant cost savings if the services are not hit for requests that (are likely to) return the same result
  during a certain interval; client developers should not be concerned with this

A CDN is functionally a trusted, shared cache and reverse proxy. There can be additional trusted, shared caches, between
the CDN and the service within the infrastructure under our control (TLS endpoints). We have to consider the effect of
our caching strategy on these caches in the infrastructure.

In general, shared caches also follow the rules established by the RFCs and the `cache-control` header in the service
response, but usually configuration to override that on URI patterns is possible.

Public static resources are deployed immutable, and served directly from the CDN, and cached there infinitely.

Public dynamic resources are cached in the CDN with the selected
[`max-age`](https://tools.ietf.org/html/rfc7234#section-5.2.2.8).

Private resources, i.e., resources that can only be interacted with by authorized users are not cached in shared caches.
If the resource's use is limited to one user (because matches would take into account the `authorization` header), this
makes little sense: the resource is already cached in the one user's browser. If the cached resource can be used to
respond to different users, this only makes sense if the CDN authorizes each request separately, without contacting the
service. This is possible, e.g., with RAA. It requires authorization code running in the CDN. This is possible in some
CDNs, but not in others.

In general, caching private resources has no benefits, or is not well-supported, and rather complex to control.

This is enforced by using the `private` directive
([RFC 7234 Section 5.2.2.6](https://tools.ietf.org/html/rfc7234#section-5.2.2.6)) for all private resources.

It is necessary for the `authorization` to reach the service through the shared caches / reverse proxies.

As a result, _all_ requests for private resources from the internet will be forwarded to the service. An attacker could
exploit this to force DoS, and / or drive up our exploitation cost, even without credentials. We depend on the
additional measures provided by the CDN (like rate limiting) to mitigate this. Authorization in the service should be
fast and cheap (see RAA). Adding additional measures (e.g., rate limiting) in the service is difficult and costly. There
are severe limitations on discerning legitimate from illegitimate requests, apart from authorization.

### AWS Cloudfront

In AWS Cloudfront we configure the distribution to
[forward the `authorization` header to the service](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/RequestAndResponseBehaviorCustomOrigin.html#request-custom-headers-behavior).

RAA authorization in the CDN could be realized with
[Lambda@Edge](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-at-the-edge.html), but we choose
not to.

The standard DDos protection measures are described in
([AWS Shield Standard](https://aws.amazon.com/shield/getting-started/)).

### Azure CDN

For Azure, the situation is complicated, and depends on the _CDN profile_.

For _Azure CDN Standard from Verizon_ and _Azure CDN Standard from Akamai_ profiles, you can adjust how an Azure CDN
works by using _CDN caching rules_. You can use _Set if missing_ for selected resources. There is no control for caching
based on headers.

For _Azure CDN Premium from Verizon_ profiles, you use the _rules engine_ to enable caching. You can set up a rule using
[a request match condition](https://docs.microsoft.com/en-us/azure/cdn/cdn-verizon-premium-rules-engine-reference-match-conditions#request).
It is possible to control caching based on headers with a
[Request Header Regex](https://docs.vdms.com/cdn/Content/HRE/M/Request-Header-Regex.htm), or a
[Request Header Wildcard](https://docs.vdms.com/cdn/Content/HRE/M/Request-Header-Wildcard.htm). You can apply
[Token-Based Authentication](https://docs.vdms.com/cdn/Content/HRE/F/Token-Auth.htm) in the CDN at an extra cost. We
choose not to.

On Azure, we use [Dynamic site acceleration](https://docs.microsoft.com/en-us/azure/cdn/cdn-dynamic-site-acceleration)
(DSA) for access to services, which forwards the `authorization` header, but prohibits any caching of service responses.

All _CDN profiles_ have [DDoS protection](https://docs.microsoft.com/en-us/azure/cdn/cdn-ddos).

## Development mode

For development use, all resources return

    cache-control: no-store

## References

- RFC
  - [RFC 7234 "Hypertext Transfer Protocol (HTTP/1.1): Caching"](https://tools.ietf.org/html/rfc7234) (2014)
  - [RFC 7231 "Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content" Section 4.2 "Common Method Properties"](https://tools.ietf.org/html/rfc7231#section-4.2)
    (2014)
  - [RFC 7231 "Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content" Section 6 "Response Status Codes"](https://tools.ietf.org/html/rfc7231#section-6)
    (2014)
  - [RFC 7232 "Hypertext Transfer Protocol (HTTP/1.1): Conditional Requests" Section 2.3 "ETag"](https://tools.ietf.org/html/rfc7232#section-2.3)
    (2014)
  - [RFC 8246 "HTTP Immutable Responses"](https://tools.ietf.org/html/rfc8246) (2017)
- [HTTP Cache Headers - A Complete Guide](https://www.keycdn.com/blog/http-cache-headers) (2018)
- [Caching Tutorial for Web Authors and Webmasters](https://www.mnot.net/cache_docs/) (2017)
- MDN:
  - ["HTTP", "HTTP Caching"](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
  - Glossary
    - [Cacheable](https://developer.mozilla.org/en-US/docs/Glossary/cacheable)
    - [safe](https://developer.mozilla.org/en-US/docs/Glossary/safe)
  - ["HTTP", "HTTP headers", "Cache-Control"](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
  - ["HTTP", "HTTP headers", "Expires"](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expires)
  - ["HTTP", "HTTP headers", "Pragma"](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Pragma)
  - ["HTTP", "HTTP headers", "ETag"](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
- RFC 2616 (1999) - the old standard; the source for many current misunderstandings
  - [Section 13: Caching in HTTP](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html)
  - [Section 14.9](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9)
