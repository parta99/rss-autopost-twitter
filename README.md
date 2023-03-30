[![Netlify Status](https://api.netlify.com/api/v1/badges/87986a74-7531-411b-9f71-f7b4585e9eb5/deploy-status)](https://app.netlify.com/sites/lighthearted-hamster-250998/deploys)
[![Netlify Builds](https://github.com/parta99/rss-autopost-twitter/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/parta99/rss-autopost-twitter/actions/workflows/build.yml)
[![License ](https://badgen.net/badge/license/MIT/blue)](https://github.com/parta99/rss-autopost-twitter/blob/main/LICENSE)
[![Defaul Branch ](https://badgen.net/github/checks/node-formidable/node-formidable)](https://github.com/parta99/rss-autopost-twitter/tree/main)
[![RSS FEED](https://badgen.net/badge/icon/rss?icon=rss&label)](https://news.google.com/rss/search?hl=en-US&gl=US&q=bali&um=1&ie=UTF-8&ceid=US:en)
[![Twitter ](https://badgen.net/badge/icon/twitter?icon=twitter&label)](https://twitter.com/@djna911)

# rss-autopost-twitter
<ul>
<li>Pertama-tama, mengimpor dependensi yang diperlukan, yaitu rss-parser, twit, dan dotenv. 
<li>rss-parser digunakan untuk mem-parsing RSS feed, twit digunakan untuk mengakses API Twitter, dan dotenv digunakan untuk mengelola variabel lingkungan.

<li>Kemudian, mengatur klien Twitter menggunakan kredensial yang tersimpan dalam variabel lingkungan.

<li>Selanjutnya, mengatur parser RSS.

<li>Setelah itu, mengatur fungsi untuk mendapatkan dan memposting RSS feed ke Twitter.

<li>Dalam fungsi tersebut, kita melakukan parsing RSS feed dan loop melalui item di dalamnya.

<li>Untuk setiap item, kita memeriksa apakah itu sudah diposting ke Twitter sebelumnya atau belum. Jika belum, kita mempostingnya ke Twitter menggunakan klien Twitter yang sudah dikonfigurasi sebelumnya.
<li>kode menggunakan fungsi getRandomInt untuk memilih artikel secara acak dari feed. Artikel yang dipilih disimpan di variabel selectedPost.
<li>Kode kemudian menghitung waktu yang telah berlalu sejak artikel dipublikasikan menggunakan fungsi timeDiff.

<li>memanggil fungsi untuk memposting RSS feed secara terjadwal (setiap 30 menit).
<li>Jika ingin memposting banyak artikel dari feed RSS tanpa mengulang artikel yang sudah diposting sebelumnya, bisa menggunakan mekanisme penyimpanan pada database atau file untuk mencatat artikel yang sudah diposting sebelumnya. Setiap kali Anda akan memposting artikel baru, Anda bisa memeriksa terlebih dahulu apakah artikel tersebut sudah pernah diposting sebelumnya dengan melihat pada catatan yang tersimpan.

<li>Catatan: Anda perlu mengganti beberapa nilai dalam kode di atas dengan informasi Anda sendiri, seperti URL RSS feed, nama pengguna Twitter, dan kredensial Twitter Anda yang disimpan dalam variabel lingkungan.
<ul>
