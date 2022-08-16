const fs = require("fs")

class Deal {
    static readFromJson = ()=>{
        let data 
        try{
            data = JSON.parse(fs.readFileSync("data.json"))
        }
        catch(e){
            data = []
        }
        return data
    }
    static writeToJSON = (data)=>{
        fs.writeFileSync("data.json", JSON.stringify(data))
    }
    static getIndex = (allUsers, val, key) =>{
        const index = allUsers.findIndex(user=> user[key] == val)
        return index
    }
}

module.exports = Deal