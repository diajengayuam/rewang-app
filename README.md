# REWANG ITS

PWA statis untuk prototipe ekosistem gotong royong kampus: Rewang Bantu dan Rewang Talang. Tidak memerlukan proses build atau dependensi.

## Menjalankan

Jalankan server HTTP lokal dari folder proyek, misalnya:

```sh
python3 -m http.server 8000
```

Buka `http://localhost:8000`. Service worker dan pengalaman offline tersedia di localhost atau saat aplikasi di-host melalui HTTPS. Membuka `index.html` langsung tetap menampilkan UI, tetapi tidak mengaktifkan service worker.

## Batasan prototipe

Formulir meminta email berformat `10-digit-NRP@student.its.ac.id` dan nama lengkap. Contoh `2043231084@student.its.ac.id` memetakan empat digit awal `2043` ke Statistika Bisnis · Fakultas Vokasi, berdasarkan contoh yang diberikan untuk prototipe. Nama dimasukkan pengguna dan tidak diverifikasi. Pemeriksaan email hanya memvalidasi format; aplikasi tidak mengonfirmasi bahwa alamat aktif atau dimiliki pengguna. Pemetaan program bukan direktori resmi ITS.

Formulir ini tidak memakai password dan belum terhubung ke SSO ITS; mengisi email dan nama tidak membuktikan identitas. Semua profil, aktivitas, layanan, dan permintaan pada aplikasi ini adalah data simulasi. Form permintaan dan simulasi talangan tidak mengirim data atau mengajukan dana. Autentikasi SSO MyITS, verifikasi mahasiswa, penyedia layanan, dan proses talangan belum terhubung ke backend.

Aktivitas dan statistik akun dimulai dari nol pada setiap sesi masuk, lalu bertambah ketika pengguna menyimpan permintaan bantuan atau menghitung rencana talangan. Riwayat hanya disimpan sementara di memori browser dan dihapus saat keluar atau memuat ulang halaman; belum ada sinkronisasi atau penyimpanan akun.
