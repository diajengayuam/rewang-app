# REWANG ITS

PWA statis untuk prototipe ekosistem gotong royong kampus: Rewang Bantu dan Rewang Talang. Tidak memerlukan proses build atau dependensi.

## Menjalankan

Jalankan server HTTP lokal dari folder proyek, misalnya:

```sh
python3 -m http.server 8000
```

Buka `http://localhost:8000`. Service worker dan pengalaman offline tersedia di localhost atau saat aplikasi di-host melalui HTTPS. Membuka `index.html` langsung tetap menampilkan UI, tetapi tidak mengaktifkan service worker.

## Publikasi ke GitHub Pages

Workflow `.github/workflows/pages.yml` menerbitkan situs statis ke GitHub Pages setiap ada push ke branch `main`. Untuk publikasi pertama, buka **Settings → Pages** pada repository dan pilih **GitHub Actions** sebagai sumber deployment. Setelah workflow berhasil, situs tersedia di `https://diajengayuam.github.io/rewang-app/`.

## Batasan prototipe

Formulir meminta email berformat `10-digit-NRP@student.its.ac.id` dan nama lengkap. Contoh `2043231084@student.its.ac.id` memetakan empat digit awal `2043` ke Statistika Bisnis · Fakultas Vokasi, berdasarkan contoh yang diberikan untuk prototipe. Nama dimasukkan pengguna dan tidak diverifikasi. Pemeriksaan email hanya memvalidasi format; aplikasi tidak mengonfirmasi bahwa alamat aktif atau dimiliki pengguna. Pemetaan program bukan direktori resmi ITS.

Formulir meminta gambar profil myITS (PNG/JPG/WEBP, maksimal 5 MB) sebagai simulasi proofing manual. Gambar hanya dipilih di browser: prototipe tidak mengunggah, menyimpan, atau memeriksanya. Status akun selalu tetap belum diverifikasi; gambar bukan bukti autentikasi dan bisa diedit. Pengguna diminta menutupi nomor telepon, email alternatif, serta data pribadi lain yang tidak diperlukan. Formulir tidak meminta password atau kode OTP, dan belum terhubung ke SSO ITS. Semua profil, aktivitas, layanan, dan permintaan pada aplikasi ini adalah data simulasi. Form permintaan dan simulasi talangan tidak mengirim data atau mengajukan dana.

Aktivitas dan statistik akun dimulai dari nol pada setiap sesi masuk, lalu bertambah ketika pengguna menyimpan permintaan bantuan atau menghitung rencana talangan. Riwayat hanya disimpan sementara di memori browser dan dihapus saat keluar atau memuat ulang halaman; belum ada sinkronisasi atau penyimpanan akun.

Di halaman Rewang Bantu, pengguna dapat memilih mode **Cari bantuan** untuk menjelajah layanan, membuat permintaan, dan memantau statusnya; pada mode **Tawarkan jasa**, pengguna dapat melihat permintaan dalam sesi yang sama, mencatat simulasi kesediaan membantu, memasang jasa, menjeda, atau menghapusnya. Data tetap lokal pada perangkat dan sesi saat ini; belum ada backend, sinkronisasi ke pengguna lain, notifikasi, atau transaksi.
