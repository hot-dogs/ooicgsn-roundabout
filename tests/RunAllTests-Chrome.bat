rem Runs all Roundabout Selenium Webdriver automated tests in Windows cmd prompt launching Chrome. Takes about 6-11 minutes to run. 
rem Set path to chromedriver.exe
SET PATH=%PATH%;%~dp0\node_modules\chromedriver\lib\chromedriver
start cmd.exe /k "node AddEditLocations.js chrome > RoundAboutTesting.log && node AddEditParts.js chrome >> RoundAboutTesting.log && node AddEditAssemblies.js chrome >> RoundAboutTesting.log && node AddEditInventory.js chrome >> RoundAboutTesting.log && node AddBuilds.js chrome >> RoundAboutTesting.log && node RetireBuilds.js chrome >> RoundAboutTesting.log && node DeleteAssemblies.js chrome >> RoundAboutTesting.log && node DeleteParts.js chrome >> RoundAboutTesting.log && node DeleteLocations.js chrome >> RoundAboutTesting.log"