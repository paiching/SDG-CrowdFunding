import { useState, useEffect,useContext } from 'react';
import {ethers} from 'ethers';
import { AuthContext  } from '../AuthContext'; //引進smartAccount

const contractABI = require('./contractAbi_DAO.json');
const contractAddress = "0xab9aC5bdCb810B2eE3D29EaBe55D6F9696037Fc3";

export const useDAO = () => {
  const [contract, setContract] = useState(null);
  
  // 使用 useContext 获取 AuthContext 中的 smartAccount
  const { smartAccount } = useContext(AuthContext);

  useEffect(() => {
    if (smartAccount) {
      // 使用 smartAccount 的提供者初始化合约
      const provider = new ethers.providers.Web3Provider(smartAccount.provider);
      const contractInstance = new ethers.Contract(contractAddress, contractABI, provider);
      setContract(contractInstance);
    }
  }, [smartAccount]);

 

  // 任何需要暴露给组件使用的合约函数
  const getName = async () => {
    if (!contract) return;
    try {
      const name = await contract.getname();
      return name;
      //return ethers.utils.formatUnits(fetchedTotalSupply, 'ether');
    } catch (error) {
      console.error("Error fetching Name:", error);
    }
  };

  // This function will retrieve all events from the contract
  const getAllEvents = async () => {
    if (!contract) return;
  
    try {
      // Fetch all events from the contract's entire history
      const events = await contract.queryFilter("*");
      return events;
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  



// 使用智能账户执行mintBatch操作
const ProposeDao = async () => {
    // 确保合约和smartAccount都已初始化
    if (!contract || !smartAccount) throw new Error('合约或smartAccount未初始化');

    let targets = ["0xE9748e34c0705d67CdFaAAC2B3eE1031D6c146cF"];
    let values = [0];
    //calldatas = contract.interface.encodeFunctionData('createActionPlan');
    let calldatas = ["0x"];
    let description = "DAO的提案描述"

    // 准备交易详情
    const txs = [
      {
        to: contractAddress,
        data: contract.interface.encodeFunctionData('propose', [targets, values,calldatas,description]),
      }
    ];

    // 获取交易的费用报价
    const feeQuotesResult = await smartAccount.getFeeQuotes(txs);
    const gaslessUserOp = feeQuotesResult.verifyingPaymasterGasless?.userOp;

    // 如果有无需用户支付gas费用的选项，发送用户操作
    if (gaslessUserOp) {
      const txHash = await smartAccount.sendUserOperation(gaslessUserOp);
      return txHash; // 返回交易哈希
    } else {
      throw new Error('无可用的无Gas交易选项');
    }
   };

  return { contract, getAllEvents,getName, ProposeDao };
};
