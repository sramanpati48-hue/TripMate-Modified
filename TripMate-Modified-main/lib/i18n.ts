export const supportedLocales = ["en", "hi", "bn", "te", "mr", "ta", "ur", "gu", "kn", "ml", "pa"] as const

export type Locale = (typeof supportedLocales)[number]

export const DEFAULT_LOCALE: Locale = "en"

export const localeLabels: Record<Locale, string> = {
  en: "English",
  hi: "हिंदी",
  bn: "বাংলা",
  te: "తెలుగు",
  mr: "मराठी",
  ta: "தமிழ்",
  ur: "اردو",
  gu: "ગુજરાતી",
  kn: "ಕನ್ನಡ",
  ml: "മലയാളം",
  pa: "ਪੰਜਾਬੀ",
}

export const rtlLocales: Locale[] = ["ur"]

const translations = {
  en: {
    common: {
      language: "Language",
      selectLanguage: "Select language",
    },
    navbar: {
      tagline: "Your Travel Companion",
      explore: "Explore",
      transport: "Transport",
      map: "Map",
      tripPlanner: "Trip Planner",
      findTravelBuddies: "Find Travel Buddies",
      searchDestinations: "Search destinations...",
      profile: "Profile",
      settings: "Settings",
      logout: "Logout",
      login: "Login",
      loginSignup: "Login / Sign Up",
      toggleMenu: "Toggle menu",
      navigationMenu: "Navigation Menu",
      search: "Search...",
    },
    footer: {
      description: "Your smart travel companion for discovering amazing destinations around the world.",
      explore: "Explore",
      destinations: "Destinations",
      foodDining: "Food & Dining",
      events: "Events",
      hotels: "Hotels",
      plan: "Plan",
      mapView: "Map View",
      aiItinerary: "AI Itinerary",
      company: "Company",
      about: "About",
      contact: "Contact",
      privacyPolicy: "Privacy Policy",
      rightsReserved: "All rights reserved.",
    },
    hero: {
      badge: "Discover India's Hidden Gems",
      title: "Your TRIPMATE Companion for India Tour",
      subtitle:
        "From the Himalayas to the backwaters, from ancient temples to vibrant beaches. Explore incredible India with personalized recommendations and local insights.",
      exploreDestinations: "Explore Destinations",
      planTrip: "Plan Your Trip",
      destinations: "Destinations",
      happyTravelers: "Happy Travelers",
      averageRating: "Average Rating",
    },
    categories: {
      heading: "Explore by Category",
      subtitle: "Discover India through diverse experiences - from spiritual journeys to thrilling adventures",
      transportTitle: "Book Your Transport",
      transportDescription:
        "Compare fares for flights, trains, and buses. Book cabs for local and outstation trips. All in one place with real-time pricing.",
      bookNow: "Book Now",
      flights: "Flights",
      trains: "Trains",
      buses: "Buses",
      cabs: "Cabs",
      spiritual: "Spiritual",
      spiritualDesc: "Sacred temples and pilgrimage sites",
      adventure: "Adventure",
      adventureDesc: "Thrilling activities and extreme sports",
      heritage: "Heritage",
      heritageDesc: "Ancient forts and monuments",
      nature: "Nature",
      natureDesc: "Scenic landscapes and natural wonders",
      beach: "Beach",
      beachDesc: "Coastal paradises",
      hillStation: "Hill Station",
      hillStationDesc: "Mountain retreats",
    },
    featured: {
      heading: "Featured Destinations",
      subtitle: "Handpicked destinations showcasing India's incredible diversity and beauty",
      viewAll: "View All",
      viewAllDestinations: "View All Destinations",
    },
    seasonal: {
      title: "Winter Wonderland Collection",
      subtitle: "Explore magical winter destinations perfect for the season",
      exploreNow: "Explore Now",
    },
    searchbar: {
      placeholder: "Search destinations in India...",
      searching: "Searching destinations...",
      destinationsFound: "{count} destinations found",
      noDestinationsFor: "No destinations found for \"{query}\"",
      trySearching: "Try searching for cities, states, or types",
      trendingDestinations: "Trending Destinations",
      popularFor: "Popular for",
    },
  },
  hi: {
    common: { language: "भाषा", selectLanguage: "भाषा चुनें" },
    navbar: {
      tagline: "आपका यात्रा साथी",
      explore: "घूमें",
      transport: "परिवहन",
      map: "मानचित्र",
      tripPlanner: "यात्रा योजनाकार",
      findTravelBuddies: "यात्रा साथी खोजें",
      searchDestinations: "गंतव्य खोजें...",
      profile: "प्रोफ़ाइल",
      settings: "सेटिंग्स",
      logout: "लॉग आउट",
      login: "लॉग इन",
      loginSignup: "लॉग इन / साइन अप",
      toggleMenu: "मेनू बदलें",
      navigationMenu: "नेविगेशन मेनू",
      search: "खोजें...",
    },
    footer: {
      description: "दुनिया भर के शानदार गंतव्यों को खोजने के लिए आपका स्मार्ट यात्रा साथी।",
      explore: "घूमें",
      destinations: "गंतव्य",
      foodDining: "भोजन और डाइनिंग",
      events: "इवेंट्स",
      hotels: "होटल",
      plan: "योजना",
      mapView: "मैप व्यू",
      aiItinerary: "एआई यात्रा योजना",
      company: "कंपनी",
      about: "हमारे बारे में",
      contact: "संपर्क",
      privacyPolicy: "गोपनीयता नीति",
      rightsReserved: "सर्वाधिकार सुरक्षित।",
    },
    hero: {
      badge: "भारत के छिपे हुए रत्न खोजें",
      title: "भारत यात्रा के लिए आपका TRIPMATE साथी",
      subtitle: "हिमालय से बैकवॉटर्स तक, प्राचीन मंदिरों से जीवंत समुद्र तटों तक। व्यक्तिगत सुझावों और स्थानीय जानकारी के साथ भारत घूमें।",
      exploreDestinations: "गंतव्य देखें",
      planTrip: "यात्रा की योजना बनाएं",
      destinations: "गंतव्य",
      happyTravelers: "खुश यात्री",
      averageRating: "औसत रेटिंग",
    },
    categories: {
      heading: "श्रेणी के अनुसार खोजें",
      subtitle: "आध्यात्मिक यात्राओं से रोमांचक अनुभवों तक भारत को नए तरीके से जानें",
      transportTitle: "अपना परिवहन बुक करें",
      transportDescription: "फ्लाइट, ट्रेन और बस किराए की तुलना करें। स्थानीय और आउटस्टेशन कैब बुक करें। सब कुछ एक ही जगह पर।",
      bookNow: "अभी बुक करें",
      flights: "फ्लाइट्स",
      trains: "ट्रेनें",
      buses: "बसें",
      cabs: "कैब",
      spiritual: "आध्यात्मिक",
      spiritualDesc: "पवित्र मंदिर और तीर्थ स्थल",
      adventure: "रोमांच",
      adventureDesc: "रोमांचक गतिविधियां और एडवेंचर खेल",
      heritage: "विरासत",
      heritageDesc: "प्राचीन किले और स्मारक",
      nature: "प्रकृति",
      natureDesc: "सुंदर प्राकृतिक दृश्य",
      beach: "समुद्र तट",
      beachDesc: "तटीय स्वर्ग",
      hillStation: "हिल स्टेशन",
      hillStationDesc: "पहाड़ी विश्राम स्थल",
    },
    featured: {
      heading: "विशेष गंतव्य",
      subtitle: "भारत की विविधता और सुंदरता दिखाने वाले चुनिंदा स्थान",
      viewAll: "सभी देखें",
      viewAllDestinations: "सभी गंतव्य देखें",
    },
    seasonal: { title: "विंटर वंडरलैंड कलेक्शन", subtitle: "मौसम के लिए बेहतरीन जादुई सर्दियों के गंतव्य देखें", exploreNow: "अभी देखें" },
    searchbar: {
      placeholder: "भारत में गंतव्य खोजें...",
      searching: "गंतव्य खोजे जा रहे हैं...",
      destinationsFound: "{count} गंतव्य मिले",
      noDestinationsFor: "\"{query}\" के लिए कोई गंतव्य नहीं मिला",
      trySearching: "शहर, राज्य या प्रकार से खोजें",
      trendingDestinations: "ट्रेंडिंग गंतव्य",
      popularFor: "किसके लिए लोकप्रिय",
    },
  },
  bn: {
    common: { language: "ভাষা", selectLanguage: "ভাষা বেছে নিন" },
    navbar: { tagline: "আপনার ভ্রমণ সঙ্গী", explore: "ঘুরুন", transport: "পরিবহন", map: "মানচিত্র", tripPlanner: "ট্রিপ প্ল্যানার", findTravelBuddies: "ভ্রমণ সঙ্গী খুঁজুন", searchDestinations: "গন্তব্য খুঁজুন...", profile: "প্রোফাইল", settings: "সেটিংস", logout: "লগ আউট", login: "লগ ইন", loginSignup: "লগ ইন / সাইন আপ", toggleMenu: "মেনু টগল করুন", navigationMenu: "নেভিগেশন মেনু", search: "খুঁজুন..." },
    footer: { description: "দারুণ গন্তব্য আবিষ্কারের জন্য আপনার স্মার্ট ভ্রমণ সঙ্গী।", explore: "ঘুরুন", destinations: "গন্তব্য", foodDining: "খাবার ও ডাইনিং", events: "ইভেন্ট", hotels: "হোটেল", plan: "পরিকল্পনা", mapView: "ম্যাপ ভিউ", aiItinerary: "এআই ইটিনেরারি", company: "কোম্পানি", about: "আমাদের সম্পর্কে", contact: "যোগাযোগ", privacyPolicy: "গোপনীয়তা নীতি", rightsReserved: "সর্বস্বত্ব সংরক্ষিত।" },
    hero: { badge: "ভারতের লুকানো রত্ন আবিষ্কার করুন", title: "ভারত ভ্রমণের জন্য আপনার TRIPMATE সঙ্গী", subtitle: "হিমালয় থেকে ব্যাকওয়াটার, প্রাচীন মন্দির থেকে জীবন্ত সৈকত পর্যন্ত। ব্যক্তিগত সুপারিশসহ ভারত ঘুরুন।", exploreDestinations: "গন্তব্য দেখুন", planTrip: "ট্রিপ পরিকল্পনা করুন", destinations: "গন্তব্য", happyTravelers: "খুশি ভ্রমণকারী", averageRating: "গড় রেটিং" },
    categories: { heading: "ক্যাটাগরি অনুযায়ী ঘুরুন", subtitle: "আধ্যাত্মিক ভ্রমণ থেকে অ্যাডভেঞ্চার পর্যন্ত বৈচিত্র্যময় অভিজ্ঞতা", transportTitle: "আপনার পরিবহন বুক করুন", transportDescription: "ফ্লাইট, ট্রেন ও বাস ভাড়া তুলনা করুন। স্থানীয় ও আউটস্টেশন ক্যাব বুক করুন।", bookNow: "এখনই বুক করুন", flights: "ফ্লাইট", trains: "ট্রেন", buses: "বাস", cabs: "ক্যাব", spiritual: "আধ্যাত্মিক", spiritualDesc: "পবিত্র মন্দির ও তীর্থস্থান", adventure: "অ্যাডভেঞ্চার", adventureDesc: "রোমাঞ্চকর কার্যকলাপ", heritage: "ঐতিহ্য", heritageDesc: "প্রাচীন দুর্গ ও স্মৃতিস্তম্ভ", nature: "প্রকৃতি", natureDesc: "দৃশ্য ও প্রাকৃতিক সৌন্দর্য", beach: "সৈকত", beachDesc: "উপকূলীয় স্বর্গ", hillStation: "হিল স্টেশন", hillStationDesc: "পাহাড়ি অবকাশ" },
    featured: { heading: "বিশেষ গন্তব্য", subtitle: "ভারতের অসাধারণ বৈচিত্র্য দেখানো বাছাই করা স্থান", viewAll: "সব দেখুন", viewAllDestinations: "সব গন্তব্য দেখুন" },
    seasonal: { title: "উইন্টার ওয়ান্ডারল্যান্ড কালেকশন", subtitle: "শীতের জন্য চমৎকার জাদুকরী গন্তব্য দেখুন", exploreNow: "এখনই দেখুন" },
    searchbar: { placeholder: "ভারতে গন্তব্য খুঁজুন...", searching: "গন্তব্য খোঁজা হচ্ছে...", destinationsFound: "{count}টি গন্তব্য পাওয়া গেছে", noDestinationsFor: "\"{query}\" এর জন্য কোনো গন্তব্য পাওয়া যায়নি", trySearching: "শহর, রাজ্য বা ধরন দিয়ে খুঁজুন", trendingDestinations: "ট্রেন্ডিং গন্তব্য", popularFor: "জনপ্রিয়" },
  },
  te: {
    common: { language: "భాష", selectLanguage: "భాషను ఎంచుకోండి" },
    navbar: { tagline: "మీ ప్రయాణ సహచరి", explore: "అన్వేషించండి", transport: "రవాణా", map: "మ్యాప్", tripPlanner: "ట్రిప్ ప్లానర్", findTravelBuddies: "ప్రయాణ స్నేహితులను కనుగొనండి", searchDestinations: "గమ్యస్థానాలను వెతకండి...", profile: "ప్రొఫైల్", settings: "సెట్టింగ్స్", logout: "లాగ్ అవుట్", login: "లాగిన్", loginSignup: "లాగిన్ / సైన్ అప్", toggleMenu: "మెనును మార్చండి", navigationMenu: "నావిగేషన్ మెనూ", search: "వెతకండి..." },
    footer: { description: "అద్భుతమైన గమ్యస్థానాలను కనుగొనడానికి మీ స్మార్ట్ ట్రావెల్ భాగస్వామి.", explore: "అన్వేషించండి", destinations: "గమ్యస్థానాలు", foodDining: "ఆహారం & భోజనం", events: "ఈవెంట్లు", hotels: "హోటళ్లు", plan: "ప్లాన్", mapView: "మ్యాప్ వ్యూ", aiItinerary: "AI ప్రణాళిక", company: "కంపెనీ", about: "మా గురించి", contact: "సంప్రదించండి", privacyPolicy: "గోప్యతా విధానం", rightsReserved: "అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి." },
    hero: { badge: "భారతదేశపు దాగిన రత్నాలను కనుగొనండి", title: "భారత టూర్ కోసం మీ TRIPMATE సహచరి", subtitle: "హిమాలయాల నుండి బ్యాక్‌వాటర్స్ వరకు, ఆలయాల నుండి బీచ్‌ల వరకు. వ్యక్తిగత సూచనలతో భారతదేశాన్ని అన్వేషించండి.", exploreDestinations: "గమ్యస్థానాలు చూడండి", planTrip: "ట్రిప్ ప్లాన్ చేయండి", destinations: "గమ్యస్థానాలు", happyTravelers: "సంతోషకర ప్రయాణికులు", averageRating: "సగటు రేటింగ్" },
    categories: { heading: "వర్గాల వారీగా అన్వేషించండి", subtitle: "ఆధ్యాత్మిక యాత్రల నుండి సాహస అనుభవాల వరకు భారతదేశాన్ని అన్వేషించండి", transportTitle: "మీ రవాణాను బుక్ చేయండి", transportDescription: "ఫ్లైట్, రైలు, బస్ చార్జీలను పోల్చండి. స్థానిక మరియు అవుట్‌స్టేషన్ క్యాబ్‌లను బుక్ చేయండి.", bookNow: "ఇప్పుడే బుక్ చేయండి", flights: "విమానాలు", trains: "రైళ్లు", buses: "బస్సులు", cabs: "క్యాబ్స్", spiritual: "ఆధ్యాత్మిక", spiritualDesc: "పవిత్ర ఆలయాలు మరియు తీర్థస్థానాలు", adventure: "సాహసం", adventureDesc: "రోమాంచక కార్యకలాపాలు", heritage: "వారసత్వం", heritageDesc: "పురాతన కోటలు మరియు స్మారకాలు", nature: "ప్రకృతి", natureDesc: "సహజ సౌందర్యం", beach: "బీచ్", beachDesc: "తీర స్వర్గాలు", hillStation: "హిల్ స్టేషన్", hillStationDesc: "పర్వత విరామస్థలాలు" },
    featured: { heading: "ప్రత్యేక గమ్యస్థానాలు", subtitle: "భారతదేశపు వైవిధ్యం మరియు అందాన్ని చూపే ఎంపిక చేసిన ప్రదేశాలు", viewAll: "అన్నీ చూడండి", viewAllDestinations: "అన్ని గమ్యస్థానాలు చూడండి" },
    seasonal: { title: "వింటర్ వండర్ల్యాండ్ కలెక్షన్", subtitle: "సీజన్‌కు తగిన మాయాజాల శీతాకాల గమ్యస్థానాలను చూడండి", exploreNow: "ఇప్పుడే చూడండి" },
    searchbar: { placeholder: "భారతదేశంలో గమ్యస్థానాలు వెతకండి...", searching: "గమ్యస్థానాలు వెతుకుతున్నాం...", destinationsFound: "{count} గమ్యస్థానాలు కనుగొనబడ్డాయి", noDestinationsFor: "\"{query}\" కోసం గమ్యస్థానాలు లభించలేదు", trySearching: "నగరాలు, రాష్ట్రాలు లేదా రకాలతో వెతకండి", trendingDestinations: "ట్రెండింగ్ గమ్యస్థానాలు", popularFor: "ప్రసిద్ధి" },
  },
  mr: {
    common: { language: "भाषा", selectLanguage: "भाषा निवडा" },
    navbar: { tagline: "तुमचा प्रवास साथी", explore: "भटका", transport: "वाहतूक", map: "नकाशा", tripPlanner: "ट्रिप प्लॅनर", findTravelBuddies: "प्रवास साथी शोधा", searchDestinations: "स्थळे शोधा...", profile: "प्रोफाइल", settings: "सेटिंग्ज", logout: "लॉग आउट", login: "लॉग इन", loginSignup: "लॉग इन / साइन अप", toggleMenu: "मेनू टॉगल करा", navigationMenu: "नेव्हिगेशन मेनू", search: "शोधा..." },
    footer: { description: "अप्रतिम ठिकाणे शोधण्यासाठी तुमचा स्मार्ट प्रवास साथी.", explore: "भटका", destinations: "स्थळे", foodDining: "अन्न व डायनिंग", events: "कार्यक्रम", hotels: "हॉटेल्स", plan: "योजना", mapView: "मॅप दृश्य", aiItinerary: "AI प्रवास योजना", company: "कंपनी", about: "आमच्याबद्दल", contact: "संपर्क", privacyPolicy: "गोपनीयता धोरण", rightsReserved: "सर्व हक्क राखीव." },
    hero: { badge: "भारताची लपलेली रत्न शोधा", title: "भारत दौर्यासाठी तुमचा TRIPMATE साथी", subtitle: "हिमालयापासून बॅकवॉटरपर्यंत, मंदिरांपासून समुद्रकिनाऱ्यांपर्यंत. वैयक्तिक शिफारसींसह भारत अनुभवा.", exploreDestinations: "स्थळे पहा", planTrip: "ट्रिप योजना करा", destinations: "स्थळे", happyTravelers: "आनंदी प्रवासी", averageRating: "सरासरी रेटिंग" },
    categories: { heading: "श्रेणीनुसार शोधा", subtitle: "आध्यात्मिक प्रवासापासून साहसी अनुभवांपर्यंत भारत अनुभवा", transportTitle: "तुमची वाहतूक बुक करा", transportDescription: "फ्लाइट, ट्रेन आणि बसचे भाडे तुलना करा. स्थानिक आणि आउटस्टेशन कॅब बुक करा.", bookNow: "आत्ताच बुक करा", flights: "फ्लाइट्स", trains: "ट्रेन्स", buses: "बस", cabs: "कॅब", spiritual: "आध्यात्मिक", spiritualDesc: "पवित्र मंदिरे आणि तीर्थक्षेत्रे", adventure: "साहस", adventureDesc: "रोमांचक कृती", heritage: "वारसा", heritageDesc: "प्राचीन किल्ले आणि स्मारके", nature: "निसर्ग", natureDesc: "निसर्गरम्य दृश्ये", beach: "समुद्रकिनारा", beachDesc: "किनारी स्वर्ग", hillStation: "हिल स्टेशन", hillStationDesc: "डोंगरातील निवांत ठिकाणे" },
    featured: { heading: "विशेष स्थळे", subtitle: "भारताची विविधता आणि सौंदर्य दाखवणारी निवडक ठिकाणे", viewAll: "सर्व पहा", viewAllDestinations: "सर्व स्थळे पहा" },
    seasonal: { title: "विंटर वंडरलँड कलेक्शन", subtitle: "हंगामासाठी योग्य जादुई हिवाळी स्थळे अनुभवा", exploreNow: "आत्ता पहा" },
    searchbar: { placeholder: "भारतातील स्थळे शोधा...", searching: "स्थळे शोधली जात आहेत...", destinationsFound: "{count} स्थळे सापडली", noDestinationsFor: "\"{query}\" साठी कोणतीही स्थळे सापडली नाहीत", trySearching: "शहरे, राज्ये किंवा प्रकार शोधा", trendingDestinations: "ट्रेंडिंग स्थळे", popularFor: "यासाठी प्रसिद्ध" },
  },
  ta: {
    common: { language: "மொழி", selectLanguage: "மொழியை தேர்வு செய்யவும்" },
    navbar: { tagline: "உங்கள் பயண தோழன்", explore: "சுற்றிப் பாருங்கள்", transport: "போக்குவரத்து", map: "வரைபடம்", tripPlanner: "பயண திட்டம்", findTravelBuddies: "பயண நண்பர்களை கண்டுபிடிக்கவும்", searchDestinations: "இடங்களை தேடுங்கள்...", profile: "சுயவிவரம்", settings: "அமைப்புகள்", logout: "வெளியேறு", login: "உள்நுழை", loginSignup: "உள்நுழை / பதிவு", toggleMenu: "மெனுவை மாற்று", navigationMenu: "வழிசெலுத்தல் மெனு", search: "தேடு..." },
    footer: { description: "அற்புதமான இடங்களை கண்டறிய உங்கள் ஸ்மார்ட் பயண துணை.", explore: "சுற்றிப் பாருங்கள்", destinations: "இடங்கள்", foodDining: "உணவு & உணவகம்", events: "நிகழ்வுகள்", hotels: "ஹோட்டல்கள்", plan: "திட்டமிடல்", mapView: "வரைபட காட்சி", aiItinerary: "AI பயண திட்டம்", company: "நிறுவனம்", about: "எங்களை பற்றி", contact: "தொடர்பு", privacyPolicy: "தனியுரிமைக் கொள்கை", rightsReserved: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை." },
    hero: { badge: "இந்தியாவின் மறைந்த ரத்தினங்களை கண்டறியுங்கள்", title: "இந்தியா சுற்றுலாவிற்கு உங்கள் TRIPMATE தோழன்", subtitle: "இமயமலையிலிருந்து பின்நீர்வழிகள் வரை, கோவில்களிலிருந்து கடற்கரைகள் வரை. தனிப்பயன் பரிந்துரைகளுடன் இந்தியாவை அனுபவிக்கவும்.", exploreDestinations: "இடங்களை பாருங்கள்", planTrip: "பயணத்தை திட்டமிடுங்கள்", destinations: "இடங்கள்", happyTravelers: "மகிழ்ச்சி பயணிகள்", averageRating: "சராசரி மதிப்பீடு" },
    categories: { heading: "வகைபடி ஆராயுங்கள்", subtitle: "ஆன்மீகப் பயணத்திலிருந்து சாகச அனுபவங்கள் வரை இந்தியாவை கண்டறியுங்கள்", transportTitle: "உங்கள் போக்குவரத்தை முன்பதிவு செய்யுங்கள்", transportDescription: "விமானம், ரயில், பேருந்து கட்டணங்களை ஒப்பிடுங்கள். உள்ளூர் மற்றும் வெளியூர் காப் முன்பதிவு செய்யுங்கள்.", bookNow: "இப்போதே முன்பதிவு", flights: "விமானங்கள்", trains: "ரயில்கள்", buses: "பேருந்துகள்", cabs: "காப்கள்", spiritual: "ஆன்மீகம்", spiritualDesc: "புனித கோவில்கள் மற்றும் தீர்த்த தலங்கள்", adventure: "சாகசம்", adventureDesc: "சுவாரசியமான செயல்பாடுகள்", heritage: "பாரம்பரியம்", heritageDesc: "பழமையான கோட்டைகள் மற்றும் நினைவுச்சின்னங்கள்", nature: "இயற்கை", natureDesc: "இயற்கை அழகுகள்", beach: "கடற்கரை", beachDesc: "கடற்கரை சொர்க்கங்கள்", hillStation: "மலைநகர்", hillStationDesc: "மலை ஓய்வு இடங்கள்" },
    featured: { heading: "சிறப்பு இடங்கள்", subtitle: "இந்தியாவின் பல்வகைமையும் அழகையும் காட்டும் தேர்ந்தெடுக்கப்பட்ட இடங்கள்", viewAll: "அனைத்தையும் காண்க", viewAllDestinations: "அனைத்து இடங்களையும் காண்க" },
    seasonal: { title: "குளிர்கால அதிசய தொகுப்பு", subtitle: "இந்த பருவத்திற்கான மாயமான குளிர்கால இடங்களை காணுங்கள்", exploreNow: "இப்போதே காண்க" },
    searchbar: { placeholder: "இந்தியாவில் இடங்களை தேடுங்கள்...", searching: "இடங்கள் தேடப்படுகிறது...", destinationsFound: "{count} இடங்கள் கிடைத்தன", noDestinationsFor: "\"{query}\" க்கு இடங்கள் கிடைக்கவில்லை", trySearching: "நகரங்கள், மாநிலங்கள் அல்லது வகைகள் மூலம் தேடுங்கள்", trendingDestinations: "பிரபல இடங்கள்", popularFor: "புகழ்பெற்றது" },
  },
  ur: {
    common: { language: "زبان", selectLanguage: "زبان منتخب کریں" },
    navbar: { tagline: "آپ کا سفری ساتھی", explore: "دریافت کریں", transport: "ٹرانسپورٹ", map: "نقشہ", tripPlanner: "ٹرپ پلانر", findTravelBuddies: "سفری ساتھی تلاش کریں", searchDestinations: "مقامات تلاش کریں...", profile: "پروفائل", settings: "ترتیبات", logout: "لاگ آؤٹ", login: "لاگ اِن", loginSignup: "لاگ اِن / سائن اپ", toggleMenu: "مینو ٹوگل کریں", navigationMenu: "نیویگیشن مینو", search: "تلاش..." },
    footer: { description: "حیرت انگیز مقامات دریافت کرنے کے لئے آپ کا اسمارٹ سفری ساتھی۔", explore: "دریافت", destinations: "مقامات", foodDining: "کھانا اور ڈائننگ", events: "ایونٹس", hotels: "ہوٹلز", plan: "منصوبہ", mapView: "نقشہ منظر", aiItinerary: "اے آئی منصوبہ", company: "کمپنی", about: "ہمارے بارے میں", contact: "رابطہ", privacyPolicy: "رازداری پالیسی", rightsReserved: "جملہ حقوق محفوظ ہیں۔" },
    hero: { badge: "بھارت کے پوشیدہ جواہرات دریافت کریں", title: "بھارت ٹور کے لئے آپ کا TRIPMATE ساتھی", subtitle: "ہمالیہ سے بیک واٹرز تک، قدیم مندروں سے ساحلوں تک۔ ذاتی تجاویز کے ساتھ بھارت گھومیں۔", exploreDestinations: "مقامات دیکھیں", planTrip: "ٹرپ پلان کریں", destinations: "مقامات", happyTravelers: "خوش مسافر", averageRating: "اوسط ریٹنگ" },
    categories: { heading: "زمرہ کے لحاظ سے دریافت کریں", subtitle: "روحانی سفر سے مہم جوئی تک بھارت کو نئے انداز سے دیکھیں", transportTitle: "اپنی ٹرانسپورٹ بک کریں", transportDescription: "فلائٹس، ٹرینز اور بسوں کے کرایے کا موازنہ کریں۔ لوکل اور آؤٹ اسٹیشن کیب بک کریں۔", bookNow: "ابھی بک کریں", flights: "فلائٹس", trains: "ٹرینیں", buses: "بسیں", cabs: "کیب", spiritual: "روحانی", spiritualDesc: "مقدس مندر اور زیارت گاہیں", adventure: "مہم جوئی", adventureDesc: "رومانی سرگرمیاں", heritage: "ورثہ", heritageDesc: "قدیم قلعے اور یادگاریں", nature: "قدرت", natureDesc: "قدرتی مناظر", beach: "ساحل", beachDesc: "ساحلی جنت", hillStation: "ہل اسٹیشن", hillStationDesc: "پہاڑی آرام گاہیں" },
    featured: { heading: "نمایاں مقامات", subtitle: "بھارت کی خوبصورتی اور تنوع دکھانے والے منتخب مقامات", viewAll: "سب دیکھیں", viewAllDestinations: "تمام مقامات دیکھیں" },
    seasonal: { title: "ونٹر ونڈر لینڈ کلیکشن", subtitle: "موسم کے لئے بہترین جادوئی سردیوں کے مقامات دیکھیں", exploreNow: "ابھی دیکھیں" },
    searchbar: { placeholder: "بھارت میں مقامات تلاش کریں...", searching: "مقامات تلاش کیے جا رہے ہیں...", destinationsFound: "{count} مقامات ملے", noDestinationsFor: "\"{query}\" کے لئے کوئی مقام نہیں ملا", trySearching: "شہر، ریاست یا قسم سے تلاش کریں", trendingDestinations: "مقبول مقامات", popularFor: "مشہور برائے" },
  },
  gu: {
    common: { language: "ભાષા", selectLanguage: "ભાષા પસંદ કરો" },
    navbar: { tagline: "તમારો પ્રવાસ સાથી", explore: "ફરો", transport: "પરિવહન", map: "નકશો", tripPlanner: "ટ્રિપ પ્લાનર", findTravelBuddies: "પ્રવાસ સાથી શોધો", searchDestinations: "ગંતવ્ય શોધો...", profile: "પ્રોફાઇલ", settings: "સેટિંગ્સ", logout: "લોગ આઉટ", login: "લોગ ઇન", loginSignup: "લોગ ઇન / સાઇન અપ", toggleMenu: "મેનુ ટૉગલ કરો", navigationMenu: "નેવિગેશન મેનુ", search: "શોધો..." },
    footer: { description: "અદ્ભુત ગંતવ્યો શોધવા માટે તમારો સ્માર્ટ ટ્રાવેલ સાથી.", explore: "ફરો", destinations: "ગંતવ્ય", foodDining: "ફૂડ અને ડાઇનિંગ", events: "ઈવેન્ટ્સ", hotels: "હોટેલ્સ", plan: "યોજના", mapView: "મેપ વ્યૂ", aiItinerary: "AI પ્રવાસ યોજના", company: "કંપની", about: "અમારા વિશે", contact: "સંપર્ક", privacyPolicy: "ગોપનીયતા નીતિ", rightsReserved: "બધા હકો અનામત." },
    hero: { badge: "ભારતના છુપાયેલા રત્નો શોધો", title: "ભારત પ્રવાસ માટે તમારો TRIPMATE સાથી", subtitle: "હિમાલયથી બેકવોટર્સ સુધી, મંદિરો થી બીચ સુધી. વ્યક્તિગત ભલામણો સાથે ભારતને શોધો.", exploreDestinations: "ગંતવ્ય જુઓ", planTrip: "પ્રવાસ યોજના બનાવો", destinations: "ગંતવ્ય", happyTravelers: "ખુશ મુસાફરો", averageRating: "સરેરાશ રેટિંગ" },
    categories: { heading: "શ્રેણી પ્રમાણે શોધો", subtitle: "આધ્યાત્મિક યાત્રાથી સાહસિક અનુભવ સુધી ભારતને શોધો", transportTitle: "તમારું પરિવહન બુક કરો", transportDescription: "ફ્લાઇટ, ટ્રેન અને બસ ભાડાં સરખાવો. સ્થાનિક અને આઉટસ્ટેશન કેબ બુક કરો.", bookNow: "હમણાં બુક કરો", flights: "ફ્લાઇટ્સ", trains: "ટ્રેન્સ", buses: "બસ", cabs: "કેબ", spiritual: "આધ્યાત્મિક", spiritualDesc: "પવિત્ર મંદિરો અને તીર્થસ્થળો", adventure: "સાહસ", adventureDesc: "રોમાંચક પ્રવૃત્તિઓ", heritage: "વારસો", heritageDesc: "પ્રાચીન કિલ્લાઓ અને સ્મારકો", nature: "પ્રકૃતિ", natureDesc: "પ્રાકૃતિક સૌંદર્ય", beach: "બીચ", beachDesc: "કિનારાકાંઠાનો સ્વર્ગ", hillStation: "હિલ સ્ટેશન", hillStationDesc: "પર્વતીય નિવાસ" },
    featured: { heading: "ફીચર્ડ ગંતવ્ય", subtitle: "ભારતની વિવિધતા અને સુંદરતા દર્શાવતા પસંદ કરેલા સ્થળો", viewAll: "બધું જુઓ", viewAllDestinations: "બધા ગંતવ્ય જુઓ" },
    seasonal: { title: "વિન્ટર વન્ડરલેન્ડ કલેક્શન", subtitle: "મોસમ માટે યોગ્ય જાદુઈ શિયાળાના ગંતવ્યો જુઓ", exploreNow: "હમણાં જુઓ" },
    searchbar: { placeholder: "ભારતમાં ગંતવ્ય શોધો...", searching: "ગંતવ્ય શોધાઈ રહ્યા છે...", destinationsFound: "{count} ગંતવ્ય મળ્યા", noDestinationsFor: "\"{query}\" માટે કોઈ ગંતવ્ય મળ્યા નથી", trySearching: "શહેર, રાજ્ય અથવા પ્રકાર શોધો", trendingDestinations: "ટ્રેન્ડિંગ ગંતવ્ય", popularFor: "માટે પ્રખ્યાત" },
  },
  kn: {
    common: { language: "ಭಾಷೆ", selectLanguage: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ" },
    navbar: { tagline: "ನಿಮ್ಮ ಪ್ರಯಾಣ ಸಂಗಾತಿ", explore: "ಅನ್ವೇಷಿಸಿ", transport: "ಸಾರಿಗೆ", map: "ನಕ್ಷೆ", tripPlanner: "ಪ್ರಯಾಣ ಯೋಜಕ", findTravelBuddies: "ಪ್ರಯಾಣ ಸ್ನೇಹಿತರನ್ನು ಹುಡುಕಿ", searchDestinations: "ಗಮ್ಯಸ್ಥಾನಗಳನ್ನು ಹುಡುಕಿ...", profile: "ಪ್ರೊಫೈಲ್", settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು", logout: "ಲಾಗ್ ಔಟ್", login: "ಲಾಗಿನ್", loginSignup: "ಲಾಗಿನ್ / ಸೈನ್ ಅಪ್", toggleMenu: "ಮೆನು ಬದಲಿಸಿ", navigationMenu: "ನ್ಯಾವಿಗೇಷನ್ ಮೆನು", search: "ಹುಡುಕಿ..." },
    footer: { description: "ಅದ್ಭುತ ಗಮ್ಯಸ್ಥಾನಗಳನ್ನು ಕಂಡುಹಿಡಿಯಲು ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಪ್ರಯಾಣ ಸಂಗಾತಿ.", explore: "ಅನ್ವೇಷಣೆ", destinations: "ಗಮ್ಯಸ್ಥಾನಗಳು", foodDining: "ಆಹಾರ ಮತ್ತು ಡೈನಿಂಗ್", events: "ಈವೆಂಟ್‌ಗಳು", hotels: "ಹೋಟೆಲ್‌ಗಳು", plan: "ಯೋಜನೆ", mapView: "ನಕ್ಷೆ ವೀಕ್ಷಣೆ", aiItinerary: "AI ಯೋಜನೆ", company: "ಕಂಪನಿ", about: "ನಮ್ಮ ಬಗ್ಗೆ", contact: "ಸಂಪರ್ಕ", privacyPolicy: "ಗೌಪ್ಯತಾ ನೀತಿ", rightsReserved: "ಎಲ್ಲ ಹಕ್ಕುಗಳು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ." },
    hero: { badge: "ಭಾರತದ ಮರೆಯಾದ ರತ್ನಗಳನ್ನು ಅನ್ವೇಷಿಸಿ", title: "ಭಾರತ ಪ್ರವಾಸಕ್ಕೆ ನಿಮ್ಮ TRIPMATE ಸಂಗಾತಿ", subtitle: "ಹಿಮಾಲಯಗಳಿಂದ ಬ್ಯಾಕ್‌ವಾಟರ್‌ಗಳವರೆಗೆ, ದೇವಾಲಯಗಳಿಂದ ಬೀಚ್‌ಗಳವರೆಗೆ. ವೈಯಕ್ತಿಕ ಶಿಫಾರಸುಗಳೊಂದಿಗೆ ಭಾರತವನ್ನು ಅನ್ವೇಷಿಸಿ.", exploreDestinations: "ಗಮ್ಯಸ್ಥಾನ ನೋಡಿ", planTrip: "ಪ್ರಯಾಣ ಯೋಜಿಸಿ", destinations: "ಗಮ್ಯಸ್ಥಾನಗಳು", happyTravelers: "ಸಂತೋಷ ಪ್ರಯಾಣಿಕರು", averageRating: "ಸರಾಸರಿ ರೇಟಿಂಗ್" },
    categories: { heading: "ವರ್ಗವಾರು ಅನ್ವೇಷಿಸಿ", subtitle: "ಆಧ್ಯಾತ್ಮಿಕ ಪ್ರಯಾಣದಿಂದ ಸಾಹಸ ಅನುಭವಗಳವರೆಗೆ ಭಾರತವನ್ನು ಕಂಡುಕೊಳ್ಳಿ", transportTitle: "ನಿಮ್ಮ ಸಾರಿಗೆ ಬುಕ್ ಮಾಡಿ", transportDescription: "ವಿಮಾನ, ರೈಲು ಮತ್ತು ಬಸ್ ದರಗಳನ್ನು ಹೋಲಿಸಿ. ಸ್ಥಳೀಯ ಮತ್ತು ಔಟ್‌ಸ್ಟೇಶನ್ ಕ್ಯಾಬ್ ಬುಕ್ ಮಾಡಿ.", bookNow: "ಈಗಲೇ ಬುಕ್ ಮಾಡಿ", flights: "ವಿಮಾನಗಳು", trains: "ರೈಲುಗಳು", buses: "ಬಸ್‌ಗಳು", cabs: "ಕ್ಯಾಬ್‌ಗಳು", spiritual: "ಆಧ್ಯಾತ್ಮಿಕ", spiritualDesc: "ಪವಿತ್ರ ದೇವಾಲಯಗಳು ಮತ್ತು ತೀರ್ಥಕ್ಷೇತ್ರಗಳು", adventure: "ಸಾಹಸ", adventureDesc: "ರೋಚಕ ಚಟುವಟಿಕೆಗಳು", heritage: "ಪಾರಂಪರ್ಯ", heritageDesc: "ಪ್ರಾಚೀನ ಕೋಟೆಗಳು ಮತ್ತು ಸ್ಮಾರಕಗಳು", nature: "ಪ್ರಕೃತಿ", natureDesc: "ಪ್ರಾಕೃತಿಕ ಸೌಂದರ್ಯ", beach: "ಬೀಚ್", beachDesc: "ಕರಾವಳಿ ಸ್ವರ್ಗ", hillStation: "ಹಿಲ್ ಸ್ಟೇಶನ್", hillStationDesc: "ಪರ್ವತ ವಿಶ್ರಾಂತಿ ಸ್ಥಳಗಳು" },
    featured: { heading: "ವೈಶಿಷ್ಟ್ಯಗೊಳಿಸಿದ ಗಮ್ಯಸ್ಥಾನಗಳು", subtitle: "ಭಾರತದ ವೈವಿಧ್ಯತೆ ಮತ್ತು ಸೌಂದರ್ಯ ತೋರಿಸುವ ಆಯ್ದ ಸ್ಥಳಗಳು", viewAll: "ಎಲ್ಲ ನೋಡಿ", viewAllDestinations: "ಎಲ್ಲ ಗಮ್ಯಸ್ಥಾನಗಳನ್ನು ನೋಡಿ" },
    seasonal: { title: "ವಿಂಟರ್ ವಂಡರ್‌ಲ್ಯಾಂಡ್ ಸಂಗ್ರಹ", subtitle: "ಈ ಋತುವಿಗೆ ಸೂಕ್ತವಾದ ಮಾಯಾಮಯ ಚಳಿಗಾಲದ ಗಮ್ಯಸ್ಥಾನಗಳನ್ನು ನೋಡಿ", exploreNow: "ಈಗ ನೋಡಿ" },
    searchbar: { placeholder: "ಭಾರತದಲ್ಲಿ ಗಮ್ಯಸ್ಥಾನಗಳನ್ನು ಹುಡುಕಿ...", searching: "ಗಮ್ಯಸ್ಥಾನಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...", destinationsFound: "{count} ಗಮ್ಯಸ್ಥಾನಗಳು ಕಂಡುಬಂದಿವೆ", noDestinationsFor: "\"{query}\" ಗೆ ಯಾವುದೇ ಗಮ್ಯಸ್ಥಾನಗಳು ಸಿಗಲಿಲ್ಲ", trySearching: "ನಗರಗಳು, ರಾಜ್ಯಗಳು ಅಥವಾ ಪ್ರಕಾರಗಳಿಂದ ಹುಡುಕಿ", trendingDestinations: "ಟ್ರೆಂಡಿಂಗ್ ಗಮ್ಯಸ್ಥಾನಗಳು", popularFor: "ಇದಕ್ಕಾಗಿ ಪ್ರಸಿದ್ಧ" },
  },
  ml: {
    common: { language: "ഭാഷ", selectLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക" },
    navbar: { tagline: "നിങ്ങളുടെ യാത്ര കൂട്ടായി", explore: "പര്യവേക്ഷണം", transport: "ഗതാഗതം", map: "മാപ്പ്", tripPlanner: "ട്രിപ്പ് പ്ലാനർ", findTravelBuddies: "യാത്ര കൂട്ടുകാരെ കണ്ടെത്തുക", searchDestinations: "ലക്ഷ്യസ്ഥാനങ്ങൾ തിരയുക...", profile: "പ്രൊഫൈൽ", settings: "ക്രമീകരണങ്ങൾ", logout: "ലോഗൗട്ട്", login: "ലോഗിൻ", loginSignup: "ലോഗിൻ / സൈൻ അപ്പ്", toggleMenu: "മെനു മാറ്റുക", navigationMenu: "നാവിഗേഷൻ മെനു", search: "തിരയുക..." },
    footer: { description: "അസാധാരണമായ ലക്ഷ്യസ്ഥാനങ്ങൾ കണ്ടെത്താൻ നിങ്ങളുടെ സ്മാർട്ട് ട്രാവൽ പങ്കാളി.", explore: "പര്യവേക്ഷണം", destinations: "ലക്ഷ്യസ്ഥാനങ്ങൾ", foodDining: "ഭക്ഷണവും ഡൈനിംഗും", events: "ഇവന്റുകൾ", hotels: "ഹോട്ടലുകൾ", plan: "പ്ലാൻ", mapView: "മാപ്പ് കാഴ്ച", aiItinerary: "AI യാത്ര പദ്ധതി", company: "കമ്പനി", about: "ഞങ്ങളേക്കുറിച്ച്", contact: "ബന്ധപ്പെടുക", privacyPolicy: "സ്വകാര്യതാ നയം", rightsReserved: "എല്ലാ അവകാശങ്ങളും സംരക്ഷിച്ചിരിക്കുന്നു." },
    hero: { badge: "ഇന്ത്യയിലെ മറഞ്ഞ രത്നങ്ങൾ കണ്ടെത്തൂ", title: "ഇന്ത്യാ ടൂറിന് നിങ്ങളുടെ TRIPMATE കൂട്ടായി", subtitle: "ഹിമാലയം മുതൽ ബാക്ക്‌വാട്ടേഴ്സ് വരെ, ക്ഷേത്രങ്ങളിൽ നിന്ന് കടൽത്തീരങ്ങളിലേക്ക്. വ്യക്തിഗത ശുപാർശകളോടെ ഇന്ത്യ പര്യവേക്ഷിക്കുക.", exploreDestinations: "ലക്ഷ്യസ്ഥാനങ്ങൾ കാണുക", planTrip: "യാത്ര പ്ലാൻ ചെയ്യുക", destinations: "ലക്ഷ്യസ്ഥാനങ്ങൾ", happyTravelers: "സന്തോഷ യാത്രക്കാർ", averageRating: "ശരാശരി റേറ്റിംഗ്" },
    categories: { heading: "വിഭാഗം അനുസരിച്ച് പര്യവേക്ഷണം", subtitle: "ആത്മീയ യാത്ര മുതൽ സാഹസിക അനുഭവങ്ങൾ വരെ ഇന്ത്യയെ കണ്ടെത്തുക", transportTitle: "നിങ്ങളുടെ ഗതാഗതം ബുക്ക് ചെയ്യുക", transportDescription: "ഫ്ലൈറ്റ്, ട്രെയിൻ, ബസ് നിരക്കുകൾ താരതമ്യം ചെയ്യുക. ലൊക്കൽ, ഔട്ട്‌സ്റ്റേഷൻ കാബുകൾ ബുക്ക് ചെയ്യുക.", bookNow: "ഇപ്പോൾ ബുക്ക് ചെയ്യൂ", flights: "ഫ്ലൈറ്റുകൾ", trains: "ട്രെയിനുകൾ", buses: "ബസുകൾ", cabs: "കാബുകൾ", spiritual: "ആത്മീയ", spiritualDesc: "പുണ്യ ക്ഷേത്രങ്ങളും തീർഥാടന കേന്ദ്രങ്ങളും", adventure: "സാഹസം", adventureDesc: "റോമാഞ്ചകരമായ പ്രവർത്തനങ്ങൾ", heritage: "പൈതൃകം", heritageDesc: "പുരാതന കോട്ടകളും സ്മാരകങ്ങളും", nature: "പ്രകൃതി", natureDesc: "പ്രകൃതി സൗന്ദര്യം", beach: "കടൽത്തീരം", beachDesc: "തീര സ്വർഗ്ഗങ്ങൾ", hillStation: "ഹിൽ സ്റ്റേഷൻ", hillStationDesc: "മലയോര വിശ്രമ കേന്ദ്രങ്ങൾ" },
    featured: { heading: "പ്രത്യേക ലക്ഷ്യസ്ഥാനങ്ങൾ", subtitle: "ഇന്ത്യയുടെ വൈവിധ്യവും സൗന്ദര്യവും കാണിക്കുന്ന തിരഞ്ഞെടുത്ത സ്ഥലങ്ങൾ", viewAll: "എല്ലാം കാണുക", viewAllDestinations: "എല്ലാ ലക്ഷ്യസ്ഥാനങ്ങളും കാണുക" },
    seasonal: { title: "വിന്റർ വണ്ടർലാൻഡ് ശേഖരം", subtitle: "ഈ സീസണിന് പറ്റിയ മായിക ശൈത്യകാല ലക്ഷ്യസ്ഥാനങ്ങൾ കാണൂ", exploreNow: "ഇപ്പോൾ കാണൂ" },
    searchbar: { placeholder: "ഇന്ത്യയിൽ ലക്ഷ്യസ്ഥാനങ്ങൾ തിരയൂ...", searching: "ലക്ഷ്യസ്ഥാനങ്ങൾ തിരയുന്നു...", destinationsFound: "{count} ലക്ഷ്യസ്ഥാനങ്ങൾ കണ്ടെത്തി", noDestinationsFor: "\"{query}\" ന് ലക്ഷ്യസ്ഥാനങ്ങൾ കണ്ടെത്തിയില്ല", trySearching: "നഗരം, സംസ്ഥാനം അല്ലെങ്കിൽ തരം ഉപയോഗിച്ച് തിരയൂ", trendingDestinations: "ട്രെൻഡിംഗ് ലക്ഷ്യസ്ഥാനങ്ങൾ", popularFor: "പ്രസിദ്ധം" },
  },
  pa: {
    common: { language: "ਭਾਸ਼ਾ", selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ" },
    navbar: { tagline: "ਤੁਹਾਡਾ ਯਾਤਰਾ ਸਾਥੀ", explore: "ਘੁੰਮੋ", transport: "ਆਵਾਜਾਈ", map: "ਨਕਸ਼ਾ", tripPlanner: "ਟ੍ਰਿਪ ਪਲੈਨਰ", findTravelBuddies: "ਯਾਤਰਾ ਸਾਥੀ ਲੱਭੋ", searchDestinations: "ਮੰਜ਼ਿਲਾਂ ਖੋਜੋ...", profile: "ਪ੍ਰੋਫਾਈਲ", settings: "ਸੈਟਿੰਗਾਂ", logout: "ਲਾਗ ਆਉਟ", login: "ਲਾਗ ਇਨ", loginSignup: "ਲਾਗ ਇਨ / ਸਾਈਨ ਅਪ", toggleMenu: "ਮੇਨੂ ਬਦਲੋ", navigationMenu: "ਨੇਵੀਗੇਸ਼ਨ ਮੇਨੂ", search: "ਖੋਜੋ..." },
    footer: { description: "ਸ਼ਾਨਦਾਰ ਮੰਜ਼ਿਲਾਂ ਖੋਜਣ ਲਈ ਤੁਹਾਡਾ ਸਮਾਰਟ ਯਾਤਰਾ ਸਾਥੀ।", explore: "ਘੁੰਮੋ", destinations: "ਮੰਜ਼ਿਲਾਂ", foodDining: "ਖਾਣਾ ਅਤੇ ਡਾਇਨਿੰਗ", events: "ਇਵੈਂਟਸ", hotels: "ਹੋਟਲ", plan: "ਯੋਜਨਾ", mapView: "ਮੈਪ ਵਿਊ", aiItinerary: "AI ਯਾਤਰਾ ਯੋਜਨਾ", company: "ਕੰਪਨੀ", about: "ਸਾਡੇ ਬਾਰੇ", contact: "ਸੰਪਰਕ", privacyPolicy: "ਪਰਦੇਦਾਰੀ ਨੀਤੀ", rightsReserved: "ਸਾਰੇ ਅਧਿਕਾਰ ਰਾਖਵੇਂ ਹਨ।" },
    hero: { badge: "ਭਾਰਤ ਦੇ ਲੁਕੇ ਹੋਏ ਰਤਨ ਖੋਜੋ", title: "ਭਾਰਤ ਟੂਰ ਲਈ ਤੁਹਾਡਾ TRIPMATE ਸਾਥੀ", subtitle: "ਹਿਮਾਲਿਆ ਤੋਂ ਬੈਕਵਾਟਰ ਤੱਕ, ਮੰਦਰਾਂ ਤੋਂ ਬੀਚ ਤੱਕ। ਨਿੱਜੀ ਸੁਝਾਵਾਂ ਨਾਲ ਭਾਰਤ ਦੀ ਖੋਜ ਕਰੋ।", exploreDestinations: "ਮੰਜ਼ਿਲਾਂ ਵੇਖੋ", planTrip: "ਟ੍ਰਿਪ ਯੋਜਨਾ ਬਣਾਓ", destinations: "ਮੰਜ਼ਿਲਾਂ", happyTravelers: "ਖੁਸ਼ ਯਾਤਰੀ", averageRating: "ਔਸਤ ਰੇਟਿੰਗ" },
    categories: { heading: "ਸ਼੍ਰੇਣੀ ਅਨੁਸਾਰ ਖੋਜੋ", subtitle: "ਆਧਿਆਤਮਿਕ ਯਾਤਰਾ ਤੋਂ ਰੋਮਾਂਚਕ ਅਨੁਭਵਾਂ ਤੱਕ ਭਾਰਤ ਨੂੰ ਜਾਣੋ", transportTitle: "ਆਪਣੀ ਆਵਾਜਾਈ ਬੁੱਕ ਕਰੋ", transportDescription: "ਫਲਾਈਟ, ਰੇਲ ਅਤੇ ਬੱਸ ਕਿਰਾਏ ਦੀ ਤੁਲਨਾ ਕਰੋ। ਲੋਕਲ ਅਤੇ ਆਊਟਸਟੇਸ਼ਨ ਕੈਬ ਬੁੱਕ ਕਰੋ।", bookNow: "ਹੁਣੇ ਬੁੱਕ ਕਰੋ", flights: "ਫਲਾਈਟਸ", trains: "ਰੇਲਗੱਡੀਆਂ", buses: "ਬੱਸਾਂ", cabs: "ਕੈਬਸ", spiritual: "ਆਧਿਆਤਮਿਕ", spiritualDesc: "ਪਵਿੱਤਰ ਮੰਦਰ ਅਤੇ ਤੀਰਥ ਸਥਾਨ", adventure: "ਸਾਹਸ", adventureDesc: "ਰੋਮਾਂਚਕ ਗਤੀਵਿਧੀਆਂ", heritage: "ਵਿਰਾਸਤ", heritageDesc: "ਪੁਰਾਤਨ ਕਿਲ੍ਹੇ ਅਤੇ ਸਮਾਰਕ", nature: "ਪ੍ਰਕਿਰਤੀ", natureDesc: "ਕੁਦਰਤੀ ਸੁੰਦਰਤਾ", beach: "ਬੀਚ", beachDesc: "ਤੱਟੀ ਸਵਰਗ", hillStation: "ਹਿੱਲ ਸਟੇਸ਼ਨ", hillStationDesc: "ਪਹਾੜੀ ਆਰਾਮਗਾਹਾਂ" },
    featured: { heading: "ਖਾਸ ਮੰਜ਼ਿਲਾਂ", subtitle: "ਭਾਰਤ ਦੀ ਵਿਭਿੰਨਤਾ ਅਤੇ ਸੁੰਦਰਤਾ ਦਿਖਾਉਣ ਵਾਲੀਆਂ ਚੁਣੀਂਦੀਆਂ ਥਾਵਾਂ", viewAll: "ਸਭ ਵੇਖੋ", viewAllDestinations: "ਸਭ ਮੰਜ਼ਿਲਾਂ ਵੇਖੋ" },
    seasonal: { title: "ਵਿੰਟਰ ਵੰਡਰਲੈਂਡ ਕਲੇਕਸ਼ਨ", subtitle: "ਮੌਸਮ ਲਈ ਸ਼ਾਨਦਾਰ ਸਰਦੀਆਂ ਦੀਆਂ ਮੰਜ਼ਿਲਾਂ ਵੇਖੋ", exploreNow: "ਹੁਣੇ ਵੇਖੋ" },
    searchbar: { placeholder: "ਭਾਰਤ ਵਿੱਚ ਮੰਜ਼ਿਲਾਂ ਖੋਜੋ...", searching: "ਮੰਜ਼ਿਲਾਂ ਖੋਜ ਰਹੇ ਹਾਂ...", destinationsFound: "{count} ਮੰਜ਼ਿਲਾਂ ਮਿਲੀਆਂ", noDestinationsFor: "\"{query}\" ਲਈ ਕੋਈ ਮੰਜ਼ਿਲ ਨਹੀਂ ਮਿਲੀ", trySearching: "ਸ਼ਹਿਰ, ਰਾਜ ਜਾਂ ਕਿਸਮ ਨਾਲ ਖੋਜੋ", trendingDestinations: "ਟ੍ਰੈਂਡਿੰਗ ਮੰਜ਼ਿਲਾਂ", popularFor: "ਲਈ ਪ੍ਰਸਿੱਧ" },
  },
} as const

function getValueByPath(source: unknown, path: string): string | undefined {
  if (!source || typeof source !== "object") {
    return undefined
  }

  return path.split(".").reduce((acc: unknown, part) => {
    if (!acc || typeof acc !== "object") {
      return undefined
    }
    return (acc as Record<string, unknown>)[part]
  }, source) as string | undefined
}

export function getTranslation(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  const value = getValueByPath(translations[locale], key) ?? getValueByPath(translations.en, key) ?? key

  if (!vars) {
    return value
  }

  return Object.entries(vars).reduce((acc, [varKey, varValue]) => {
    return acc.replaceAll(`{${varKey}}`, String(varValue))
  }, value)
}
