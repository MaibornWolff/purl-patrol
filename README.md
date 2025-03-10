# purl-patrol
Builds a container image to consume a SBOM, extracts the software licenses and checks them against a policy

# Usage
```yaml
- uses: MaibornWolff/purl-patrol@v1
  with:
    # The path to your SBOM in the repository. [Required]
    SBOM_PATH: ''
    # The path to the license policy in the repository
    # Default: /mw_license_policy.json
    LICENSE_POLICY_PATH: ''
    # Whether to break the pipeline, by exiting with an error,
    # in case of license non-compliance
    BREAK_ENABLED: false
```
