# DAC Production Monitoring System 

![Laravel](https://img.shields.io/badge/Backend-Laravel_11-red?style=for-the-badge&logo=laravel)
![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/Database-MySQL%2FPostgre-blue?style=for-the-badge&logo=postgresql)

**DAC Production Monitoring System** adalah platform pemantauan lini produksi laptop yang menggabungkan presisi data industri dengan estetika modern. Sistem ini dirancang untuk memastikan **Traceability** penuh, di mana setiap unit dapat dilacak hingga ke kelompok dan leader perakitnya jika ditemukan cacat pada tahap akhir.

---

## 🌌 Konsep Visual
Sistem ini menggunakan pendekatan UI/UX futuristik:
* **Dark Glow Theme:** Latar belakang pekat (#020617) dengan aksen neon cyan pada border dan input.
* **Glassmorphism:** Efek transparansi pada kartu dashboard untuk kesan ringan dan modern.
* **Physics-based Interaction:** Elemen UI yang memiliki efek melayang (*floating*) atau bereaksi terhadap hover menggunakan Framer Motion.

---

## 🏗️ Arsitektur Teknologi

### Backend (API-based)
* **Framework:** Laravel 11
* **Database:** MySQL  (Relational)
* **Auth:** Laravel Sanctum (Token-based authentication)

### Frontend (SPA)
* **Library:** React.js
* **Styling:** Tailwind CSS
* **Animation:** Framer Motion 
* **Icons:** Lucide React / Heroicons

---

## 👥 Manajemen User & Role
Terdapat 6 level akses dengan dashboard dan otoritas yang berbeda:

1.  **Admin:** Manajemen user, data kelompok, dan laporan performa global.
2.  **Pra-Assembly:** Registrasi awal, cek fisik (lecet/penyok), pemasangan RAM & SSD.
3.  **Assembly:** Input Serial Number (SN), pemasangan LCD, baut, dan aktivasi sistem.
4.  **QC (Quality Control):** Audit akhir. Jika "Reject", sistem otomatis menampilkan data Leader kelompok yang merakit.
5.  **Packing:** Pemasangan aksesori (adaptor, manual book, garansi) dan pengemasan.
6.  **Logistik:** Final approval. Tombol "Ship" hanya aktif jika semua tahap sebelumnya (1-4) valid.

---

## ⚙️ Alur Kerja Linear (Traceability Logic)

Sistem menggunakan logika urutan ketat (Linear Progress). Setiap unit membawa data dari tahap sebelumnya:



1.  **Pondasi (Pra-Assembly):** Memilih Kelompok & Leader. Unit berstatus "In Progress".
2.  **Identitas (Assembly):** Scan Serial Number (SN). Sejak tahap ini, SN menjadi kunci utama yang terikat dengan Kelompok/Leader.
3.  **Akuntabilitas (QC):** Scan SN. Jika ada cacat, sistem menarik data relasional: *"Unit SN:XXX dikerjakan oleh Kelompok [Nama] (Leader: [Nama])"*.
4.  **Finalisasi (Packing & Logistik):** Memastikan kelengkapan fisik sebelum status berubah menjadi "Siap Kirim".

---

## 🚀 Instalasi & Setup

### Backend (Laravel)
1. Clone repositori.
2. Jalankan `composer install`.
3. Copy `.env.example` ke `.env` dan sesuaikan database.
4. Jalankan migrasi dan seeder:
   ```bash
   php artisan migrate --seed