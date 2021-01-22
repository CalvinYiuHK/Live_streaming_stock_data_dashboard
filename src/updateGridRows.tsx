export type Row = {
  Time: string,
  RowId: string,
  Action: string,
  Portfolio: string,
  Code: string,
  Name: string,
  Price: string,
  Quantity: string
}


export default function updateGridRows(displaying: Row[], commands: Row[]) {
  /*
  Update the displaying data according to the 'Action' field in the received commands.
  Add:    Add the Row into the displaying data, if targeted stock already exist (same portfolio, name, code),
          log an error message and update it instead.
  Update: Update the quantity and price of the targeted stock, if no match is found, log an error message and add it
          instead.
  Delete: Delete the targeted stock, if no match is found, log an error message.
   */
  let result = [];
  let commandIndex;
  let displayingIndex = displaying.length;
  let displayingMap = new Map();
  // Building a hash map for previous data
  while (displayingIndex--) {
    let displayingName = displaying[displayingIndex].Name;
    let displayingCode = displaying[displayingIndex].Code;
    let displayingPortfolio = displaying[displayingIndex].Portfolio;
    displayingMap.set(`${displayingName}-${displayingCode}-${displayingPortfolio}`, displayingIndex);
  }
  // The main loop of the function, loop through all the commands.
  for (commandIndex = 0; commandIndex < commands.length; commandIndex++) {
    const command = commands[commandIndex];
    const action = command.Action;
    const commandName = commands[commandIndex].Name;
    const commandCode = commands[commandIndex].Code;
    const commandPortfolio = commands[commandIndex].Portfolio;
    const commandKey = `${commandName}-${commandCode}-${commandPortfolio}`;

    if (action === "Add") {
      if (displayingMap.has(commandKey)) {
        displaying.splice(displayingMap.get(commandKey), 1);
        console.log("Data already existed, update instead.")
      }

      result.push(commands[commandIndex]);
    } else if (action === "Delete") {
      if (displayingMap.has(commandKey)) {
        displaying.splice(displayingMap.get(commandKey), 1);
      } else {
        console.log("No match found, no Row is deleted.")
      }
    } else if (action === "Update") {
      if (displayingMap.has(commandKey)) {
        displaying.splice(displayingMap.get(commandKey), 1);
      } else {
        console.log("No match found, add instead.")
      }

      result.push(commands[commandIndex]);
    } else {
      throw new Error(`Unsupported action ${action}.`);
    }
  }
  result = result.concat(displaying);
  return result;
}

