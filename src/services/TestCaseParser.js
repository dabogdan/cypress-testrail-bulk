class TestCaseParser {
    /**
     *
     * @param title
     * @returns {string[]|*[]}
     */
    searchCaseId(title) {
        // const trimmedTitle = title.trim();

        const foundCases = [];
        const regex = /[C][0-9]+/;
        if (title.match(regex)) {
            const cases = title.split(' ');
            
            cases.forEach((singleCase) => {
                if (singleCase.match(regex) && singleCase.startsWith('C')) {
                    singleCase = singleCase.replace('C', '');
                    singleCase = singleCase.replace(':', '');
                    singleCase = singleCase.replace(',', '');
                    foundCases.push(singleCase);
                }
            });
        }

        return foundCases;
    }
}

module.exports = TestCaseParser;
