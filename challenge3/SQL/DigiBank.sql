-- CREATE SQL QUERY 
-- Membuat tabel untuk Nasabah (Customer)
CREATE TABLE Customer (
    customer_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255),
    gender VARCHAR(10),
    address TEXT,
    phone_number VARCHAR(20),
    email VARCHAR(255),
    date_of_birth DATE,
    identification_number VARCHAR(20),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    is_delete Boolean
);

-- Membuat tabel untuk Akun (Account)
CREATE TABLE Account (
    account_id SERIAL PRIMARY KEY,
    account_number VARCHAR(20),
    balance NUMERIC(12, 2),
    account_type VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    is_delete Boolean,
    status VARCHAR(20),
    customer_id INT REFERENCES Customer(customer_id)
);

-- Membuat tabel untuk Transaksi (Transaction)
CREATE TABLE Transaction (
    transaction_id SERIAL PRIMARY KEY,
    transaction_type VARCHAR(20),
    amount NUMERIC(12, 2),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    is_delete BOOLEAN,
    account_id INT REFERENCES Account(account_id),
    branch_id INT REFERENCES BankBranch(branch_id)
);


-- Membuat tabel untuk Pemegang Akun
CREATE TABLE AccountHolder (
    account_id INT REFERENCES Account(account_id),
    customer_id INT REFERENCES Customer(customer_id),
    PRIMARY KEY (account_id, customer_id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    is_delete Boolean
);


-- Membuat tabel untuk Bank
CREATE TABLE Bank (
    bank_id SERIAL PRIMARY KEY,
    bank_name VARCHAR(255),
    head_office_address TEXT,
    phone_number VARCHAR(20),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    is_delete Boolean
);

-- Membuat tabel untuk Cabang Bank (Bank Branch)
CREATE TABLE BankBranch (
    branch_id SERIAL PRIMARY KEY,
    branch_name VARCHAR(255),
    branch_address TEXT,
    bank_id INT REFERENCES Bank(bank_id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    is_delete Boolean
);


-- INSERT SQL QUERY
-- Menambahkan data pada table Customer
INSERT INTO Customer (full_name, gender, address, phone_number, email, date_of_birth, identification_number, created_at, updated_at, is_delete)
VALUES
('Rio', 'Male', 'Jl. Utama No. 123, Kotalama', '555-123-4567', 'rio@email.com', '1990-02-15', '1234567890', NOW(), NOW(), FALSE),
('Siti', 'Female', 'Jl. Kenanga No. 456, Desakota', '555-987-6543', 'siti@email.com', '1985-07-20', '9876543210', NOW(), NOW(), FALSE),
('Andi', 'Male', 'Jl. Merdeka No. 789, Kota Baru', '555-555-5555', 'andi@email.com', '1978-11-03', '5555555555', NOW(), NOW(), FALSE),
('Dewi', 'Female', 'Jl. Mawar No. 567, Perkampungan', '555-111-1111', 'dewi@email.com', '1995-04-30', '1111111111', NOW(), NOW(), FALSE),
('Budi', 'Male', 'Jl. Dahlia No. 101, Suburkota', '555-222-3333', 'budi@email.com', '1980-10-10', '1237894560', NOW(), NOW(), FALSE),
('Lina', 'Female', 'Jl. Melati No. 222, Kotaseni', '555-123-7890', 'lina@email.com', '1989-05-20', '9873216540', NOW(), NOW(), FALSE),
('Eko', 'Male', 'Jl. Nusantara No. 333, Kota Indah', '555-888-8888', 'eko@email.com', '1992-08-08', '3698521470', NOW(), NOW(), FALSE),
('Wulan', 'Female', 'Jl. Agung No. 444, Desakota', '555-444-4444', 'wulan@email.com', '1987-03-25', '4563217890', NOW(), NOW(), FALSE),
('Rizky', 'Male', 'Jl. Merah No. 555, Kota Jaya', '555-555-1234', 'rizky@email.com', '1999-12-12', '8529631470', NOW(), NOW(), FALSE),
('Sari', 'Female', 'Jl. Seruni No. 666, Perkotaan', '555-999-9999', 'sari@email.com', '1993-09-18', '1234567890', NOW(), NOW(), FALSE);

-- Menambahkan data pada table Account
INSERT INTO Account (account_number, balance, account_type, created_at, updated_at, is_delete, status, customer_id)
VALUES
    ('1001', 5000.00, 'Savings', NOW(), NOW(), FALSE, 'Active', 1),
    ('1002', 2500.50, 'Savings', NOW(), NOW(), FALSE, 'Active', 2),
    ('1003', 7500.00, 'Savings', NOW(), NOW(), FALSE, 'Active', 3),
    ('1004', 3000.75, 'Savings', NOW(), NOW(), FALSE, 'Active', 4),
    ('1005', 6000.25, 'Checking', NOW(), NOW(), FALSE, 'Active', 5),
    ('1006', 3500.00, 'Checking', NOW(), NOW(), FALSE, 'Active', 6),
    ('1007', 8900.75, 'Savings', NOW(), NOW(), FALSE, 'Active', 7),
    ('1008', 1500.50, 'Checking', NOW(), NOW(), FALSE, 'Active', 8),
    ('1009', 20000.00, 'Savings', NOW(), NOW(), FALSE, 'Active', 9),
    ('1010', 800.00, 'Checking', NOW(), NOW(), FALSE, 'Active', 10);

-- Menambahkan data pada table Transaction
INSERT INTO Transaction (transaction_type, amount, created_at, updated_at, is_delete, account_id, bank_branch_id)
VALUES
    ('Deposit', 1000.00, NOW(), NOW(), FALSE, 1, 1),   
    ('Withdrawal', 500.50, NOW(), NOW(), FALSE, 1, 1),
    ('Deposit', 750.00, NOW(), NOW(), FALSE, 2, 2),   
    ('Deposit', 2000.00, NOW(), NOW(), FALSE, 3, 1),  
    ('Withdrawal', 200.25, NOW(), NOW(), FALSE, 4, 3),
    ('Deposit', 1500.00, NOW(), NOW(), FALSE, 5, 2),
    ('Withdrawal', 800.50, NOW(), NOW(), FALSE, 6, 1),
    ('Deposit', 500.00, NOW(), NOW(), FALSE, 7, 4),   
    ('Withdrawal', 250.75, NOW(), NOW(), FALSE, 8, 2),
    ('Deposit', 300.00, NOW(), NOW(), FALSE, 9, 1);


-- Menambahkan data pada table Account Holder
INSERT INTO AccountHolder (account_id, customer_id, created_at, updated_at, is_delete)
VALUES
    (1, 1, NOW(), NOW(), FALSE),
    (2, 2, NOW(), NOW(), FALSE),
    (3, 3, NOW(), NOW(), FALSE),
    (4, 4, NOW(), NOW(), FALSE),
    (5, 5, NOW(), NOW(), FALSE),
    (6, 6, NOW(), NOW(), FALSE),
    (7, 7, NOW(), NOW(), FALSE),
    (8, 8, NOW(), NOW(), FALSE),
    (9, 9, NOW(), NOW(), FALSE),
    (10, 10, NOW(), NOW(), FALSE);

-- Menambahkan data pada table Bank
INSERT INTO Bank (bank_name, head_office_address, phone_number, created_at, updated_at, is_delete)
VALUES
    ('Bank A', 'Jl. Utama No. 123, Kotalama', '555-111-2222', NOW(), NOW(), FALSE),
    ('Bank B', 'Jl. Kenanga No. 456, Desakota', '555-333-4444', NOW(), NOW(), FALSE),
    ('Bank C', 'Jl. Melati No. 789, Kota Baru', '555-555-5555', NOW(), NOW(), FALSE),
    ('Bank D', 'Jl. Dahlia No. 101, Suburkota', '555-222-3333', NOW(), NOW(), FALSE),
    ('Bank E', 'Jl. Mawar No. 567, Perkampungan', '555-123-7890', NOW(), NOW(), FALSE),
    ('Bank F', 'Jl. Nusantara No. 222, Kota Indah', '555-888-8888', NOW(), NOW(), FALSE),
    ('Bank G', 'Jl. Seruni No. 333, Perkotaan', '555-444-4444', NOW(), NOW(), FALSE),
    ('Bank H', 'Jl. Merah No. 555, Kota Jaya', '555-555-1234', NOW(), NOW(), FALSE),
    ('Bank I', 'Jl. Biru No. 666, Kotaseni', '555-999-9999', NOW(), NOW(), FALSE),
    ('Bank J', 'Jl. Jaya No. 777, Kota Bahagia', '555-777-7777', NOW(), NOW(), FALSE);

-- Menambahkan data pada table BankBranc
INSERT INTO BankBranch (branch_name, branch_address, bank_id, created_at, updated_at, is_delete)
VALUES
    ('Kantor Pusat', 'Jl. Utama No. 123, Kotalama', 1, NOW(), NOW(), FALSE),
    ('Cabang Utama', 'Jl. Kenanga No. 456, Desakota', 1, NOW(), NOW(), FALSE),
    ('Cabang Kota Baru', 'Jl. Melati No. 789, Kota Baru', 2, NOW(), NOW(), FALSE),
    ('Cabang Suburkota', 'Jl. Dahlia No. 101, Suburkota', 2, NOW(), NOW(), FALSE),
    ('Cabang Perkampungan', 'Jl. Mawar No. 567, Perkampungan', 2, NOW(), NOW(), FALSE),
    ('Cabang Kota Indah', 'Jl. Nusantara No. 222, Kota Indah', 3, NOW(), NOW(), FALSE),
    ('Cabang Perkotaan', 'Jl. Seruni No. 333, Perkotaan', 3, NOW(), NOW(), FALSE),
    ('Cabang Kota Jaya', 'Jl. Merah No. 555, Kota Jaya', 3, NOW(), NOW(), FALSE),
    ('Cabang Kotaseni', 'Jl. Biru No. 666, Kotaseni', 4, NOW(), NOW(), FALSE),
    ('Cabang Kota Bahagia', 'Jl. Jaya No. 777, Kota Bahagia', 4, NOW(), NOW(), FALSE);

