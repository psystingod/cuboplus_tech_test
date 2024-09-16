class Address {
    constructor(address, funded_txo_sum, spent_txo_sum) {
        this.address = address;
        this.funded_txo_sum = funded_txo_sum;
        this.spent_txo_sum = spent_txo_sum;
    }
    getBalance() {
        return this.funded_txo_sum - this.spent_txo_sum;
    }
}
export default Address;
