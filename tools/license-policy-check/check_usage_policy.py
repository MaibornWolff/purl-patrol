import argparse
import csv
import sys

from tabulate import tabulate


def filterPurls(purl, ignore_list):
    return any(
        purl.startswith("pkg:" + package_type + "/") for package_type in ignore_list
    )


def main(input_file, pipeline_break, ignore_pkg_types):
    return_code = 0
    try:
        with open(input_file, "r") as file:
            reader = csv.reader(file)
            sbom_license_evaluation = list(reader)

            ignore_list = ignore_pkg_types.split(",") if ignore_pkg_types else []
            ignore_list = [x.strip() for x in ignore_list]

            for row in sbom_license_evaluation:
                # remove license-type column from the sbom_license_evaluation
                del row[1]
                for _ in range(3, 12):
                    del row[3]

            headers = sbom_license_evaluation[0]
            rows_without_header = sbom_license_evaluation[1:]

            non_compliant_licenses = []
            for dependency_evaluation in rows_without_header:
                purl = dependency_evaluation[3]

                if filterPurls(purl, ignore_list):
                    continue

                # usage-policy is the first column
                usage_policy = dependency_evaluation[0]
                # Check if the usage-policy is UNDEFINED, needs-review, or deny
                if usage_policy == "UNDEFINED" or usage_policy == "needs-review":
                    non_compliant_licenses.append(dependency_evaluation)
                elif usage_policy == "deny":
                    # colors "deny" red in console
                    dependency_evaluation[0] = (
                        "\033[31m" + dependency_evaluation[0] + "\033[39m"
                    )
                    non_compliant_licenses.append(dependency_evaluation)
                    return_code = 1

            print(tabulate(non_compliant_licenses, tablefmt="pretty", headers=headers))

    except FileNotFoundError:
        print(f"File not found: {input_file}")
        sys.exit(1)
    except Exception as e:
        print(f"An error occurred: {e}")
        sys.exit(1)

    if pipeline_break:
        sys.exit(return_code)
    else:
        sys.exit(0)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("filename")
    parser.add_argument("--pipelinebreak", "-p", type=str)
    parser.add_argument("--ignore-pkg-types", "-i", dest="ignore_pkg_types", type=str)
    args = parser.parse_args()
    main(args.filename, args.pipelinebreak == "true", args.ignore_pkg_types)
