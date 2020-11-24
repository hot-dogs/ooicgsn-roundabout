// JavaScript source code
'use strict';
console.log("Running Delete Cruise/Vessel Test.");

// Generated by Selenium IDE
const { Builder, By, Key, until, a, WebElement, promise, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const assert = require('assert');
const fs = require('fs');

var driver;
var myArgs = process.argv.slice(2);
var user;
var password;


(async function deleteCruise() {

    let chromeCapabilities = Capabilities.chrome();
    var firefoxOptions = new firefox.Options();

    // Docker linux chrome will only run headless
    if ((myArgs[1] == 'headless') && (myArgs.length != 0)) {

        chromeCapabilities.set("goog:chromeOptions", {
            args: [
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--headless",
                "--log-level=3",
                "--disable-gpu"
            ]
        });

        firefoxOptions.addArguments("-headless");
    }

    // First argument specifies the Browser type
    if (myArgs[0] == 'chrome') {
        driver = new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
    }
    else if (myArgs[0] == 'firefox') {
        driver = new Builder().forBrowser('firefox').setFirefoxOptions(firefoxOptions).build();
    }
    else {
        console.log('Error: Missing Arguments');
    }

    if (myArgs[2] == 'admin') {
        await driver.get("http://localhost:8000/");
        user = "admin";
        password = "admin";
    }
    else {
        //        await driver.get("https://ooi-cgrdb-staging.whoi.net/");
        await driver.get("https://rdb-testing.whoi.edu/");
        user = "jkoch";
        password = "Automatedtests";
    }

    // 2 | setWindowSize | 1304x834 | 
    await driver.manage().window().setRect({ width: 1304, height: 834 });
    // Set implict wait time in between steps
    await driver.manage().setTimeouts({ implicit: 2000 });

    //Hide Timer Panel when connecting to circleci local rdb django app
    if ((await driver.findElements(By.css("#djHideToolBarButton"))).length != 0) {
        await driver.findElement(By.css("#djHideToolBarButton")).click();
    }

    try {

        // If navbar toggler present in small screen
        try {
            var signin = await driver.findElement(By.linkText("Sign In"));
        }
        catch (NoSuchElementException) {
            await driver.findElement(By.css(".navbar-toggler-icon")).click();
        }
        // LOGIN
        await driver.findElement(By.linkText("Sign In")).click();
        await driver.findElement(By.id("id_login")).sendKeys(user);
        await driver.findElement(By.id("id_password")).sendKeys(password);
        await driver.findElement(By.css(".primaryAction")).click();

        // DELETE CRUISE/VESSEL TEST

        // Delete a Vessel
        // TO DO: When Ethan fixes warning there are active cruises, put that in
        await driver.findElement(By.linkText("Cruises")).click()
        while ((await driver.findElements(By.id("action"))).length == 0)
        {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Action.");
        }
        await driver.findElement(By.id("action")).click()
        while ((await driver.findElements(By.linkText("Edit Vessel List"))).length == 0) {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Edit Vessel.");
        }
        await driver.findElement(By.linkText("Edit Vessel List")).click()
        await new Promise(r => setTimeout(r, 2000));

        // Delete all Vessels
        while ((await driver.findElements(By.css("tr:nth-child(" + 1 + ") .btn-danger"))).length != 0) {
            await driver.findElement(By.css("tr:nth-child(" + 1 + ") .btn-danger")).click();
            while ((await driver.findElements(By.css(".btn-danger"))).length == 0) {
                await new Promise(r => setTimeout(r, 2000));
                console.log("Wait 2 seconds for Confirm.");
            }
            await driver.findElement(By.css(".btn-danger")).click();
            await new Promise(r => setTimeout(r, 2000));
        }
 
	console.log("All Vessels Deleted.");

        // Delete All Cruises
        while ((await driver.findElements(By.linkText("Cruises"))).length == 0) {
            await new Promise(r => setTimeout(r, 4000));
            console.log("Wait 2 seconds for Cruises.");
        }
        await driver.findElement(By.linkText("Cruises")).click()
	await new Promise(r => setTimeout(r, 4000));

        while ((await driver.findElements(By.xpath("//li/ul/li/a"))).length != 0) {
            await driver.findElement(By.xpath("//li/ul/li/a")).click();

            while ((await driver.findElements(By.linkText("Delete"))).length == 0) {
                await new Promise(r => setTimeout(r, 2000));
                console.log("Wait 2 seconds for Delete Cruise.");
            }
            await driver.findElement(By.linkText("Delete")).click();

            while ((await driver.findElements(By.css(".btn-danger"))).length == 0) {
                await new Promise(r => setTimeout(r, 2000));
                console.log("Wait 2 seconds for Confirm.");
            }
            await driver.findElement(By.css(".btn-danger")).click();
            await new Promise(r => setTimeout(r, 4000));
        }

	console.log("All Cruises Deleted.");

        // Close browser window
        driver.quit();

    }
    catch (e) {
        console.log(e.message, e.stack);
        console.log("Delete Cruise/Vessel failed.");
        return 1;
    }
    console.log("Delete Cruise/Vessel completed.");
    return 0;

})();
