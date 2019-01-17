require('dotenv').load();
// 
const abiDecoder = require('abi-decoder');
const fs = require('fs');
const Web3 = require('web3');
const path = require('path');
const chalk = require('chalk');
const { log } = console;
const PORT = process.env.CHAINPORT || '8545';
const abiFolder = process.env.ABIFOLDER || path.resolve(__dirname, '../../../../build/contracts');

if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
	console.log('PORT: ', PORT, 'ABIFOLDER: ', abiFolder);
} else {
	web3 = new Web3(new Web3.providers.HttpProvider(`http://localhost:${PORT}`));
	console.log('PORT: ', PORT, 'ABIFOLDER: ', abiFolder);
}

const abis = []
const bytecodes = []
const names = []
const addresses = []

fs.readdirSync(abiFolder).forEach((fileName, index) => {
	// require uses path relative to __dirname 
	const file = require(abiFolder + '/' + fileName);
	abis[index] = file.abi;
	bytecodes[index] = file.bytecode;
	names[index] = file.contractName;
})

abis.forEach(abi => abiDecoder.addABI(abi));

async function gatherLogs(args) {
	let lastBlock
	try {
		lastBlock = await web3.eth.getBlockNumber()
	} catch (e) {
		log(chalk.red('Failed to connect to an Ethereum Client'));
	}
	lastBlock = args.e ? args.e : lastBlock;

	if(args.b) {
		args.s = args.b;
		lastBlock = args.b;
	}

	if (lastBlock === 0 || typeof lastBlock !== 'number') {
		log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
		log(chalk.red(`There are no transactions to show`));
		log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
		return;
	}

	for (let i = args.s || 0; i <= lastBlock; i++) {
		const block = await web3.eth.getBlock(i)
		const txs = block.transactions
		for (let j = 0; j < txs.length; j++) {
			const tx = await web3.eth.getTransaction(txs[j])
			var accountType = await format(tx.from);

			// console.log('TX:', tx);
			const txReceipt = await web3.eth.getTransactionReceipt(txs[j])
			// console.log(txReceipt);
			const from = await format(tx.from)
			let to
			let input2
			const logs = abiDecoder.decodeLogs(txReceipt.logs)

			if (tx.to == null) {
				to = '0x0 (most likely contract created)'
				input2 = getContractCreated(txReceipt.contractAddress, tx.input)
			} else {
				to = await format(tx.to)
				const input = abiDecoder.decodeMethod(tx.input)
				if (!input) {
					input2 = ''
				} else {
					input2 = input.name + '('
					let params = input.params
					for (let k = 0; k < params.length; k++) {
						input2 += await format(params[k].value)
						if (k != params.length - 1) {
							input2 += ', '
						}
					}
					input2 += ')'
				}
			}

			log(chalk.yellowBright.underline.bold('Tx in Block #' + tx.blockNumber));
			log(chalk.bold('From:'), from)
			log(chalk.bold('To:'), to)
			log(chalk.bold('Input:'), input2)
			await printLogs(logs);
			log(chalk.bold('Value (i.e. ETH sent):'), chalk.green.bold(tx.value));
			log(chalk.bold('Gas used:'), chalk.red.bold(Math.floor(txReceipt.gasUsed / 1000) + 'k'));
			log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
		}
	}
}

async function printLogs(logs) {
	for (let i = 0; i < logs.length; i++) {
		const log = logs[i]
		if (!log) continue
		console.log(chalk.cyanBright.underline.bold(`Event #${i+1}: ${log.name}`));
		for (let j = 0; j < log.events.length; j++) {
			const param = log.events[j]
			console.log(chalk.white.bold(`Name:`), chalk.yellow(`${param.name}`), chalk.white.bold(`Value:`), chalk.yellow(`${param.value}`));
		}
		console.log('------',)
	}
}

async function format(a) {
	const acc = (await web3.eth.getAccounts()).map(x => x.toLowerCase())

	if (typeof a === 'string') {
		a = a.toLowerCase()
	}
	const inAcc = acc.indexOf(a)

	if (inAcc > -1) {
		// a is an account
		return 'accounts[' + inAcc + ']'
	} else {
		let inContr

		for (let i = 0; i < addresses.length; i++) {
			if (addresses[i]) {
				let inAdd = addresses[i].indexOf(a)
				if (inAdd > -1) {
					inContr = i
				}
			}
		}
		
		if (inContr > -1) {
			// a is a contract
			return names[inContr]
		} else {
			// console.log('a.parseInt',a.parseInt)
			if (parseInt(a, 10) && parseInt(a, 10) % 10000 === 0) {
				// a is a number that should be displayed in scientific notation
				// console.log('a.toExponential()',a.toExponential())
				return parseInt(a,10).toExponential()
			} else {
				return a
			}
		}
	}
}

function isInUpToLibraries(bytecode, input) {
	let index
	for (let i = 0; i < bytecode.length; i++) {
		if (bytecode[i] !== input[i]) {
			index = i
			break
		}
	}

	if ((!index || bytecode[index] === '_') && bytecode.length > 2) return true
		else return false
}

function getContractCreated(address, input) {
	let index
	for (let i = 0; i < bytecodes.length; i++) {
		if (isInUpToLibraries(bytecodes[i], input)) {
			index = i
			break
		}
	}

	if (addresses[index]) {
		addresses[index].push(address.toLowerCase())
	} else {
		addresses[index] = [address.toLowerCase()]
	}

	return names[index]
}

const outputData = async (args) => {
	await gatherLogs(args);

	if (args.contracts) {
		const l = Math.max(names.length, addresses.length)
		if (l === 0) {
			log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
			log(chalk.red(`There are no contracts to show`));
			log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
		}
		
		for (let i = 0; i < l; i++) {
			const add = addresses[i] ? addresses[i] : 'not deployed' 
			console.log(names[i], add)
		}
		return;
	}
}

module.exports = outputData;