import AddressInterface from "./Interfaces/AddressInterface.js";
import Address from "./Models/Address.js";
import {addToDOM, btcToUSD, getData, satsToBTC} from "./Helpers/domHelpers.js";

const apiData = getData("https://mempool.space/api/address/32ixEdVJWo3kmvJGMTZq5jAQVZZeuwnqzo");

let apiResult = null;

apiData
    .then(async data => {
        apiResult = data;
        const onChainData: AddressInterface = new Address(apiResult.address, apiResult.chain_stats.funded_txo_sum, apiResult.chain_stats.spent_txo_sum);
        const mempoolData: AddressInterface = new Address(apiResult.address, apiResult.mempool_stats.funded_txo_sum, apiResult.mempool_stats.spent_txo_sum);
        console.log(apiResult.chain_stats.funded_txo_sum);
        console.log(onChainData);
        const elementOc: HTMLElement | null = document.querySelector("#onchain");
        const elementMp: HTMLElement | null = document.querySelector("#mempool");
        
        const usdValueOc = await btcToUSD(onChainData.getBalance());
        const usdValueMp = await btcToUSD(mempoolData.getBalance());

        if(elementOc && elementMp) {
            addToDOM(elementOc, satsToBTC(onChainData.getBalance()).toString() + " / $" + usdValueOc);
            addToDOM(elementMp, satsToBTC(mempoolData.getBalance()).toString() + " / $" + usdValueMp);
        }
        
})
    .catch(error => {
        console.error("Error fetching data:", error);
});

// Función para obtener las transacciones de una dirección Bitcoin
async function getTransactions(address:string) {
    try {
      const response = await fetch(`https://mempool.space/api/address/${address}/txs`);
      if (!response.ok) {
        throw new Error('Error al obtener las transacciones');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }
  
  // Función para calcular el saldo basado en las transacciones hace x días
  async function calculateBalanceDaysAgo(address:string, daysAgo:number) {
    const transactions = await getTransactions(address);
    
    // Obtener el timestamp de hace `x` días
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - daysAgo);
    const pastTimestamp = Math.floor(pastDate.getTime() / 1000);
  
    let balance = 0;
  
    if (transactions.length === 0) {
      console.log('No se encontraron transacciones para esta dirección.');
      return balance;
    }
  
    console.log(`Revisando transacciones para la dirección ${address}`);
  
    // Recorrer todas las transacciones y sumar o restar valores según los inputs y outputs
    transactions.forEach((tx:any) => {
      console.log(`Transacción en el tiempo: ${tx.time}, Valor en satoshis: ${tx.value}`);
      
      // Revisar si la transacción es anterior a la fecha límite
      if (tx.time < pastTimestamp) {
        // Revisar inputs para restar el valor de la dirección
        tx.vin.forEach((input:any) => {
          if (input.prevout && input.prevout.scriptpubkey_address === address) {
            console.log(`Restando ${input.prevout.value} satoshis de input`);
            balance -= input.prevout.value; // Resta si la dirección está en inputs (es una salida previa)
          }
        });
  
        // Revisar outputs para sumar el valor de la dirección
        tx.vout.forEach((output:any) => {
          if (output.scriptpubkey_address === address) {
            console.log(`Sumando ${output.value} satoshis de output`);
            balance += output.value; // Suma si la dirección está en outputs (se recibe BTC)
          }
        });
      }
    });
  
    return balance;
  }
  
  // Dirección de Bitcoin de ejemplo (cambia por tu dirección)
  const bitcoinAddress = "32ixEdVJWo3kmvJGMTZq5jAQVZZeuwnqzo";
  
  // Cambia el número de días según lo que desees
  const daysAgo = 7;
  
  // Calcular el balance hace `x` días
  calculateBalanceDaysAgo(bitcoinAddress, daysAgo)
    .then((balance) => {
      console.log(`El balance hace ${daysAgo} días era de: ${balance} satoshis`);
    })
    .catch((error) => {
      console.error('Error al calcular el balance:', error);
    });
  