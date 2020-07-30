// JavaScript source code
'use strict';
console.log('Running Delete Assemblies Test');

// Generated by Selenium IDE
const { Builder, By, Key, until, a, WebElement, promise, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const assert = require('assert');

var driver;
var myArgs = process.argv.slice(2);

(async function deleteAssemblies() {

    let chromeCapabilities = Capabilities.chrome();
    var firefoxOptions = new firefox.Options();

    // Docker linux chrome will only run headless
    if ((myArgs[1] == 'headless') && (myArgs.length !=0)) {
    
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

    // Step # | name | target | value
    // 1 | open | https://ooi-cgrdb-staging.whoi.net/ | 
    await driver.get("https://ooi-cgrdb-staging.whoi.net/");
    // 2 | setWindowSize | 1304x834 | 
     await driver.manage().window().setRect({ width: 1304, height: 834 });

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
        await driver.findElement(By.css(".primaryAction")).click();

        // DELETE ASSEMBLIES TEST

       // Searches for and deletes the Assemblies added during the Add and Update Assemblies Test
	await new Promise(r => setTimeout(r, 4000));  //required for firefox
        await driver.wait(until.elementLocated(By.id("searchbar-query")));
        await driver.findElement(By.id("searchbar-query")).click();
        var dropdown = await driver.findElement(By.id("searchbar-modelselect"));
        await dropdown.findElement(By.xpath("//option[. = 'Assembly Templates']")).click();
        // 16 | type | id=searchbar-query | Test Assembly 2
        await driver.findElement(By.id("searchbar-query")).sendKeys("Test Assembly");
        // 17 | click | css=.btn-outline-primary:nth-child(1) | 
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();
        // 18 | click | linkText=123-002 | 
        await driver.wait(until.elementLocated(By.linkText("123-001")));
        await driver.findElement(By.linkText("123-001")).click();
 
        // 13 | click | linkText=Delete | 
  	await new Promise(r => setTimeout(r, 4000));  //required for firefox
        await driver.findElement(By.linkText("Delete")).click();
        // 14 | click | css=.btn-danger | 
        await driver.wait(until.elementLocated(By.css(".btn-danger")));
        await driver.findElement(By.css(".btn-danger")).click();

        // 15 | click | id=searchbar-query | 
	await new Promise(r => setTimeout(r, 4000));  //required for firefox
        await driver.wait(until.elementLocated(By.id("searchbar-query")));
        await driver.findElement(By.id("searchbar-query")).click();
        // 16 | type | id=searchbar-query | Test Assembly 2
        await driver.findElement(By.id("searchbar-query")).sendKeys("Test Assembly 2");
        // 17 | click | css=.btn-outline-primary:nth-child(1) | 
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();
        // 18 | click | linkText=123-002 | 
        await driver.wait(until.elementLocated(By.linkText("123-002")));
        await driver.findElement(By.linkText("123-002")).click();
        // 22 | click | linkText=Delete | 
        await new Promise(r => setTimeout(r, 4000));  //required for firefox
        await driver.findElement(By.linkText("Delete")).click();
        // 23 | click | css=.btn-danger | 
        await driver.wait(until.elementLocated(By.css(".btn-danger")));
        await driver.findElement(By.css(".btn-danger")).click();

        // 24 | click | id=searchbar-query | 
	await new Promise(r => setTimeout(r, 4000));  //required for firefox
        await driver.wait(until.elementLocated(By.id("searchbar-query")));
        await driver.findElement(By.id("searchbar-query")).click();
        // 25 | type | id=searchbar-query | Test Assembly 3
        await driver.findElement(By.id("searchbar-query")).sendKeys("Test Assembly 3");
        // 26 | click | css=.btn-outline-primary:nth-child(1) | 
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();
        // 27 | click | linkText=123-003 | 
        await driver.wait(until.elementLocated(By.linkText("123-003")));
        await driver.findElement(By.linkText("123-003")).click();
        // 28 | click | linkText=Delete | 
        await new Promise(r => setTimeout(r, 4000));  //required for firefox
        await driver.findElement(By.linkText("Delete")).click();
        // 29 | click | css=.btn-danger | 
        await driver.wait(until.elementLocated(By.css(".btn-danger")));
        await driver.findElement(By.css(".btn-danger")).click();

        // 30 | click | id=searchbar-query | 
        await new Promise(r => setTimeout(r, 6000));  //required for firefox
        await driver.findElement(By.id("searchbar-query")).click();
        // 31 | type | id=searchbar-query | Test Glider 1
        await driver.findElement(By.id("searchbar-query")).sendKeys("Test Glider 1");
        // 32 | click | css=.btn-outline-primary:nth-child(1) | 
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();
        // 33 | click | linkText=000-654-987 | 
        await driver.wait(until.elementLocated(By.linkText("000-654-987")));
        await driver.findElement(By.linkText("000-654-987")).click();
        // 34 | click | linkText=Delete | 
        await new Promise(r => setTimeout(r, 4000));  //required for firefox
        await driver.findElement(By.linkText("Delete")).click();
        // 35 | click | css=.btn-danger | 
        await driver.wait(until.elementLocated(By.css(".btn-danger")));
        await driver.findElement(By.css(".btn-danger")).click();

        // Close browser window
        driver.quit();

    }
    catch (e) {
        console.log(e.message, e.stack);
        console.log("Delete Assemblies failed.");
        throw (e);
	return false;
    } 

    console.log("Delete Assemblies completed.")
    return true;

})();