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

## Privacy

Privacy has to be taken into consideration.

Most often, this is not a problem, if communication between the client and the service is ultimately secured with TLS
between trusted infrastructure (e.g., client to trusted CDN, trusted CDN to service). In this case, the response cannot
be cached by intermediate caches, but only by trusted infrastructure and the client under control of the end user.

Note that section [RFC 7234 Section 3.2](https://tools.ietf.org/html/rfc7234#section-3.2) prevents a shared cache from
saving and returning a response to a previous request if that request included an `authorization` header.

The `private` directive ensures the response is only cached by the browser's cache
([RFC 7234 Section 5.2.2.6](https://tools.ietf.org/html/rfc7234#section-5.2.2.6)).

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
