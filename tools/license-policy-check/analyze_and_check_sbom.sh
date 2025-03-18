#!/bin/sh
# shellcheck shell=dash

LICENSE_POLICY_PATH="${LICENSE_POLICY_PATH:-/sbom/mw_license_policy.json}"
BREAK_ENABLED="${BREAK_ENABLED:-true}"

if [ -z "$SBOM_PATH" ] || [ -z "$LICENSE_POLICY_PATH" ] || [ -z "$BREAK_ENABLED" ]; then
  echo "Missing variables in check script. Please check SBOM_PATH or LICENSE_POLICY_PATH or BREAK_ENABLED"
  exit 1
fi
/sbom/sbom-utility license list --input-file="$SBOM_PATH" --format=csv --summary --config-license="$LICENSE_POLICY_PATH" -o="evaluated_sbom.csv"
python3 /sbom/check_usage_policy.py --pipelinebreak "$BREAK_ENABLED" /github/workspace/evaluated_sbom.csv
