const fs = require('fs-extra');
const _ = require('lodash');
const path = require('path');

const gasStatsFile = path.join('build', 'gas', 'gas-stats.json');

function setupProxiesForGasStats(instance, gasStats) {
  new Set(instance.abi.filter(({ type }) => type === "function")).forEach(
    ({ name: fnName, outputs: fnOutputs }) => {
      const wrapFn = (originalFn, estimateGas) =>
        async function() {
          const result = await originalFn.apply(this, arguments);

          const datum = {
            args: Array.from(arguments).slice(0, fnOutputs.length),
            gasUsed: _.has(result, "receipt")
              ? result.receipt.gasUsed
              : await estimateGas.apply(this, arguments)
          };

          let fnGasStats = gasStats[fnName];

          if (fnGasStats == null) {
            fnGasStats = {
              data: []
            };
            gasStats[fnName] = fnGasStats;
          }

          fnGasStats.data.push(datum);

          return result;
        };
      const original = instance[fnName];
      instance[fnName] = wrapFn(original, original.estimateGas);
      instance[fnName].call = wrapFn(original.call, original.estimateGas);
    }
  );
}

function createGasStatCollectorBeforeHook(contracts) {
  return () => {
    if (process.env.COLLECT_GAS_STATS) {
      contracts.forEach(contract => {
        contract.gasStats = {};

        const originalDeployed = contract.deployed;
        contract.deployed = async function() {
          const instance = await originalDeployed.apply(this, arguments);
          setupProxiesForGasStats(instance, contract.gasStats);
          return instance;
        };

        const originalAt = contract.at;
        contract.at = function() {
          const instance = originalAt.apply(this, arguments);
          setupProxiesForGasStats(instance, contract.gasStats);
          return instance;
        };
      });
    }
  };
}

function createGasStatCollectorAfterHook(contracts) {
  return () => {
    if (process.env.COLLECT_GAS_STATS) {
      let existingData;

      const collectedData = _.fromPairs(
        contracts.map(contract => [contract.contract_name, contract.gasStats])
      );

      try {
        existingData = JSON.parse(fs.readFileSync(gasStatsFile));
      } catch (e) {
        fs.outputFileSync(gasStatsFile, JSON.stringify(collectedData, null, 2));
        return;
      }

      _.forEach(collectedData, (contractData, contractName) => {
        const existingContractData = existingData[contractName];
        if (existingContractData != null) {
          _.forEach(contractData, (fnData, fnName) => {
            const existingFnData = existingContractData[fnName];
            if (existingFnData != null) {
              Array.prototype.push.apply(existingFnData.data, fnData.data);
            } else {
              existingContractData[fnName] = fnData;
            }
          });
        } else {
          existingData[contractName] = contractData;
        }
      });

      fs.outputFileSync(gasStatsFile, JSON.stringify(existingData, null, 2));
    }
  };
}

Object.assign(exports, {
  createGasStatCollectorBeforeHook,
  createGasStatCollectorAfterHook
});
