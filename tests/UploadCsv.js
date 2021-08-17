// JavaScript source code
'use strict';
console.log("Running Upload CSV (CI Version) Test.");

// Generated by Selenium IDE
const { Builder, By, Key, until, a, WebElement, promise, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const assert = require('assert');

var driver;
var myArgs = process.argv.slice(2);
var user;
var password;
var filename, filename_ext;

(async function uploadCsv() {

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

        // UPLOAD CSV TEST
        var fs = require('fs');
        const jsdom = require("jsdom");
        const { JSDOM } = jsdom;
        const { window } = new JSDOM(`...`);
        var $ = require('jquery')(window);
        $.csv = require('jquery-csv');
        var data;
        var erroridx = 0;

	// Import Cruise CSV - CI Version
        await driver.findElement(By.id("navbarAdmintools")).click()
        await driver.findElement(By.linkText("Upload GitHub CSVs")).click()
        if (myArgs[1] == 'headless') {
            filename = process.cwd() + "//CruiseInformation-import.csv";
        }
        else {
            filename = process.cwd() + "\\CruiseInformation-import.csv";
        }
        await driver.findElement(By.id("id_cruises_csv")).sendKeys(filename)
        await driver.findElement(By.id("submit")).click()
        // Wait for upload to Complete
        var bodyText;
        for (var j = 0; j < 5; j++) {
            bodyText = await driver.findElement(By.tagName("Body")).getText();
            if (bodyText.includes("Import Complete")) {
                break;
            }
            else if (bodyText.includes("File: CruiseInformation-import")) {
                // Import error occurred
                erroridx = bodyText.indexOf("File: CruiseInformation-import");
                var error = bodyText.substring(erroridx, erroridx + 70);
                console.log("Import Error Occurred: " + error);
                break;
            }
            else {
                await new Promise(r => setTimeout(r, 2000));
                console.log("Wait 2 seconds for Import Cruises.");
            }
        }

        // If no import error, export the Cruise file
        if (erroridx == 0) {

           // Don't trust Import Complete has actually imported all the Cruises
           await new Promise(r => setTimeout(r, 20000));

           // Export Cruises - CI Version
           await driver.findElement(By.id("navbarAdmintools")).click()
           await driver.findElement(By.linkText("Bulk Download Tool")).click()
	   // CI download button associated with Cruises
           await driver.findElement(By.linkText("Export Cruises [CI]")).click()

           // Access Downloaded Cruise file
           if (myArgs[1] == 'headless') {
               // Docker/Circleci puts file in the current dir
               var rdb_cruise = process.cwd() + "//CruiseInformation.csv";
           }
           else {
               // Windows command line puts file in the User's default Downloads dir
               const execSync = require('child_process').execSync;
               var username = execSync('echo %username%', { encoding: 'utf-8' });
               username = username.replace(/[\n\r]+/g, '');
               var rdb_cruise = "C:\\Users\\" + username + "\\Downloads\\CruiseInformation.csv";
           }

           while (!fs.existsSync(rdb_cruise)) // wait for file download
           {
               await new Promise(r => setTimeout(r, 2000));
               console.log("Wait 2 seconds for File Download.");
           }
           await new Promise(r => setTimeout(r, 20000));  //wait for file write to finish

           // Compare Uploaded & Exported Cruise files
           // read a line from upload file and find it in exported buffer to verify Cruise was created properly
           // my local file has been modified to remove extra spaces and an extra dash in a time field and to fix R/V naming
           var upload = fs.readFileSync(filename, 'utf8');
           var exported = fs.readFileSync(rdb_cruise, 'utf8');

           var uploaded_data = $.csv.toArrays(upload);

           // Skip  line
           for (var i = 2, len = uploaded_data.length; i < len; i++) {
               var cruise_str = uploaded_data[i];
      	       // Strip off any trailing blanks in cruise name imported data
	       cruise_str[1] = cruise_str[1].toString().trim();
	       // Remove extra dash in Timestamp
	       cruise_str[2] = cruise_str[2].toString().replace('-T', 'T');
	       cruise_str[3] = cruise_str[3].toString().replace('-T', 'T');
               // This is the only way to compare the double quotes in the notes field
               if (cruise_str[4].includes(",")) {
                    if (!(exported.includes(cruise_str[0]) && exported.includes(cruise_str[1])
                       && exported.includes(cruise_str[2]) && exported.includes(cruise_str[3])))
                       console.log("Cruise Export Missing: " + cruise_str)
                    if (!exported.includes(cruise_str[4]))
                       console.log("Cruise Export Missing: " + cruise_str[4])
               }
               else if (!exported.includes(cruise_str)) {
                   console.log("Cruise Export Missing: "+cruise_str)
               }
           }
        }

        // Import Vessel CSV - CI Version
        // My file has been modified from the asset mgmt. file - fix mara s. marian invalid char in mmsi field
        await driver.findElement(By.id("navbarAdmintools")).click()
        await driver.findElement(By.linkText("Upload GitHub CSVs")).click()
        if (myArgs[1] == 'headless') {
            filename = process.cwd() + "//shiplist-import.csv";
        }
        else {
            filename = process.cwd() + "\\shiplist-import.csv";
        }
        await driver.findElement(By.id("id_vessels_csv")).sendKeys(filename)
        await driver.findElement(By.id("submit")).click()
        // Wait for upload to Complete
        erroridx = 0;
        for (var j = 0; j < 5; j++) {
            bodyText = await driver.findElement(By.tagName("Body")).getText();
            if (bodyText.includes("Import Complete")) {
                break;
            }
            else if (bodyText.includes("File: shiplist-import")) {
                // Import error occurred (asset mgmt file has only prefix, designation, vessel name for all vessels)
                erroridx = bodyText.indexOf("File: shiplist-import");
                var error = bodyText.substring(erroridx, erroridx + 70);
                console.log("Import Error Occurred: " + error);
                break;
            }
            else {
                await new Promise(r => setTimeout(r, 2000));
                console.log("Wait 2 seconds for Import Cruises.");
            }
        }

        // If no import error, export the Vessel file
        if (erroridx == 0) {
           // Don't trust Import Complete has actually imported all the Vessels
           await new Promise(r => setTimeout(r, 20000));

           // Export Vessels - CI Version
           await driver.findElement(By.id("navbarAdmintools")).click()
           await driver.findElement(By.linkText("Bulk Download Tool")).click()
	   // CI download button associated with Vessels
           await driver.findElement(By.linkText("Export Vessels [CI]")).click()

           // Access Downloaded Vessel file
           if (myArgs[1] == 'headless') {
               // Docker/Circleci puts file in the current dir
               var rdb_vessel = process.cwd() + "//shiplist.csv";
           }
           else {
               // Windows command line puts file in the User's default Downloads dir
               const execSync = require('child_process').execSync;
               var username = execSync('echo %username%', { encoding: 'utf-8' });
               username = username.replace(/[\n\r]+/g, '');
               var rdb_vessel = "C:\\Users\\" + username + "\\Downloads\\shiplist.csv";
           }

           while (!fs.existsSync(rdb_vessel)) // wait for file download
           {
               await new Promise(r => setTimeout(r, 2000));
               console.log("Wait 2 seconds for File Download.");
           }

           await new Promise(r => setTimeout(r, 20000));  //wait for file write to finish

           // Compare Uploaded & Exported Vessel files
           upload = fs.readFileSync(filename, 'utf8');
           exported = fs.readFileSync(rdb_vessel, 'utf8');

           // Strip .0 off all numbers in exported data to match imported data
           // exported = exported.replace("/(\.[0-9]*[1-9]+)[0]+/", "$1",);
           // console.log(exported);

           var uploaded_data = $.csv.toArrays(upload);

           // Skip header line
           for (var i = 1, len = uploaded_data.length; i < len; i++)
           {
               var vessel_str = uploaded_data[i];
	       // Strip off any trailing blanks in vessel name imported data
   	       vessel_str[2] = vessel_str[2].toString().trim();

               for (var j = 0, lth = vessel_str.length; j < lth; j++)
               {
                   if (!(exported.includes(vessel_str[j])))
                   {
                       console.log("Vessel Export Missing: " + vessel_str +" at index:  "+ j +"  "+ vessel_str[j] );
                       break;
                   }
               } 
           }
        }


        // Upload Calibration CSV with a single calibration and a 2D calibration
	// Test depends on Manufacturer Serial Number previously defined in Import Export Inventory
        await driver.findElement(By.id("navbarAdmintools")).click()
        await driver.findElement(By.linkText("Upload GitHub CSVs")).click()
        if (myArgs[1] == 'headless') {
            filename = process.cwd() + "//3604-00131-00001-20004__20160510-import.csv";
        }
        else {
            filename = process.cwd() + "\\3604-00131-00001-20004__20160510-import.csv";
        }

        await driver.findElement(By.id("id_calibration_csv")).sendKeys(filename);
        if (myArgs[1] == 'headless') {
            filename_ext = process.cwd() + "//3604-00131-00001-20004__20160510-import__scalib2.ext";
        }
        else {
            filename_ext = process.cwd() + "\\3604-00131-00001-20004__20160510-import__scalib2.ext";
        }
        await driver.findElement(By.id("id_calibration_csv")).sendKeys(filename_ext);

        await driver.findElement(By.id("submit")).click()

        // Wait for upload to Complete
        var bodyText;
        for (var j = 0; j < 5; j++) {
            bodyText = await driver.findElement(By.tagName("Body")).getText();
            if (bodyText.includes("Import Complete")) {
                break;
            }
            else {
                await new Promise(r => setTimeout(r, 2000));
                console.log("Wait 2 seconds for Import Calibrations.");
            }
        }
        // Don't trust Import Complete has actually imported all the Calibrations
        await new Promise(r => setTimeout(r, 20000));

        // Bulk Download Calibrations
        await driver.findElement(By.id("navbarAdmintools")).click()
	await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.linkText("Bulk Download Tool")).click()
	await new Promise(r => setTimeout(r, 2000));
        await driver.findElement(By.linkText("Export Calibrations")).click()
	await new Promise(r => setTimeout(r, 2000));

        // Access Downloaded Calibrations file
        if (myArgs[1] == 'headless') {
            // Docker/Circleci puts file in the current dir
            var rdb_calib = process.cwd() + "//CalibrationEvents.zip"
            var rdb_path = process.cwd();
            var rdb_unzip = process.cwd() + "//3604-00131-00001-20004__20160510.csv"
            var rdb_ext = process.cwd() + "//3604-00131-00001-20004__20160510__scalib2.ext"
        }
        else {
            // Windows command line puts file in the User's default Downloads dir
            const execSync = require('child_process').execSync;
            var username = execSync('echo %username%', { encoding: 'utf-8' });
            username = username.replace(/[\n\r]+/g, '');
            var rdb_calib = "C:\\Users\\" + username + "\\Downloads\\CalibrationEvents.zip";
            var rdb_path = "C:\\Users\\" + username + "\\Downloads";
            var rdb_unzip = "C:\\Users\\" + username + "\\Downloads\\3604-00131-00001-20004__20160510.csv";
            var rdb_ext = "C:\\Users\\" + username + "\\Downloads\\3604-00131-00001-20004__20160510__scalib2.ext"
        }

        while (!fs.existsSync(rdb_calib)) // wait for file download
        {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for File Download.");
        }

        // Unzip file
        const unzipper = require('unzipper')

        // await and promise required to work
        await fs.createReadStream(rdb_calib).pipe(unzipper.Extract({ path: rdb_path })).promise();

        while (!fs.existsSync(rdb_unzip)) // wait for file extract
        {
            await new Promise(r => setTimeout(r, 2000));
            console.log("Wait 2 seconds for File Extract.");
        }

        // Compare Uploaded & Exported Calibration files
        var upload = fs.readFileSync(filename, 'utf8');
        var upload_ext = fs.readFileSync(filename_ext, 'utf8');
        var exported = fs.readFileSync(rdb_unzip, 'utf8');

        // First imported value is type single, second imported value is type 2D array - read it's value from referenced .ext file
        var uploaded_data = $.csv.toArrays(upload);
        var uploaded_ext = $.csv.toArrays(upload_ext);
        var exported_data = $.csv.toArrays(exported);

        var single_str = uploaded_data[1];
        for (var j = 0, lth = single_str.length; j < lth; j++) {
            if (!(exported.includes(single_str[j]))) {
                console.log("Calibration Export Missing: " + single_str + " at index:  " + j + "  " + single_str[j]);
                break;
            }
        }

        if (uploaded_data[2][0] != exported_data[2][0])
            console.log("Calibration Export Missing: Serial Number " + uploaded_data[2]);
        if (uploaded_data[2][1] != exported_data[2][1])
            console.log("Calibration Export Missing: Name " + uploaded_data[2]);
        if (uploaded_data[2][3] != exported_data[2][3])
            console.log("Calibration Export Missing: Notes " + uploaded_data[2]);
        if (exported_data[2][2] != "SheetRef:scalib2")
            console.log("Calibration Export Missing: 2 Dimensional Array Ext File Reference " + exported_data[2][2]);

        // Open and read the Ext file
        var ext_data = fs.readFileSync(rdb_ext, 'utf8');
        if (!ext_data.includes(uploaded_ext[0]))
            console.log("Calibration Export Missing: 2 Dimensional Array Values");


        // Upload Deployment CSV
        
            

        // Close browser window
        driver.quit();

    }
    catch (e) {
        console.log(e.message, e.stack);
        console.log("Upload CSV (CI Version) failed.");
        return 1;
    }
    console.log("Upload CSV (CI Version) completed.");
    return 0;

})();
