Lists should always contain `href` references to the list resources, and not the resource content themselves. It is wise
to add `link rel=preload` headers for the list elements, or use HTTP/2 push.

## Paging

For long lists, paging needs to be used. For short lists (< 50 entries expected) paging should not be used.

### Paging HateOAS hrefs

The returned resource is a page of the list, with an extra `href` section that contains the relative URIs of the
`first`, `previous`, `next`, and `last` page of the list (where `previous` is omitted in the first page, and `next` is
omitted in the last page). These HateOAS links should contain an `at` parameter if the list resource has an `at`
parameter, to ensure that all the pages represent the same knowledge time.

Some sources advocate to use the `link` response header for these references. We do not support that, because it is too
difficult to express in OpenAPI.

Do not include these references `link rel=preload` headers. The browser would then load the entire list, page by page
(and possibly get in an infinite loop going back and forth).

### Paging control request parameters

When requesting the resource, the client needs to add the page (subset of the list) that is requested. Some sources
advocate to use request headers (e.g., `range`, `content-length`, …) to do that. Yet, in that case it is impossible to
provide simple HateOAS links in the response (unless we would extend that formalism to include headers). Therefore, we
use query parameters to control paging.

Some sources advocate a page-based semantics (ask for a particular page, and a page size) in the request parameters,
others item-based semantics (ask for a particular first item, and a maximum number of items). The former seems to gain
more traction, because of the success of the GitHub API (see, e.g.,
[the API for retrieving gists](https://docs.github.com/en/rest/reference/gists) — note that the GitHub API does use
`link` headers for the HateOAS links to other pages, and we do not).

All paging resources will have the common `page` query parameter, which is a positive integer, that counts the pages **1
based**. The `page` query parameter is optional, and defaults to `1`. A request for a page that does not exist results
in a `404` response (not found).

The page size can be defined implicitly for the resource, but it is better to let the client decide that too, since the
requirements for non-interactive clients differ fundamentally from browser-based interactive clients (SPAs), and within
those, the requirements differ significantly depending on the framework and libraries used, and the UI layout.

The page size is controlled by the common `per_page` query parameter, which is a positive integer. The resource should
impose an upper limit, and document it. The server returns the requested number of references in the response, except
for the first and last page. The first page can be empty, or have fewer elements that the page size. The last page can
have fewer reference in the response than the page size, but cannot be empty. Other pages have exactly the page size as
number of elements. The `per_page` query parameter is optional, but has a defined and documented default value, smaller
or equal to the defined upper limit.

If the `page` or `per_page` query parameters are not a positive integer, or the `per_page` value is larger than the
imposed and documented upper limit, this is a violation of the contract, which results in a generic `400` (Bad Request)
as usual. These generic contract violations are not documented in the API, but implied for every request.

## List order

Paging implies an order to the list. When possible, the order is defined implicitly for the resource, and documented in
the API. When not, a further `order` request attribute is to be added, with a semantics to be defined locally.
