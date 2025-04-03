import * as assert from 'assert';
import * as path from 'path';
import * as ttm from 'azure-pipelines-task-lib/mock-test';
import {describe, it, before} from 'node:test';


const dirname = "./dist/helpers/"
describe('loading the pipeline task successfully with all inputs', function () {
    let tr: ttm.MockTestRunner;

    before(async function() {
        let tp = path.join(dirname, 'success-all-inputs.js');
        tr = new ttm.MockTestRunner(tp);
        await tr.runAsync();
    });

    it("should have ran", function() {
        assert.ok(tr.ran);
    });

    it("should succeed", function() {
        assert.equal(tr.succeeded, true);
    });

    it("should show Docker ran successfully", function() {
        assert.equal(tr.stdout.includes("Docker ran successfully"), true);
    });

    it("should have no errors", function() {
        assert.deepEqual(tr.errorIssues, []);
    });

    it("should have no warnings", function() {
        assert.deepEqual(tr.warningIssues, []);
    });

    it("should display 'Running PURL Patrol...'", function() {
        assert.match(tr.stdout, /Running PURL Patrol/);
    });

    it("should display 'PURL Patrol completed successfully'", function() {
        assert.match(tr.stdout, /PURL Patrol completed successfully/);
    });
});
