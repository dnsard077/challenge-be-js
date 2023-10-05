import { formatRupiah } from "./utils.js";
import { DepositTransaction, WithdrawalTransaction } from "./transaction.js";

class BankAccount {
  constructor() {
    this._saldo = 0;
    this._transactions = [];
    this.balanceElement = document.getElementById("balance");
    this.transactionLogTable = document.getElementById("transaction-log-table");
    this.transactionLogBody = document.getElementById("transaction-log-body");
    this.amountInput = document.getElementById("amount");
    this.depositButton = document.getElementById("deposit-button");
    this.withdrawButton = document.getElementById("withdraw-button");
    this.exitButton = document.getElementById("exit-button");
    this.progressBar = document.getElementById("progress-bar");
    this.loadingMessage = document.getElementById("loading-message");

    this.initializeApp();
  }

  initializeApp() {
    this.updateBalance();
    this.renderTransactionLog();
    this.loadSaldo();
    this.loadTransactions();

    this.depositButton.addEventListener("click", () =>
      this.processTransaction("Deposit")
    );
    this.withdrawButton.addEventListener("click", () =>
      this.processTransaction("Penarikan")
    );
    this.exitButton.addEventListener("click", () => this.exitApp());
  }

  loadSaldo() {
    const saldo = parseFloat(localStorage.getItem("saldo")) || this._saldo;
    this._saldo = saldo;
    this.updateBalance();
  }

  loadTransactions() {
    const transactions =
      JSON.parse(localStorage.getItem("transactions")) || this._transactions;
    this._transactions = transactions;
    this.renderTransactionLog();
  }

  updateBalance() {
    this.balanceElement.innerText = `Saldo Anda Saat Ini: ${this.formatRupiah(
      this._saldo
    )}`;
  }

  renderTransactionLog() {
    const tbody = this.transactionLogBody;
    tbody.innerHTML = "";

    this._transactions.forEach((transaction) => {
      this.renderTransactionRow(tbody, transaction);
    });
  }

  renderTransactionRow(tbody, transaction) {
    const row = tbody.insertRow();
    const cellDate = row.insertCell(0);
    const cellType = row.insertCell(1);
    const cellAmount = row.insertCell(2);
    const cellPrevBalance = row.insertCell(3);
    const cellCurrBalance = row.insertCell(4);

    cellDate.innerText = transaction.date;
    cellType.innerText = transaction.type;
    cellAmount.innerText = this.formatRupiah(transaction.amount);
    cellPrevBalance.innerText = this.formatRupiah(transaction.previousBalance);
    cellCurrBalance.innerText = this.formatRupiah(transaction.currentBalance);
  }

  formatRupiah(amount) {
    return formatRupiah(amount);
  }

  processTransaction(type) {
    const amount = parseFloat(this.amountInput.value);
    if (!isNaN(amount) && amount > 0) {
      const previousBalance = this._saldo;

      this.updateProgressBar(0);
      this.loadingMessage.classList.remove("hidden");

      setTimeout(() => {
        this.updateProgressBar(100);

        setTimeout(() => {
          let transaction;
          if (type === "Deposit") {
            transaction = new DepositTransaction(
              type,
              amount,
              previousBalance,
              this._saldo
            );
          } else {
            if (this._saldo >= amount) {
              transaction = new WithdrawalTransaction(
                type,
                amount,
                previousBalance,
                this._saldo
              );
            } else {
              alert("Saldo Tidak Cukup Untuk Melakukan Penarikan.");
              this.resetState();
              return;
            }
          }

          transaction.processTransaction(this);
          this._transactions.push(transaction);

          this.updateLocalStorage();
          this.updateBalance();
          this.renderTransactionLog();
          this.resetState();
        }, 2000);
      }, 1000);
    } else {
      alert("Masukkan Jumlah Saldo Yang Valid.");
    }
  }

  updateProgressBar(percent) {
    this.progressBar.style.width = percent + "%";
  }

  resetState() {
    this.amountInput.value = "";
    this.updateProgressBar(0);
    this.loadingMessage.classList.add("hidden");
  }

  updateLocalStorage() {
    localStorage.setItem("saldo", this._saldo.toString());
    localStorage.setItem("transactions", JSON.stringify(this._transactions));
  }

  exitApp() {
    localStorage.clear();
    alert("Terima Kasih Telah Menggunakan Aplikasi Ini.");
    window.close();
  }
}

const bankAccount = new BankAccount();
