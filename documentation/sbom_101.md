# SBOM 101

## What is an SBOM?
> A “Software Bill of Materials” (SBOM) is a machine-processable file containing supply chain relationships
and details of the components used in a software product. It supports automated processing of information
on these components. This covers both the so-called “primary component” and used (e.g. external/thirdparty) components. 
[Source](https://www.bsi.bund.de/SharedDocs/Downloads/EN/BSI/Publications/TechGuidelines/TR03183/BSI-TR-03183-2-2_0_0.pdf?__blob=publicationFile&v=3#page=7)

or in other words:
>  For software, a SBOM is the equivalent of a list of ingredients for food. It details which libraries and other software components are used in the product.
[Source](https://www.bsi.bund.de/EN/Themen/Unternehmen-und-Organisationen/Informationen-und-Empfehlungen/Cyber_Resilience_Act/cyber_resilience_act.html)

## Why do we need an SBOM?
The EU Cyber Resilience Act (CRA) demands the creation of an SBOM. 
As a manufacturer of Software this is something we need to provide.

## How does an SBOM look like?
This depends on which kind of SBOM format is used. Currently, there are two different formats:
CycloneDX and SPDX. These each have different versions as well and aren't that easy to convert as 
some of the fields differ.  
A definition of the latest CycloneDX format can be found [here](https://cyclonedx.org/docs/1.6/json/#).  
A definition of the latest SPDX format can be found [here](https://spdx.github.io/spdx-spec/v3.0.1/rdf/schema.json).

## How can I generate an SBOM
You can use various tools to create SBOMs. One thing which needs to be considered for choosing a tool,
is that purl-patrol obviously needs to have the licence information included in the SBOM to analyze it.  
Not every tool provides this functionality, but we have provided a page which gives an example on how
to generate an SBOM <!-- INSERT REFERENCE TO DOCUMENT HERE -->

## How can I scan the licenses of my SBOM?
See purl-patrol readme...