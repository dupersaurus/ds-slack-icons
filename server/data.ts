import fs = require("fs");

export class DataManager {
    private static _iconSets: Map<string, any> = null;
    
    constructor() {
        if (DataManager._iconSets == null) {
            DataManager._iconSets = new Map<string, any>();

            var master = JSON.parse(fs.readFileSync('data/icon-sets.json', 'utf8'));

            for (var set of master.sets) {
                console.log(set);
                console.log(`Load set ${set.name} with list ${set.list}`);
                DataManager._iconSets[set.name] = set.list;
            }
        }
    }

    getSetDefinition(name: string): {name: string, list: string} {
        return DataManager._iconSets[name];
    }
}

var dataManager = new DataManager();
export default dataManager;