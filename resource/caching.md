HTTP cache behavior is specified by [RFC 7234](https://tools.ietf.org/html/rfc7234).

## Only add Cache-Control headers to GET 200 and 404 responses

In practice, only responses to [safe](https://tools.ietf.org/html/rfc7231#section-4.2.1) HTTP methods (`GET` — and
`HEAD`) are cached (see [RFC 7231 Section 4.2.3](https://tools.ietf.org/html/rfc7231#section-4.2.3)).

The following status code are cacheable: `200`, `203`, `204`, `206`, `300`, `301`, `404`, `405`, `410`, `414`, and `501`
(see [RFC 7231 Section 6](https://tools.ietf.org/html/rfc7231#section-6)).

Responses to `PUT` or `DELETE` are never cached, and, in practice, neither are responses to `POST`.

A `PUT` on a resource invalidates an existing cached response for `GET` on that resource.

## Do not use other caching headers

If there is a `cache-control` header with the `max-age` or `s-maxage` directive in the response, the Expires header is
ignored (see [RFC 7231 Section 5.3](https://tools.ietf.org/html/rfc7234#section-5.3)).

A [`pragma` header](https://tools.ietf.org/html/rfc7234#section-5.4) should only be used for backward compatibility,
which is irrelevant for new applications on modern infrastructure.

The [`etag` header](https://tools.ietf.org/html/rfc7232#section-2.3) makes little sense for dynamic data: the service
would need to implement the `HEAD` method for each resource, and get all necessary data from persistent storage to
calculate the ETag of the data to respond to the `HEAD` request, like it does for the `GET` method, or store the ETag,
keep it up-to-date, and retrieve it. This only makes sense for large responses, which a service that offers dynamic data
most often avoids.

Thus, if a `cache-control` header is used, there should be no `expires`, `pragma`, nor `etag` header on the response.

## Caching and a CDN as DDoS protection

In any cloud infrastructure, a CDN should always be used as access point for clients, while services and static data
should not be reachable from the internet. The main reasons for this are that

- this single access point acts as a simple architectural _api gateway_ (a multiplexing reverse proxy), and the single
  _origin_ for all HTTP requests; that way, _CORS_ is avoided
- CDN access points of the different cloud providers are a massive infrastructure, that is protected against DDoS by its
  massive size, and additional measures by the provider, as part of the service
- a CDN access point makes our architecture far more responsive to clients for many requests (the prime reason of
  existence for CDNs)

A CDN is functionally in effect a cache. We thus have to consider the effect of our caching strategy on the CDN in the
infrastructure.

## Privacy

Privacy has to be taken into consideration.

Most often, this is not a problem, if communication between the client and the service is ultimately secured with TLS
between trusted infrastructure (e.g., client to trusted CDN, trusted CDN to service). In this case, the response cannot
be cached by intermediate caches, but only by trusted infrastructure and the client under control of the end user.

Note that section [RFC 7234 Section 3.2](https://tools.ietf.org/html/rfc7234#section-3.2) prevents a shared cache from
saving and returning a response to a previous request if that request included an `authorization` header, unless a cache
directive that allows such responses to be stored is present in the response.

The `private` directive ensures the response is only cached by the browser's cache
([RFC 7234 Section 5.2.2.6](https://tools.ietf.org/html/rfc7234#section-5.2.2.6)).

## DDos Protection

For business APIs, we would like to use a trusted shared cache, with a minimal `max-age`, e.g., a trusted CDN, to
protect against DDoS attacks. This can be done by

- not using the `private` directive
- adding an explicit `cache-control` header with a `max-age` directive

Then we still need to convince the trusted shared cache to take into account the `authorization` header when matching
subsequent requests for the resource. Otherwise, when authorized user `alice` has made an earlier successful `GET`
request for resource `/r`, a later request by user `bob` for the same resource `/r` would return `alices` response from
the shared cache, without checking `bob`'s authorization.

This is possible in
[AWS Cloudfront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/RequestAndResponseBehaviorCustomOrigin.html#request-custom-headers-behavior)
and necessary anyway, for the `authorization` to reach the service. Apart from that, there are other, higher level DDos
protection measures included ([AWS Shield Standard](https://aws.amazon.com/shield/getting-started/)).

For Azure, the situation is complicated, and depends on the _CDN profile_. For _Azure CDN Standard from Verizon_ and
_Azure CDN Standard from Akamai_ profiles, you can adjust how an Azure CDN works by using _CDN caching rules_. You can
use _Set if missing_ for selected resources, but there is no control for caching based on headers (and we need caching
based on the `authorization` header). For _Azure CDN Premium from Verizon_ profiles only, you use the rules engine to
enable caching. You can set up a rule using
[a request match condition](https://docs.microsoft.com/en-us/azure/cdn/cdn-verizon-premium-rules-engine-reference-match-conditions#request)
with a [Request Header Regex](https://docs.vdms.com/cdn/Content/HRE/M/Request-Header-Regex.htm) `authorization: .*`, or
a [Request Header Wildcard](https://docs.vdms.com/cdn/Content/HRE/M/Request-Header-Wildcard.htm) `authorization: *`. Or
you can apply [Token-Based Authentication](https://docs.vdms.com/cdn/Content/HRE/F/Token-Auth.htm) in the CDN at an
extra cost.

On Azure, we should however use
[Dynamic site acceleration](https://docs.microsoft.com/en-us/azure/cdn/cdn-dynamic-site-acceleration) (DSA) for access
to the service, which forwards the `authorization` header, but prohibits any caching of service responses.

All _profiles_ do have higher level [DDoS protection](https://docs.microsoft.com/en-us/azure/cdn/cdn-ddos) however.

_**// MUDO:** Azure this needs to be verified._

## Last-Modified

According to [RFC 2616 Section 13.3.4](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html#sec13.3.4), we should
also add a `last-modified` header. The browser would then include a `if-modified-since` header in subsequent requests
for the same resource.

However, that only makes sense if we would also take that header into account in the service. That makes little sense
for dynamic data. To take this into account, the service would need to get the necessary data from persistent storage,
like it does for any `GET` method. This only makes sense for large responses, which a service that offers dynamic data
most often avoids.

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
