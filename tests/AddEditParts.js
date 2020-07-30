// JavaScript source code
'use strict';
console.log('Running Add & Edit Parts Test');

// Generated by Selenium IDE
const { Builder, By, Key, until, a, WebElement, promise, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const assert = require('assert');

var driver;
var dropdown;
var myArgs = process.argv.slice(2);

(async function testParts() {

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

        // ADD PARTS TEST

        // 10 | click | id=navbarTemplates |
        await driver.findElement(By.id("navbarTemplates")).click();
        await driver.findElement(By.id("navbarAdmintools")).click();
        // 11 | click | linkText=Locations | 
        await driver.findElement(By.linkText("Edit Part Types")).click();
        // 5 | click | linkText=Test | 

        // Add a Part Type with a name
        // 5 | click | linkText=Add Part Type | 
        await driver.findElement(By.linkText("Add Part Type")).click();
        // 7 | type | id=id_name | Sewing Machine
        await driver.findElement(By.id("id_name")).sendKeys("Sewing Machine");
        // 8 | click | css=.btn-primary | 
        await driver.findElement(By.css(".btn-primary")).click();

        // Add Part Type with null name
        // 9 | click | linkText=Add Part Type | 
	await new Promise(r => setTimeout(r, 2000));   //linux firefox
        await driver.findElement(By.linkText("Add Part Type")).click();
        // 10 | click | css=.btn-primary | 
        await driver.findElement(By.css(".btn-primary")).click();
        // 11 | verifyText | id=error_1_id_name | This field is required.
        assert(await driver.findElement(By.id("error_1_id_name")).getText() == "This field is required.");
        // 12 | click | css=.btn-light | 
        await driver.findElement(By.css(".btn-light")).click();

        //Add template with Part Number, Name, and Type
        // 13 | click | id=navbarTemplates | 
        await driver.findElement(By.id("navbarTemplates")).click();
        // 14 | click | linkText=Parts | 
        await driver.wait(until.elementLocated(By.linkText("Parts")));
        await driver.findElement(By.linkText("Parts")).click();
        // 15 | click | linkText=Add Part Template | 
        await new Promise(r => setTimeout(r, 4000));   //linux firefox keeps hanging here
        await driver.findElement(By.linkText("Add Part Template")).click();
        /*Get the text after ajax call*/
        // 16 | type | id=id_part_number | 123-456-789
        await driver.wait(until.elementLocated(By.id("id_part_number")));
        await driver.findElement(By.id("id_part_number")).sendKeys("123-456-789");
        // 17 | type | id=id_name | Sewing Template
        await driver.findElement(By.id("id_name")).sendKeys("Sewing Template");
        // 18 | type | id=id_friendly_name | sewing
        await driver.findElement(By.id("id_friendly_name")).sendKeys("sewing");
        // 19 | select | id=id_part_type | label=Sewing Machine
        {
            dropdown = await driver.findElement(By.id("id_part_type"));
            await dropdown.findElement(By.xpath("//option[. = ' Sewing Machine']")).click();
 
        }
        // 20 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();
        await new Promise(r => setTimeout(r, 2000));

        try {
            var obj = await driver.findElement(By.xpath("//*[text()='Part with this Part number already exists.']"));
        }
        catch (NoSuchElementException) {
            console.log("Add Parts running...");
        }
        if (obj)
        {
            throw new Error("Please run the Delete Parts Test. Sewing Template already created");
        }

        // Create new Template Revision with cost or refurbishment cost with greater than 2 decimal places.
        // 21 | click | id=action | 
        await driver.wait(until.elementLocated(By.id("action")));
        await driver.findElement(By.id("action")).click();
        // 22 | click | linkText=Create New Revision |
        await driver.wait(until.elementLocated(By.linkText("Create New Revision")));
        await driver.findElement(By.linkText("Create New Revision")).click();
        // 23 | type | id=id_revision_code | B
	await new Promise(r => setTimeout(r, 4000));   //linux firefox
        // await driver.wait(until.elementLocated(By.id("id_revision_code")), 2000);  //linux firefox stale element
        await driver.findElement(By.id("id_revision_code")).sendKeys("B");
        // 24 | type | id=id_unit_cost | 3.000
        await driver.findElement(By.id("id_unit_cost")).clear();
        await driver.findElement(By.id("id_unit_cost")).sendKeys("3.000");
        // 25 | type | id=id_refurbishment_cost | 4.000
        await driver.findElement(By.id("id_refurbishment_cost")).clear();
        await driver.findElement(By.id("id_refurbishment_cost")).sendKeys("4.000");
        // 26 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();

        await driver.wait(until.elementLocated(By.css("#div_id_unit_cost .ajax-error")));
        // 27 | verifyText | css=#div_id_unit_cost .ajax-error | Ensure that there are no more than 2 decimal places.
        assert(await driver.findElement(By.css("#div_id_unit_cost .ajax-error")).getText() == "Ensure that there are no more than 2 decimal places.");
        // 28 | verifyText | css=#div_id_refurbishment_cost .ajax-error | Ensure that there are no more than 2 decimal places.
        assert(await driver.findElement(By.css("#div_id_refurbishment_cost .ajax-error")).getText() == "Ensure that there are no more than 2 decimal places.");
        // 29 | type | id=id_unit_cost | 9999999999.00
        await driver.findElement(By.id("id_unit_cost")).clear();
        await driver.findElement(By.id("id_unit_cost")).sendKeys("9999999999.00");
        // 30 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();
        await driver.wait(until.elementLocated(By.css("#div_id_unit_cost .ajax-error")));
        // 31 | verifyText | css=#div_id_unit_cost .ajax-error | Ensure that there are no more 9 digits in total.
        assert(await driver.findElement(By.css("#div_id_unit_cost .ajax-error")).getText() == "Ensure that there are no more than 9 digits in total.");

        // Create a new Template Revision with cost or refurbishment cost with 2 decimal places.
        // 32 | type | id=id_unit_cost | 3.00
        await driver.findElement(By.id("id_unit_cost")).clear();
        await driver.findElement(By.id("id_unit_cost")).sendKeys("3.00");
        await driver.switchTo().frame(0);
        // 35 | selectFrame | relative=parent | 
        await driver.switchTo().defaultContent();
        // 36 | type | id=id_refurbishment_cost | 3.74
        await driver.findElement(By.id("id_refurbishment_cost")).clear();
        await driver.findElement(By.id("id_refurbishment_cost")).sendKeys("3.74");
        // 37 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();

        // Add template with null Part Number, name, type or revision code.
        // 40 | click | linkText=Add Part Template | 
 //       await driver.switchTo().frame(0);
        await driver.wait(until.elementLocated(By.linkText("Add Part Template")));
        await driver.findElement(By.linkText("Add Part Template")).click();
        // 41 | click | id=id_part_number |         
        // 43 | click | css=.controls > .btn | 
        await driver.wait(until.elementLocated(By.css(".controls > .btn")));
        await driver.findElement(By.css(".controls > .btn")).click();
        await driver.wait(until.elementLocated(By.css("#div_id_part_number .ajax-error")));
        // 44 | verifyText | css=#div_id_part_number .ajax-error This field is required.
        assert(await driver.findElement(By.css("#div_id_part_number .ajax-error")).getText() == "This field is required.");
        // 45 | verifyText | css=#div_id_name .ajax-error | This field is required.
        assert(await driver.findElement(By.css("#div_id_name .ajax-error")).getText() == "This field is required.");
        // 46 | verifyText | css=#div_id_part_type .ajax-error | This field is required.
        assert(await driver.findElement(By.css("#div_id_part_type .ajax-error")).getText() == "This field is required.");

        // Add template with same Part Number used above.
        // 47 | type | id=id_part_number | 123-456-789
        // 33 | click | id=id_refurbishment_cost | 
        await driver.findElement(By.id("id_part_number")).clear();
        await driver.findElement(By.id("id_part_number")).sendKeys("123-456-789");
        // 48 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();
        await new Promise(r => setTimeout(r, 4000));
 //       await driver.wait(until.elementLocated(By.css("#div_id_part_number .ajax-error")));
        // 49 | verifyText | css=#div_id_part_number .ajax-error | Part with this Part number already exists.
        assert(await driver.findElement(By.css("#div_id_part_number .ajax-error")).getText() == "Part with this Part number already exists.");
        // 50 | type | id=id_name | Sewing Template
        // 33 | click | id=id_refurbishment_cost | 
        await driver.wait(until.elementLocated(By.id("id_name")));
        await driver.findElement(By.id("id_name")).clear();
        await driver.findElement(By.id("id_name")).sendKeys("Sewing Template");
        // 51 | type | id=id_friendly_name | sewing
        await driver.findElement(By.id("id_friendly_name")).clear();
        await driver.findElement(By.id("id_friendly_name")).sendKeys("sewing");
        // 52 | select | id=id_part_type | label=Sewing Machine
        dropdown = await driver.findElement(By.id("id_part_type"));
        await dropdown.findElement(By.xpath("//option[. = ' Sewing Machine']")).click();
        // 53 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();
        await driver.wait(until.elementLocated(By.css("#div_id_part_number .ajax-error")));
        // 54 | verifyText | css=#div_id_part_number .ajax-error | Part with this Part number already exists.
        assert(await driver.findElement(By.css("#div_id_part_number .ajax-error")).getText() == "Part with this Part number already exists.");

 // EDIT PARTS TEST

        // Change part type
        // 3 | click | id=navbarAdmintools |

        await driver.findElement(By.id("navbarAdmintools")).click();
        // 4 | click | linkText=Edit Part Types | 
        await driver.findElement(By.linkText("Edit Part Types")).click();
        // 5 | click | css=tr:nth-child(1) .btn-primary | 
        // Get the index to the row Sewing Machine is displayed on screen
        await new Promise(r => setTimeout(r, 2000));  //until element located not working here
        var i = 1;
        while (true) {
            if ((await driver.findElement(By.xpath("//tr["+i+"]/td")).getText()) == "Sewing Machine") { 
                break;
            }
            i++;
        }
        
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.css("tr:nth-child("+i+") .btn-primary")).click();

        // 6 | type | id=id_name | Sewing Machine - updated
        await driver.findElement(By.id("id_name")).clear();
        await driver.findElement(By.id("id_name")).sendKeys("Sewing Machine - Updated");
        // 8 | click | css=.btn-primary | 
        await driver.findElement(By.css(".btn-primary")).click();

        // Change part type name to null
        // 9 | verifyText | xpath=//td[contains(.,'Sewing Machine - Updated')] | Sewing Machine - updated
        await new Promise(r => setTimeout(r, 2000));
        var i = 1;
        while (true) {
            if ((await driver.findElement(By.xpath("//tr[" + i + "]/td")).getText()) == "Sewing Machine - Updated") {
                break;
            }
            i++;
        }
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.css("tr:nth-child("+i+") .btn-primary")).click();
        // 11 | type | id=id_name |  
        await driver.findElement(By.id("id_name")).clear();
        await driver.findElement(By.id("id_name")).sendKeys(" ");
        // 12 | click | css=.btn-primary | 
        await driver.findElement(By.css(".btn-primary")).click();
        // 13 | verifyText | id=error_1_id_name | This field is required.
        assert(await driver.findElement(By.id("error_1_id_name")).getText() == "This field is required.");

        // Change part type parent
        // 14 | type | id=id_name | Sewing Machine
        await driver.wait(until.elementLocated(By.id("id_name")));
        await driver.findElement(By.id("id_name")).clear();
        await driver.findElement(By.id("id_name")).sendKeys("Sewing Machine");
        // 15 | click | css=.parts | 
        await driver.findElement(By.css(".parts")).click();
        // 16 | select | id=id_parent | label=Mechanical
        dropdown = await driver.findElement(By.id("id_parent"));
        await dropdown.findElement(By.xpath("//option[. = ' Mechanical']")).click();
        // 17 | click | css=.btn-primary | 
        await driver.findElement(By.css(".btn-primary")).click();
        // 18 | verifyElementPresent | xpath=//td[contains(.,'Sewing Machine')] | 
        {
            await new Promise(r => setTimeout(r, 2000));
            const elements = await driver.findElements(By.xpath("//td[contains(.,\'Sewing Machine\')]"));
            assert(elements.length);
        }

        // Change part type parent back to null
        // 14 | type | id=id_name | Sewing Machine
        // Get the index to the row Sewing Machine is displayed on screen
        await new Promise(r => setTimeout(r, 2000));  //until element located not working here
        var i = 1;
        while (true) {
            if ((await driver.findElement(By.xpath("//tr[" + i + "]/td")).getText()) == "Sewing Machine") {
                break;
            }
            i++;
        }
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.css("tr:nth-child(" + i + ") .btn-primary")).click();
        // 16 | select | id=id_parent | label=
        dropdown = await driver.findElement(By.id("id_parent"));
        await dropdown.findElement(By.xpath("//option[. = '---------']")).click();
        // 17 | click | css=.btn-primary | 
        await driver.findElement(By.css(".btn-primary")).click();

        // Search for Part Templates and change Part Number
        // 20 | type | id=searchbar-query | Sewing Template
        await driver.findElement(By.id("searchbar-query")).sendKeys("Sewing Template");
        // 21 | click | css=.btn-outline-primary:nth-child(1) | 
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();
        // 22 | click | linkText=123-456-789 | 
        await driver.findElement(By.linkText("123-456-789")).click();
        // 23 | click | id=action | 
        await driver.wait(until.elementLocated(By.id("action")));
        await driver.findElement(By.id("action")).click();
        // 24 | click | linkText=Edit Part Template | 
	await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.linkText("Edit Part Template")).click();
        // 25 | type | id=id_part_number | 789-456-123
        await driver.wait(until.elementLocated(By.id("id_part_number")));
        await driver.findElement(By.id("id_part_number")).clear();
        await driver.findElement(By.id("id_part_number")).sendKeys("789-456-123");
        // 26 | select | id=id_part_type | label=Cable
        dropdown = await driver.findElement(By.id("id_part_type"));
        await dropdown.findElement(By.xpath("//option[. = ' Cable']")).click();
        // 27 | click | css=.controls > .btn | 
        await new Promise(r => setTimeout(r, 4000));
        await driver.findElement(By.css(".controls > .btn")).click();

        // Add revision
        // 28 | click | id=action | 
        await driver.wait(until.elementLocated(By.id("action")));
        await driver.findElement(By.id("action")).click();
        // 29 | click | linkText=Create New Revision | 
        await driver.findElement(By.linkText("Create New Revision")).click();
        // 30 | type | id=id_revision_code | B
	await new Promise(r => setTimeout(r, 4000));
        //await driver.wait(until.elementLocated(By.id("id_revision_code")), 2000); // linux firefox stale element
        await driver.findElement(By.id("id_revision_code")).sendKeys("B");
        // 31 | click | id=div_id_created_at | 
        await driver.findElement(By.id("div_id_created_at")).click();
        // 32 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();

        // Change template to null Part Number, name, or type
        // 33 | click | id=action | 
        await driver.wait(until.elementLocated(By.id("action")));
        await driver.findElement(By.id("action")).click();
        // 34 | click | linkText=Edit Part Template | 
        await driver.findElement(By.linkText("Edit Part Template")).click();
        // 35 | type | id=id_part_number |   
        await driver.wait(until.elementLocated(By.id("id_part_number")));
        await driver.findElement(By.id("id_part_number")).clear();
        await driver.findElement(By.id("id_part_number")).sendKeys("  ");
        // 36 | type | id=id_name |   
        await driver.findElement(By.id("id_name")).clear();
        await driver.findElement(By.id("id_name")).sendKeys("  ");
        // 37 | select | id=id_part_type | label=---------
        dropdown = await driver.findElement(By.id("id_part_type"));
        await dropdown.findElement(By.xpath("//option[. = '---------']")).click();
        // 38 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();
        // 39 | verifyText | css=#div_id_part_number .ajax-error | This field is required.
        await driver.wait(until.elementLocated(By.css("#div_id_part_number .ajax-error")));
        assert(await driver.findElement(By.css("#div_id_part_number .ajax-error")).getText() == "This field is required.");
        assert(await driver.findElement(By.css("#div_id_name .ajax-error")).getText() == "This field is required.");
        assert(await driver.findElement(By.css("#div_id_part_type .ajax-error")).getText() == "This field is required.");

        // 40 | type | id=id_part_number | 1232
        await driver.wait(until.elementLocated(By.id("id_part_number")));
        await driver.findElement(By.id("id_part_number")).clear();
        await driver.findElement(By.id("id_part_number")).sendKeys("1232");
        // 43 | type | id=id_name | Sewing Template
        await driver.findElement(By.id("id_name")).sendKeys("Sewing Template");
        // 46 | select | id=id_part_type | label=--- Sewing Machine
        dropdown = await driver.findElement(By.id("id_part_type"));
        await dropdown.findElement(By.xpath("//option[. = ' Sewing Machine']")).click();
        // 47 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();
        await new Promise(r => setTimeout(r, 2000));

        try {
            var obj = await driver.findElement(By.xpath("//*[text()='Part with this Part number already exists.']"));
        }
        catch (NoSuchElementException) {
            console.log("Edit Parts running...");
        }
        if (obj) {
            throw new Error("Please run the Delete Parts Test. Sewing Template already created");
        }

        // Edit revision with null code and invalid date
        // 48 | click | linkText=Revision: B | 
        await driver.wait(until.elementLocated(By.linkText("Revision: B")));
        await driver.findElement(By.linkText("Revision: B")).click();
        // 49 | click | linkText=Edit Revision | 
        await driver.wait(until.elementLocated(By.linkText("Edit Revision")));
        await driver.findElement(By.linkText("Edit Revision")).click();
        // 50 | type | id=id_created_at |  
        //await driver.wait(until.elementLocated(By.id("id_revision_code"))); //StaleElementReferenceError, use timeout
        await new Promise(r => setTimeout(r, 4000));
        await driver.findElement(By.id("id_revision_code")).clear();
        await driver.findElement(By.id("id_revision_code")).sendKeys("   ");
        await driver.findElement(By.id("id_created_at")).click();
        await driver.findElement(By.id("id_created_at")).clear(); 
//        await driver.findElement(By.css(".glyphicon-trash")).click();  doesn't work
//        await driver.findElement(By.id("id_created_at")).sendKeys("0000"); doesn't work - gets converted to a valid date

        // Change unit cost or refurbishment cost to value with greater than 2 decimal places
        // 56 | type | id=id_unit_cost | 3.000
        await driver.findElement(By.id("id_unit_cost")).clear();
        await driver.findElement(By.id("id_unit_cost")).sendKeys("3.000");
        // 57 | type | id=id_refurbishment_cost | 3.560
        await driver.findElement(By.id("id_refurbishment_cost")).clear();
        await driver.findElement(By.id("id_refurbishment_cost")).sendKeys("3.560");
        // 58 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();
        await driver.wait(until.elementLocated(By.css(".ajax-error")));
        assert(await driver.findElement(By.css(".ajax-error")).getText() == "This field is required.");
        // 53 | type | id=id_created_at | 1
 //       assert(await driver.findElement(By.css(".ajax-error")).getText() == "Enter a valid date/time.");
        // 59 | verifyText | css=#div_id_unit_cost .ajax-error | Ensure that there are no more than 2 decimal places.
        assert(await driver.findElement(By.css("#div_id_unit_cost .ajax-error")).getText() == "Ensure that there are no more than 2 decimal places.");
        // 60 | verifyText | css=#div_id_refurbishment_cost .ajax-error | Ensure that there are no more than 2 decimal places.
        assert(await driver.findElement(By.css("#div_id_refurbishment_cost .ajax-error")).getText() == "Ensure that there are no more than 2 decimal places.");

        // Close browser window
        driver.quit();
    }
    catch (e) {
        console.log(e.message, e.stack);
        console.log("Add Edit Parts failed.");
        throw (e);
	return false;
    } 

    console.log("Add Edit Parts completed.");
    return true;
    

})();