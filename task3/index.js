const Customer = require("./controller/customer.controller")
const yargs = require("yargs")

yargs.command({
    command: "add",
    builder: {
        accNum: { default: Date.now() },
        name: { demandOption: true },
        userName: { demandOption: true },
        balance: { demandOption: true },
        remaining: { default: 0 },
        transactions: { default: [] },
    },
    handler: (argv) => Customer.addCustomer(argv)
})
yargs.command({
    command: "edit",
    builder: {
        id: { demandOption: true }
    },
    handler: (argv) => Customer.editCustomer(argv)
})
yargs.command({
    command: "del",
    builder: {
        id: { demandOption: true }
    },
    handler: (argv) => Customer.delCustomer(argv.id)
})
yargs.command({
    command: "showAll",
    handler: () => Customer.allCustomers()
})
yargs.command({
    command: "showSingle",
    builder: {
        id: { demandOption: true }
    },
    handler: (argv) => Customer.showCustomer(argv.id)
})
yargs.command({
    command: "addTransaction",
    builder: {
        transNum: { default: Date.now() },
        tType: { demandOption: true },
        tValue: { demandOption: true }
    },
    handler: (argv) => Customer.addTransaction(argv)
})
yargs.command({
    command: "rollBack",
    builder: {
        accNum: { demandOption: true },
        transNum: { demandOption: true }
    },
    handler: (argv) => Customer.rollBackTransaction(argv)
})
yargs.argv