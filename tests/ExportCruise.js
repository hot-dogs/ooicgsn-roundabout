// JavaScript source code
'use strict';
console.log("Running Export Cruise Test.");

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


(async function calibrations() {

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

        // EXPORT CRUISE TEST

        // Add a Vessel
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
        while ((await driver.findElements(By.linkText("Add Vessel"))).length == 0) {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Add Vessel.");
        }
        await driver.findElement(By.linkText("Add Vessel")).click()
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.id("id_prefix")).sendKeys("MS")
        await driver.findElement(By.id("id_vessel_designation")).sendKeys("MP")
        await driver.findElement(By.id("id_vessel_name")).sendKeys("Maui Princess")
        await driver.findElement(By.id("id_ICES_code")).sendKeys("2234")
        await driver.findElement(By.id("id_operator")).sendKeys("Koch")
        await driver.findElement(By.id("id_call_sign")).sendKeys("Prin")
        await driver.findElement(By.id("id_MMSI_number")).sendKeys("100000000")
        await driver.findElement(By.id("id_IMO_number")).sendKeys("1000000")
        await driver.findElement(By.id("id_length")).sendKeys("999.9")
        await driver.findElement(By.id("id_max_speed")).sendKeys("99.9")
        await driver.findElement(By.id("id_max_draft")).sendKeys(".1")
        await driver.findElement(By.id("id_designation")).sendKeys("5")
        await driver.findElement(By.id("id_notes")).sendKeys("Deep water vessel.")
        await driver.findElement(By.css(".btn-primary")).click()

        // Add a Cruise
        while ((await driver.findElements(By.linkText("Cruises"))).length == 0) {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Cruises.");
        }
        await driver.findElement(By.linkText("Cruises")).click()
        while ((await driver.findElements(By.id("action"))).length == 0) {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Action2.");
        }
        await driver.findElement(By.id("action")).click()
        while ((await driver.findElements(By.linkText("Add Cruise"))).length == 0) {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Add Cruise.");
        }
        await driver.findElement(By.linkText("Add Cruise")).click()
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.id("id_CUID")).sendKeys("MAUI")
        await driver.findElement(By.id("id_friendly_name")).sendKeys("Sunset Cruise")
        await driver.findElement(By.id("id_vessel")).sendKeys("MP Maui Princess")
        await driver.findElement(By.id("id_cruise_start_date")).sendKeys(Key.DELETE)
        await driver.findElement(By.id("id_cruise_start_date")).sendKeys("11/04/2020 00:00")
        await driver.findElement(By.id("id_cruise_stop_date")).sendKeys("1/03/2021 00:00")
        await driver.findElement(By.id("id_notes")).sendKeys("Sunset Cruise.")
        {
            const dropdown = await driver.findElement(By.id("id_location"))
            await dropdown.findElement(By.xpath("//option[. = ' Test']")).click()
        }  
        await driver.findElement(By.css(".controls > .btn")).click()
        await new Promise(r => setTimeout(r, 4000));

        // Export Cruise and Vessel
        await driver.findElement(By.id("navbarAdmintools")).click();
        while ((await driver.findElements(By.linkText("Bulk Download Tool"))).length == 0) {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Bulk Download.");
        }
        await driver.findElement(By.linkText("Bulk Download Tool")).click();
        while ((await driver.findElements(By.linkText("Export Cruises"))).length == 0) {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for Export Cruises.");
        }
        await driver.findElement(By.linkText("Export Cruises")).click();
        await new Promise(r => setTimeout(r, 4000));
        await driver.findElement(By.linkText("Export Vessels")).click();

        //Read in the Exported Data and Verify it's correct
        var fs = require('fs');
        const jsdom = require("jsdom");
        const { JSDOM } = jsdom;
        const { window } = new JSDOM(`...`);
        var $ = require('jquery')(window);
        $.csv = require('jquery-csv');
        var data;

        if (myArgs[1] == 'headless') {
            var rdb_ves = process.cwd() + "/shiplist.csv";
            var rdb_cru = process.cwd() + "/CruiseInformation.csv";
        }
        else {
            const execSync = require('child_process').execSync;
            var username = execSync('echo %username%', { encoding: 'utf-8' });
            username = username.replace(/[\n\r]+/g, '');
            var rdb_ves = "C:\\Users\\" + username + "\\Downloads\\shiplist.csv";
            var rdb_cru = "C:\\Users\\" + username + "\\Downloads\\CruiseInformation.csv";
        }

        // Read in the exported Vessel csv data  
        while (!fs.existsSync(rdb_ves)) // wait for file download
        {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for File Download.");
        }    	
        var csv = fs.readFileSync(rdb_ves, 'utf8');
        var exported_data = $.csv.toArrays(csv);
 
        if ((exported_data[1][0] == "MS") &&
            (exported_data[1][1] == "MP") &&
            (exported_data[1][2] == "Maui Princess") &&
            (exported_data[1][3] == "2234") &&
            (exported_data[1][4] == "Koch") &&
            (exported_data[1][5] == "Prin") &&
            (exported_data[1][6] == "100000000") &&
            (exported_data[1][7] == "1000000") &&
            (exported_data[1][8] == "999.9") &&
            (exported_data[1][9] == "99.9") &&
            (exported_data[1][10] == "0.1") &&
            (exported_data[1][11] == "5") &&
            (exported_data[1][12] == "Y") &&
            (exported_data[1][13] == "Y")) {
                console.log("Export Vessel Fields Match.");
        }
        else
        {
            console.log("Export Vessel Fields Do Not Match.");
        }
 
        // Read in the exported Cruise csv data  
        while (!fs.existsSync(rdb_cru)) // wait for file download
        {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for File Download.");
        }
        csv = fs.readFileSync(rdb_cru, 'utf8');
        exported_data = $.csv.toArrays(csv);

        if ((exported_data[1][0] == "MAUI") &&
            (exported_data[1][1] == "Maui Princess") &&
            (exported_data[1][2] == "2020-11-04T00:00:00") &&
            (exported_data[1][3] == "2021-01-03T00:00:00") &&
            (exported_data[1][4] == "Sunset Cruise."))
        {
            console.log("Export Vessel Fields Match.");
        }
        else
        {
            console.log("Export Vessel Fields Do Not Match.");
        }



        // Close browser window
        driver.quit();

    }
    catch (e) {
        console.log(e.message, e.stack);
        console.log("Export Cruise failed.");
        return 1;
    }
    console.log("Export Cruise completed.");
    return 0;

})();
