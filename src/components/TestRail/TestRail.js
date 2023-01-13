const ColorConsole = require('../../services/ColorConsole');
const ApiClient = require('./ApiClient');

class TestRail {
    /**
     *
     * @param domain
     * @param username
     * @param password
     * @param isScreenshotsEnabled
     */
    constructor(domain, username, password, isScreenshotsEnabled) {
        this.client = new ApiClient(domain, username, password);
        this.isScreenshotsEnabled = isScreenshotsEnabled;
    }

    /**
     *
     * @param projectId
     * @param milestoneId
     * @param suiteId
     * @param name
     * @param description
     * @param callback
     * @returns {Promise<AxiosResponse<*>>}
     */
    createRun(projectId, milestoneId, suiteId, name, description, callback) {
        const postData = {
            name: name,
            description: description,
            include_all: false,
            case_ids: [],
        };

        if (milestoneId !== '') {
            postData['milestone_id'] = milestoneId;
        }

        if (suiteId !== '') {
            postData['suite_id'] = suiteId;
        }

        return this.client.sendData(
            '/add_run/' + projectId,
            postData,
            (response) => {
                ColorConsole.success('  TestRun created in TestRail: ' + name);
                // notify our callback
                callback(response.data.id);
            },
            (statusCode, statusText, errorText) => {
                ColorConsole.error('  Could not create TestRail run for project P' + projectId + ': ' + statusCode + ' ' + statusText + ' >> ' + errorText);
                ColorConsole.debug('');
            }
        );
    }

    /**
     *
     * @param runId
     * @param caseIds
     * @returns {Promise<AxiosResponse<any>>}
     */
    updateRun(runId, caseIds) {
        const postData = {
            include_all: false,
            case_ids: caseIds,
        };

        return this.client.sendData(
            '/update_run/' + runId,
            postData,
            () => {
                ColorConsole.success('  TestRun updated in TestRail: ' + runId);
            },
            (statusCode, statusText, errorText) => {
                ColorConsole.error('  Could not add TestRail test cases to run R' + runId + ': ' + statusCode + ' ' + statusText + ' >> ' + errorText);
                ColorConsole.debug('');
            }
        );
    }

    /**
     *
     * @param runId
     * @param onSuccess
     */
    closeRun(runId, onSuccess) {
        return this.client.sendData(
            '/close_run/' + runId,
            {},
            () => {
                onSuccess();
            },
            (statusCode, statusText, errorText) => {
                ColorConsole.error('  Could not close TestRail run R' + runId + ': ' + statusCode + ' ' + statusText + ' >> ' + errorText);
                ColorConsole.debug('');
            }
        );
    }

    /**
     *
     * @param runID
     * @param result
     */
    sendResult(runID, result) {
        const data = result.map(res => {
            return {
                case_id: res.getCaseId(),
                status_id: res.getStatusId(),
                comment: res.getComment().trim(),
            }
        })

        // 0s is not valid
        result.forEach((res, i) => {
            if (res.getElapsed() !== '0s') {
                data[i].elapsed = res.getElapsed();
            }}
        )

        const postData = { results: [...data] }

        return this.client.sendData(
            '/add_results_for_cases/' + runID,
            postData,
            (response) => {
                ColorConsole.success('Test results are sent to TestRail for TestCases: ' + result.map(res => res.getCaseId()))

                result.forEach((result, i)=> {
                    if (this.isScreenshotsEnabled && result.getScreenshotPath() !== null && result.getScreenshotPath() !== '') {
                        ColorConsole.debug('    sending screenshot to TestRail for TestCase C' + result.getCaseId());
                        this.client.sendScreenshot(response.data[i].id, result.getScreenshotPath(), null, null);
                    }    
                });
                
            },
            (statusCode, statusText, errorText) => {
                ColorConsole.error('  Could not send TestRail result for test cases ' + result.map(res => res.getCaseId()) + ': ' + statusCode + ' ' + statusText + ' >> ' + errorText);
                ColorConsole.debug('');
            }
        );
    }
}

module.exports = TestRail;
