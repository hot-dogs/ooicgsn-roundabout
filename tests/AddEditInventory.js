// JavaScript source code
'use strict';
console.log("Running Add & Edit Inventory Test.");

// Generated by Selenium IDE
const { Builder, By, Key, until, a, WebElement, promise, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const assert = require('assert');

var driver;
var myArgs = process.argv.slice(2);
var user;
var password;

(async function addInventory() {

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
    if (myArgs[1] == 'headless')
    {
        await driver.get("http://localhost:8000/");   
        user = "admin";
        password = "admin";
    }
    else
    {
        // 1 | open | https://ooi-cgrdb-staging.whoi.net/ | 
        await driver.get("https://ooi-cgrdb-staging.whoi.net/");
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

        // ADD INVENTORY TEST

        // Add Inventory with unique serial number and non null template, revision code, and location
        await driver.findElement(By.linkText("Inventory")).click();
        await new Promise(r => setTimeout(r, 4000)); // Inventory tree takes awhile to load (firefox)
        // 4 | click | linkText=Add Inventory | 
        await driver.wait(until.elementLocated(By.linkText("Add Inventory")));
        await driver.findElement(By.linkText("Add Inventory")).click();
        await driver.wait(until.elementLocated(By.id("id_part_type")));
        // 5 | select | id=id_part_type | label=-- Sewing Machine
        {
            const dropdown = await driver.findElement(By.id("id_part_type"));
            await dropdown.findElement(By.xpath("//option[. = '-- Sewing Machine']")).click();
        }
        // 6 | select | id=id_part | label=Sewing Template
        {
            await driver.wait(until.elementLocated(By.id("id_part")));
            const dropdown = await driver.findElement(By.id("id_part"));
            await dropdown.findElement(By.xpath("//option[. = 'Sewing Template']")).click();
        }
        // 7 | select | id=id_location | label=Test
        {
            const dropdown = await driver.findElement(By.id("id_location"));
            // There's a space before Test in the option dropdown
            await dropdown.findElement(By.xpath("//option[. = ' Test']")).click();
        }
        // 8 | storeValue | id=id_serial_number | Serial_Number
        // Stores the value of the Serial Number assigned
	await new Promise(r => setTimeout(r, 2000)); //circleci
        var Serial_Number = await driver.findElement(By.id("id_serial_number")).getAttribute("value");
        // 10 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();

        // Add Inventory with blank part type, template, revision, and location
        // 11 | click | linkText=Add Inventory | 
        await new Promise(r => setTimeout(r, 4000)); // Inventory tree takes awhile to load
        await driver.findElement(By.linkText("Add Inventory")).click();
        // 12 | click | id=id_part_type | 
        await driver.wait(until.elementLocated(By.id("id_part_type")));
        await driver.findElement(By.id("id_part_type")).click();
        // 13 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();
        await driver.wait(until.elementLocated(By.css("#div_id_part .ajax-error")));
        // Wait for bug fix for blank part type error
        //assert(await driver.findElement(By.css("#div_id_part .ajax-error")).getText() == "This field is required.");
        assert(await driver.findElement(By.css("#div_id_part .ajax-error")).getText() == "This field is required.");
        assert(await driver.findElement(By.css("#div_id_revision .ajax-error")).getText() == "This field is required.");
        assert(await driver.findElement(By.css("#div_id_location .ajax-error")).getText() == "This field is required.");

        // Add Inventory item with null template
        // 14 | click | id=id_part |
        await driver.findElement(By.id("id_part")).click();
        // 15 | select | id=id_part_type | label=-- Sewing Machine
        await driver.wait(until.elementLocated(By.id("id_part_type")));
        {
            const dropdown = await driver.findElement(By.id("id_part_type"));
            await dropdown.findElement(By.xpath("//option[. = '-- Sewing Machine']")).click();
        }
        {
            const dropdown = await driver.findElement(By.id("id_location"));
            // Blank need before Test in dropdown
            await dropdown.findElement(By.xpath("//option[. = ' Test']")).click();
        }
        // 17 | select | id=id_part | label=Sewing Template
        {
            await driver.wait(until.elementLocated(By.id("id_part")));
            const dropdown = await driver.findElement(By.id("id_part"));
            await dropdown.findElement(By.xpath("//option[. = 'Sewing Template']")).click();
        }
        // Add Inventory item with non unique serial number
        // 18 | click | id=hint_id_serial_number | 
        await driver.findElement(By.id("hint_id_serial_number")).click();
        // 19 | click | id=id_serial_number | 
	await new Promise(r => setTimeout(r, 2000)); //circleci
        await driver.findElement(By.id("id_serial_number")).click();
        // 20 | type | id=id_serial_number | [Serial_Number]
        // Uses stored serial number assigned above
        await driver.findElement(By.id("id_serial_number")).clear();
        await driver.findElement(By.id("id_serial_number")).sendKeys(Serial_Number);
        // 21 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();
        // 22 | select | id=id_location | label=Test

        // 23 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();

        await new Promise(r => setTimeout(r, 4000));  //linux docker
        assert(await driver.findElement(By.css("#div_id_serial_number .ajax-error")).getText() == "Inventory with this Serial number already exists.");

    // EDIT INVENTORY TEST

       // Add Inventories
        await driver.findElement(By.linkText("Inventory")).click();
        // 4 | click | linkText=Add Inventory | 
        await new Promise(r => setTimeout(r, 4000)); // Inventory tree takes awhile to load
        await driver.findElement(By.linkText("Add Inventory")).click();
        await driver.wait(until.elementLocated(By.id("id_part_type")));
        // 5 | select | id=id_part_type | label=-- Sewing Machine
        {
            const dropdown = await driver.findElement(By.id("id_part_type"));
            await dropdown.findElement(By.xpath("//option[. = '-- Sewing Machine']")).click();
        }
        // 6 | select | id=id_part | label=Wheel Template
        {
            await new Promise(r => setTimeout(r, 2000));  //only thing that works here
            const dropdown = await driver.findElement(By.id("id_part"));
            await dropdown.findElement(By.xpath("//option[. = 'Wheel Template']")).click();
        }
        // 7 | select | id=id_location | label=--- Lost
        {
            await new Promise(r => setTimeout(r, 2000));
            const dropdown = await driver.findElement(By.id("id_location"));
            // Space needed before Test
            await dropdown.findElement(By.xpath("//option[. = ' Test']")).click();
        }
        // 8 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();


        // 9 | click | linkText=Add Inventory | 
        await new Promise(r => setTimeout(r, 4000)); // Inventory tree takes awhile to load
        await driver.findElement(By.linkText("Add Inventory")).click();
        await driver.wait(until.elementLocated(By.id("id_part_type")));
        // 10 | select | id=id_part_type | label=-- Sewing Machine
        {
            const dropdown = await driver.findElement(By.id("id_part_type"));
            await dropdown.findElement(By.xpath("//option[. = '-- Sewing Machine']")).click();
        }
        // 11 | select | id=id_part | label=Pin Template
        {
            await new Promise(r => setTimeout(r, 2000));
            const dropdown = await driver.findElement(By.id("id_part"));
            await dropdown.findElement(By.xpath("//option[. = 'Pin Template']")).click();
        }
        // 12 | select | id=id_location | label=Test
        {
            const dropdown = await driver.findElement(By.id("id_location"));
            // Space needed before Test
            await dropdown.findElement(By.xpath("//option[. = ' Test']")).click();
        }
        // 13 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();

        // Update location with null location
        // 19 | click | css=.btn-outline-primary:nth-child(1) | 
	await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click(); // search button
        // 20 | click | id=field-select_c_r0 | 
        await driver.wait(until.elementLocated(By.id("field-select_c_r0")));
        await driver.findElement(By.id("field-select_c_r0")).click();
        // 21 | select | id=field-select_c_r0 | label=Location
        {
            const dropdown = await driver.findElement(By.id("field-select_c_r0"));
            await dropdown.findElement(By.xpath("//option[. = 'Location']")).click();
        }
        // 22 | select | id=qfield-lookup_c_r0 | label=Exact
        {
            const dropdown = await driver.findElement(By.id("qfield-lookup_c_r0"));
            await dropdown.findElement(By.xpath("//option[. = 'Exact']")).click();
        }
        // 23 | type | id=field-query_c_r0 | Lost
        await driver.findElement(By.id("field-query_c_r0")).sendKeys("Test");
        // 24 | click | id=searchform-submit-button | 
        await driver.findElement(By.id("searchform-submit-button")).click();
        // 25 | click | css=.even a | 
	await new Promise(r => setTimeout(r, 2000));  //linux docker
        await driver.findElement(By.css(".even a")).click();
        // 26 | click | id=action | 
	await new Promise(r => setTimeout(r, 4000));  //circleci firefox
        await driver.findElement(By.id("action")).click();
        // 27 | click | linkText=Location Change | 
        await driver.findElement(By.linkText("Location Change")).click();
        // 28 | select | id=id_location | label=---------
        {
            await new Promise(r => setTimeout(r, 2000));  //increase wait
            const dropdown = await driver.findElement(By.id("id_location"));
            await dropdown.findElement(By.xpath("//option[. = '---------']")).click();
        }
        // 29 | click | css=.controls > .btn-primary | 
        await new Promise(r => setTimeout(r, 2000));

	    var element = driver.findElement(By.css(".controls > .btn-primary"));
	    await driver.executeScript("arguments[0].click();", element);
	    //await driver.findElement(By.css(".controls > .btn-primary")).click();	//linux elementnotinteractable error

        await new Promise(r => setTimeout(r, 2000));
        assert(await driver.findElement(By.css("#div_id_location .ajax-error")).getText() == "This field is required.");

        // Update location with non null location
        // 30 | select | id=id_location | label=Test
        {
            await new Promise(r => setTimeout(r, 2000));
            const dropdown = await driver.findElement(By.id("id_location"));
            await dropdown.findElement(By.xpath("//option[. = ' Test']")).click();
        }
        // 31 | click | css=.controls > .btn-primary | 
	await new Promise(r => setTimeout(r, 2000)); //circleci
	await driver.findElement(By.css(".controls > .btn-primary")).click();
        // 32 | click | css=.btn-outline-primary:nth-child(1) | 
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();  //Search button
        await driver.wait(until.elementLocated(By.id("field-select_c_r0")));
        // 33 | select | id=field-select_c_r0 | label=Location
        {
            const dropdown = await driver.findElement(By.id("field-select_c_r0"));
            await dropdown.findElement(By.xpath("//option[. = 'Location']")).click();
        }
        // 34 | select | id=qfield-lookup_c_r0 | label=Exact
        {
            const dropdown = await driver.findElement(By.id("qfield-lookup_c_r0"));
            await dropdown.findElement(By.xpath("//option[. = 'Exact']")).click();
        }
        // 35 | type | id=field-query_c_r0 | Test
        await driver.findElement(By.id("field-query_c_r0")).sendKeys("Test");
        // 36 | click | css=#qcard_c > .card-body | 
        await driver.findElement(By.css("#qcard_c > .card-body")).click();
        // 37 | click | id=searchform-submit-button | 
        await driver.findElement(By.id("searchform-submit-button")).click();
        // 39 | click | id=searchbar-query | 
        await driver.findElement(By.id("searchbar-query")).click(); //search within these results
        // 40 | type | id=searchbar-query | Sewing Template
        await driver.findElement(By.id("searchbar-query")).sendKeys("Sewing Template");
        // 41 | click | css=.btn-outline-primary:nth-child(1) | 
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();
        // 42 | click | css=.even a | 
	await new Promise(r => setTimeout(r, 2000));  //linux docker
        await driver.findElement(By.css(".even a")).click();
        // 43 | click | id=action | 

        // Add subassembly item to valid parent
        await new Promise(r => setTimeout(r, 4000));  //circleci
        await driver.findElement(By.id("action")).click();
        // 44 | click | linkText=Add Sub-Assembly | 
        await driver.findElement(By.linkText("Add Sub-Assembly")).click();
        // 45 | click | linkText=Add | 
        await driver.wait(until.elementLocated(By.linkText("Add")));
        await driver.findElement(By.linkText("Add")).click();
        // 46 | click | id=action | 
        await new Promise(r => setTimeout(r, 4000));  //circleci
        await driver.findElement(By.id("action")).click();
        // 47 | click | linkText=Add Sub-Assembly | 

        // Add another subassembly item to valid parent - no more children appear
        await driver.findElement(By.linkText("Add Sub-Assembly")).click();
        // 48 | type | id=searchbar-query | pioneer inshore deck assembly
        await driver.findElement(By.id("searchbar-query")).sendKeys("singer");
        // 49 | click | css=.btn-outline-primary:nth-child(1) | 
        await new Promise(r => setTimeout(r, 2000));  //circleci
        await driver.findElement(By.xpath("//p[contains(.,'NONE')]"));
            
        // Add valid child to parent assembly
        await driver.findElement(By.id("searchbar-query")).clear();
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();  //Search button
        await driver.wait(until.elementLocated(By.id("field-select_c_r0")));
        // 33 | select | id=field-select_c_r0 | label=Location
        {
            const dropdown = await driver.findElement(By.id("field-select_c_r0"));
            await dropdown.findElement(By.xpath("//option[. = 'Location']")).click();
        }
        // 34 | select | id=qfield-lookup_c_r0 | label=Exact
        {
            const dropdown = await driver.findElement(By.id("qfield-lookup_c_r0"));
            await dropdown.findElement(By.xpath("//option[. = 'Exact']")).click();
        }
        // 35 | type | id=field-query_c_r0 | Test
        await driver.findElement(By.id("field-query_c_r0")).clear();
        await driver.findElement(By.id("field-query_c_r0")).sendKeys("Test");

        // 31 | click | css=#qfield_\+ROW_c > .fa | 
        await driver.findElement(By.css("#qfield_\\+ROW_c > .fa")).click();
        // 33 | select | id=qfield-lookup_c_r1 | label=Exact
        {
            const dropdown = await driver.findElement(By.id("qfield-lookup_c_r1"));
            await dropdown.findElement(By.xpath("//option[. = 'Exact']")).click();
        }

        // 35 | click | id=field-query_c_r1 | 
        await driver.findElement(By.id("field-query_c_r1")).click();
        // 36 | type | id=field-query_c_r1 | Pin
        await driver.findElement(By.id("field-query_c_r1")).sendKeys("Pin");
        await driver.findElement(By.id("searchform-submit-button")).click();
        // 42 | click | css=.even a | 
	    await new Promise(r => setTimeout(r, 2000));  //linux docker
        await driver.findElement(By.css(".even a")).click();
        // 43 | click | id=action |
        await new Promise(r => setTimeout(r, 4000));  //circleci
        await driver.findElement(By.id("action")).click();
        // 52 | click | linkText=Add to Parent Assembly | 
        await driver.findElement(By.linkText("Add to Parent Assembly")).click();
        // 53 | click | linkText=Add | 
        await driver.wait(until.elementLocated(By.linkText("Add")));
        await driver.findElement(By.linkText("Add")).click();

        // Edit item details with null revision code and update serial number
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.id("action")).click();
        // 55 | click | linkText=Edit Inventory Details | 
	await new Promise(r => setTimeout(r, 2000)); 
        await driver.findElement(By.linkText("Edit Inventory Details")).click();
        await driver.wait(until.elementLocated(By.id("hint_id_serial_number")));
        await driver.findElement(By.id("hint_id_serial_number")).click();
        await new Promise(r => setTimeout(r, 8000));  // circleci firefox
        await driver.findElement(By.id("id_serial_number")).clear();
        // 56 | type | id=id_serial_number | 3604-00131-00001-20004
        await new Promise(r => setTimeout(r, 2000));  // circleci
        await driver.findElement(By.id("id_serial_number")).sendKeys("3604-00131-00001-20004");
        await new Promise(r => setTimeout(r, 2000));  // circleci
        // 57 | click | css=.controls > .btn-primary | 
        await driver.findElement(By.css(".controls > .btn-primary")).click();

	await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.id("action")).click();
        // 44 | click | linkText=Add Sub-Assembly | 
        await driver.findElement(By.linkText("Edit Inventory Details")).click();
        // 58 | select | id=id_revision | label=---------
        {
	    await new Promise(r => setTimeout(r, 2000)); //circleci - stale element
            const dropdown = await driver.findElement(By.id("id_revision"));
	    await new Promise(r => setTimeout(r, 2000));  // circleci
            await dropdown.findElement(By.xpath("//option[. = '---------']")).click();
        }

	// Edit item with duplicate serial number
	await new Promise(r => setTimeout(r, 2000)); //circleci
        await driver.wait(until.elementLocated(By.id("hint_id_serial_number")));
        await driver.findElement(By.id("hint_id_serial_number")).click();
	await new Promise(r => setTimeout(r, 2000)); //circleci
        await driver.findElement(By.id("id_serial_number")).clear();
	await new Promise(r => setTimeout(r, 4000)); //circleci
        await driver.findElement(By.id("id_serial_number")).sendKeys("555-456-789-20001");
        // 60 | click | css=.controls > .btn-primary | 
	await new Promise(r => setTimeout(r, 2000)); //circleci
        await driver.findElement(By.css(".controls > .btn-primary")).click();
        await new Promise(r => setTimeout(r, 4000)); //circleci
        assert(await driver.findElement(By.css("#div_id_revision .ajax-error")).getText() == "This field is required.");
        assert(await driver.findElement(By.css("#div_id_serial_number .ajax-error")).getText() == "Inventory with this Serial number already exists.");

        // Close browser window
        driver.quit();

    }
    catch (e) {
        console.log(e.message, e.stack);
        console.log("Add Edit Inventory failed.");
	return 1;
    } 
    console.log("Add Edit Inventory completed.")
    return 0;

})();
