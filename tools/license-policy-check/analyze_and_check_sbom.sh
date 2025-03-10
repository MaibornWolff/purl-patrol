#!/bin/sh
# shellcheck shell=dash

if [ -z "$SBOM_PATH" ] || [ -z "$LICENSE_POLICY_PATH" ] || [ -z "$BREAK_ENABLED" ]; then
  echo "Missing variables in check script. Please check SBOM_PATH or LICENSE_POLICY_PATH or BREAK_ENABLED"
  exit 1
fi
/sbom/sbom-utility license list --input-file="$SBOM_PATH" --format=csv --summary --config-license="$LICENSE_POLICY_PATH" -o="/sbom/evaluated_sbom.csv"
python3 /sbom/check_usage_policy.py --pipelinebreak "$BREAK_ENABLED" /sbom/evaluated_sbom.csv
