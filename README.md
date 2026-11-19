# Kanuni Sultan Süleyman'ı Uğurluyoruz

TikTok canlı yayını için etkileşimli alay oyunu. İzleyiciler sohbete yazarak alaya katılır, beğeni ve hediyeyle öne geçer.

## Oyun kuralları

| İzleyici ne yapar | Oyunda ne olur |
|---|---|
| Sohbete **PADİŞAHIM** yazar | Alaya katılır, kalabalıkta bir karakteri olur |
| Beğeni gönderir | Puanı artar, saflar her 20 sn'de yeniden dizilir, önde olan padişahın tahtına yaklaşır |
| **YENİÇERİ / SİPAHİ / KADIN / ERKEK** yazar | Karakterinin kıyafeti değişir |
| Başka bir şey yazar | Yazdığı, karakterinin üstünde balon olarak görünür |
| Gül (1 jeton) | Padişahın tahtına gül yaprakları yağar |
| 10+ jetonluk hediye | 1 dk boyunca padişahın tahtına omuz verir |
| 30+ jetonluk hediye | Sancağı taşır, alayın önünde yürür |
| 100+ jetonluk hediye | 90 sn boyunca Sokullu Paşa olur, alayı yönetir |
| Paylaşır | +10 puan, ekranda duyurulur |

Her 70 saniyede bir **Kanuni dönemiyle ilgili tarih sorusu** çıkar. İzleyiciler A, B, C veya D yazar. Doğru bilen herkes 50 puan alır, ilk bilen 100 puan alır.
5 dakikalık tur bitince en çok puanı olan "turun alay başı" ilan edilir, puanlar sıfırlanır.

## Yayında nasıl kullanılır

### Sadece telefonla (Android + Termux)

1. Termux'u F-Droid'den kur ve aç.
2. Şunları sırayla yaz (son satırda kendi TikTok kullanıcı adını yaz, @ koyma):
   ```
   pkg install nodejs git
   git clone https://github.com/furrkanzdl/kanuni-oyun
   cd kanuni-oyun/kopru
   npm install
   termux-wake-lock
   node server.js tiktok_kullanici_adin
   ```
3. Chrome'da `http://localhost:8081` adresini aç.
4. TikTok'ta ekran paylaşımlı canlı yayın başlat ("Mobil oyun"), sonra Chrome'a geç.

Sonraki seferlerde sadece şunlar yeterli:
```
cd kanuni-oyun/kopru
git pull
node server.js tiktok_kullanici_adin
```

### Bilgisayarla

1. [Node.js](https://nodejs.org) kur.
2. `kopru` klasöründe `npm install`, sonra `node server.js tiktok_kullanici_adin` çalıştır.
3. TikTok LIVE Studio veya OBS'de **tarayıcı kaynağı** ekle: `http://localhost:8081`, 1080×1920 (dikey).

Köprü yayına bağlanınca oyunun sol üstündeki ışık yeşil yanar ve yanında "Canlı" yazar.

TikFinity kullanıyorsan köprüye gerek yok: `index.html`'i aç, ⚙ ayarlarına `ws://localhost:21213` yaz.

## Ses

Davul, zil, çan ve ney benzeri sesler tarayıcıda üretilir. Arkada ağır bir yürüyüş davulu çalar. Hediyelerin, soruların ve tur sonunun kendi sesleri vardır.
Tarayıcı sesi ancak ekrana dokununca başlatır: oyunu açınca bir kez dokun. Ses açma/kapama, fon davulu ve ses düzeyi ⚙ ayarlarındadır.

## Kısayollar

`D` demo aç/kapat · `Q` hemen soru sor · `R` turu sıfırla · `S` ayarlar · `F` tam ekran · `M` ses

Ayarlar panelinden başlığı ve katılma kelimesini değiştirebilirsin. Soruları değiştirmek için `index.html` içindeki `SORULAR` listesini düzenle.

Not: Köprü, TikTok'un resmî olmayan bir kütüphanesini (`tiktok-live-connector`) kullanır. TikTok bir şeyi değiştirirse geçici olarak çalışmayabilir. O durumda `npm install tiktok-live-connector@latest` dene.
