class BankAccount {
  // inisiasi variable
  constructor() {
    this.saldo = 0;
  }

  // function tambahSaldo
  tambahSaldo() {
    const jumlahTambah = parseFloat(
      prompt("Masukkan Jumlah Saldo Yang Ingin Ditambahkan: ")
    );
    if (!isNaN(jumlahTambah)) {
      this.saldo += jumlahTambah;
    } else {
      alert("Masukkan Jumlah Saldo Yang Valid.");
    }
  }

  // function kurangiSaldo
  kurangiSaldo() {
    const jumlahKurang = parseFloat(
      prompt("Masukkan Jumlah Saldo Yang Ingin Dikurangkan: ")
    );
    if (!isNaN(jumlahKurang)) {
      if (this.saldo >= jumlahKurang) {
        this.saldo -= jumlahKurang;
      } else {
        alert("Saldo Tidak Cukup Untuk Melakukan Pengurangan.");
      }
    } else {
      alert("Masukkan Jumlah Saldo Yang Valid.");
    }
  }

  // function tampilkanSaldo
  tampilkanSaldo() {
    alert(`Saldo Anda Saat Ini Adalah: ${this.saldo}`);
  }

  // function menuUtama
  menuUtama() {
    let pilihan;
    pilihan = prompt(
      "Menu Aplikasi Bank Fiktif\n1. Tampilkan Saldo\n2. Tambah Saldo\n3. Kurangi Saldo\n4. Exit\nSilakan Masukkan Pilihan Anda:"
    );
    let parsedPilihan = pilihan ? parseInt(pilihan) : pilihan;

    switch (parsedPilihan) {
      case 1:
        this.tampilkanSaldo();
        this.menuUtama();
        break;
      case 2:
        this.tambahSaldo();
        this.menuUtama();
        break;
      case 3:
        this.kurangiSaldo();
        this.menuUtama();
        break;
      case 4:
      case null:
        alert("Terima Kasih Telah Menggunakan Aplikasi Ini.");
        break;
      default:
        alert("Masukkan Pilihan Yang Valid.");
        this.menuUtama();
        break;
    }
  }
}

// instantiate BankAccount
const bankAccount = new BankAccount();
bankAccount.menuUtama();
