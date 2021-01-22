# Live Streaming Stock data dashboard
This project is to build a client server application which can stream data from a server to a data grid on a website.

# Getting Started
The project is separated into two parts, client side and server side, the configuration are different as shown in the 
following.  

## Server

### Installation
The server is built on python flask-socketio, run the following command in the terminal to install all required package.
```commandline
$ pip install -r requirements.txt
```
### Start the Server
To start broadcasting data, run the following command in terminal with port number (default=8082). 
```commandline
$ python Server.py [-p | --port] 
```

## Client

### Installation
The client is built on TypeScript React framework, using AG Grid to display the data, run the following in the terminal 
to install all required package.
```commandline
$ npm install
```

### Start the client
To start displaying the data, run the following command in terminal to start the react script.
```commandline
$ npm run start
```



To modify the port for the server, change the value in the constants.tsx
```typescript
export const PORT = 8082
```

# Application Logic
The data grid display the data according to the following logic.

## Data Format
The data consist 8 columns, as shown in the following example:

| Time | RowId | Action | Portfolio   | Code | Name           | Price | Quantity |
|------|-------|--------|-------------|------|----------------|-------|----------|
| 0    | 2     | Add    | Portfolio 1 | 0007 | HK FINANCE INV | 0.092 | 100      |
| 0    | 1     | Add    | Portfolio 1 | 0005 | HSBC HOLDINGS  | 31.09 | 100      |
| 0    | 8     | Add    | Portfolio 2 | 0068 | LEE HING       | 1.21  | 100      |
| 1    | 5     | Add    | Portfolio 2 | 0051 | HARBOUR CENTRE | 7.1   | 50       |
| 1    | 9     | Add    | Portfolio 1 | 0068 | LEE HING       | 1.21  | 50       |
| 2    | 10    | Add    | Portfolio 2 | 0293 | CATHAY PAC AIR | 5.86  | 100      |
| 2    | 5     | Update | Portfolio 2 | 0051 | HARBOUR CENTRE | 7.1   | 75       |
| 2    | 2     | Update | Portfolio 1 | 0007 | HK FINANCE INV | 0.091 | 100      |

### Time
The time columns represent the time to send the Update, the value represents the number of seconds since the first 
client connects.

### Action
The action columns represent the action that the row will do to the data grid. There are three types of action: 

**Add**: Adding the row to the data grid, if data already exist, update the value instead.

**Update**: Update the existing data grid for the specific stock (same portfolio, code and name), if it is not existed,
add it to the data grid instead.

**Delete**: Delete the specific stock (same portfolio, code and name) if exist. 

### RowID
This is the Unique Identifier for each row.

### All Other Columns
All other columns are displaying on the data grid.

## Data feed 
The server will start feeding data once the first client is connected, data are sent according to their time column, 
the value inside the time column represent the seconds after the first client is connected. All clients will receive the
same data at the same time, late join clients will not receive previous data, when all data are sent, it will return to
the beginning and broadcast the data all over again.

If all clients is disconnected, the index parameter of the data will be reset, so the broadcasting will start from the 
beginning next time.