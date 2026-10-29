/* Original A1 mini-dialogues. Tap-to-hear pronunciation uses the existing device German voice. */
(() => {
  'use strict';
  // speaker, German, English, Nepali meaning, approximate English sounds, approximate Nepali sounds
  const dialogues = {
    'a1-02': {
      scene:'👋 Meeting a friend', goal:'Greet someone and ask how they are.',
      turns:[
        ['Anna','Guten Morgen!','Good morning!','शुभ प्रभात!','GOO-ten MOR-gen','गुटेन मोर्गेन'],
        ['Ben','Guten Morgen! Wie geht es dir?','Good morning! How are you?','शुभ प्रभात! तिमीलाई कस्तो छ?','GOO-ten MOR-gen! vee GAYT ess DEER','गुटेन मोर्गेन! वी गेट एस डीर'],
        ['Anna','Gut, danke. Und dir?','Good, thanks. And you?','राम्रो छ, धन्यवाद। अनि तिमीलाई?','GOOT DAHN-kuh. oont DEER','गुट डान्के। उन्ट डीर']
      ]},
    'a1-05': {
      scene:'🍎 At the fruit shop', goal:'Ask for a simple quantity.',
      turns:[
        ['Mina','Ich möchte zwei Äpfel, bitte.','I would like two apples, please.','मलाई दुईवटा स्याउ चाहिन्छ, कृपया।','ikh MERSH-tuh TSVY EP-fel BIT-tuh','इख मेर्श्टे त्स्वाइ एप्फेल बिट्टे'],
        ['Verkäufer','Gerne. Hier sind zwei Äpfel.','Certainly. Here are two apples.','अवश्य। यहाँ दुईवटा स्याउ छन्।','GAIR-nuh. HEER zint TSVY EP-fel','गेर्ने। हीर जिन्ट त्स्वाइ एप्फेल'],
        ['Mina','Danke schön!','Thank you very much!','धेरै धन्यवाद!','DAHN-kuh SHERN','डान्के शेर्न']
      ]},
    'a1-07': {
      scene:'👨‍👩‍👧 Talking about family', goal:'Introduce a family member.',
      turns:[
        ['Lena','Das ist meine Mutter.','This is my mother.','उहाँ मेरी आमा हुनुहुन्छ।','dahs ist MY-nuh MOOT-er','दास इस्ट माइने मुटर'],
        ['Tom','Wie heißt sie?','What is her name?','उहाँको नाम के हो?','vee HYST zee','वी हाइस्ट जी'],
        ['Lena','Sie heißt Maria.','Her name is Maria.','उहाँको नाम मारिया हो।','zee HYST mah-REE-ah','जी हाइस्ट मारिया']
      ]},
    'a1-10': {
      scene:'🏠 Visiting a home', goal:'Talk about a room and furniture.',
      turns:[
        ['Amir','Ist das dein Zimmer?','Is that your room?','के त्यो तिम्रो कोठा हो?','ist dahs DYN TSIM-mer','इस्ट दास डाइन त्सिमर'],
        ['Sara','Ja, hier ist mein Bett.','Yes, here is my bed.','हो, यहाँ मेरो ओछ्यान छ।','yah HEER ist MYN BET','या हीर इस्ट माइन बेट'],
        ['Amir','Das Zimmer ist schön.','The room is nice.','कोठा राम्रो छ।','dahs TSIM-mer ist SHERN','दास त्सिमर इस्ट शेर्न']
      ]},
    'a1-16': {
      scene:'🥐 Ordering at a café', goal:'Order a drink and a food item politely.',
      turns:[
        ['Gast','Ich möchte ein Wasser, bitte.','I would like some water, please.','मलाई पानी चाहिन्छ, कृपया।','ikh MERSH-tuh ayn VAH-ser BIT-tuh','इख मेर्श्टे आइन वासर बिट्टे'],
        ['Service','Möchten Sie auch Brot?','Would you also like bread?','के तपाईंलाई रोटी पनि चाहिन्छ?','MERKH-ten zee owkh BROHT','मेश्टेन जी आउख ब्रोट'],
        ['Gast','Ja, bitte. Danke!','Yes, please. Thank you!','हुन्छ, कृपया। धन्यवाद!','yah BIT-tuh DAHN-kuh','या बिट्टे डान्के']
      ]},
    'a1-19': {
      scene:'🧥 Shopping for clothes', goal:'Describe clothing simply.',
      turns:[
        ['Nina','Wie findest du die Jacke?','What do you think of the jacket?','तिमीलाई यो ज्याकेट कस्तो लाग्छ?','vee FIN-dest doo dee YAH-kuh','वी फिन्डेस्ट डू डी याके'],
        ['Max','Die Jacke ist schön.','The jacket is nice.','ज्याकेट राम्रो छ।','dee YAH-kuh ist SHERN','डी याके इस्ट शेर्न'],
        ['Nina','Sie ist aber teuer.','But it is expensive.','तर यो महँगो छ।','zee ist AH-ber TOY-er','जी इस्ट आबर टोयर']
      ]},
    'a1-23': {
      scene:'🚉 Asking for directions', goal:'Ask where the station is.',
      turns:[
        ['Gast','Entschuldigung! Wo ist der Bahnhof?','Excuse me! Where is the train station?','माफ गर्नुहोस्! रेल स्टेशन कहाँ छ?','ent-SHOOL-dee-goong! voh ist dair BAHN-hohf','एन्टशुल्डिगुङ! वो इस्ट डेअर बान्होफ'],
        ['Passant','Gehen Sie geradeaus.','Go straight ahead.','तपाईं सिधा जानुहोस्।','GAY-en zee guh-RAH-duh-ows','गेएन जी गराडेआउस'],
        ['Gast','Vielen Dank!','Thank you very much!','धेरै धन्यवाद!','FEE-len DAHNK','फीलन डान्क']
      ]},
    'a1-25': {
      scene:'🩺 A visit to the doctor', goal:'Say what hurts and understand a simple request.',
      turns:[
        ['Arzt','Was fehlt Ihnen?','What is wrong?','तपाईंलाई के समस्या छ?','vahs FAYLT EE-nen','वास फेल्ट ईनेन'],
        ['Patient','Mein Kopf tut weh.','My head hurts.','मेरो टाउको दुखिरहेको छ।','MYN KOPF toot VAY','माइन कोप्फ टुट वे'],
        ['Arzt','Trinken Sie bitte Wasser.','Please drink water.','कृपया पानी पिउनुहोस्।','TRINK-en zee BIT-tuh VAH-ser','ट्रिङ्केन जी बिट्टे वासर']
      ]}
  };
  window.DEUTSCH_VISUAL_STORIES=dialogues;
})();
