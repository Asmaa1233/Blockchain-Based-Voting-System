

import Web3 from 'web3';
import ChainOfCustodyContract from './contractJSON/ChainOfCustody.json';



declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}

const getWeb3 = (): Promise<Web3> => {
  return new Promise(async (resolve, reject) => {
    if (typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        resolve(web3);
      } catch (error) {
        reject(error);
      }
    } else if (typeof window.web3 !== 'undefined') {
      resolve(new Web3(window.web3.currentProvider));
    } else {
      // if no web3 provider is currently connected to the browser
      reject(new Error('No web3 provider found'));
    }
  });
};

const getContract = async (web3: Web3, networkId: number): Promise<any> => {
  const chainOfCustodyContract = ChainOfCustodyContract as any;
  const network = chainOfCustodyContract.networks[networkId];
  if (network) {
    const contract = new web3.eth.Contract(
      chainOfCustodyContract.abi,
      network.address,
    );
    return contract;
  } else {
    throw new Error('Contract not deployed to the detected network');
  }
};

export { getWeb3, getContract };
