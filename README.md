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

    This will start up the broker and all the "devices" in the system, except for the "sensors".

4. You can then open a 5th terminal and start either of the files in the [sensors](./sensors) folder in whatever order you want, e.g.:

    - `node sensors/motion.js`
    - `node sensors/phone-gps.js`
    - `node sensors/temp.js`

    They will each only publish data once, so you will have to start restart them manually if you want to do it again.

5. Read about functionality [here](#functionality) if needed

---

## Technologies used

| Name     | Usage                                         | Location examples                     |
| -------- | --------------------------------------------- | ------------------------------------- |
| aedes    | Broker                                        | [broker.js](./broker.js)              |
| mongoose | Connecting/interacting with DB                | Schemas can be found [here](./models) |
| mqtt     | Connection between publishers and subscribers | Used in all devices and sensor files  |
| net      | Server setup for broker                       | [broker.js](./broker.js)              |
| xml2js   | Conversion from XML to JSON                   | [broker.js](./broker.js)              |
| dotenv   | Setting environment variables                 | [.env](./.env)                        |
| nodemon  | Automatic refresh of server                   | [package.json](./package.json)        |

---

## Functionality

### Broker

-   Runs server / broker functionality
-   Converts payload to JSON
-   Uploads status of devices to the database

#### Database

I created a couple of simple schemas for saving information about the _Heater_ and _Light_ devices. This is only an example, and in a real system there would of course be a lot more information that needed to be saved. When running the system, you can take a look at your local database to see what it looks like, but there will of course not be much data there.

### Devices

-   Mock functionality of some of the devices in the scenario (2 lightbulbs and 1 heater)
-   Log to the console what happens, e.g.: "Light turned off"

### Sensors

-   Publishes fake data (only once)
    -   The data represents SenML values of various formats

## Assumptions & things done for simplicity

-   Only a small number of the devices in the scenario are included here
-   Since I couldn't collect data from actual sensors, I created fake data that looks like legitimate SenML data
-   Same with the devices, since I cannot program actual lightbulbs to turn on/off etc., I logged the functionality to the console to "mock" actual functionality
