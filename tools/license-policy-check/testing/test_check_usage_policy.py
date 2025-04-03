import os
import sys
import unittest
from io import StringIO
from unittest.mock import patch

import pytest

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from check_usage_policy import main

test_evaluated_sbom_non_compliant_licenses = (
    "+--------------+-------------------------------------------------------------------------------"
    "-----+---------------+---------------------+--------------+\n"
    "| usage-policy |                                      "
    "license                                       | resource-name |       "
    "bom-ref       | bom-location |\n"
    "+--------------+-------------------------------------------------------------------------------"
    "-----+---------------+---------------------+--------------+\n"
    "|     \x1b[31mdeny\x1b[39m     | License :: OSI Approved :: GNU Lesser "
    "General Public License v2 or later (LGPLv2+) |    chardet    |   "
    "chardet==5.2.0    |  components  |\n"
    "| needs-review |          License :: OSI Approved :: Mozilla Public License "
    "2.0 (MPL 2.0)           |     fqdn      |     fqdn==1.5.1     |  components  "
    "|\n"
    "|  UNDEFINED   |                         declared license of "
    "'uri-template'                         | uri-template  | uri-template==1.3.0 "
    "|  components  |\n"
    "+--------------+-------------------------------------------------------------------------------"
    "-----+---------------+---------------------+--------------+\n"
)


class TestCheckUsagePolicy(unittest.TestCase):
    @patch("sys.stdout", new_callable=StringIO)
    def test_undefined(self, mock_stdout):
        with pytest.raises(SystemExit) as e:
            main("test_evaluated_sbom.csv", False)
        output = mock_stdout.getvalue()
        assert output.find("UNDEFINED") != -1
        assert e.value.code == 0

    @patch("sys.stdout", new_callable=StringIO)
    def test_needs_review(self, mock_stdout):
        with pytest.raises(SystemExit) as e:
            main("test_evaluated_sbom.csv", False)
        output = mock_stdout.getvalue()
        assert output.find("needs-review") != -1
        assert e.value.code == 0

    @patch("sys.stdout", new_callable=StringIO)
    def test_deny(self, mock_stdout):
        with pytest.raises(SystemExit) as e:
            main("test_evaluated_sbom.csv", False)
        output = mock_stdout.getvalue()
        assert output.find("deny") != -1
        assert e.value.code == 0

    @patch("sys.stdout", new_callable=StringIO)
    def test_allowed(self, mock_stdout):
        with pytest.raises(SystemExit) as e:
            main("test_evaluated_sbom.csv", False)
        output = mock_stdout.getvalue()
        assert output.find("allow") == -1
        assert e.value.code == 0

    @patch("sys.stdout", new_callable=StringIO)
    def test_all_allowed(self, mock_stdout):
        with pytest.raises(SystemExit) as e:
            main("test_evaluated_sbom_only_allowed.csv", False)
        output = mock_stdout.getvalue()
        assert output.find("allow") == -1
        assert e.value.code == 0

    @patch("sys.stdout", new_callable=StringIO)
    def test_non_compliant_licenses(self, mock_output):
        with pytest.raises(SystemExit) as e:
            main("test_evaluated_sbom.csv", False)
        output = mock_output.getvalue()
        assert output == test_evaluated_sbom_non_compliant_licenses
        assert e.value.code == 0

    def test_file_not_found(self):
        with pytest.raises(SystemExit) as e:
            main("non_existing_file.csv", False)
        assert e.value.code == 1

    def test_empty_file(self):
        with pytest.raises(SystemExit) as e:
            main("test_empty_evaluated_sbom.csv", False)
        assert e.value.code == 1

    def test_non_compliant_licenses_pipeline_break(self):
        with pytest.raises(SystemExit) as e:
            main("test_evaluated_sbom.csv", True)
        assert e.value.code == 1
