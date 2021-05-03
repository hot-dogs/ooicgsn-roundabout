// JavaScript source code
'use strict';
console.log("Running Delete Assemblies Test.");

// Generated by Selenium IDE
const { Builder, By, Key, until, a, WebElement, promise, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const assert = require('assert');

var driver;
var myArgs = process.argv.slice(2);
var user;
var password;

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

   if (myArgs[2] == 'admin')
    {
        await driver.get("http://localhost:8000/");
        user = "admin";
        password = "admin";
    }
    else
    {
 //        await driver.get("https://ooi-cgrdb-staging.whoi.net/");
        await driver.get("https://rdb-testing.whoi.edu/");
        user = "jkoch";
        password = "Automatedtests";
    }

    // 2 | setWindowSize | 1304x834 | 
     await driver.manage().window().setRect({ width: 1304, height: 834 });

    //Hide Timer Panel when connecting to circleci local rdb django app
    if ((await driver.findElements(By.css("#djHideToolBarButton"))).length != 0)
    {
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

        // DELETE ASSEMBLIES TEST

       // Searches for and deletes the Assemblies added during the Add and Update Assemblies Test
	while ((await driver.findElements(By.id("searchbar-query"))).length == 0) // 1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Search.");
	}
        await driver.findElement(By.id("searchbar-query")).click();
        var dropdown = await driver.findElement(By.id("searchbar-modelselect"));
        await dropdown.findElement(By.xpath("//option[. = 'Assembly Templates']")).click();
        // 16 | type | id=searchbar-query | Test Assembly 2
        await driver.findElement(By.id("searchbar-query")).sendKeys("Test Assembly");
 	while ((await driver.findElements(By.css(".btn-outline-primary:nth-child(1)"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Link1.");
        }
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();
        // 18 | click | linkText=123-002 | 

	if ((await driver.findElements(By.linkText("Test Assembly"))).length != 0)
	{
            await driver.findElement(By.linkText("Test Assembly")).click();
 
 	    while ((await driver.findElements(By.linkText("Delete"))).length == 0)
	    {
	       await new Promise(r => setTimeout(r, 2000));
	     console.log("Wait 2 seconds for Delete1.");
	    }
            await driver.findElement(By.linkText("Delete")).click();
 	    while ((await driver.findElements(By.css(".btn-danger"))).length == 0)
	    {
	       await new Promise(r => setTimeout(r, 2000));
	     console.log("Wait 2 seconds for Confirm1.");
	    }
            await driver.findElement(By.css(".btn-danger")).click();
	}
	else
	    console.log("Delete Assemblies failed: Test Assembly not found");

        // 15 | click | id=searchbar-query | 
	await new Promise(r => setTimeout(r, 4000));  //required for firefox
        await driver.wait(until.elementLocated(By.id("searchbar-query")));
        await driver.findElement(By.id("searchbar-query")).click();
        // 16 | type | id=searchbar-query | Test Assembly 2
        await driver.findElement(By.id("searchbar-query")).sendKeys("Test Assembly 2");
 	while ((await driver.findElements(By.css(".btn-outline-primary:nth-child(1)"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Link2.");
        }
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();
        // 18 | click | linkText=123-002 | 

	if ((await driver.findElements(By.linkText("Test Assembly 2"))).length != 0)
	{
            await driver.findElement(By.linkText("Test Assembly 2")).click();
            // 22 | click | linkText=Delete | 
	    while ((await driver.findElements(By.linkText("Delete"))).length == 0)
	    {
	       await new Promise(r => setTimeout(r, 2000));
	     console.log("Wait 2 seconds for Delete2.");
	    }
            await driver.findElement(By.linkText("Delete")).click();
 	    while ((await driver.findElements(By.css(".btn-danger"))).length == 0)
	    {
	       await new Promise(r => setTimeout(r, 2000));
	     console.log("Wait 2 seconds for Confirm2.");
	    }
            await driver.findElement(By.css(".btn-danger")).click();
	}
	else
	    console.log("Delete Assemblies failed: Test Assembly 2 not found");

        // 24 | click | id=searchbar-query | 
	await new Promise(r => setTimeout(r, 4000));  //required for firefox
        await driver.wait(until.elementLocated(By.id("searchbar-query")));
        await driver.findElement(By.id("searchbar-query")).click();
        // 25 | type | id=searchbar-query | Test Assembly 3
        await driver.findElement(By.id("searchbar-query")).sendKeys("Test Assembly 3");
 	while ((await driver.findElements(By.css(".btn-outline-primary:nth-child(1)"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Link3.");
        }
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();
        // 27 | click | linkText=123-003 | 

	if ((await driver.findElements(By.linkText("Test Assembly 3"))).length != 0)
	{
            await driver.findElement(By.linkText("Test Assembly 3")).click();
            // 28 | click | linkText=Delete | 
	    while ((await driver.findElements(By.linkText("Delete"))).length == 0)
	    {
	       await new Promise(r => setTimeout(r, 2000));
	     console.log("Wait 2 seconds for Delete3.");
	    }
            await driver.findElement(By.linkText("Delete")).click();
 	    while ((await driver.findElements(By.css(".btn-danger"))).length == 0)
	    {
	       await new Promise(r => setTimeout(r, 2000));
	     console.log("Wait 2 seconds for Confirm3.");
	    }
            await driver.findElement(By.css(".btn-danger")).click();
	}
	else
	    console.log("Delete Assemblies failed: Test Assembly 3 not found");

        // 30 | click | id=searchbar-query | 
        await new Promise(r => setTimeout(r, 6000));  //required for firefox
        await driver.findElement(By.id("searchbar-query")).click();
        // 31 | type | id=searchbar-query | Singer
        await driver.findElement(By.id("searchbar-query")).sendKeys("Singer");
 	while ((await driver.findElements(By.css(".btn-outline-primary:nth-child(1)"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Link4.");
        }
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();
        // 33 | click | linkText=000-654-987 | 

	if ((await driver.findElements(By.linkText("Singer"))).length != 0)
	{
            await driver.findElement(By.linkText("Singer")).click();
            // 34 | click | linkText=Delete | 
	    while ((await driver.findElements(By.linkText("Delete"))).length == 0)
	    {
	       await new Promise(r => setTimeout(r, 2000));
	     console.log("Wait 2 seconds for Delete4.");
	    }
            await driver.findElement(By.linkText("Delete")).click();
 	    while ((await driver.findElements(By.css(".btn-danger"))).length == 0)
	    {
	       await new Promise(r => setTimeout(r, 2000));
	     console.log("Wait 2 seconds for Confirm4.");
	    }
            await driver.findElement(By.css(".btn-danger")).click();
	}
	else
	    console.log("Delete Assemblies failed: Singer not found");

        // Delete Assembly Type
        // 10 | click | id=navbarTemplates |
        await driver.findElement(By.id("navbarTemplates")).click();
        await driver.findElement(By.id("navbarAdmintools")).click();
        // 5 | click | linkText=Test |
        await driver.findElement(By.linkText("Edit Assembly Types")).click();

        if ((await driver.findElements(By.xpath("//tr[*]/td[text()='Electric']"))).length != 0) {
            var i = 1;
            while (true) {
                if ((await driver.findElement(By.xpath("//tr[" + i + "]/td")).getText()) == "Electric") {
                    break;
                }
                i++;
            }
            await driver.findElement(By.css("tr:nth-child(" + i + ") .btn-danger")).click();
            // 6 | click | css=.btn-danger | 
            await driver.findElement(By.css(".btn-danger")).click();
        }
        else
            console.log("Delete Assemblies failed: Electric type not found");


        // Close browser window
        driver.quit();

    }
    catch (e) {
        console.log(e.message, e.stack);
        console.log("Delete Assemblies failed.");
	return 1;
    } 

    console.log("Delete Assemblies completed.")
    return 0;

})();