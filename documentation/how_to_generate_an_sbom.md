## How do you generate an SBOM?
This heavily depends on the tech stack that you are using in the project.
Some tools are a better fit for a language compared to others. You can also create an SBOM of your OCI-Image.\
[This document](github.com/awesomeSBOM/awesome-sbom) can help you find a fitting SBOM tool.

One of the tools to generate a SBOM with license information is [cdxgen](https://github.com/CycloneDX/cdxgen).\
Using this tool the SBOM is generated in the right format as well (CycloneDX), as we need this format in order to analyze the SBOM.\
This is an example on how to use cdxgen:
```bash
cdxgen -t typescript -o sbom.cdx.json --profile license-compliance
```
You will have to provide your project-type with the "-t" flag (a list can be found [here](https://cyclonedx.github.io/cdxgen/#/PROJECT_TYPES)),
as well as the --profile which tells cdxgen to include the license information in the SBOM.

When trying out other tools keep in mind that the SBOM needs to include the license information of the dependencies.
Not every tool has the option the include license information in the SBOM,
but this is really important, as purl-patrol of course checks the license information for compliance.
