<p align="center">
   <img width="200px" src="/assets/cypress.jpg">
</p>
<h1 align="center">Cypress TestRail Integration</h1>


This integration helps you to automatically send test results to TestRail.

Simply add your TestRail credentials in Cypress, decide which test results should be sent to TestRail and you're done!

This is a `TestRail-driven` workflow, so your QA team will always be in charge of the TestRail documentation and Cypress will only work as a testing client and does **not modify** anything in your test cases anymore.

Define new test cases in TestRail, and add automation to it, when you are ready.

### 1. Installation

### 2. Setup TestRail credentials

### 3. Register Plugin

import '../../vendor/cypress-testrail';

### 4. Map Test Cases

That's it.
You can now start Cypress (restart after config changes), and all your results should be sent to TestRail as soon as your mapped tests pass or faiil!

### Copying / License

This repository is distributed under the MIT License (MIT). You can find the whole license text in the [LICENSE](LICENSE) file.
