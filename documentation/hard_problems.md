# Remaining Problems while using Purl-Patrol

When you generate a SBOM using tools like `sbom-utility` or `cdxgen`, some packages might have unknown
license information such as:
- No IDs but a name, which has no further rules. Some packages therefore have values that can't be
further processed. Better way is to enrich the SBOM beforehand.

**Example**
```
{
  "license": {
    "name": "License :: OSI Approved :: Apache Software License"
  }
}

OR

{
  "license": {
    "name": "declared license of 'defusedxml'",
    "text": {
      "content": "PSFL",
      "contentType": "text/plain"
    }
  }
}
```
- Not every spdx-license is covered in the default MW license policy and might fail the pipeline.
- A few components in the SBOM might have a deprecated license identifier. A list of deprecated SPDX license identifiers
can be found [here (bottom of page)](https://spdx.org/licenses/).
- Some components have a wrong or unclear license definition.
- Can't filter which packages are included in the scan. For example, we can't exclude apk packages.
- We only support CycloneDX SBOMs, because SBOMs in the SPDX format are not supported by sbom-utility.
