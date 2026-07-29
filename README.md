# 🚗 Avto Online - Yo'l Harakati Qoidalari & Chorrahalar Simulyatori (PDD)

**Avto Online** — O'zbekiston Yo'l Harakati Qoidalari (YHQ) bo'yicha chorrahalardan o'tish simulyatori hamda rasmiy imtihon testlari ilovasi (Web PWA / Android APK).

![Avto Online Icon](icon.png)

## 🌟 Imkoniyatlar
- 🚗 **Interaktiv Chorrahalar Simulyatori:** 2D interaktiv chorrahalarda avtomobillarni to'g'ri ketma-ketlikda o'tkazish.
- 💥 **Realistik Avariya va Fizika:** Navbat buzilganda avariya sodir bo'lishi hamda animatsiyalarning avtomatik to'xtashi.
- 📝 **PDD Imtihon Bo'limi (24pdd.uz):** Rasmiy YHQ imtihoni savollari, vizual rasmlar hamda to'g'ri/xato javoblar statistikasi (foiz, to'g'ri/xato soni).
- 📱 **Mobil Responsiv UI/UX:** Android va iOS qurilmalar uchun moslashtirilgan oyna, pastki navigatsiya paneli hamda sensorli tugmalar.
- 🔊 **Web Audio Ovozlar:** Dvigatel, bosish, g'alaba hamda avariya tovushlari.
- 🌐 **Ko'p tillilik:** O'zbekcha hamda Ruscha (UZ / RU) tillarni qo'llab-quvvatlash.

## 📁 Proyekt Tuzilishi
```
avto-online/
├── index.html        # Asosiy HTML interfeys
├── style.css         # Dark Glassmorphism CSS dizayn
├── game.js           # O'yin dvigateli, animatsiyalar va imtihon testlari
├── manifest.json     # PWA Android ilova manifesti
├── sw.js             # Service Worker (Oflayn ishlash)
├── icon.png          # App logotipi
└── android/          # Android Studio proyekt fayllari (WebView container)
```

## 🚀 Ishga Tushirish
1. Lokal serverda ishga tushirish:
   ```bash
   python3 -m http.server 8080
   ```
2. Brauzerda ochish: `http://localhost:8080`

## 📲 APK Qilib Chiqarish
`android/` papkasini **Android Studio** da ochib `Build -> Build APK(s)` tugmasi orqali Android `.apk` faylini yaratishingiz mumkin.
