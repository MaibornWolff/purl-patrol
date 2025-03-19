import * as assert from 'assert';
import * as path from 'path';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

import {describe, it} from 'node:test';


const dirname = "./dist/helpers/"
describe('The required SBOM path does not exist', function () {
    let tr: ttm.MockTestRunner;
    let tp = path.join(dirname, 'sbom-path-not-found.js');
    tr = new ttm.MockTestRunner(tp); 

    it("should fail due to sbom file not found", {timeout:5000}, async() => {
        await tr.runAsync();
        assert.equal(tr.failed, true, 'The task should have failed');
        assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], "Not found ./invalid/path/secobserve.cdx.json", "Error message should include that the sbom path was not found");
        assert.notEqual(tr.stdout.includes("Docker ran successfully"), true, 'Should not include the string "Docker ran successfully' )
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.notEqual(tr.stdout.indexOf('Running PURL Patrol...') >= 0, true, "should not display Running PURL Patrol...");
        assert.notEqual(tr.stdout.indexOf('PURL Patrol completed successfully') >= 0, true, "should not display PURL Patrol completed successfully");
    });
});

