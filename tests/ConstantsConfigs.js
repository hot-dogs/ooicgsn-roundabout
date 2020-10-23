// JavaScript source code
'use strict';
console.log("Running Constants and Configs Test.");

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


(async function addBuilds() {

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
        await driver.get("https://ooi-cgrdb-staging.whoi.net/");
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

        // CONSTANTS AND CONFIGS TEST

        // Test Approve, Edit, Add Self as Reviewer for Constants and Configs - Issue #123
        // Enable Constants and Configs for Part Type
        await driver.findElement(By.id("navbarAdmintools")).click();
        // 4 | click | linkText=Edit Part Types | 
        await driver.findElement(By.linkText("Edit Part Types")).click();

        // Get the index to the row Sewing Machine is displayed on screen
        await new Promise(r => setTimeout(r, 2000));

        if ((await driver.findElements(By.xpath("//tr[*]/td[text()='Sewing Machine']"))).length != 0) {
            var i = 1;
            while (true) {
                if ((await driver.findElement(By.xpath("//tr[" + i + "]/td")).getText()) == "Sewing Machine") {
                    break;
                }
                i++;
            }
        }
        else
            console.log("Edit Parts failed: Sewing Machine type not found");

        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.css("tr:nth-child(" + i + ") .btn-primary")).click();
        // 9 | click | id=id_ccc_toggle | 
        await driver.findElement(By.id("id_ccc_toggle")).click();
        // 11 | click | css=.btn-primary | 
        await driver.findElement(By.css(".btn-primary")).click();
        await new Promise(r => setTimeout(r, 6000));
       
        // 13 | type | id=searchbar-query | sewing
        await driver.findElement(By.id("searchbar-query")).sendKeys("sewing");
        // 14 | click | css=.btn-outline-primary:nth-child(1) | 
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click();
        await new Promise(r => setTimeout(r, 6000));
        // 15 | click | linkText=1232 | 
        await driver.findElement(By.linkText("1232")).click();
        await new Promise(r => setTimeout(r, 6000));  //stale element
        // 16 | click | id=action | 

        // Create Configurations / Constants | 
        await driver.findElement(By.linkText("Create Configurations / Constants")).click();
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.linkText("Add Configurations/Constants")).click();
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.linkText("Add Configurations/Constants")).click();
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.linkText("Add Configurations/Constants")).click();
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.linkText("Add Configurations/Constants")).click();
        // 23 | type | id=id_config_names-0-name | scon1
       
        // 24 | click | linkText=Add Configurations/Constants | 
        await new Promise(r => setTimeout(r, 2000));

        await driver.findElement(By.id("id_config_names-0-config_type")).sendKeys("Constants"); //dropdown doesn't work here
        await driver.findElement(By.id("id_config_names-1-config_type")).sendKeys("Constants");
        await driver.findElement(By.id("id_config_names-2-config_type")).sendKeys("Configuration");
        await driver.findElement(By.id("id_config_names-3-config_type")).sendKeys("Configuration");
       
        await new Promise(r => setTimeout(r, 2000));
        // 27 | click | id=id_config_names-1-config_type | 
        await driver.findElement(By.id("id_config_names-0-name")).sendKeys("scnst1");
        await driver.findElement(By.id("id_config_names-1-name")).sendKeys("scnst11");
        await driver.findElement(By.id("id_config_names-2-name")).sendKeys("sconf1");
        await driver.findElement(By.id("id_config_names-3-name")).sendKeys("sconf11");

        await new Promise(r => setTimeout(r, 2000));
        // 21 | addSelection | id=id_user_draft | label=admin
        {
            const dropdown = await driver.findElement(By.id("id_user_draft"));
            await dropdown.findElement(By.xpath("//option[. = 'admin']")).click();
        }
        await new Promise(r => setTimeout(r, 4000));

        //let encodedString = await driver.takeScreenshot();
        //await fs.writeFileSync('C:/Users/Joanne/Desktop/sewing.png', encodedString, 'base64');       
        // 30 | click | css=.controls > .btn-primary |
        await driver.findElement(By.css(".controls > .btn-primary")).click();
        // 31 | click | css=.list-group:nth-child(1) > .list-group-item > .collapsed > .fa |
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.css(".list-group:nth-child(1) > .list-group-item > .collapsed > .fa")).click()

        // 36 | click | linkText=Edit Configurations / Constants |
        await new Promise(r => setTimeout(r, 4000));
        await driver.findElement(By.linkText("Edit Configurations / Constants")).click();

        // 40 | type | id=id_config_names-0-name | conf12
        await new Promise(r => setTimeout(r, 4000));
        await driver.findElement(By.id("id_config_names-3-name")).clear();
        await driver.findElement(By.id("id_config_names-3-name")).sendKeys("sconf12");
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.id("id_config_names-1-name")).clear();
        await driver.findElement(By.id("id_config_names-1-name")).sendKeys("scnst12");

        // 46 | click | css=.controls > .btn-primary | 
        await driver.findElement(By.css(".controls > .btn-primary")).click();
        await new Promise(r => setTimeout(r, 2000));
        // 47 | click | css=.list-group:nth-child(1) > .list-group-item > .collapsed > .fa | 
        await driver.findElement(By.css(".list-group:nth-child(1) > .list-group-item > .collapsed > .fa")).click();
        await new Promise(r => setTimeout(r, 2000));
        // 48 | click | linkText=Edit Configurations / Constants | 
        await driver.findElement(By.linkText("Edit Configurations / Constants")).click();
        await new Promise(r => setTimeout(r, 2000));

        // 51 | click | css=.controls > .btn-primary | 
        await driver.findElement(By.css(".controls > .btn-primary")).click();
        await new Promise(r => setTimeout(r, 2000));
        // 52 | click | css=.list-group:nth-child(1) > .list-group-item > .collapsed > .fa | 
        await driver.findElement(By.css(".list-group:nth-child(1) > .list-group-item > .collapsed > .fa")).click();

        // Verify Approvers; blank, Reviewers: admin
        await new Promise(r => setTimeout(r, 2000));
        var bodyText = await driver.findElement(By.tagName("Body")).getText();
        assert(bodyText.includes("Approvers:"));        
        assert(bodyText.includes("Reviewers: admin"));

       
        // UPDATE CONSTANT & CONFIG DEFAULTS - ISSUE#133
        // Navigate to Assembly Item & Part in Assembly Tree
        await driver.findElement(By.id("navbarTemplates")).click()
        // 4 | click | linkText=Assemblies | 
        await driver.findElement(By.linkText("Assemblies")).click()

        if ((await driver.findElements(By.xpath("//div/div/ul/li[*]/a[text()='Electrics']"))).length != 0) {
            // Expand Revision B and Sewing Template
            var j = 1;
            while (true) {
                if ((await driver.findElement(By.xpath("//div/div/ul/li[" + j + "]/a")).getText()) == "Electrics") {
                    break;
                }
                j++;
            }
        }
        else
            console.log("Constants & Configs failed: Electrics type not found");

        await new Promise(r => setTimeout(r, 4000));
        await driver.findElement(By.xpath("//li[" + j + "]/i")).click();
        await new Promise(r => setTimeout(r, 4000));
        await driver.findElement(By.xpath("//li[" + j + "]/ul/li/i")).click();
        await new Promise(r => setTimeout(r, 6000));
        await driver.findElement(By.xpath("//li[" + j + "]/ul/li/ul/li/i")).click(); 
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.linkText("sewing")).click();
        // 12 | click | id=action | 
        await driver.findElement(By.id("action")).click()
        // 13 | click | id=add_configdefault_action | 
        await driver.findElement(By.id("add_configdefault_action")).click()
        // 14 | addSelection | id=id_user_draft | label=admin
        {
            const dropdown = await driver.findElement(By.id("id_user_draft"))
            await dropdown.findElement(By.xpath("//option[. = 'admin']")).click()
        }

        // 16 | type | id=id_config_defaults-0-default_value | 1
        await driver.findElement(By.id("id_config_defaults-0-default_value")).sendKeys("1")
        // 17 | click | css=.controls > .btn-primary | 
        await driver.findElement(By.css(".controls > .btn-primary")).click()
        // Edit Defaults Again
        await driver.findElement(By.linkText("Edit Configuration Defaults")).click()
        // 20 | click | id=id_config_defaults-1-default_value | 
        await driver.findElement(By.id("id_config_defaults-1-default_value")).sendKeys("12")

        // 25 | click | css=.controls > .btn-primary | 
        await driver.findElement(By.css(".controls > .btn-primary")).click();
        await new Promise(r => setTimeout(r, 4000));
        // 27 | click | css=.collapsed > .fa | 
        await driver.findElement(By.css(".collapsed > .fa")).click()
        // Verify values added
        await new Promise(r => setTimeout(r, 4000));
        var bodyText = await driver.findElement(By.tagName("Body")).getText();
        assert(bodyText.includes("1"));
        assert(bodyText.includes("12"));
 

        // Tests defaults on Inventory Items with multiple assemblies - issue #141
        await driver.findElement(By.linkText("Inventory")).click();
        await new Promise(r => setTimeout(r, 6000));
        if ((await driver.findElements(By.xpath("//div[2]/ul/li[*]/a[text()='Test']"))).length != 0) {
            // Expand Revision B and Sewing Template
            var j = 1;
            while (true) {
                if ((await driver.findElement(By.xpath("//div[2]/ul/li[" + j + "]/a")).getText()) == "Test") {
                    break;
                }
                j++;
            }
        }
        else
            console.log("Constants & Configs failed: Test Location not found");

        await new Promise(r => setTimeout(r, 4000));
        await driver.findElement(By.xpath("//li[" + j + "]/i")).click();
        await new Promise(r => setTimeout(r, 4000));
        await driver.findElement(By.xpath("//li[" + j + "]/ul/li/i")).click();
        await new Promise(r => setTimeout(r, 6000));
        await driver.findElement(By.partialLinkText("sewing")).click();
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.id("action")).click()
        // 35 | click | id=add_constdefault_action |
        await new Promise(r => setTimeout(r, 4000));
        await driver.findElement(By.id("add_constdefault_action")).click()
        await new Promise(r => setTimeout(r, 2000));
        // 36 | addSelection | id=id_user_draft | label=admin
        {
            const dropdown = await driver.findElement(By.id("id_user_draft"))
            await dropdown.findElement(By.xpath("//option[. = 'admin']")).click()
        }
        // 38 | type | id=id_constant_defaults-0-default_value | 1
        await driver.findElement(By.id("id_constant_defaults-0-default_value")).sendKeys("657")
        // 39 | click | css=.controls > .btn-primary | 
        await driver.findElement(By.css(".controls > .btn-primary")).click()
        await new Promise(r => setTimeout(r, 2000));
        // 40 | click | id=const_default-template-tab | 
        await driver.findElement(By.id("const_default-template-tab")).click()
        // Edit Defaults Again
        await driver.findElement(By.linkText("Edit Constant Defaults")).click()
        await new Promise(r => setTimeout(r, 2000));
        // 42 | click | id=id_constant_defaults-1-default_value | 
        await driver.findElement(By.id("id_constant_defaults-1-default_value")).click()
        // 43 | type | id=id_constant_defaults-1-default_value | 12
        await driver.findElement(By.id("id_constant_defaults-1-default_value")).sendKeys("983")
        // 44 | click | css=.controls > .btn-primary 
        await driver.findElement(By.css(".controls > .btn-primary")).click()
        await new Promise(r => setTimeout(r, 4000));

        await driver.findElement(By.linkText("Constant Defaults")).click()
        await new Promise(r => setTimeout(r, 4000));
        await driver.findElement(By.linkText("Defaults")).click();
        // Verify values added
        await new Promise(r => setTimeout(r, 4000));
        var bodyText = await driver.findElement(By.tagName("Body")).getText();
        assert(bodyText.includes("657"));
        assert(bodyText.includes("983"));

        // Test Cal/Const/Config Tab on Inventory Item assigned to a Build - Issue #145
        // Verify the absence of the Calibration Tab, the above tests verifys the presence of the Constants Default Tab
        try {
            await driver.findElement(By.linkText("Configuration History"));
            console.log("Constants and Configs Error: Configuration History tab visible when no configs are defined.");
        }
        catch (NoSuchElementException) { } 
       
        //Create Constant Value (on a Deployed Build) and Search for Name, Value, Date, Reviewers, Approval Flag
        await driver.findElement(By.id("action")).click()
        // 8 | click | id=add_const_action | 
        await driver.findElement(By.id("add_const_action")).click()
        // 9 | addSelection | id=id_user_draft | label=admin
        {
            const dropdown = await driver.findElement(By.id("id_user_draft"))
            await dropdown.findElement(By.xpath("//option[. = 'admin']")).click()
        }
        // 13 | click | css=.controls > .btn-primary | 
        await driver.findElement(By.css(".controls > .btn-primary")).click()
        await new Promise(r => setTimeout(r, 2000));
  
        // 16 | select | id=searchbar-modelselect | label=-- Configs/Constants
        await driver.findElement(By.id("searchbar-modelselect")).sendKeys("-- Configs/Constants");
        // 18 | click | css=.btn-outline-primary:nth-child(1) | 
        await driver.findElement(By.css(".btn-outline-primary:nth-child(1)")).click()
        await new Promise(r => setTimeout(r, 2000));
        // 19 | click | id=field-select_c_r0 |

        // Name
        await driver.findElement(By.id("field-select_c_r0")).click()
        // 20 | select | id=field-select_c_r0 | label=Inventory: Name
        {
            const dropdown = await driver.findElement(By.id("field-select_c_r0"))
            await dropdown.findElement(By.xpath("//option[. = 'Config/Const Name']")).click()
        }
        // 23 | type | id=field-query_c_r0 | scnst
        await driver.findElement(By.id("field-query_c_r0")).sendKeys("scnst1")
        // 24 | click | id=qfield-lookup_c_r0 | 
        {
            const dropdown = await driver.findElement(By.id("qfield-lookup_c_r0"))
            await dropdown.findElement(By.xpath("//option[. = 'Exact']")).click()
        }
        // 27 | click | id=searchform-submit-button | 
        await driver.findElement(By.id("searchform-submit-button")).click()
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.partialLinkText("1232"));

        // Value
        // 35 | select | id=field-select_c_r0 | label=Value
        {
            const dropdown = await driver.findElement(By.id("field-select_c_r0"))
            await dropdown.findElement(By.xpath("//option[. = 'Value']")).click()
        }
        await driver.findElement(By.id("field-query_c_r0")).clear();
        // 39 | type | id=field-query_c_r0 | 657
        await driver.findElement(By.id("field-query_c_r0")).sendKeys("657")
        // 40 | click | id=searchform-submit-button | 
        await driver.findElement(By.id("searchform-submit-button")).click()
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.partialLinkText("1232"));

        //Approved Flag
        {
            const dropdown = await driver.findElement(By.id("field-select_c_r0"))
            await dropdown.findElement(By.xpath("//option[. = 'Config/Const Event: Approved Flag']")).click()
        }
        await driver.findElement(By.id("field-query_c_r0")).clear();
        // 39 | type | id=field-query_c_r0 | 657
        await driver.findElement(By.id("field-query_c_r0")).sendKeys("False")
        // 40 | click | id=searchform-submit-button | 
        await driver.findElement(By.id("searchform-submit-button")).click()
        await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.partialLinkText("1232"));

        // Close browser window
        driver.quit();

    }
    catch (e) {
        console.log(e.message, e.stack);
        console.log("Constants and Configs failed.");
        return 1;
    }
    console.log("Constants and Configs completed.");
    return 0;

})();