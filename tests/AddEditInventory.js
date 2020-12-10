// JavaScript source code
'use strict';
console.log("Running Add & Edit Inventory Test.");

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

        // ADD INVENTORY TEST

        // Add Inventory with unique serial number and non null template, revision code, and location
        await driver.findElement(By.linkText("Inventory")).click();
	while ((await driver.findElements(By.linkText("Add Inventory"))).length == 0) // Inventory tree takes awhile to load
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Add Inventory.");
	}
        // 4 | click | linkText=Add Inventory | 
        await driver.findElement(By.linkText("Add Inventory")).click();

	while ((await driver.findElements(By.id("id_part_type"))).length == 0) // Inventory tree takes awhile to load
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Add Inventory1.");
	}

        // 5 | select | id=id_part_type | label=-- Sewing Machine
        {
            const dropdown = await driver.findElement(By.id("id_part_type"));
            await dropdown.findElement(By.xpath("//option[. = '-- Sewing Machine']")).click();
        }
        // 6 | select | id=id_part | label=Sewing Template
        {
            const dropdown = await driver.findElement(By.id("id_part"));
            await new Promise(r => setTimeout(r, 4000)); //New for 1.6 - This field blanked back out without timeout
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
	await new Promise(r => setTimeout(r, 4000)); 
        var Serial_Number = await driver.findElement(By.id("id_serial_number")).getAttribute("value");
	//let encodedString = await driver.takeScreenshot();
	//await fs.writeFileSync('/tests/iscreen.png', encodedString, 'base64');      
        await driver.findElement(By.css(".controls > .btn")).click();
	while ((await driver.findElements(By.id("action"))).length == 0) // Inventory tree takes awhile to load
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Add Inventory2.");
	}

        // Add Inventory with blank part type, template, revision, and location
        // 11 | click | linkText=Add Inventory | 
        await driver.findElement(By.linkText("Add Inventory")).click();
	await new Promise(r => setTimeout(r, 6000)); 
        // 12 | click | id=id_part_type | 
        await driver.findElement(By.id("id_part_type")).click();
        // 13 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();
	await new Promise(r => setTimeout(r, 4000)); //1.6
        // Wait for bug fix for blank part type error
        assert(await driver.findElement(By.css("#div_id_part .ajax-error")).getText() == "This field is required.");
        assert(await driver.findElement(By.css("#div_id_revision .ajax-error")).getText() == "This field is required.");
        assert(await driver.findElement(By.css("#div_id_location .ajax-error")).getText() == "This field is required.");

        // Add Inventory item with null template
        // 14 | click | id=id_part |
        await driver.findElement(By.id("id_part")).click();
        // 15 | select | id=id_part_type | label=-- Sewing Machine
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
            const dropdown = await driver.findElement(By.id("id_part"));
            await new Promise(r => setTimeout(r, 2000)); //New for 1.6 - This field blanked back out without timeout
            await dropdown.findElement(By.xpath("//option[. = 'Sewing Template']")).click();
        }
        // Add Inventory item with non unique serial number
        // 18 | click | id=hint_id_serial_number | 
        await driver.findElement(By.id("hint_id_serial_number")).click();
        // 19 | click | id=id_serial_number | 
	await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.id("id_serial_number")).click();
        // 20 | type | id=id_serial_number | [Serial_Number]
        // Uses stored serial number assigned above
        await driver.findElement(By.id("id_serial_number")).clear();
        await driver.findElement(By.id("id_serial_number")).sendKeys(Serial_Number);
        // 21 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();

        await new Promise(r => setTimeout(r, 8000));
        assert(await driver.findElement(By.css("#div_id_serial_number .ajax-error")).getText() == "Inventory with this Serial number already exists.");

    // EDIT INVENTORY TEST

       // Add Inventories
        await driver.findElement(By.linkText("Inventory")).click();
        // 4 | click | linkText=Add Inventory | 
	while ((await driver.findElements(By.linkText("Add Inventory"))).length == 0) 
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Add Inventory3.");
	}

        await driver.findElement(By.linkText("Add Inventory")).click();
	while ((await driver.findElements(By.id("id_part_type"))).length == 0) 
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Add Inventory4.");
	}

        // 5 | select | id=id_part_type | label=-- Sewing Machine
        {
            const dropdown = await driver.findElement(By.id("id_part_type"));
            await dropdown.findElement(By.xpath("//option[. = '-- Sewing Machine']")).click();
        }
        // 6 | select | id=id_part | label=Wheel Template
        {
            const dropdown = await driver.findElement(By.id("id_part"));
            await new Promise(r => setTimeout(r, 4000)); //New for 1.6 - This field blanked back out without timeout
            await dropdown.findElement(By.xpath("//option[. = 'Wheel Template']")).click();
        }
        // 7 | select | id=id_location | label=--- Lost
        {
            await new Promise(r => setTimeout(r, 2000));
            const dropdown = await driver.findElement(By.id("id_location"));
            // Space needed before Test
            await dropdown.findElement(By.xpath("//option[. = ' Test']")).click();
        }
	await new Promise(r => setTimeout(r, 2000));
        // 8 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();

let encodedString = await driver.takeScreenshot();
await fs.writeFileSync('/tests/iscreen.png', encodedString, 'base64');    

	while ((await driver.findElements(By.id("action"))).length == 0) // Inventory tree takes awhile to load
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Add Inventory5.");
	}

        // 9 | click | linkText=Add Inventory | 
        await driver.findElement(By.linkText("Add Inventory")).click();
	while ((await driver.findElements(By.id("id_part_type"))).length == 0) // Inventory tree takes awhile to load
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Add Inventory6.");
	}
        // 10 | select | id=id_part_type | label=-- Sewing Machine
        {
            const dropdown = await driver.findElement(By.id("id_part_type"));
            await dropdown.findElement(By.xpath("//option[. = '-- Sewing Machine']")).click();
        }
        // 11 | select | id=id_part | label=Pin Template
        {
            const dropdown = await driver.findElement(By.id("id_part"));
            await new Promise(r => setTimeout(r, 4000)); //New for 1.6 - This field blanked back out without timeout
            await dropdown.findElement(By.xpath("//option[. = 'Pin Template']")).click();
        }
        // 12 | select | id=id_location | label=Test
        {
	    await new Promise(r => setTimeout(r, 2000));
            const dropdown = await driver.findElement(By.id("id_location"));
            // Space needed before Test
            await dropdown.findElement(By.xpath("//option[. = ' Test']")).click();
        }
encodedString = await driver.takeScreenshot();
await fs.writeFileSync('/tests/iscreen1.png', encodedString, 'base64');    
        // 13 | click | css=.controls > .btn | 
        await driver.findElement(By.css(".controls > .btn")).click();
	await new Promise(r => setTimeout(r, 8000));

        // Update location with null location
        // 19 | click | css=.btn-outline-primary:nth-child(1) | 	    
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click(); // search button
        // 20 | click | id=field-select_c_r0 | 
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
//	await new Promise(r => setTimeout(r, 6000));
	while ((await driver.findElements(By.css(".even a"))).length == 0) // 1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Search1.");
	}
        await driver.findElement(By.css(".even a")).click();
        // 26 | click | id=action | 

	while ((await driver.findElements(By.id("action"))).length == 0) 
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Search2.");
	}
        await driver.findElement(By.id("action")).click();

	await new Promise(r => setTimeout(r, 4000));
        // 27 | click | linkText=Location Change | 
        await driver.findElement(By.linkText("Location Change")).click();
        // 28 | select | id=id_location | label=---------
	while ((await driver.findElements(By.id("id_location"))).length == 0) 
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Location.");
	}
        {
            const dropdown = await driver.findElement(By.id("id_location"));
            await dropdown.findElement(By.xpath("//option[. = '---------']")).click();
        }
        await new Promise(r => setTimeout(r, 2000));

	var element = driver.findElement(By.css(".controls > .btn-primary"));
	await driver.executeScript("arguments[0].click();", element);
	//await driver.findElement(By.css(".controls > .btn-primary")).click();	//linux elementnotinteractable error	
	await new Promise(r => setTimeout(r, 6000));
        assert(await driver.findElement(By.css("#div_id_location .ajax-error")).getText() == "This field is required.");

        // Update location with non null location
        // 30 | select | id=id_location | label=Test
        {
            await new Promise(r => setTimeout(r, 2000));
            const dropdown = await driver.findElement(By.id("id_location"));
            await dropdown.findElement(By.xpath("//option[. = ' Test']")).click();
        }
	await new Promise(r => setTimeout(r, 2000));
	await driver.findElement(By.css(".controls > .btn-primary")).click();
	await new Promise(r => setTimeout(r, 6000));

        // 32 | click | css=.btn-outline-primary:nth-child(1) | 
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();  //Search button
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
     
//	await new Promise(r => setTimeout(r, 6000));
	while ((await driver.findElements(By.css(".even a"))).length == 0) // 1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Search3.");
	}
        await driver.findElement(By.css(".even a")).click();

        // Add subassembly item to valid parent
	while ((await driver.findElements(By.id("action"))).length == 0) 
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Search4.");
	}
        await driver.findElement(By.id("action")).click();
        // 44 | click | linkText=Add Sub-Assembly | 
        await driver.findElement(By.linkText("Add Sub-Assembly")).click();
        // 45 | click | linkText=Add | 
	while ((await driver.findElements(By.linkText("Add"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Add SubAssembly.");
	}
        await driver.findElement(By.linkText("Add")).click();
        // 46 | click | id=action | 

	while ((await driver.findElements(By.id("action"))).length == 0) 
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Add Sub-Assembly.");
	}
        await driver.findElement(By.id("action")).click();
        // 47 | click | linkText=Add Sub-Assembly | 

        // Add another subassembly item to valid parent - no more children appear
        await driver.findElement(By.linkText("Add Sub-Assembly")).click();
        // 48 | type | id=searchbar-query | pioneer inshore deck assembly
        await driver.findElement(By.id("searchbar-query")).sendKeys("singer");
        // 49 | click | css=.btn-outline-primary:nth-child(1) | 
	while ((await driver.findElements(By.xpath("//p[contains(.,'NONE')]"))).length == 0) 
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Xpath.");
	}
        await driver.findElement(By.xpath("//p[contains(.,'NONE')]"));
            
        // Add valid child to parent assembly
        await driver.findElement(By.id("searchbar-query")).clear();
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();  //Search button
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
//	await new Promise(r => setTimeout(r, 8000));  //1.6
	while ((await driver.findElements(By.css(".even a"))).length == 0) // 1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Search5.");
	}
       // 43 | click | id=action | 
        await driver.findElement(By.css(".even a")).click();

        // 43 | click | id=action |
	while ((await driver.findElements(By.id("action"))).length == 0) 
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Search6.");
	}
        await driver.findElement(By.id("action")).click();
        // 52 | click | linkText=Add to Parent Assembly | 
        await driver.findElement(By.linkText("Add to Parent Assembly")).click();
        // 53 | click | linkText=Add | 
	while ((await driver.findElements(By.linkText("Add"))).length == 0) //1.6
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Add SubAssembly.");
	}
        await driver.findElement(By.linkText("Add")).click();

        // Edit item details with null revision code and update serial number
	while ((await driver.findElements(By.id("action"))).length == 0) 
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Add to Parent.");
	}
        await driver.findElement(By.id("action")).click();
        // 55 | click | linkText=Edit Inventory Details | 
	await new Promise(r => setTimeout(r, 8000)); 
        await driver.findElement(By.linkText("Edit Inventory Details")).click();
	await new Promise(r => setTimeout(r, 4000));
        await driver.findElement(By.id("hint_id_serial_number")).click();
        await new Promise(r => setTimeout(r, 8000)); 
        await driver.findElement(By.id("id_serial_number")).clear();
        // 56 | type | id=id_serial_number | 3604-00131-00001-20004
        await new Promise(r => setTimeout(r, 2000));
        // Note: Serial number can be found in the Trash Bin if Inventory not deleted when Build or Part is deleted
        await driver.findElement(By.id("id_serial_number")).sendKeys("3604-00131-00001-20004");
        await new Promise(r => setTimeout(r, 2000));
        // 57 | click | css=.controls > .btn-primary | 
        await driver.findElement(By.css(".controls > .btn-primary")).click();
	while ((await driver.findElements(By.id("action"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Search7.");
	}
        await driver.findElement(By.id("action")).click();

        // 44 | click | linkText=Add Sub-Assembly | 
        await driver.findElement(By.linkText("Edit Inventory Details")).click();
        // 58 | select | id=id_revision | label=---------
        {
	    await new Promise(r => setTimeout(r, 6000)); //circleci - stale element
            const dropdown = await driver.findElement(By.id("id_revision"));
	    await new Promise(r => setTimeout(r, 2000));
            await dropdown.findElement(By.xpath("//option[. = '---------']")).click();
        }

	    // Edit item with duplicate serial number
	await new Promise(r => setTimeout(r, 2000));
  
        await driver.findElement(By.id("hint_id_serial_number")).click();
	await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.id("id_serial_number")).clear();
	await new Promise(r => setTimeout(r, 4000));
        await driver.findElement(By.id("id_serial_number")).sendKeys("555-456-789-20001");
        // 60 | click | css=.controls > .btn-primary | 
	await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.css(".controls > .btn-primary")).click();
        await new Promise(r => setTimeout(r, 8000));
        assert(await driver.findElement(By.css("#div_id_revision .ajax-error")).getText() == "This field is required.");
        assert(await driver.findElement(By.css("#div_id_serial_number .ajax-error")).getText() == "Inventory with this Serial number already exists.");

	await new Promise(r => setTimeout(r, 2000));        
	// Assign Destination to Sewing Inventory - tests Issue #143
        await driver.findElement(By.partialLinkText("sewing")).click();

	while ((await driver.findElements(By.id("action"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Click Navtree.");
	}   
        // 9 | click | id=action | 
        await driver.findElement(By.id("action")).click();

        // 10 | click | linkText=Assign Destination | 
        await driver.findElement(By.linkText("Assign Destination")).click();
        // 11 | click | css=.btn > b | 
	await new Promise(r => setTimeout(r, 6000));    
        await driver.findElement(By.css(".btn > b")).click();
        // 12 | click | linkText=Select | 
	await new Promise(r => setTimeout(r, 2000));    
        await driver.findElement(By.linkText("Select")).click();
        // 13 | click | id=destination-tab | 
//	await new Promise(r => setTimeout(r, 2000));
	while ((await driver.findElements(By.id("destination-tab"))).length == 0)
	{
	   await new Promise(r => setTimeout(r, 2000));
	   console.log("Wait 2 seconds for Assign Desination.");
	}   
        await driver.findElement(By.id("destination-tab")).click();
        await new Promise(r => setTimeout(r, 4000));

        var bodyText = await driver.findElement(By.tagName("Body")).getText();
        assert(bodyText.includes("Revision B - Singer"));     //Verify the Destination is assigned on the Destination tab

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
