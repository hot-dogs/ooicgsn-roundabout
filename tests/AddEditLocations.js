// JavaScript source code
'use strict';
console.log('Running Add & Edit Locations Test');

// Generated by Selenium IDE
const { Builder, By, Key, until, a, WebElement, promise } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const assert = require('assert');

var driver;
var dropdown;
var myArgs = process.argv.slice(2);

(async function testLocations() {

    // First argument specifies the Browser type, chrome is default if no argument is supplied
    if ((myArgs[0] == 'chrome') || (myArgs.length == 0)) {        
        driver = new Builder().forBrowser('chrome').build();
    }
    else {       
        driver = new Builder().forBrowser('firefox').build();
    }

    // Step # | name | target | value
    // 1 | open | https://ooi-cgrdb-staging.whoi.net/ | 
    await driver.get("https://ooi-cgrdb-staging.whoi.net/");
    // 2 | setWindowSize | 1304x834 | 
    await driver.manage().window().setRect({ width: 1304, height: 834 });
    // Set implicit wait between commands in  - still need promise wait
 //   driver.manage().setTimeouts({ implicit: 2000});  //Do not mix implicit and explicit waits.
    

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
        await driver.findElement(By.id("id_login")).sendKeys("jkoch");
        await driver.findElement(By.id("id_password")).sendKeys("Automatedtests");
        await driver.findElement(By.css(".primaryAction")).click()

        // ADD LOCATIONS TEST

        // Add location with unique name
        // 10 | click | id=navbarTemplates |
        await driver.findElement(By.id("navbarTemplates")).click();
        // 11 | click | linkText=Locations | 
        await driver.findElement(By.linkText("Locations")).click();
        // 12 | click | linkText=Add Location | 
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.linkText("Add Location")).click();
        //TO DO: ADD WAIT - next stmt only works stepping in debugger
        await driver.wait(until.elementLocated(By.id("id_name")));
        // 14 | type | id=id_name | Test
        await driver.findElement(By.id("id_name")).sendKeys("Test");
        // 15 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();

        // Add location with non-unique name
        // 16 | click | linkText=Add Location |
        await driver.wait(until.elementLocated(By.linkText("Add Location")));
        await driver.findElement(By.linkText("Add Location")).click();
        // 17 | type | id=id_name | Test
        await driver.wait(until.elementLocated(By.id("id_name")), 90000);  //this wait required
        await driver.findElement(By.id("id_name")).sendKeys("Test");
        // 18 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();

        //await driver.wait(until.elementLocated(By.linkText("Test")), 90000); //this wait doesn't work here

        // Rename to unique name for test automation
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.linkText("Test")).click();
        await driver.wait(until.elementLocated(By.linkText("Edit Location")), 2000);
        await driver.findElement(By.linkText("Edit Location")).click();
        await driver.wait(until.elementLocated(By.id("id_name")));
        // 12 | type | id=id_name | Test
        await driver.findElement(By.id("id_name")).clear();
        await driver.findElement(By.id("id_name")).sendKeys("Test1");
        // 14 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();

        // Add child location with unique name
        // 19 | click | linkText=Add Location |
        await driver.wait(until.elementLocated(By.linkText("Add Location")), 2000);
        await driver.findElement(By.linkText("Add Location")).click();
        // 20 | type | id=id_name | Test Child
        await driver.wait(until.elementLocated(By.id("id_name")));
        await driver.findElement(By.id("id_name")).sendKeys("Test Child");
        // 21 | select | id=id_parent | label=Test from dropdown
        dropdown = await driver.findElement(By.id("id_parent"));
        await dropdown.findElement(By.xpath("//option[. = ' Test']")).click(); //need space before Test
        // 24 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();

        // Add child location with name in parent group
        // 26 | click | linkText=Add Location |
        await driver.wait(until.elementLocated(By.linkText("Add Location")));
        await driver.findElement(By.linkText("Add Location")).click();
        // 27 | type | id=id_name | Test Child
        //   await driver.wait(until.elementLocated(By.id("id_name")), 90000);
        await driver.wait(until.elementLocated(By.id("id_name")));
        await driver.findElement(By.id("id_name")).sendKeys("Test Child");
        // 21 | select | id=id_parent | label=Test from dropdown
        dropdown = await driver.findElement(By.id("id_parent"));
        await dropdown.findElement(By.xpath("//option[. = ' Test']")).click(); //need space before Test
        // 24 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();


        // EDIT LOCATIONS TEST

        //    await activeTest.click(); //doesn't work - saved id from the add

        // Rename location with unique name
        // Timeout needed here to avoid staleelementreferenceerror (ajax) when not running in debugger
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.linkText("Test")).click();
        // 6 | click | linkText=Edit Location | 
        await driver.wait(until.elementLocated(By.linkText("Edit Location")));
        await driver.findElement(By.linkText("Edit Location")).click();
        // 8 | type | id=id_name | Test1
        await driver.wait(until.elementLocated(By.id("id_name")));
        await driver.findElement(By.id("id_name")).clear();
        await driver.findElement(By.id("id_name")).sendKeys("Test1");
        // 9 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();

        // Rename location with non-unique name
        // 10 | click | linkText=Edit Location |
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.linkText("Edit Location")).click();
        await driver.wait(until.elementLocated(By.id("id_name")));
        // 12 | type | id=id_name | Test
        await driver.findElement(By.id("id_name")).clear();
        await driver.findElement(By.id("id_name")).sendKeys("Test");
        // 14 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();
        await new Promise(r => setTimeout(r, 2000));

        // Child location renamed with name unique to parent group
        await new Promise(r => setTimeout(r, 2000));   // needed extra wait
        await driver.findElement(By.linkText("Test Child")).click();
        await new Promise(r => setTimeout(r, 2000));   //only wait works here
        // 17 | click | linkText=Edit Location | 
        await driver.findElement(By.linkText("Edit Location")).click();
        // 18 | click | id=id_name | 
        await driver.wait(until.elementLocated(By.id("id_name")));
        // 19 | type | id=id_name | Test Child1
        await driver.findElement(By.id("id_name")).clear();
        await driver.findElement(By.id("id_name")).sendKeys("Test Child1");
        // 20 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();

        // Child location renamed with name existing in parent group
        await new Promise(r => setTimeout(r, 2000));
        // 21 | click | linkText=Edit Location |
        await driver.findElement(By.linkText("Edit Location")).click();
        await driver.wait(until.elementLocated(By.id("id_name")));
        // 23 | type | id=id_name | Test Child
        await driver.findElement(By.id("id_name")).clear();
        await driver.findElement(By.id("id_name")).sendKeys("Test Child");
        // 24 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();

        // // Rename to unique name for test automation
        await new Promise(r => setTimeout(r, 2000));
        // 21 | click | linkText=Edit Location |
        await driver.findElement(By.linkText("Edit Location")).click();
        await driver.wait(until.elementLocated(By.id("id_name")));
        // 23 | type | id=id_name | Test Child
        await driver.findElement(By.id("id_name")).clear();
        await driver.findElement(By.id("id_name")).sendKeys("Test Child1");
        // 24 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();

        //Child location parent changed to itself
        // 25 | click | linkText=Edit Location |
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.linkText("Test Child")).click();
        await driver.wait(until.elementLocated(By.linkText("Edit Location")));
        await driver.findElement(By.linkText("Edit Location")).click();
        // 26 | click | id=id_parent | 
        await driver.wait(until.elementLocated(By.id("id_parent")));
        await driver.findElement(By.id("id_parent")).click();
        // 27 | select | id=id_parent | label=--- Test Child
        {
            dropdown = await driver.findElement(By.id("id_parent"));
            await dropdown.findElement(By.xpath("//option[. = '--- Test Child']")).click();
        }
        // 28 | click | id=id_parent | 
        await driver.findElement(By.id("id_parent")).click();
        // 29 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();
        await new Promise(r => setTimeout(r, 2000));

        //Verify warning message: Location Parent cannot be self
        try {
            assert(await driver.findElement(By.css("#div_id_parent .ajax-error")).getText() == "Location Parent cannot be self");
        } catch (e) {
            console.log("ERROR: Location Parent cannot be self error not found");
            throw (e);
        }

        // Close browser window
           driver.quit();

    }
    catch (e)
    {
        console.log(e.message, e.stack);
        console.log("Add Edit Locations failed.");
        throw (e);
    }

    console.log("Add Edit Locations completed.");
    return;

})();
