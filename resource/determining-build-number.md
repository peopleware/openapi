Different clients use different methods to determine the build number to use. This often depends on the build of the
client, and / or the `mode` for which the interaction takes place. `LATEST` is a special build number, that refers to
the latest deployed build of the service.

## UI to service

The UI, accessed as `immutable` build, always works in `dev-experiment` `mode`, and uses `LATEST` as build number for
each service, apart from some temporary exceptions where some build numbers are hard coded.

Accessed as `bookmarkable` build, the UI contains a configuration that explicitly lists the build numbers of all
services to use.

When accessed directly as `bookmarkable`, the UI works in `dev-experiment` `mode`. When accessed as QA, acceptance, or
production, the UI uses a `qa-…`, `acceptance-…`, `demo`, or the `production` mode. In all cases, the embedded
configuration is used to determine the build numbers of the services to interact with.

## Automated tests of the UI

<div style="background-color: red; color: yellow; padding: 5mm;"><strong>MUDO:</strong> where to get this
configuration on a commit build (LATEST)? where to get it when deploying in a different env?</div>

## Other clients to service

When other clients, such as CLI programs or scripts, access services, they need to be told what `mode` to operate in,
and what build number of servicess to address. Usually, this is left to the user: some CLI arguments or environment
variables are required for operation.

This is notably the case for import scripts (using a `migration–…` `mode`, or any of the modes above), re-index scripts,
etc.

## Service to service: central configuration management

When a service, such as `your-service`, or the search topic handler, accesses other services, e.g., `my-service`, the
build number is determined from the `mode` using central configuration.

Configuration parameters might mention that build number `00432` of `my-service` must be used in a `qa-023` `mode`, and
build `LATEST` must be used in mode `dev-experiment`. The configuration can differ between different deployed builds of
the dependent service, and can evolve without a new build or deploy. It is the resonsibility of the central
configuration to make sure that the build of the dependent service is compatible with the version of the API the build
of the service that is called offers.

<div style="background-color: red; color: yellow; padding: 5mm;"><strong>MUDO:</strong> Describe process, entry
from bookmarkable CI. Entry from definition of <code>qa-…</code>, <code>`acceptance-…</code> mode. Entry evolution for
<code>demo</code>, <code>production</code> when bookmarkable is promoted.</div>

## Automated tests of services

Automated tests always use a completely separate `automated-test-…` `mode` for each run. When automated tests directly
access a service `A`, and that depends on services `B`, `C`, …, service `A` must be able to determine what build of each
of these dependencies should be interacted with, during a particular test run.

Nominally, service `A` retrieves this information per `mode` from central configuration. Therefore, the test run needs
to set this configuration in central configuration before the test run starts, and preferably clean up this setting once
the test run completes.

<div style="background-color: red; color: yellow; padding: 5mm;"><strong>MUDO:</strong> where to get this
configuration on a commit build? where to get it when deploying in a different env?</div>
