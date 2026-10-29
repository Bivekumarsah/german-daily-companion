"""Author-owned, original A1 learning syllabus. Builds a static JS file without dependencies."""
import json
from pathlib import Path
units=[]
def add(title, group, grammar, explanation, nepali_grammar, example, en, ne, vocab, reading, listening, write, speak, phonetic='', nephonetic=''):
    """Semicolon-separated vocabulary; pipe-separated passage/questions/options and writing prompts."""
    index=len(units)+1
    vocabulary=[]
    for entry in vocab.split(';'):
        parts=[x.strip() for x in entry.strip().split('|')]
        if len(parts)!=3:raise ValueError((title,entry,parts))
        vocabulary.append(dict(de=parts[0],en=parts[1],ne=parts[2]))
    def passage(raw):
        parts=[x.strip() for x in raw.split('|')]
        if len(parts)!=6:raise ValueError((title,parts))
        return dict(text=parts[0],question=parts[1],choices=parts[2:5],answer=int(parts[5]))
    def prompt(raw):
        parts=[x.strip() for x in raw.split('|')]
        if len(parts)!=2:raise ValueError((title,parts))
        return dict(prompt=parts[0],model=parts[1])
    units.append(dict(id=f'a1-{index:02}',number=index,title=title,group=group,grammar=dict(title=grammar,en=explanation,ne=nepali_grammar,example=example,exampleEn=en,exampleNe=ne,pronEnglish=phonetic,pronNepali=nephonetic),vocab=vocabulary,reading=passage(reading),listening=passage(listening),writing=prompt(write),speaking=prompt(speak)))

add('Alphabet & spelling','Foundations','Letters, umlauts and ß','German has 26 basic letters plus Ä, Ö, Ü and ß. Spell names one letter at a time. ß sounds like ss.','जर्मनमा Ä, Ö, Ü र ß पनि प्रयोग हुन्छन्।', 'Wie schreibt man das?','How do you spell that?','त्यसलाई कसरी लेखिन्छ?',
'A|A|आ;B|B|बे;C|C|त्से;Ä|A-umlaut|उम्लाउट ए;Ö|O-umlaut|उम्लाउट ओ;Ü|U-umlaut|उम्लाउट यू;Buchstabieren|to spell|हिज्जे गर्नु',
'Ich heiße Lea. Mein Name beginnt mit L.|Which letter does the name start with?|L|B|M|0',
'Wie heißt du? – Ich heiße Tom. T-O-M.|Which is the correct spelling?|T-O-M|T-A-M|D-O-M|0',
'Write your name and spell it in German letters.|Ich heiße Mina. M-I-N-A.',
'Say your name, then spell it slowly.|Ich heiße Ravi. R-A-V-I.', 'vee SHRAIBT man das','वी श्राइब्ट मान दास')
add('Greetings & politeness','Foundations','Formal and informal greetings','Use Hallo with friends, Guten Tag in many formal daytime settings, and Auf Wiedersehen for a polite goodbye.','साथीलाई Hallo, औपचारिक भेटमा Guten Tag प्रयोग गर्न सकिन्छ।','Guten Tag! Wie geht es Ihnen?','Good day! How are you (formal)?','नमस्कार! तपाईंलाई कस्तो छ?',
'Hallo|hello|नमस्ते;Guten Morgen|good morning|शुभ प्रभात;Guten Tag|good day|नमस्कार;Guten Abend|good evening|शुभ साँझ;Tschüss|bye|बाइ;Danke|thank you|धन्यवाद;Bitte|please / you are welcome|कृपया / स्वागत छ',
'Herr Weber kommt um neun Uhr ins Büro. Er sagt: Guten Morgen!|When does he arrive?|At nine|At six|At eight|0',
'Guten Abend, Frau Koch! – Guten Abend!|Which greeting was used?|Good evening|Good morning|Good night|0',
'Write a polite greeting and goodbye to a teacher.|Guten Tag, Frau Müller! Auf Wiedersehen!',
'Greet a friend, then a teacher.|Hallo, Anna! Guten Tag, Frau Braun!', 'GOO-ten tahk vee gayt ess EE-nen','गूटन टाक वी गेट एस ईनेन')
add('Introducing yourself','Foundations','Ich heiße / Ich bin','Use ich heiße + name or ich bin + name. Introduce yourself with name and a simple fact.','आफ्नो नाम बताउन ich heiße वा ich bin प्रयोग गर्नुहोस्।','Ich heiße Sita und ich bin Studentin.','My name is Sita and I am a student.','मेरो नाम सीता हो र म विद्यार्थी हुँ।',
'ich|I|म;du|you (informal)|तिमी;Sie|you (formal)|तपाईं;heißen|to be called|नाम हुनु;der Name|name|नाम;der Vorname|first name|पहिलो नाम;der Nachname|surname|थर',
'Hallo! Ich bin Omar. Mein Nachname ist Ali.|What is the surname?|Ali|Omar|Hallo|0',
'Guten Tag. Ich heiße Sara. Wie heißen Sie?|What is the speaker asking?|Your name|Your job|Your address|0',
'Write three sentences introducing yourself.|Ich heiße Nisha. Ich komme aus Nepal. Ich lerne Deutsch.',
'Introduce yourself with your name and one fact.|Ich heiße Bivek. Ich komme aus Nepal.', 'ikh HAI-suh ZEE-tah unt ikh bin shtoo-DEN-tin','इख हाइसे सीता उन्ट इख बिन श्टुडेन्टिन')
add('Countries & languages','Foundations','kommen aus + country','Use ich komme aus Nepal, ich wohne in Berlin, and ich spreche Deutsch. Some countries take an article.','म कहाँबाट आएको हुँ: ich komme aus Nepal।','Ich komme aus Nepal und spreche Nepali.','I come from Nepal and speak Nepali.','म नेपालबाट आएको हुँ र नेपाली बोल्छु।',
'das Land|country|देश;Nepal|Nepal|नेपाल;Deutschland|Germany|जर्मनी;Indien|India|भारत;sprechen|to speak|बोल्नु;wohnen|to live|बस्नु;Deutsch|German|जर्मन;Englisch|English|अङ्ग्रेजी',
'Lina wohnt in München. Sie kommt aus Indien.|Where does Lina come from?|India|Germany|Nepal|0',
'Ich komme aus Spanien, aber ich wohne in Deutschland.|Where does the speaker live?|Germany|Spain|Austria|0',
'Write your home country, current town and language.|Ich komme aus Nepal. Ich wohne in Kathmandu. Ich spreche Nepali.',
'Answer: Woher kommen Sie? Welche Sprachen sprechen Sie?|Ich komme aus Nepal. Ich spreche Nepali und Englisch.', 'ikh KOM-uh owss neh-PAHL','इख कोमे आउस नेपाल')
add('Numbers & phone numbers','Foundations','Numbers 0–100','In German, 21 is einundzwanzig (one-and-twenty). Phone numbers are often spoken digit by digit.','जर्मनमा २१ लाई einundzwanzig भनिन्छ।','Meine Telefonnummer ist null eins sieben zwei.','My phone number is zero one seven two.','मेरो फोन नम्बर शून्य एक सात दुई हो।',
'null|zero|शून्य;eins|one|एक;zwei|two|दुई;drei|three|तीन;zehn|ten|दश;zwanzig|twenty|बीस;dreißig|thirty|तीस;hundert|hundred|सय',
'Der Kurs kostet zwanzig Euro. Die Prüfung kostet dreißig Euro.|How much does the course cost?|20 euros|30 euros|10 euros|0',
'Das Ticket kostet zwölf Euro. Bitte bezahlen Sie an der Kasse.|What is the ticket price?|12 euros|20 euros|2 euros|0',
'Write a price and a telephone number in German words.|Das Buch kostet zehn Euro. Meine Nummer ist eins zwei drei.',
'Say the numbers 0 to 10 and your telephone number slowly.|Null, eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn.', 'MAI-nuh teh-leh-FOHN-noom-er ist nool ains ZEE-ben tsvai','माइने टेलेफोन नुमर इस्ट नुल आइन्स जीबन त्स्वाइ')
add('Clock, weekdays & dates','Foundations','um / am / im','Use um for clock time, am for days and dates, im for months and seasons.','घडीको समयमा um, दिनमा am, महिनामा im प्रयोग हुन्छ।','Der Termin ist am Montag um zehn Uhr.','The appointment is on Monday at ten.','भेटघाट सोमबार दस बजे छ।',
'die Uhr|clock / o’clock|घडी / बजे;heute|today|आज;morgen|tomorrow|भोलि;Montag|Monday|सोमबार;Freitag|Friday|शुक्रबार;Januar|January|जनवरी;der Termin|appointment|भेटघाट;die Woche|week|हप्ता',
'Die Bibliothek öffnet am Montag um neun Uhr. Am Sonntag ist sie zu.|When is it closed?|Sunday|Monday|Friday|0',
'Unser Treffen ist am Freitag um vierzehn Uhr.|Which day is the meeting?|Friday|Monday|Tuesday|0',
'Write an appointment message with a day and time.|Hallo Ali, unser Termin ist am Dienstag um 10 Uhr. Bis dann!',
'Say today’s weekday and an appointment time.|Heute ist Montag. Mein Termin ist um neun Uhr.', 'dehr tehr-MEEN ist am MOHN-tahk oom tsehn oor','देर टेर्मिन इस्ट आम मोन्टाक उम त्सेन उर')
add('Family & relationships','People & home','mein / meine','Use mein before many masculine and neuter singular nouns; meine before feminine and plural nouns in the basic subject form.','साधारण कर्ता रूपमा der/das सँग mein र die/बहुवचनसँग meine।','Das ist meine Mutter und das ist mein Vater.','This is my mother and this is my father.','यो मेरी आमा र यो मेरा बुबा हुन्।',
'die Mutter|mother|आमा;der Vater|father|बुबा;die Schwester|sister|दिदी / बहिनी;der Bruder|brother|दाइ / भाइ;die Eltern|parents|आमाबुबा;das Kind|child|बच्चा;die Familie|family|परिवार',
'Mein Bruder heißt Jan. Meine Schwester heißt Eva.|Who is Eva?|The sister|The brother|The mother|0',
'Das ist mein Sohn Leo. Er ist drei Jahre alt.|How old is Leo?|Three|Ten|Seven|0',
'Write four sentences about your family.|Meine Familie ist klein. Meine Mutter heißt Sita. Mein Vater heißt Ram. Ich habe einen Bruder.',
'Tell someone who is in your family.|Ich habe eine Schwester und einen Bruder.', 'das ist MAI-nuh MOOT-er unt das ist main FAH-ter','दास इस्ट माइने मुटर उन्ट दास इस्ट माइन फाटर')
add('People, ages & descriptions','People & home','er / sie / es; sein','Use er for he, sie for she, and es for it. Sein changes: ich bin, du bist, er/sie ist.','er=ऊ पुरुष, sie=ऊ महिला, es=यो; ich bin, du bist, sie ist।','Meine Schwester ist zwanzig Jahre alt.','My sister is twenty years old.','मेरी बहिनी बीस वर्षकी छिन्।',
'jung|young|जवान;alt|old|वृद्ध / पुरानो;groß|tall / big|अग्लो / ठूलो;klein|small|सानो;freundlich|friendly|मिलनसार;das Alter|age|उमेर;das Jahr|year|वर्ष',
'Erik ist 28 Jahre alt. Seine Schwester ist 25.|How old is Erik?|28|25|18|0',
'Mein Vater ist sechzig Jahre alt und sehr freundlich.|Who is friendly?|The father|The sister|The teacher|0',
'Write a basic description of a person.|Meine Freundin heißt Lena. Sie ist 23 Jahre alt. Sie ist freundlich.',
'Say your age and describe a friend.|Ich bin 25 Jahre alt. Mein Freund ist groß und freundlich.', 'MAI-nuh SHVES-ter ist TSVAN-tsikh YAH-ruh alt','माइने श्वेस्टर इस्ट त्स्वान्सिख यारे आल्ट')
add('Jobs & studying','People & home','arbeiten als / studieren','Use ich arbeite als + profession, or ich studiere + subject. Ich lerne Deutsch means I learn German.','पेशा बताउँदा ich arbeite als ... प्रयोग गर्नुहोस्।','Ich arbeite als Entwickler und lerne Deutsch.','I work as a developer and learn German.','म विकासकर्ताको रूपमा काम गर्छु र जर्मन सिक्छु।',
'der Beruf|profession|पेशा;arbeiten|to work|काम गर्नु;studieren|to study at university|विश्वविद्यालयमा पढ्नु;lernen|to learn|सिक्नु;der Lehrer|teacher (male)|शिक्षक;die Ärztin|doctor (female)|चिकित्सक;der Student|university student (male)|विद्यार्थी',
'Mia studiert Informatik. Am Abend lernt sie Deutsch.|What does Mia study?|Computer science|Medicine|Music|0',
'Ich arbeite im Krankenhaus. Ich bin Arzt.|What is the speaker’s job?|Doctor|Teacher|Driver|0',
'Write three sentences about your work or studies.|Ich bin Student. Ich studiere IT. Ich lerne Deutsch.',
'Answer: Was machen Sie beruflich? Lernen Sie Deutsch?|Ich bin Student. Ja, ich lerne Deutsch.', 'ikh AR-bai-tuh als ent-VIK-ler unt LEHR-nuh DOITCH','इख आरबाइटे आल्स एन्टभिक्लर उन्ट लेर्ने डोइच')
add('Home & rooms','People & home','wo? / in + location','Use Wo wohnst du? to ask where someone lives. Ich wohne in einer Wohnung is a useful A1 answer.','Wo wohnst du? = तिमी कहाँ बस्छौ?','Ich wohne in einer kleinen Wohnung.','I live in a small apartment.','म सानो अपार्टमेन्टमा बस्छु।',
'die Wohnung|apartment|अपार्टमेन्ट;das Haus|house|घर;das Zimmer|room|कोठा;die Küche|kitchen|भान्सा;das Bad|bathroom|स्नानघर;das Schlafzimmer|bedroom|सुत्ने कोठा;die Tür|door|ढोका',
'Die Wohnung hat zwei Zimmer, eine Küche und ein Bad.|How many rooms are mentioned as Zimmer?|Two|Three|One|0',
'Ich wohne im zweiten Stock. Die Küche ist klein.|What is small?|The kitchen|The balcony|The garden|0',
'Describe your home in three sentences.|Ich wohne in einer Wohnung. Sie hat zwei Zimmer. Die Küche ist klein.',
'Answer: Wo wohnen Sie? Wie viele Zimmer haben Sie?|Ich wohne in Berlin. Meine Wohnung hat zwei Zimmer.', 'ikh VOH-nuh in AI-ner KLAI-nen VOH-noong','इख वोने इन आइनर क्लाइनन वोनुङ')
add('Objects & articles','People & home','der / die / das','Every German noun has a grammatical gender. Learn nouns with their articles, for example der Tisch, die Lampe, das Buch.','जर्मन संज्ञालाई der, die, das सँगै याद गर्नुहोस्।','Das ist ein Buch. Die Lampe ist neu.','That is a book. The lamp is new.','त्यो किताब हो। बत्ती नयाँ छ।',
'der Tisch|table|टेबल;die Lampe|lamp|बत्ती;das Buch|book|किताब;der Stuhl|chair|कुर्सी;die Tasche|bag|झोला;das Fenster|window|झ्याल;das Handy|mobile phone|मोबाइल',
'Auf dem Tisch liegen ein Buch und eine Tasche.|What is on the table?|A book and bag|A phone only|A lamp only|0',
'Die Lampe ist neu, aber der Tisch ist alt.|Which object is new?|The lamp|The table|The window|0',
'Write one sentence with der, one with die and one with das.|Der Tisch ist groß. Die Lampe ist neu. Das Buch ist interessant.',
'Point to three objects and say their articles.|Das ist der Tisch. Das ist die Tasche. Das ist das Buch.', 'das ist ain BOOKH dee LAM-puh ist noy','दास इस्ट आइन बुख दी लाम्पे इस्ट नोइ')
add('Present tense: regular verbs','Grammar & communication','ich -e, du -st, er/sie -t','Regular verbs often use endings -e, -st, -t, -en. For lernen: ich lerne, du lernst, er lernt, wir lernen.','क्रियामा व्यक्ति अनुसार -e, -st, -t आदि अन्त्य बदलिन्छ।','Ich lerne Deutsch. Du lernst Englisch.','I learn German. You learn English.','म जर्मन सिक्छु। तिमी अङ्ग्रेजी सिक्छौ।',
'lernen|learn|सिक्नु;machen|do / make|गर्नु;spielen|play|खेल्नु;kaufen|buy|किन्नु;fragen|ask|सोध्नु;hören|hear|सुन्नु;wohnen|live|बस्नु',
'Anna lernt Deutsch, aber Ben lernt Spanisch.|Which language does Anna learn?|German|Spanish|French|0',
'Ich spiele Fußball. Meine Schwester spielt Tennis.|What does the speaker play?|Football|Tennis|Basketball|0',
'Write three sentences using different verb subjects.|Ich lerne Deutsch. Du spielst Tennis. Wir wohnen hier.',
'Say what you and a friend do each day.|Ich lerne Deutsch. Mein Freund arbeitet.', 'ikh LEHR-nuh DOITCH doo LEHRNST ENG-lish','इख लेर्ने डोइच डू लेर्न्स्ट एङ्ग्लिश')
add('sein & haben','Grammar & communication','Irregular present verbs','Sein: ich bin, du bist, er ist, wir sind. Haben: ich habe, du hast, er hat, wir haben.','sein र haben महत्त्वपूर्ण अनियमित क्रिया हुन्।','Ich bin müde, aber ich habe Zeit.','I am tired, but I have time.','म थाकेको छु तर मसँग समय छ।',
'sein|to be|हुनु;haben|to have|हुनु / साथमा हुनु;bin|am|छु;bist|are (du)|छौ;ist|is|छ;habe|have (ich)|मसँग छ;hat|has (er/sie)|उससँग छ',
'Leo ist müde. Er hat heute keinen Unterricht.|How does Leo feel?|Tired|Happy|Hungry|0',
'Ich habe zwei Kinder. Meine Kinder sind sechs und acht Jahre alt.|How many children?|Two|Three|One|0',
'Write two sentences with sein and two with haben.|Ich bin Student. Meine Schwester ist nett. Ich habe Zeit. Wir haben ein Auto.',
'Answer: Sind Sie Student? Haben Sie Geschwister?|Ja, ich bin Student. Ja, ich habe eine Schwester.', 'ikh bin MYOO-duh ah-ber ikh HAH-buh tsait','इख बिन म्यूडे आबेर इख हाबे त्साइट')
add('Questions & word order','Grammar & communication','W-questions / yes-no questions','W-questions start with wo, wer, wie, was, wann, warum. Yes/no questions begin with the conjugated verb.','प्रश्नमा Wo, Wer, Wie, Was प्रयोग हुन्छ। हो/होइन प्रश्न क्रियाबाट सुरु हुन्छ।','Wo wohnst du? Wohnst du in Berlin?','Where do you live? Do you live in Berlin?','तिमी कहाँ बस्छौ? के तिमी बर्लिनमा बस्छौ?',
'wer|who|को;was|what|के;wo|where|कहाँ;wann|when|कहिले;wie|how|कसरी;warum|why|किन;welche|which|कुन',
'Frage: Wann fährt der Bus? Antwort: Um acht Uhr.|When does the bus leave?|At eight|At nine|At seven|0',
'Wo wohnen Sie? – Ich wohne in Köln.|What information was requested?|Place of residence|Age|Name|0',
'Write three questions using wo, wie and wann.|Wo wohnst du? Wie heißt du? Wann beginnt der Kurs?',
'Ask a friend about their name, city and age.|Wie heißt du? Wo wohnst du? Wie alt bist du?', 'voh VOHNST doo VOHNST doo in behr-LEEN','वो वोन्स्ट डू वोन्स्ट डू इन बेर्लिन')
add('Negation: nicht & kein','Grammar & communication','Negation in simple sentences','Use kein with a noun that would take ein, and nicht to negate many verbs/adjectives. Ich habe kein Auto. Ich arbeite nicht.','ein प्रकारको संज्ञा नकार्दा kein, क्रिया नकार्दा nicht।','Ich habe kein Auto und arbeite heute nicht.','I do not have a car and am not working today.','मसँग गाडी छैन र आज काम गर्दिनँ।',
'nicht|not|होइन / नगर्नु;kein|no / not a|कुनै छैन;keine|no (feminine/plural)|छैन;nie|never|कहिल्यै होइन;heute|today|आज;leider|unfortunately|दुर्भाग्यवश;doch|yes (contradicting no)|हो नि',
'Bitte kommen Sie heute nicht. Der Kurs fällt aus.|What is cancelled?|The course|The train|The concert|0',
'Haben Sie Milch? – Nein, leider haben wir keine Milch.|What is unavailable?|Milk|Bread|Tea|0',
'Write two negative sentences with nicht and kein.|Ich trinke keinen Kaffee. Ich komme heute nicht.',
'Say something you do not have and do not do.|Ich habe kein Fahrrad. Ich rauche nicht.', 'ikh HAH-buh kain OW-toh unt AR-bai-tuh HOY-tuh nikht','इख हाबे काइन आउटो उन्ट आरबाइटे होइटे निख्ट')
add('Food & drinks','Everyday life','mögen / möchten','Ich mag Tee means I like tea. Ich möchte Tee means I would like tea and is polite for ordering.','Ich mag = मलाई मन पर्छ; Ich möchte = मलाई चाहिन्छ (विनम्र)।','Ich möchte Brot und einen Tee, bitte.','I would like bread and a tea, please.','मलाई रोटी र एक कप चिया दिनुहोस्।',
'das Brot|bread|रोटी;das Wasser|water|पानी;der Tee|tea|चिया;der Kaffee|coffee|कफी;die Milch|milk|दूध;der Reis|rice|भात;der Apfel|apple|स्याउ;das Frühstück|breakfast|बिहानको खाना',
'Im Café kostet der Tee zwei Euro und der Kaffee drei Euro.|Which drink costs three euros?|Coffee|Tea|Water|0',
'Möchten Sie Wasser oder Saft? – Wasser, bitte.|What is ordered?|Water|Juice|Coffee|0',
'Write a simple shopping list and an order.|Ich brauche Brot, Milch und Äpfel. Ich möchte einen Tee, bitte.',
'Order food and drink politely.|Ich möchte Reis und ein Wasser, bitte.', 'ikh MURKH-tuh BROHT unt AI-nen teh BIT-tuh','इख म्यौख्टे ब्रोट उन्ट आइनन टे बिट्टे')
add('At the restaurant','Everyday life','Ordering politely','Use Ich hätte gern ... or Ich möchte ... for polite orders. Ask Die Rechnung, bitte to pay.','अर्डर गर्दा Ich hätte gern / Ich möchte प्रयोग हुन्छ।','Ich hätte gern eine Suppe und die Rechnung, bitte.','I would like a soup and the bill, please.','मलाई सुप र बिल दिनुहोस्।',
'die Speisekarte|menu|मेनु;die Rechnung|bill|बिल;die Suppe|soup|सुप;das Essen|food|खाना;bestellen|to order|अर्डर गर्नु;bezahlen|to pay|तिर्नु;lecker|tasty|मीठो',
'Das Restaurant ist täglich von 12 bis 22 Uhr geöffnet.|When does the restaurant close?|22:00|12:00|20:00|0',
'Ich nehme die Suppe. Und zum Trinken ein Wasser, bitte.|What food is ordered?|Soup|Salad|Bread|0',
'Write a short restaurant dialogue with an order.|Guten Abend. Ich möchte eine Suppe, bitte. Danke. Die Rechnung, bitte.',
'Role-play: order food and ask for the bill.|Ich hätte gern eine Suppe. Die Rechnung, bitte.', 'ikh HET-tuh gehrn AI-nuh ZOOP-uh','इख हेट्टे गेर्न आइने जुपे')
add('Shopping & prices','Everyday life','Accusative: einen / eine / ein','A masculine direct object changes ein → einen: Ich kaufe einen Apfel. Feminine eine and neuter ein stay unchanged.','कर्ममा पुरुषलिङ्ग ein → einen हुन सक्छ।','Ich kaufe einen Apfel und eine Banane.','I buy an apple and a banana.','म स्याउ र केरा किन्छु।',
'kaufen|buy|किन्नु;kosten|cost|मूल्य पर्नु;billig|cheap|सस्तो;teuer|expensive|महँगो;der Preis|price|मूल्य;das Geld|money|पैसा;der Laden|shop|पसल;die Kasse|checkout|काउन्टर',
'Der Pullover kostet 25 Euro. Heute gibt es fünf Euro Rabatt.|What is the discount?|5 euros|25 euros|10 euros|0',
'Entschuldigung, was kostet das Brot? – Zwei Euro fünfzig.|How much is the bread?|€2.50|€5.20|€3.00|0',
'Write a question about a price and an answer.|Was kostet der Apfel? Er kostet einen Euro.',
'Ask for two items and their prices.|Ich möchte einen Apfel und eine Banane. Was kostet das?', 'ikh KOW-fuh AI-nen AP-fel unt AI-nuh bah-NAH-nuh','इख काउफे आइनन आप्फल उन्ट आइने बनाने')
add('Clothes, colors & sizes','Everyday life','Adjectives for basic description','Describe objects with simple adjectives: Die Jacke ist blau. For clothing size ask Welche Größe haben Sie?','रङ र आकारले सामानको वर्णन गर्न सकिन्छ।','Die rote Jacke ist zu klein.','The red jacket is too small.','रातो ज्याकेट धेरै सानो छ।',
'die Jacke|jacket|ज्याकेट;die Hose|trousers|पाइन्ट;das Hemd|shirt|सर्ट;die Schuhe|shoes|जुत्ता;rot|red|रातो;blau|blue|निलो;schwarz|black|कालो;die Größe|size|साइज',
'Heute sind alle blauen Jacken 20 Prozent günstiger.|Which clothing is discounted?|Blue jackets|Black shoes|Red trousers|0',
'Ich brauche Schuhe in Größe 42. Haben Sie schwarze Schuhe?|What color is requested?|Black|Blue|Red|0',
'Write a description of clothing you want to buy.|Ich möchte eine schwarze Jacke in Größe M.',
'Ask for a shirt in a size and color.|Haben Sie ein blaues Hemd in Größe M?', 'dee ROH-tuh YAK-uh ist tsoo klain','दी रोटे याके इस्ट त्सू क्लाइन')
add('Daily routines','Everyday life','Time adverbs and verb-second','In statements the conjugated verb is usually in position 2: Am Morgen trinke ich Kaffee.','सामान्य वाक्यमा रूप बदलिएको क्रिया दोस्रो स्थानमा हुन्छ।','Um sieben Uhr stehe ich auf.','I get up at seven o’clock.','म सात बजे उठ्छु।',
'aufstehen|get up|उठ्नु;duschen|take a shower|नुहाउनु;frühstücken|eat breakfast|बिहानको खाना खानु;arbeiten|work|काम गर्नु;schlafen|sleep|सुत्नु;am Morgen|in the morning|बिहान;am Abend|in the evening|साँझ',
'Lisa arbeitet von acht bis sechzehn Uhr. Danach geht sie nach Hause.|When does Lisa finish work?|16:00|08:00|18:00|0',
'Ich stehe um sechs Uhr auf. Um sieben frühstücke ich.|When does the speaker get up?|06:00|07:00|08:00|0',
'Write your daily routine with four time expressions.|Um sieben stehe ich auf. Um acht frühstücke ich. Um neun lerne ich. Um elf schlafe ich.',
'Describe your morning in three sentences.|Ich stehe um sieben Uhr auf. Dann dusche ich. Danach frühstücke ich.', 'oom ZEE-ben oor SHTEH-uh ikh owf','उम जीबन उर श्टेए इख आउफ')
add('Separable verbs','Everyday life','Verb prefix moves to the end','With aufstehen the prefix auf moves to sentence end: Ich stehe früh auf. In an infinitive it stays attached.','aufstehen जस्ता क्रियाको उपसर्ग वाक्यको अन्त्यमा जान्छ।','Ich rufe dich heute Abend an.','I will call you this evening.','म आज साँझ तिमीलाई फोन गर्छु।',
'anrufen|to call|फोन गर्नु;aufstehen|get up|उठ्नु;einkaufen|shop|किनमेल गर्नु;fernsehen|watch television|टिभी हेर्नु;mitkommen|come along|सँगै आउनु;an|on (prefix)|क्रियाको उपसर्ग;auf|up (prefix)|क्रियाको उपसर्ग',
'Die Mutter ruft ihren Sohn um acht Uhr an.|When does the mother call?|08:00|18:00|07:00|0',
'Ich kaufe am Samstag ein. Am Sonntag bleibe ich zu Hause.|When does the speaker shop?|Saturday|Sunday|Monday|0',
'Write two sentences with separable verbs.|Ich stehe um sieben Uhr auf. Ich rufe meine Mutter an.',
'Ask a friend to come and say when you shop.|Kommst du mit? Ich kaufe morgen ein.', 'ikh ROO-fuh dikh HOY-tuh AH-bent an','इख रुफे दिख होइटे आबेन्ट आन')
add('Appointments & invitations','Situations','können / möchten / imperative requests','Use Können Sie ...? for polite requests and Hast du Zeit? for an informal invitation.','विनम्र अनुरोधका लागि Können Sie ...? प्रयोग गर्नुहोस्।','Hast du am Samstag Zeit?','Do you have time on Saturday?','तिमीसँग शनिबार समय छ?',
'der Termin|appointment|भेटघाट;die Einladung|invitation|निमन्त्रणा;Zeit haben|have time|समय हुनु;kommen|come|आउनु;treffen|meet|भेट्नु;absagen|cancel|रद्द गर्नु;verschieben|postpone|सार्नु',
'Liebe Sara, wir treffen uns am Freitag um 18 Uhr im Park.|Where is the meeting?|In the park|At the station|At a café|0',
'Hallo Tom. Kannst du am Sonntag um zehn Uhr kommen?|What day is proposed?|Sunday|Saturday|Monday|0',
'Write a 25–35 word invitation to a friend.|Hallo Anna, ich habe am Samstag Geburtstag. Komm bitte um 18 Uhr zu mir. Wir essen zusammen. Kannst du kommen? Liebe Grüße, Ravi.',
'Invite a friend and ask for a reply.|Hast du am Sonntag Zeit? Komm bitte um fünf Uhr. Geht das?', 'hast doo am ZAHMS-tahk tsait','हास्ट डू आम जाम्सटाक त्साइट')
add('Directions & transport','Situations','wohin? / nach / zu','Use nach with many cities/countries (nach Berlin), zu for a person or destination (zum Arzt).','सहरका लागि nach Berlin, व्यक्तिका लागि zum Arzt भन्न सकिन्छ।','Wie komme ich zum Bahnhof?','How do I get to the railway station?','म रेल स्टेसन कसरी पुग्छु?',
'der Bahnhof|railway station|रेल स्टेसन;der Bus|bus|बस;der Zug|train|रेल;das Ticket|ticket|टिकट;links|left|बायाँ;rechts|right|दायाँ;geradeaus|straight ahead|सिधा;die Haltestelle|bus stop|बस स्टप',
'Der Bus 12 fährt zum Bahnhof. Er hält vor der Schule.|Which bus goes to the station?|12|21|2|0',
'Gehen Sie geradeaus und dann nach links. Dort ist die Post.|Which way after going straight?|Left|Right|Back|0',
'Write short directions from your home to a nearby stop.|Gehen Sie geradeaus. Dann gehen Sie rechts. Die Haltestelle ist links.',
'Ask directions politely and repeat them.|Entschuldigung, wo ist der Bahnhof? Geradeaus und dann links? Danke!', 'vee KOM-uh ikh tsoom BAHN-hohf','वी कोमे इख त्सुम बान्होफ')
add('Places & local services','Situations','es gibt + accusative','Es gibt means there is/there are. Es gibt hier einen Supermarkt. Ask Wo gibt es ...?','Es gibt = यहाँ ... छ / छन्।','In meiner Stadt gibt es eine Apotheke.','In my town there is a pharmacy.','मेरो सहरमा एउटा औषधि पसल छ।',
'die Apotheke|pharmacy|औषधि पसल;die Post|post office|हुलाक;die Bank|bank|बैंक;der Supermarkt|supermarket|सुपरमार्केट;das Rathaus|town hall|नगरपालिका कार्यालय;die Schule|school|विद्यालय;das Krankenhaus|hospital|अस्पताल',
'Die Apotheke ist neben der Bank. Sie öffnet um 9 Uhr.|What is beside the bank?|Pharmacy|School|Hospital|0',
'Gibt es hier einen Supermarkt? – Ja, neben der Post.|Where is the supermarket?|By the post office|By the bank|By the park|0',
'Write which services are near your home.|Bei mir gibt es einen Supermarkt, eine Bank und eine Apotheke.',
'Ask where to find a pharmacy.|Entschuldigung, wo gibt es hier eine Apotheke?', 'in MAI-ner shtat gipt ess AI-nuh ah-poh-TEH-kuh','इन माइनर श्टाट गिब्ट एस आइने आपोटेके')
add('Health & at the doctor','Situations','mir tut ... weh','Use Mir tut der Kopf weh (my head hurts) or Ich habe Kopfschmerzen. Ask for an appointment politely.','दुखाइ बताउँदा mir tut ... weh प्रयोग हुन्छ।','Mir tut der Kopf weh. Ich brauche einen Termin.','My head hurts. I need an appointment.','मेरो टाउको दुख्छ। मलाई अपोइन्टमेन्ट चाहिन्छ।',
'der Arzt|doctor (male)|डाक्टर;die Ärztin|doctor (female)|महिला चिकित्सक;krank|ill|बिरामी;der Kopf|head|टाउको;der Bauch|stomach|पेट;der Schmerz|pain|दुखाइ;das Rezept|prescription|औषधि पर्चा',
'Die Praxis ist heute bis 16 Uhr geöffnet. Morgen ist sie geschlossen.|Until when is the office open?|16:00|18:00|12:00|0',
'Ich habe Fieber. Können Sie mir bitte heute einen Termin geben?|What does the caller want?|A doctor appointment|A hotel booking|A ticket|0',
'Write a short message requesting a doctor’s appointment.|Guten Tag, ich bin krank und habe Fieber. Haben Sie heute einen Termin für mich? Vielen Dank.',
'Explain one symptom and ask for help.|Guten Tag. Ich habe Kopfschmerzen. Ich brauche einen Termin.', 'meer toot dehr KOPF veh','मीर टूट देर कोप्फ वे')
add('Weather & seasons','Situations','es ist + adjective','Use Es ist kalt/warm/sonnig, or Es regnet. Weather sentences often start with es.','मौसममा Es ist kalt / Es regnet प्रयोग हुन्छ।','Heute ist es kalt und es regnet.','Today it is cold and raining.','आज चिसो छ र पानी परिरहेको छ।',
'der Sommer|summer|गर्मी;der Winter|winter|जाडो;der Frühling|spring|वसन्त;der Herbst|autumn|शरद;die Sonne|sun|घाम;der Regen|rain|वर्षा;kalt|cold|चिसो;warm|warm|न्यानो',
'Am Samstag ist es sonnig. Am Sonntag regnet es stark.|What is Saturday’s weather?|Sunny|Rainy|Snowy|0',
'Morgen sind es zehn Grad und es regnet.|How is the weather tomorrow?|Rainy|Sunny|Hot|0',
'Write a short weather report for today and tomorrow.|Heute ist es warm und sonnig. Morgen regnet es.',
'Describe the weather and your favorite season.|Heute ist es kalt. Ich mag den Sommer.', 'HOY-tuh ist ess kalt unt ess REHG-net','होइटे इस्ट एस काल्ट उन्ट एस रेग्नेट')
add('Free time & hobbies','Situations','gern / lieber / am liebsten','Use gern after a verb for liking an activity. Lieber means prefer. Am liebsten means like most.','gern = गर्न मन पर्छ; lieber = बढी मन पर्छ।','Ich lese gern und spiele manchmal Fußball.','I like reading and sometimes play football.','मलाई पढ्न मन पर्छ र कहिलेकाहीँ फुटबल खेल्छु।',
'das Hobby|hobby|रुचि;lesen|read|पढ्नु;schwimmen|swim|पौडिनु;tanzen|dance|नाच्नु;die Musik|music|सङ्गीत;das Kino|cinema|सिनेमा;das Wochenende|weekend|सप्ताहन्त',
'Max geht samstags ins Kino. Sonntags liest er zu Hause.|What does Max do on Sunday?|Read at home|Go to cinema|Go swimming|0',
'Ich spiele gern Tennis, aber meine Freundin schwimmt lieber.|What does the friend prefer?|Swimming|Tennis|Reading|0',
'Write three short sentences about your hobbies.|Ich lese gern Bücher. Ich höre Musik. Am Wochenende spiele ich Fußball.',
'Ask a friend about hobbies and share yours.|Was machst du gern? Ich höre gern Musik.', 'ikh LEH-zuh gehrn unt SHPEE-luh MANCH-mahl FOOSS-ball','इख लेजे गेर्न उन्ट श्पीले मान्खमाल फुसबाल')
add('Modal verbs & requests','Situations','können / müssen / wollen / dürfen','After a modal verb, another verb stays in the infinitive at the end: Ich muss heute arbeiten.','Modal क्रियापछि अर्को क्रिया वाक्यको अन्त्यमा मूल रूपमा आउँछ।','Ich kann heute kommen, aber ich muss früh gehen.','I can come today, but I must leave early.','म आज आउन सक्छु तर चाँडै जानुपर्छ।',
'können|can|सक्नु;müssen|must|गर्नुपर्नु;wollen|want|चाहनु;dürfen|be allowed|अनुमति पाउनु;sollen|should|गर्नुपर्ने;helfen|help|मद्दत गर्नु;bitten|request|अनुरोध गर्नु',
'Bitte seien Sie pünktlich. Sie müssen um acht Uhr da sein.|What time must the person arrive?|08:00|09:00|10:00|0',
'Können Sie bitte das Fenster öffnen? – Ja, natürlich.|What is requested?|Open the window|Close the door|Call a taxi|0',
'Write three requests with modal verbs.|Können Sie mir helfen? Ich muss heute arbeiten. Darf ich hier sitzen?',
'Make a polite request and ask permission.|Können Sie mir bitte helfen? Darf ich hier sitzen?', 'ikh kan HOY-tuh KOM-en ah-ber ikh moos froo GEH-en','इख कान होइटे कोमेन आबेर इख मुस फ्रु गेएन')
add('Hotel & travel','Situations','ich möchte + booking','Request a room with Ich möchte ein Zimmer buchen. Provide number of nights and a date.','कोठा बुक गर्दा Ich möchte ein Zimmer buchen भन्नुहोस्।','Ich möchte ein Zimmer für zwei Nächte buchen.','I would like to book a room for two nights.','म दुई रातका लागि कोठा बुक गर्न चाहन्छु।',
'das Hotel|hotel|होटल;das Zimmer|room|कोठा;die Nacht|night|रात;buchen|book|बुक गर्नु;der Reisepass|passport|राहदानी;die Reservierung|reservation|बुकिङ;die Reise|trip|यात्रा',
'Hotel Alba: Einzelzimmer ab 60 Euro pro Nacht. Frühstück inklusive.|What is included?|Breakfast|Dinner|Transport|0',
'Guten Tag, ich habe ein Zimmer für zwei Nächte reserviert.|How many nights?|Two|Three|One|0',
'Write a short hotel booking request.|Guten Tag, ich möchte ein Zimmer für zwei Nächte buchen. Haben Sie am Montag ein Zimmer frei? Vielen Dank.',
'Book a room and state how many nights.|Ich möchte ein Zimmer für zwei Nächte, bitte.', 'ikh MURKH-tuh ain TSIM-er fyoor tsvai NEKH-tuh BOO-khen','इख म्यौख्टे आइन त्सिमर फ्युर त्स्वाइ नेख्टे बुखन')
add('Past events: first steps','Situations','Perfekt: haben / sein + participle','Recognize common Perfekt forms in simple conversation: Ich habe gelernt. Ich bin nach Hause gegangen. Many movement verbs use sein.','साधारण बितेका घटना: ich habe gelernt, ich bin gegangen।','Gestern habe ich Deutsch gelernt.','Yesterday I studied German.','हिजो मैले जर्मन पढेँ।',
'gestern|yesterday|हिजो;letzte Woche|last week|गत हप्ता;gemacht|done / made|गरेको;gelernt|learned|सिकेको;gegessen|eaten|खाएको;gegangen|gone|गएको;gefahren|travelled / driven|यात्रा गरेको',
'Gestern hat Tim gekocht. Am Abend hat er Deutsch gelernt.|What did Tim do in the evening?|Studied German|Cooked|Went swimming|0',
'Ich bin gestern nach Hamburg gefahren und habe dort Freunde besucht.|Where did the speaker travel?|Hamburg|Berlin|Bonn|0',
'Write two simple sentences about yesterday.|Gestern habe ich Deutsch gelernt. Danach habe ich gekocht.',
'Say what you did yesterday.|Gestern habe ich gearbeitet und Musik gehört.', 'GEHS-tern HAH-buh ikh DOITCH geh-LEHRNT','गेस्टर्न हाबे इख डोइच गेलेर्न्ट')
add('Short messages & email','Exam preparation','Hallo / Liebe Grüße / Sie','An informal message uses Hallo ... and Liebe Grüße. A formal message often begins Guten Tag or Sehr geehrte ... and ends Mit freundlichen Grüßen.','अनौपचारिक पत्रमा Hallo / Liebe Grüße; औपचारिकमा Guten Tag प्रयोग गर्नुहोस्।','Hallo Anna, ich kann heute nicht kommen.','Hi Anna, I cannot come today.','हेलो अन्ना, म आज आउन सक्दिनँ।',
'die Nachricht|message|सन्देश;die E-Mail|email|इमेल;schreiben|write|लेख्नु;senden|send|पठाउनु;die Adresse|address|ठेगाना;Liebe Grüße|best wishes|शुभकामना सहित;vielen Dank|many thanks|धेरै धन्यवाद',
'Hallo Sara, der Deutschkurs fällt morgen aus. Wir sehen uns am Montag. Liebe Grüße, Mia.|When is the next meeting?|Monday|Tomorrow|Sunday|0',
'Hallo Ben, ich bin krank und komme heute nicht zur Arbeit.|Why is the speaker absent?|Illness|Vacation|Travel|0',
'Write a 30-word message canceling an appointment and suggesting a new time.|Hallo Ali, leider kann ich morgen nicht kommen. Ich bin krank. Können wir uns am Freitag um 15 Uhr treffen? Bitte schreib mir. Liebe Grüße, Mira.',
'Tell a friend that you cannot come and suggest another day.|Leider kann ich heute nicht kommen. Geht es morgen?', 'HAH-loh AN-ah ikh kan HOY-tuh nikht KOM-en','हालो आना इख कान होइटे निख्ट कोमेन')
add('Forms & personal data','Exam preparation','Form fields and basic facts','Be able to fill in Vorname, Nachname, Geburtsdatum, Anschrift, Land and Telefonnummer. Do not share sensitive real information for practice.','फारममा नाम, जन्ममिति, ठेगाना, फोन लेख्ने अभ्यास गर्नुहोस्।','Mein Vorname ist Maya, mein Nachname ist Rai.','My first name is Maya, my surname is Rai.','मेरो पहिलो नाम माया र थर राई हो।',
'der Vorname|first name|नाम;der Nachname|surname|थर;das Geburtsdatum|date of birth|जन्ममिति;die Anschrift|address|ठेगाना;die Postleitzahl|postal code|हुलाक कोड;die Unterschrift|signature|हस्ताक्षर;ledig|single (marital status)|अविवाहित',
'Anmeldeformular: Vorname Eva, Nachname Sommer, Wohnort Bonn.|Where does Eva live?|Bonn|Berlin|Hamburg|0',
'Bitte schreiben Sie Ihren Namen und Ihre Telefonnummer auf das Formular.|What must be written?|Name and telephone|Age and hobby|Price and city|0',
'Complete a fictional form with name, city, birth date and phone number.|Vorname: Mina; Nachname: Shah; Wohnort: Bonn; Geburtsdatum: 03.05.2000; Telefon: 01234.',
'Practice answering a request for your name, city and age (use fictional details).|Ich heiße Mia. Ich wohne in Berlin. Ich bin 24 Jahre alt.', 'main FOR-nah-muh ist MAH-yah','माइन फोरनामे इस्ट माया')
add('Reading signs & notices','Exam preparation','Read practical notices','Scan short signs for place, dates, times, price and prohibitions. Look for words such as geschlossen, geöffnet, Eintritt frei.','सूचनामा समय, स्थान, मिति र निषेध पहिचान गर्नुहोस्।','Die Bibliothek ist heute geschlossen.','The library is closed today.','पुस्तकालय आज बन्द छ।',
'geöffnet|open|खुला;geschlossen|closed|बन्द;der Eingang|entrance|प्रवेशद्वार;der Ausgang|exit|निकास;verboten|forbidden|निषेध;der Eintritt|admission|प्रवेश;frei|free / available|निःशुल्क / खाली',
'Museum: Montag geschlossen. Dienstag bis Sonntag: 10–17 Uhr. Eintritt: 5 Euro.|When is the museum closed?|Monday|Tuesday|Sunday|0',
'Achtung! Der Zug nach Köln fährt heute von Gleis fünf.|Which platform?|Five|Three|Six|0',
'Write a brief sign with opening hours and an entry price.|Geöffnet: Montag bis Freitag, 9–17 Uhr. Eintritt frei.',
'Explain a sign: Heute geschlossen.|Das Geschäft ist heute geschlossen.', 'dee bee-blee-oh-TEHK ist HOY-tuh geh-SHLOSS-en','दी बिब्लिओटेक इस्ट होइटे गेश्लोसन')
add('Listening: everyday messages','Exam preparation','Listen for details, not every word','Listen twice if needed. Focus on one detail: time, price, name, place, or reason. Device speech is practice, not authentic Goethe audio.','सबै शब्द बुझ्नुपर्दैन। समय, मिति, स्थान र मूल्य जस्ता मुख्य जानकारी सुन्नुहोस्।','Der Termin ist nicht um acht, sondern um neun.','The appointment is not at eight but at nine.','अपोइन्टमेन्ट आठ होइन, नौ बजे हो।',
'die Durchsage|announcement|घोषणा;die Nachricht|message|सन्देश;hören|listen / hear|सुन्नु;wiederholen|repeat|दोहोर्‍याउनु;langsam|slowly|बिस्तारै;noch einmal|once more|फेरि एक पटक;die Information|information|जानकारी',
'Bitte beachten Sie: Das Büro öffnet heute erst um zehn Uhr.|When does the office open?|10:00|09:00|11:00|0',
'Achtung, eine Durchsage: Der Zug nach Bonn fährt heute zwanzig Minuten später.|What is different?|The train is late|The train is cancelled|The train is early|0',
'Write one sentence reporting an appointment change.|Der Termin ist heute um neun Uhr, nicht um acht Uhr.',
'Ask someone politely to repeat an announcement.|Entschuldigung, können Sie das bitte wiederholen?', 'dehr tehr-MEEN ist nikht oom akht ZON-dern oom noin','देर टेर्मिन इस्ट निख्ट उम आख्ट जोन्डर्न उम नोइन')
add('Speaking: introduction & requests','Exam preparation','A1 speaking task routines','Practice three speaking types: introduce yourself, ask/answer simple questions, make/respond to a polite request. Partner practice is important.','परिचय दिनुहोस्, सरल प्रश्न सोध्नुहोस्, अनि विनम्र अनुरोध गर्नुहोस्।','Können Sie mir bitte das Buch geben?','Could you please give me the book?','के तपाईं मलाई किताब दिन सक्नुहुन्छ?',
'vorstellen|introduce|परिचय दिनु;fragen|ask|सोध्नु;antworten|answer|जवाफ दिनु;bitten|request|अनुरोध गर्नु;geben|give|दिनु;wiederholen|repeat|दोहोर्‍याउनु;Entschuldigung|excuse me / sorry|माफ गर्नुहोस्',
'Guten Tag. Ich heiße Sara, komme aus Nepal und wohne in Bonn.|Where does Sara live?|Bonn|Nepal|Köln|0',
'Können Sie mir bitte das Handy geben? – Ja, gern.|What is requested?|The phone|The bag|The book|0',
'Write your self-introduction with name, country, city, language and hobby.|Ich heiße Sara. Ich komme aus Nepal. Ich wohne in Bonn. Ich spreche Nepali und Deutsch. Ich lese gern.',
'Introduce yourself, ask a question, and make a polite request.|Ich heiße Samir. Wo wohnen Sie? Können Sie mir bitte helfen?', 'KURN-en zee meer BIT-tuh das BOOKH GEH-ben','क्योनन जी मीर बिट्टे दास बुख गेवन')
add('A1 review & next steps','Exam preparation','Check all four skills','A1 preparation involves understanding short everyday German, reading simple notices, completing forms and messages, and exchanging basic information.','A1 तयारीमा सुन्ने, पढ्ने, लेख्ने र बोल्ने चारै सीप चाहिन्छ।','Ich kann mich vorstellen und einfache Fragen stellen.','I can introduce myself and ask simple questions.','म आफ्नो परिचय दिन र सरल प्रश्न सोध्न सक्छु।',
'die Prüfung|exam|परीक्षा;das Hören|listening|श्रवण;das Lesen|reading|पठन;das Schreiben|writing|लेखन;das Sprechen|speaking|बोलाइ;üben|practice|अभ्यास गर्नु;verstehen|understand|बुझ्नु',
'Prüfung am Dienstag: Hören 9:00 Uhr, Lesen 9:30 Uhr. Bitte um 8:45 Uhr kommen.|When must candidates arrive?|08:45|09:00|09:30|0',
'Bitte bringen Sie Ihren Ausweis mit. Die Prüfung beginnt um neun Uhr.|What must participants bring?|ID|A book|A ticket|0',
'Write a short email explaining you will be late and asking for information.|Guten Tag, leider komme ich zehn Minuten später. Wann beginnt der Kurs? Vielen Dank. Mit freundlichen Grüßen, Mina.',
'Practice a full A1 self-introduction and two everyday questions.|Guten Tag. Ich heiße Mina. Ich komme aus Nepal. Ich wohne in Bonn. Ich lerne Deutsch. Wie heißen Sie? Was machen Sie gern?', 'ikh kan mikh FOR-shtel-en unt AI-nfah-khuh FRAH-gen SHTEL-en','इख कान मिख फोर्श्टेलन उन्ट आइनफाखे फ्रागन श्टेलन')

# Rotate answer positions consistently so learners cannot pass by always choosing choice one.
for lesson in units:
 for skill,offset in [('reading',0),('listening',1)]:
  item=lesson[skill]
  new_index=(lesson['number']+offset)%3
  correct=item['choices'][item['answer']]
  others=[x for i,x in enumerate(item['choices']) if i!=item['answer']]
  others.insert(new_index,correct)
  item['choices']=others
  item['answer']=new_index
assert len(units)==36, len(units)
assert sum(len(u['vocab']) for u in units)>=200
for u in units:
 for field in ('reading','listening'):
  a=u[field];assert 0<=a['answer']<=2
  assert len(a['choices'])==3
  assert all(a['choices']),u['title']

# A small original exam-style sampler: these are self-check exercises, not official Goethe questions.
exam={
 'disclaimer':'Independent original practice; not a Goethe exam and not an official score. For a realistic simulation, use the linked Goethe official model exam and authentic recordings.',
 'reading': [u['reading'] for u in units[17:27]],
 'listening': [u['listening'] for u in units[9:19]],
 'writing': [units[i]['writing'] for i in (20,26,27)],
 'speaking': [units[i]['speaking'] for i in (2,23,28)]
}
content={'version':1,'units':units,'exam':exam,'sources':[
 {'title':'Goethe-Zertifikat A1: Start Deutsch 1 — exam description','url':'https://www.goethe.de/ins/de/en/prf/gzsd1.cfm'},
 {'title':'Goethe-Institut — A1 official practice materials & vocabulary list','url':'https://www.goethe.de/en/spr/prf/ueb/pa1.html'},
 {'title':'Council of Europe — CEFR A1 descriptors','url':'https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors-search'}
]}
out=Path(__file__).with_name('a1-course-data.js')
out.write_text('/* Original DeutschDaily course content; aligned to public A1 objectives, not endorsed by Goethe-Institut. */\nwindow.DEUTSCH_A1 = '+json.dumps(content,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf8')
print('Built:',len(units),'units,',sum(len(u['vocab']) for u in units),'vocabulary entries,',len(exam['reading']),'reading exam practice,',len(exam['listening']),'listening exam practice')
