# Assignment 2 - MQTT

_- Ida M. R. Gjeitsund_

---

## Content

1. [How to install and run the project locally](#how-to-install-and-run-the-project-locally)
2. [Technologies used](#technologies-used)
3. [Functionality](#functionality)
4. [Assumptions & things done for simplicity](#assumptions-&-things-done-for-simplicity)

---

## How to install and run the project locally

### Install

1. Run `npm install` in the terminal
2. [_Optional_] Change mongoDB connection string in the [.env](./.env) file to connect to a different database. It is currently set to connect locally.
3. When install has finished, open 4 separate terminals and run these commands

    - `npx nodemon broker`
    - `node devices/ceilingLight`
    - `node devices/heater`
    - `node devices/nightlight`

    This will start up the broker and all the "devices" in the system, except for the "sensors". All functionality and communication will be logged to the terminals.

4. You can then open a 5th terminal and start either of the files in the [sensors](./sensors) folder in whatever order you want. The options are

    - `node sensors/motion.js`
      <br>Mock functionality of the motion sensor detecting motion. Will tell all connected lights to turn brightness to 50% and raise temperature of all connected heaters to 23℃.

    - `node sensors/phone-gps.js`
      <br>Mock functionality of the phone GPS telling the system that it is leaving the home area. Will turn off all connected lights and set temperature of heaters to 20℃.

    - `node sensors/temp.js`
      <br>Mock functionality of a temperature sensor detecting a low temperature. Will tell specific heater ("panel1") to raise temperature to 21℃.

    They will each only publish data once, so you will have to start restart them manually if you want to do it again.

5. Read about functionality [here](#functionality) if needed

---

## Technologies used

| Name          | Usage                                         | Location examples                     |
| ------------- | --------------------------------------------- | ------------------------------------- |
| aedes         | Broker                                        | [broker.js](./broker.js)              |
| mongoose      | Connecting/interacting with DB                | Schemas can be found [here](./models) |
| mqtt          | Connection between publishers and subscribers | Used in all devices and sensor files  |
| net           | Server setup for broker                       | [broker.js](./broker.js)              |
| xml2js        | Conversion from XML to JSON                   | [broker.js](./broker.js)              |
| exificient.js | Conversion from EXI to JSON                   | [broker.js](./broker.js)              |
| dotenv        | Setting environment variables                 | [.env](./.env)                        |
| nodemon       | Automatic refresh of server                   | [package.json](./package.json)        |

---

## Functionality

### Broker

-   Runs server / broker functionality
-   Converts payload to JSON
-   Uploads status of devices to the database

#### Database

I created a couple of simple schemas for saving information about the _Heater_ and _Light_ devices. This is only an example, and in a real system there would of course be a lot more information that needed to be saved. When running the system, you can take a look at your local database to see what it looks like after testing the system.

### Devices

-   Mock functionality of some of the devices in the scenario (2 lightbulbs and 1 heater)
-   Log to the console what happens, e.g.: "Light turned off"
-   Send status information back to the broker so the broker can save status in database

### Sensors

-   Publishes fake data (only once)
    -   The data represents SenML values of various formats

## Assumptions & things done for simplicity

-   Only a small number of the devices in the scenario are included here, for simplicity
-   Since I couldn't collect data from actual sensors, I created fake data that looks like legitimate SenML data
-   Same with the devices, since I cannot program actual lightbulbs to turn on/off etc., I logged the functionality to the console to "mock" actual functionality
-   The QoS is set to the default 0 since the system is running locally and there is no persistent sessions set up
-   There is no authentication/authorization set up. Aedes have authentication and authorization features that would make this easy to do, but it wasn't mentioned as part of the assignment, so I haven't set it up, since it would have to be "faked" anyway
