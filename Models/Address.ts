class Address {

    private readonly address: string;
    private funded_txo_sum: number;
    private spent_txo_sum: number;

    constructor(address: string, funded_txo_sum: number, spent_txo_sum: number) {
        this.address = address;
        this.funded_txo_sum = funded_txo_sum;
        this.spent_txo_sum = spent_txo_sum;
    }

    public getBalance(): number {
        return this.funded_txo_sum - this.spent_txo_sum;
    }
}

export default Address;