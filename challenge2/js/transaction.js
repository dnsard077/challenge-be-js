class Transaction {
  constructor(type, amount, previousBalance) {
    this.type = type;
    this.amount = amount;
    this.previousBalance = previousBalance;
    this.currentBalance = 0;
    this.date = new Date().toLocaleString();
  }

  processTransaction(account) {}
}

class DepositTransaction extends Transaction {
  processTransaction(account) {
    account._saldo += this.amount;
    this.currentBalance = account._saldo;
  }
}

class WithdrawalTransaction extends Transaction {
  processTransaction(account) {
    account._saldo -= this.amount;
    this.currentBalance = account._saldo;
  }
}

export { Transaction, DepositTransaction, WithdrawalTransaction };
