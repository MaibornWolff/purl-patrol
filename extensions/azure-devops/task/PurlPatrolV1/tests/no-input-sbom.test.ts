import * as assert from 'assert';
import * as path from 'path';
import * as ttm from 'azure-pipelines-task-lib/mock-test';
import {describe, it, before} from 'node:test';


const dirname = "./dist/helpers/"
describe('The required SBOM path input is not provided', function () {
    let tr: ttm.MockTestRunner;

    before(async function() {
        let tp = path.join(dirname, 'no-input-sbom.js');
        tr = new ttm.MockTestRunner(tp);
        await tr.runAsync();
    });

    it("should have ran", function() {
        assert.ok(tr.ran);
    });

    it("should fail", function() {
        assert.equal(tr.failed, true);
    });

    it("should have exactly one error issue", function() {
        assert.equal(tr.errorIssues.length, 1);
    });

    it("should have error about missing SBOMPATH input", function() {
        assert.equal(tr.errorIssues[0], "Input required: SBOMPATH");
    });

    it("should not show Docker ran successfully", function() {
        assert.equal(tr.stdout.includes("Docker ran successfully"), false);
    });

    it("should have no warnings", function() {
        assert.deepEqual(tr.warningIssues, []);
    });

    it("should not display 'Running PURL Patrol...'", function() {
        assert.equal(tr.stdout.includes('Running PURL Patrol...'), false);
    });

    it("should not display 'PURL Patrol completed successfully'", function() {
        assert.equal(tr.stdout.includes('PURL Patrol completed successfully'), false);
    });
});
