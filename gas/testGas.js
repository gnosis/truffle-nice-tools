const fs = require('fs-extra');
const _ = require('lodash');
const path = require('path');

let gasStatsFile = process.env.GAS_STATS_FILE;
if (process.env.BUILDGASFILE) {
  gasStatsFile = process.env.BUILDGASFILE
}  
function setupProxiesForGasStats(instance, gasStats) {
  new Set(instance.abi.filter(({ type }) => type === "function")).forEach(
    ({ name: fnName, outputs: fnOutputs }) => {
      const wrapFn = (originalFn, estimateGas) =>
        async function() {
          const result = await originalFn.apply(this, arguments);

          const datum = {
            args: Array.from(arguments),
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

      // HACK: This is support for estimateGas on public variable accessors
      if (original.estimateGas === undefined) {
        original.estimateGas = () => 
        function () {
          var instance = this;
  
          var args = Array.prototype.slice.call(arguments);
          var tx_params = {};
          var last_arg = args[args.length - 1];
  
          // It's only tx_params if it's an object and not a BigNumber.
          if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
            tx_params = args.pop();
          }
  
          tx_params = Utils.merge(C.class_defaults, tx_params);
  
          return C.detectNetwork().then(function() {
            return new Promise(function(accept, reject) {
              var callback = function(error, result) {
                if (error != null) {
                  reject(error);
                } else {
                  accept(result);
                }
              };
              args.push(tx_params, callback);
              fn.apply(instance.contract, args);
            });
          });
        }
      }

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
          const instanceQ = originalAt.apply(this, arguments);
          if(typeof instanceQ.abi !== 'undefined') {
            setupProxiesForGasStats(instanceQ, contract.gasStats);
            return instanceQ;
          } else {
            return instanceQ.then(instance => (
              setupProxiesForGasStats(instance, contract.gasStats),
              instance
            ));
          }
        };

        const originalNew = contract.new;
        contract.new = async function() {
          const instance = await originalNew.apply(this, arguments);
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
