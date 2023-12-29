const fs = require('fs');

var data = fs.readFileSync(process.cwd()+'\\src\\app\\id_name_slots.csv');
var items = data.toString().split("\n").map(line => {
    var parts = line.split(",");
    return {
        id: parts[0],
        name: parts[1],
        slots: parts[2]
    }
}).reduce((result, item, index, array) => {
    result[item.id] = {
        name: item.name,
        slots: item.slots
    }

    return result;
}, {});

fs.writeFileSync("id_name_slots.json", JSON.stringify(items));