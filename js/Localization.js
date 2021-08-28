var THREATS_TITLES = {
    0: {
      he: "אזעקת צבע אדום",
      en: "Red Alert",
      ru: "Цева Адом",
      ar: "اللون الأحمر",
      es: "Rojo Color",
    },
    1: {
      he: "אירוע חומרים מסוכנים",
      en: "Hazardous Materials Event",
      ru: "Опасные происшествия Материалы",
      ar: "حادثة المواد الخطرة",
      es: "Incidente de materiales peligrosos",
    },
    2: {
      he: "אירוע חדירת מחבלים",
      en: "Terrorist infiltration incident",
      ru: "Террорист инфильтрация инцидент",
      ar: "حادثة تسلل إرهابي",
      es: "Incidente de infiltración terrorista",
    },
    3: {
      he: "רעידת אדמה",
      en: "Earthquake",
      ru: "Землетрясение",
      ar: "هزة أرضية",
      es: "Terremoto",
    },
    4: {
      he: "חשש לצונאמי",
      en: "Fear of a tsunami",
      ru: "Страх цунами",
      ar: "مخاوف موجة تسونامي",
      es: "Miedo a un tsunami",
    },
    5: {
      he: "חדירת כלי טיס",
      en: "An unmanned aircraft",
      ru: "беспилотный самолет",
      ar: "طائرة بدون طيار",
      es: "Las aeronaves no tripuladas",
    },
    6: {
      he: "חשש לאירוע רדיולוגי",
      en: "Radiological incident",
      ru: "Радиологический инцидент",
      ar: "حادث إشعاعي",
      es: "Incidente radiológico",
    },
    7: {
      he: "טיל בלתי קונבנציונלי",
      en: "Non-conventional missile",
      ru: "Нетрадиционная ракета",
      ar: "صاروخ غير تقليدي",
      es: "Misil no convencional",
    },
    8: {
      he: "איום בלתי קונבנציונלי",
      en: "Non-conventional threat",
      ru: "Нетрадиционная угроза",
      ar: "تهديد غير تقليدي",
      es: "Una amenaza no convencional",
    }
};

var SELECTION_DESC = {
    he: "יוצגו התרעות על אזעקות בכל הארץ.<br><br>ניתן לקבל התרעות עבור יישובים מסויימים בלבד, על ידי חיפוש שמות היישובים בתיבת החיפוש.",
    en: "Alerts will be received for the entire country.<br><br>You can receive alerts only for specific cities, by adding them to the list through the search box above.",
    es: "Se recibirán alertas para todo el país.<br><br>Puede recibir alertas solo para ciudades específicas, agregándolas a la lista a través del cuadro de búsqueda de arriba.",
    ar: "سيتم استلام التنبيهات للبلد بأكمله.<br><br>يمكنك تلقي التنبيهات لمدن معينة فقط ، عن طريق إضافتها إلى القائمة من خلال مربع البحث أعلاه.",
    ru: "Оповещения будут приходить для всей страны.<br><br>Вы можете получать оповещения только для определенных городов, добавив их в список через окно поиска выше."
}

var STRINGS = {
  /* App */
  appName: {
    he: "צופר - צבע אדום",
    en: "Tzofar - Red Alert",
    es: "Tzofar - color rojo",
    ar: "تسوفار - انذار احمر",
    ru: "Цофар - Цева Адом"
  },

  /* Popup.html */
  recentAlerts: {
    he: "התרעות אחרונות",
    en: "Recent Alerts",
    es: "Últimas alarmas",
    ar: "الانذارات الاخيره",
    ru: "Последние Оповещения"
  },
  sounds: {
    he: "צליל",
    en: "Sounds",
    es: "Sonidos",
    ar: "رنين",
    ru: "Звуки"
  },
  cities: {
    he: "יישובים",
    en: "Cities",
    es: "Ciudades",
    ar: "المدن",
    ru: "Города"
  },
  other: {
    he: "אחר",
    en: "Other",
    es: "Otro",
    ar: "آخر",
    ru: "Другой"
  },

  /* Popup - Select sound */
  selectSoundTitle: {
    he: "בחר צליל התרעה",
    en: "Select Sound",
    es: "Sonido de alerta",
    ar: "صوت للتنبيه",
    ru: "Звук сигнала"
  },
  selectSoundDesc: {
    he: "בחר את הצליל שיושמע בזמן קבלת התרעה",
    en: "Select a sound for incoming alerts",
    es: "Seleccionar el sonido de la notificación de alarma",
    ar: "حدد صوتًا للتنبيهات الواردة",
    ru: "Выбрать звук  при тревоге"
  },
  
  /* Popup - Sound names */
  bell: {
    he: "פעמון (ברירת מחדל)",
    en: "Bell",
    es: "Campana",
    ar: "الجرس",
    ru: "Белл"
  },
  tone: {
    he: "חד",
    en: "twang",
    es: "Tañido",
    ar: "توانج",
    ru: "звон"
  },
  alarm: {
    he: "אזעקה",
    en: "Alarm",
    es: "Alarma",
    ar: "صفارة إنذار",
    ru: "Сирена"
  },
  redalert: {
    he: "צבע אדום",
    en: "Red Alert",
    es: "Color rojo",
    ar: "اللون الأحمر",
    ru: "Цева Адом"
  },
  redalert2: {
    he: "צבע אדום (מקוצר)",
    en: "Red Alert (short)",
    es: "Color rojo (corto)",
    ar: "اللون الأحمر (قصير)",
    ru: "Цева Адом (короткий)"
  },
  warning: {
    he: "אזהרה",
    en: "Warning",
    es: "Advertencia",
    ar: "إنذار",
    ru: "Предупреждение"
  },
  message: {
    he: "הודעה",
    en: "Message",
    es: "Mensaje",
    ar: "رسالة",
    ru: "Сообщение"
  },
  secondary: {
    he: "משנה",
    en: "Secondary",
    es: "Secundario",
    ar: "ثانوي",
    ru: "второстепенный"
  },
  alert: {
    he: "התרעה",
    en: "Alert",
    es: "Alerta",
    ar: "يحذر",
    ru: "тревога"
  },
  calm: {
    he: "רגוע",
    en: "Calm",
    es: "Tranquilo",
    ar: "بارد الاعصاب",
    ru: "Спокойный"
  },
  silent: {
    he: "שקט",
    en: "Silent",
    es: "Silencio",
    ar: "صامتة",
    ru: "Тихий"
  },

  /* Popup - Select cities */
  selectCitiesTitle: {
    he: "בחירת יישובי עניין",
    en: "Select cities",
    es: "Seleccionar ciudades",
    ar: "حدد المدن",
    ru: "Выберите города"
  },
  selectCitiesDesc: {
    he: "בחר את היישובים עבורם אתה מעוניין לקבל התרעות",
    en: "Select the cities you want to be alerted to",
    es: "Seleccione las ciudades sobre las que desea recibir una alerta",
    ar: "حدد المدن التي تريد تنبيهك إليها",
    ru: "Выберите города, о которые вы хотите получать оповещения"
  },
  clearSelection: {
    he: "נקה בחירה",
    en: "Clear all",
    es: "Borrar selección",
    ar: "احذف كل شيء",
    ru: "Очистить выделение"
  },
  searchCities: {
    he: "הזן את שם היישוב...",
    en: "Search city name...",
    es: "Encontrar el asentamiento...",
    ar: "البحث عن اسم المنطقة...",
    ru: "Ищите поселение..."
  },

  /* Popup - Other */
  otherTitle: {
    he: "הגדרות נוספות",
    en: "Advanced",
    es: "Opciones",
    ar: "المتقدمة",
    ru: "Расширенные"
  },
  alertsTitle: {
    he: "הגדרת התרעות",
    en: "Advanced Alerts",
    es: "Alertas Avanzadas",
    ar: "تنبيهات متقدمة",
    ru: "Расширенный агент"
  },
  desktopNotifications: {
    he: "השתמש בהתרעות מערכת ההפעלה, במקום חלון קופץ",
    en: "Use desktop notifications instead of a pop-up window",
    es: "Use notificaciones de escritorio",
    ar: "استخدم إشعارات سطح المكتب بدلاً من النافذة المنبثقة",
    ru: "Используйте уведомления на рабочем столе вместо всплывающего окна"
  },
  backgroundHidePopup: {
    he: "מנע מהתרעות לקפוץ במהלך שימוש בתוכנות אחרות",
    en: "Prevent alerts from popping up while using other software",
    es: "Evite que aparezcan alertas mientras usa otro software",
    ar: "منع التنبيهات من الظهور أثناء استخدام برامج أخرى",
    ru: "Предотвращение появления предупреждений при использовании другого программного обеспечения"
  },
  alertsOverSites: {
    he: "הצגה של חלון ההתרעה על גבי אתרים בדפדפן",
    en: "View alerts above the sites in your browser",
    es: "Ver alertas sobre los sitios en su navegador",
    ar: "عرض التنبيهات فوق المواقع في متصفحك",
    ru: "Просмотр предупреждений над сайтами"
  },
  selectLanguageTitle: {
    he: "Language / שפה",
    en: "Language",
    es: "Language / Idioma",
    ar: "Language / لغة",
    ru: "Language / Язык"
  },
  testAlert: {
    he: "בדיקת התרעה",
    en: "Test Alert",
    es: "Prueba",
    ar: "اضغط لفحص الانذار",
    ru: "Проверка"
  },
  aboutTitle: {
    he: "אודות",
    en: "About",
    es: "Acerca",
    ar: "حول",
    ru: "Про"
  },

  /* Alert.html */
  copyButton: {
    he: "העתקת התרעה",
    en: "Copy Alert",
    es: "Alerta de copia",
    ar: "نسخ التنبيه",
    ru: "Копировать"
  },
  openMapButton: {
    he: "פתח מפה",
    en: "Open Map",
    es: "Abrir mapa",
    ar: "افتح الخريطة",
    ru: "Открыть карту"
  }
};

STRINGS.aboutText = {
  he: `אפליקציית "${STRINGS.appName.he}" מתריעה על אזעקות ברחבי הארץ. התוסף נכתב על ידי איתי גולי`,
  en: `"${STRINGS.appName.en}" alerts alarms across the country. The plugin was written by Itai Guli`,
  es: `"${STRINGS.appName.es}" alerta de alarmas en todo el país. El complemento fue escrito por Itai Guli`,
  ar: `"${STRINGS.appName.ar}" التنبيهات أجهزة الإنذار في جميع أنحاء البلاد البرنامج المساعد كتبه - ايتاي قولى`,
  ru: `"${STRINGS.appName.ru}" подает сигнал тревоги по всей стране. Автор плагина - Итаи Гули`
};
STRINGS.sentVia = {
  he: `באמצעות תוסף "${STRINGS.appName.he}" לכרום.`,
  en: `Using "${STRINGS.appName.en}" for Chrome.`,
  es: `Usando "${STRINGS.appName.es}" para Chrome.`,
  ar: `استخدام "${STRINGS.appName.ar}" للكروم.`,
  ru: `Использование "${STRINGS.appName.ru}" для Chrome.`
};

window.addEventListener("load", async (event) => {
  const siteLanguage = await Preferences.getSelectedLanguage();
  document.querySelectorAll("*").forEach(e => {
    Array.from(e.childNodes)
      .filter(child => child.nodeType == Node.TEXT_NODE && /{(.*)}/.test(child.textContent))
      .forEach(textNode => textNode.textContent = replaceStrings(textNode.textContent, siteLanguage));

    Array.from(e.attributes)
      .filter(attr => /{(.*)}/.test(attr.value))
      .map(attr => attr.value = replaceStrings(attr.value, siteLanguage));
  });
  document.title = replaceStrings(document.title, siteLanguage);
  fixLTR(siteLanguage);
});


function fixLTR(siteLanguage) {
  if (siteLanguage == "HE" || siteLanguage == "AR") return;
  const style = document.createElement('style');
  style.textContent = `
    html, body {
      direction: ltr !important;
    }

    #selection input {
      margin-right: unset;
      margin-left: 5px;
      background-position: right center;
    }

    #selection .item {
      margin-left: unset;
      margin-right: 4px;
    }

    .history_item .date {
      text-align: left !important;
    }

    #map::before {
      background-image: linear-gradient(to left, rgba(169, 162, 162, 0), #cd363487, #cd3634db, #cd3634);
    }

    #Sounds input {
      margin-left: 40% !important;
    }

    input {
      margin-right: 5px !important;
    }

    #logo {
      right: 10px;
      left: unset !important;
    }
  `;
  document.head.append(style);
}

function replaceStrings(htmlText, siteLanguage) {
  return htmlText.replaceAll(/\{(.*?)\}/g, (all, stringName) => {
    var localizationString;
    try {
      localizationString = STRINGS[stringName][siteLanguage.toLowerCase()] || STRINGS[stringName]["he"];
    } catch (error) {};
    return (localizationString != null) ? localizationString : all;
  });
}