import * as assert from 'assert';
import * as path from 'path';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

import {describe, it} from 'node:test';


const dirname = "./dist/helpers/"
describe('The required SBOM path input is not provided', function () {
    let tr: ttm.MockTestRunner;
    let tp = path.join(dirname, 'no-input-sbom.js');
    tr = new ttm.MockTestRunner(tp); 

    it("should fail due to missing input", {timeout:5000}, async() => {
        await tr.runAsync();
        assert.equal(tr.failed, true, 'The task should have failed');
        assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], "Input required: SBOMPATH", "Error message should include missing sbom path input");
        assert.notEqual(tr.stdout.includes("Docker ran successfully"), true, 'Should not include the string "Docker ran successfully' )
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.notEqual(tr.stdout.indexOf('Running PURL Patrol...') >= 0, true, "should not display Running PURL Patrol...");
        assert.notEqual(tr.stdout.indexOf('PURL Patrol completed successfully') >= 0, true, "should not display PURL Patrol completed successfully");
        
    });
});


