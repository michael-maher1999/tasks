const deal = require("./deal.controller")
const heads = ["accNum", "name", "userName", "balance", "remaining", "transactions"]
const transHeads = ["transNum", "tType", "tValue"]
const allowedHeads = ["name", "userName"]

class Customer {
    static addCustomer= (data)=>{
        const customer = {}
        heads.forEach(head => customer[head] = data[head])
        customer.remaining = customer.balance
        const allCustomers = deal.readFromJson()
        const index = deal.getIndex(allCustomers, customer.userName, "userName")
        if(index!=-1) return console.log("userName used before")
        allCustomers.push(customer)
        deal.writeToJSON(allCustomers)
    }
    static showCustomer=(data)=>{
        const allUsers = deal.readFromJson()
        const index = deal.getIndex(allUsers, data, "accNum")
        if(index==-1) return console.log("user not found")
        console.log(allUsers[index])
    }
    static allCustomers=()=>{
        console.log(deal.readFromJson())
    }    
    static editCustomer=(argv)=>{
        const customer = {}
        allowedHeads.forEach(head => customer[head] = argv[head]) // edit name, userName only
        console.log(customer);
        const allCustomers = deal.readFromJson()
        const index = deal.getIndex(allCustomers, argv.id, "accNum")
        if (index == -1) return console.log("not found")

        // verify username is unique
        const hasUserName = deal.getIndex(allCustomers, customer.userName, "userName")
        if (hasUserName!=-1 && hasUserName!=index){
            return console.log("user used before")
        }
        for (const property in customer){
            allCustomers[index][property] = customer[property]
        }
        console.log(allCustomers[index]);
        deal.writeToJSON(allCustomers)
    }
    static addTransaction=(argv)=>{
        const trans = {}
        const allCustomers = deal.readFromJson()
        const index = deal.getIndex(allCustomers, argv.accNum, "accNum")
        if (index==-1) return console.log("user not found")

        transHeads.forEach(head => trans[head] = argv[head])

        if (argv.tType == "withdraw") allCustomers[index].remaining = allCustomers[index].remaining - argv.tValue
        else allCustomers[index].remaining = allCustomers[index].remaining + argv.tValue
    
        allCustomers[index].transactions.push(trans)
        
        console.log(allCustomers[index])
        deal.writeToJSON(allCustomers)
    }
    static delCustomer=(data)=>{
        const allUsers = deal.readFromJson()
        const index = deal.getIndex(allUsers, data, "accNum")
        if(index==-1) return console.log("user not found")
        allUsers.splice(index, 1)
        deal.writeToJSON(allUsers)
    }
    static rollBackTransaction=(argv)=>{
        const allUsers = deal.readFromJson()
        const index = deal.getIndex(allUsers, argv.accNum, "accNum")
        const transIndex = deal.getIndex(allUsers[index].transactions, argv.transNum, "transNum")
        
        if (allUsers[index].transactions[transIndex].tType == "withdraw"){
            allUsers[index].remaining = allUsers[index].remaining + allUsers[index].transactions[transIndex].tValue
        }
        else allUsers[index].remaining = allUsers[index].remaining - allUsers[index].transactions[transIndex].tValue
        
        allUsers[index].transactions.splice(transIndex, 1)
        deal.writeToJSON(allUsers)
        console.log(allUsers[index].transactions[transIndex])
    }
}

module.exports = Customer