# PURL Patrol: Operation SBOM

[![GitHub Actions Status](https://github.com/MaibornWolff/purl-patrol/workflows/CI/badge.svg)](https://github.com/MaibornWolff/purl-patrol/actions)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4ba)](CODE_OF_CONDUCT.md)

PURL Patrol is a tool designed to consume Software Bill of Materials (SBOMs), extract software licenses, and check them against a predefined license policy. It helps you ensure that your project's dependencies comply with your organization's licensing requirements, preventing legal and security risks.
This is done by using the [sbom-utility](https://github.com/CycloneDX/sbom-utility) tool.

## Key Features

🚦 **Policy-Based Compliance:** Compares extracted licenses from an SBOM against a configurable license policy, allowing you to define allowed, disallowed, or restricted licenses.

📊 **Actionable Results:** Provides clear reports on license compliance status, highlighting any violations of your policy.

🔄 **CI/CD Integration:** Seamlessly integrates with GitHub Actions for automated license compliance checks in your CI/CD pipeline - *and more to follow ;)*

## Usage
In order for PURL Patrol to work the SBOM needs to be a CycloneDX SBOM!
### GitHub Actions

```yaml
- uses: MaibornWolff/purl-patrol@v1.6 # or MaibornWolff/purl-patrol@main to always use the latest version!
  with:
    SBOM_PATH: 'path/to/your/sbom.json' # Required: The path to your SBOM in the repository
    LICENSE_POLICY_PATH: 'path/to/your/license_policy.json' # Optional: The path to your license policy
    BREAK_ENABLED: false # Optional: Whether to break the pipeline, by exiting with an error, in case of license non-compliance. Default: true
```

### Azure DevOps

:rocket: Coming soon!

## Input Parameters

| Parameter             | Description                                                                                                                     | Required | Default Value                  |
|-----------------------|---------------------------------------------------------------------------------------------------------------------------------|----------|--------------------------------|
| `SBOM_PATH`           | The path to your Software Bill of Materials (SBOM) file within the docker container.                                            | Yes      | *None*                         |
| `LICENSE_POLICY_PATH` | The path to the license policy file within the docker container. This file defines the allowed and disallowed licenses.         | No       | `/sbom/mw_license_policy.json` |
| `BREAK_ENABLED`       | A boolean flag indicating whether the pipeline should fail (exit with an error) if any license non-compliance issues are found. | No       | `true`                         |

### License File

The license policy file (`LICENSE_POLICY_PATH`) should be a JSON file that defines your organization's license policy.  Example:

```json
{
    "policies": [
        {
            "id": "CAL-1.0",
            "name": "CAL-1.0",
            "family": "dummy1",
            "reference": "https://spdx.org/licenses/CAL-1.0.html",
            "usagePolicy": "deny",
            "annotationRefs": [
                "PROHIBITED"
            ],
            "urls": [
                ""
            ]
        }
    ]
}

```

In the annotationRefs you can set proper definitions for license as follows:

* `PROHIBITED`:  The license must not be used. If `BREAK_ENABLED` is set to true the run will fail
* `NEEDS-APPROVAL`: The license must be manual reviewed and approved. These will trigger a warning
* `APPROVED`: The licenese is approved

**Note:** If no `LICENSE_POLICY_PATH` is provided, the action will look for a file named `/sbom/mw_license_policy.json` in the repository. This policy is provided by MaibornWolff GmbH and can be replaced.

## Local Execution

You can also run the `purl-patrol` container locally for development and testing:

### Execution with MaibornWolff policy

```bash
docker pull ghcr.io/maibornwolff/purl-patrol:1.0.0
docker run \
  -e SBOM_PATH=/sbom/sbom.json \
  -v /path/to/sbom.json:/sbom/sbom.json \
  ghcr.io/maibornwolff/purl-patrol:1.0.0
```

Replace `path/to/sbom.json` with the actual paths to your file

### Execution with different policy

```bash
docker pull ghcr.io/maibornwolff/purl-patrol:1.0.0
docker run \
  -e SBOM_PATH=/sbom/sbom.json \
  -e LICENSE_POLICY_PATH=/sbom/license_policy.json \
  -v path/to/sbom.json:/sbom/sbom.json \
  -v path/to/license_policy.json:/sbom/license_policy.json \
  ghcr.io/maibornwolff/purl-patrol:1.0.0
```

Replace `path/to/sbom.json` & `path/to/license_policy.json` with the actual paths to your file

## Contributing

We welcome contributions to PURL Patrol!  Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to contribute.

## Code of Conduct

We strive to create a welcoming and inclusive environment for all contributors. Please review our [Code of Conduct](CODE_OF_CONDUCT.md).

## MaibornWolff

[https://www.maibornwolff.de/](https://www.maibornwolff.de/)
