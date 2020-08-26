#!/bin/bash

set -e

# Runs all Roundabout Selenium Webdriver automated tests in linux Docker container. Takes about 14 minutes to run.
echo Run Chrome Tests

val=$(node AddEditLocations.js chrome headless)
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

val=$(node AddEditParts.js chrome headless)
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

val=$(node AddEditAssemblies.js chrome headless)
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

val=$(node AddEditInventory.js chrome headless)
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

val=$(node AddBuilds.js chrome headless)
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

val=$(node RetireBuilds.js chrome headless)
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

val=$(node DeleteAssemblies.js chrome headless)
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

val=$(node DeleteParts.js chrome headless)
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

val=$(node DeleteLocations.js chrome headless)
echo $val
if [[ "$val" == *"failed."* ]]; then
  exit 1
fi

exit 0