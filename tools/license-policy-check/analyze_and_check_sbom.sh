#!/bin/sh
# shellcheck shell=dash

LICENSE_POLICY_PATH="${LICENSE_POLICY_PATH:-/sbom/mw_license_policy.json}"
BREAK_ENABLED="${BREAK_ENABLED:-true}"
IGNORE_PKG_TYPES="${IGNORE_PKG_TYPES:=""}"

if [ -z "$SBOM_PATH" ] || [ -z "$LICENSE_POLICY_PATH" ] || [ -z "$BREAK_ENABLED" ] || [ -z "$IGNORE_PKG_TYPES" ]; then
  echo "Missing variables in check script. Please check SBOM_PATH or LICENSE_POLICY_PATH or BREAK_ENABLED"
  exit 1
fi
/sbom/sbom-utility license list --input-file="$SBOM_PATH" --format=csv --config-license="$LICENSE_POLICY_PATH" -o="evaluated_sbom.csv" --quiet
python3 /sbom/check_usage_policy.py --pipelinebreak "$BREAK_ENABLED" --ignore-pkg-types "$IGNORE_PKG_TYPES" evaluated_sbom.csv
