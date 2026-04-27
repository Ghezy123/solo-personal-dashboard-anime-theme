// ============================================
// ANIME QUOTES
// ============================================
function initQuotes() {
  const quoteElement = document.getElementById('anime-quote');
  const sourceElement = document.getElementById('quote-source');
  const newQuoteBtn = document.getElementById('new-quote-btn');

  if(!quoteElement || !sourceElement || !newQuoteBtn) return;

  const quotes = [
    { text: "Orang tidak akan pernah bisa menang sendirian. Itulah kenapa kita memiliki teman.", source: "Natsu Dragneel — Fairy Tail" },
    { text: "Jika kamu tidak menyukai takdirmu, jangan terima saja. Berjuanglah untuk mengubahnya sesuai keinginanmu.", source: "Naruto Uzumaki — Naruto" },
    { text: "Tidak peduli seberapa dalam malam, fajar pasti akan datang.", source: "Brook — One Piece" },
    { text: "Yang terkuat bukanlah yang tidak pernah menangis, tapi yang tetap tersenyum setelah menangis.", source: "Erza Scarlet — Fairy Tail" },
    { text: "Mimpi itu tidak akan lari. Yang lari adalah dirimu sendiri.", source: "Sei Shonagon — The Pillow Book" },
    { text: "Manusia yang tidak menghargai kehidupan tidak layak memilikinya.", source: "L Lawliet — Death Note" },
    { text: "Ketika ada pertemuan, pasti ada perpisahan. Tapi perpisahan hanyalah jembatan menuju pertemuan berikutnya.", source: "Jiraiya — Naruto" },
    { text: "Tidak ada yang namanya kebetulan di dunia ini. Yang ada hanyalah takdir.", source: "Yuuko Ichihara — xxxHolic" },
    { text: "Kegagalan adalah ibu dari kesuksesan. Selama kamu terus mencoba, kamu tidak pernah benar-benar kalah.", source: "Might Guy — Naruto" },
    { text: "Hidup adalah tentang membuat pilihan. Pilihan yang salah pun tetap lebih baik daripada tidak memilih sama sekali.", source: "Lelouch Lamperouge — Code Geass" },
    { text: "Kamu tidak bisa membantu orang lain kalau kamu sendiri tidak bahagia.", source: "Tanjiro Kamado — Demon Slayer" },
    { text: "Masa lalu adalah masa lalu. Tidak ada gunanya terus memikirkannya. Yang bisa kita lakukan adalah terus melangkah maju.", source: "Edward Elric — Fullmetal Alchemist" },
    { text: "Keberanian bukan berarti tidak takut. Keberanian adalah tetap maju meskipun ketakutan.", source: "Midoriya Izuku — My Hero Academia" },
    { text: "Dalam dunia ini, ada hal-hal yang tidak bisa kau lindungi sendirian. Itulah mengapa kita saling membutuhkan.", source: "Kirito — Sword Art Online" },
    { text: "Jangan pernah meremehkan tekad seseorang yang berjuang untuk melindungi orang yang dicintainya.", source: "Ichigo Kurosaki — Bleach" },
    { text: "Kerja keras tidak akan mengkhianatimu, tapi impian bisa mengkhianatimu jika kamu tidak bekerja keras.", source: "Hachiman Hikigaya — Oregairu" },
    { text: "Jika kamu punya waktu untuk memikirkan akhir yang indah, maka hiduplah dengan indah sampai akhir.", source: "Sakata Gintoki — Gintama" },
    { text: "Mengetahui rasanya sakit adalah alasan mengapa kita berusaha untuk baik kepada orang lain.", source: "Naruto Uzumaki — Naruto" },
    { text: "Dunia ini tidak sempurna. Tapi ia ada di sana untuk kita, memberikan yang terbaik yang ia bisa.", source: "Roy Mustang — Fullmetal Alchemist" },
    { text: "Jangan memohon sesuatu. Lakukan sendiri, atau kamu tidak akan mendapatkan apa-apa.", source: "Renton Thurston — Eureka Seven" },
    { text: "Seseorang yang tidak bisa mengorbankan sesuatu yang berharga, tidak akan bisa mengubah apa pun.", source: "Armin Arlert — Attack on Titan" },
    { text: "Tidak peduli seberapa kecil peluangnya, itu bukan nol persen.", source: "Sora — No Game No Life" },
    { text: "Kemungkinan yang ada di depan kita hampir tidak terbatas. Itulah alasan kita terus melangkah.", source: "Aether — Genshin Impact" },
    { text: "Ingatlah bahwa setiap orang yang kamu temui takut akan sesuatu, mencintai sesuatu, dan telah kehilangan sesuatu.", source: "Lucy Heartfilia — Fairy Tail" },
    { text: "Berhenti mencoba mencari alasan untuk melakukan sesuatu yang kamu benci. Lakukan saja apa yang kamu suka.", source: "Shinichi Chiaki — Nodame Cantabile" },
    { text: "Kelemahan adalah hal yang memalukan, tapi tetap menjadi lemah jauh lebih memalukan.", source: "Fuegoleon Vermillion — Black Clover" },
    { text: "Batas hanya ada bagi mereka yang sudah berhenti berjuang.", source: "Vegeta — Dragon Ball" },
    { text: "Rasa takut itu perlu untuk evolusi. Rasa takut bahwa seseorang bisa hancur kapan saja.", source: "Aizen Sosuke — Bleach" },
    { text: "Jika kamu tidak bisa menemukan alasan untuk bertarung, maka kamu tidak seharusnya bertarung.", source: "Akame — Akame ga Kill" },
    { text: "Jangan hanya menghitung apa yang telah hilang. Pikirkan apa yang masih kamu miliki.", source: "Jinbe — One Piece" },
    { text: "Lebih baik dipercaya dan dikhianati daripada tidak percaya sama sekali.", source: "Kirito — Sword Art Online" },
    { text: "Perbedaan antara pemula dan master adalah master telah gagal lebih banyak daripada yang pernah dicoba pemula.", source: "Koro-sensei — Assassination Classroom" },
    { text: "Setiap perjalanan dimulai dengan satu langkah kecil. Pastikan langkah itu menuju ke arah yang benar.", source: "Zhongli — Genshin Impact" },
    { text: "Jangan pernah menarik kembali kata-katamu, karena itu adalah jalan ninjamu.", source: "Uzumaki Naruto — Naruto" },
    { text: "Masa depan adalah milik mereka yang percaya pada keindahan mimpi mereka.", source: "Hinata Shoyo — Haikyuu!!" }
  ];

  let lastIndex = -1;

  function displayQuote() {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * quotes.length);
    } while (randomIndex === lastIndex && quotes.length > 1);
    
    lastIndex = randomIndex;
    const quote = quotes[randomIndex];

    quoteElement.style.opacity = '0';
    sourceElement.style.opacity = '0';

    setTimeout(() => {
      quoteElement.textContent = `"${quote.text}"`;
      sourceElement.textContent = `— ${quote.source}`;
      quoteElement.style.opacity = '1';
      sourceElement.style.opacity = '1';
    }, 200);
  }

  quoteElement.style.transition = 'opacity 0.2s ease';
  sourceElement.style.transition = 'opacity 0.2s ease';

  newQuoteBtn.addEventListener('click', displayQuote);
  displayQuote();
}