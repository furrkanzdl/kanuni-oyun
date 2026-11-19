// TikTok canlı yayın köprüsü
// Yayındaki sohbet, beğeni, hediye, paylaşım ve takip olaylarını alır,
// oyuna WebSocket üzerinden iletir. Oyunu da http://localhost:8081 adresinde sunar.
//
// Kullanım:  node server.js tiktok_kullanici_adin
const http = require("http");
const fs = require("fs");
const path = require("path");
const { WebSocketServer } = require("ws");
const { TikTokLiveConnection, WebcastEvent } = require("tiktok-live-connector");

const KULLANICI = (process.argv[2] || process.env.TIKTOK_KULLANICI || "").replace(/^@/, "");
const PORT = Number(process.env.PORT) || 8081;
const OYUN = path.join(__dirname, "..", "index.html");

if (!KULLANICI) {
  console.log("Kullanım: node server.js tiktok_kullanici_adin");
  process.exit(1);
}

// Oyun sayfası (yayın yazılımında "tarayıcı kaynağı" olarak bu adresi aç)
const sunucu = http.createServer((istek, yanit) => {
  if (istek.url === "/" || istek.url.startsWith("/?")) {
    const govde = fs.readFileSync(OYUN, "utf8");
    yanit.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    yanit.end(
      '<!doctype html><html lang="tr"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' +
      `<script>window.KOPRU_WS="ws://"+location.host;</script>` + govde + "</body></html>"
    );
    return;
  }
  yanit.writeHead(404); yanit.end();
});
const wss = new WebSocketServer({ server: sunucu });

function yay(event, data) {
  const mesaj = JSON.stringify({ event, data });
  for (const c of wss.clients) if (c.readyState === 1) c.send(mesaj);
}
function kisi(d) {
  const u = d.user || {};
  return { uniqueId: u.uniqueId || d.uniqueId, nickname: u.nickname || d.nickname };
}

const baglanti = new TikTokLiveConnection(KULLANICI, {});

baglanti.on(WebcastEvent.CHAT, d => yay("chat", { ...kisi(d), comment: d.comment }));
baglanti.on(WebcastEvent.LIKE, d => yay("like", { ...kisi(d), likeCount: d.likeCount }));
baglanti.on(WebcastEvent.GIFT, d => {
  const g = d.giftDetails || {};
  yay("gift", {
    ...kisi(d),
    giftName: g.giftName,
    diamondCount: g.diamondCount,
    giftType: g.giftType,
    repeatCount: d.repeatCount,
    repeatEnd: d.repeatEnd,
  });
});
baglanti.on(WebcastEvent.SHARE, d => yay("share", kisi(d)));
baglanti.on(WebcastEvent.FOLLOW, d => yay("follow", kisi(d)));
baglanti.on(WebcastEvent.STREAM_END, () => console.log("Yayın bitti."));
baglanti.on("disconnected", () => {
  console.log("Bağlantı koptu, 10 sn sonra yeniden denenecek…");
  setTimeout(baglan, 10000);
});

function baglan() {
  baglanti.connect()
    .then(s => console.log(`@${KULLANICI} yayınına bağlanıldı (oda ${s.roomId}).`))
    .catch(e => {
      console.log("Bağlanılamadı:", e.message || e, "— yayın açık mı? 15 sn sonra yeniden denenecek.");
      setTimeout(baglan, 15000);
    });
}

sunucu.listen(PORT, () => {
  console.log(`Oyun: http://localhost:${PORT}`);
  baglan();
});
