/* DeutschDaily A1 productive-skill scaffolds: independently authored and reviewed as
   original teaching prompts. Not a grammar checker, pronunciation recognizer, or Goethe score. */
(() => {
'use strict';
const writingGoals={
 'a1-01':['Say your name using a short German sentence.','Spell the name clearly, letter by letter.'],
 'a1-02':['Use a polite greeting suitable for a teacher.','End with a polite goodbye.'],
 'a1-03':['Introduce your name.','Give your country or home town.','State another fact about yourself.'],
 'a1-04':['State your home country.','Name the place where you live.','Name at least one language.'],
 'a1-05':['Write a price using German number words.','Write a short fictional telephone number using German words.'],
 'a1-06':['Mention a weekday.','Give a clear appointment time.'],
 'a1-07':['Name family members.','Describe a relationship or fact.','Aim for four short sentences.'],
 'a1-08':['Introduce one person.','State an age or another description.'],
 'a1-09':['Say what you study or where you work.','Use at least three short statements.'],
 'a1-10':['Say where you live.','Describe your rooms or home.','Aim for three statements.'],
 'a1-11':['Write one short sentence using der.','Write one with die.','Write one with das.'],
 'a1-12':['Use ich in a present-tense statement.','Use du or er/sie.','Use wir or another subject.'],
 'a1-13':['Use sein in two statements.','Use haben in two statements.'],
 'a1-14':['Ask a question using wo.','Ask a question using wie.','Ask a question using wann.'],
 'a1-15':['Write one sentence with nicht.','Write one sentence with kein or keine.'],
 'a1-16':['Include a simple shopping list.','Add a polite food or drink order.'],
 'a1-17':['Write a customer’s order.','Write a reply from the waiter or waitress.'],
 'a1-18':['Ask how much an item costs.','Give a price in your answer.'],
 'a1-19':['Describe an item of clothing.','Specify its colour and size.'],
 'a1-20':['Describe your daily routine in order.','Include four times or time-related expressions.'],
 'a1-21':['Use two different separable verbs.','Put the separable prefix at the end of each main clause.'],
 'a1-22':['Invite a friend and say what the event is.','Include a day and time.','Use an appropriate greeting and ending.'],
 'a1-23':['Start from a clear location.','Give at least two directions or turns.'],
 'a1-24':['Name local services near you.','Describe where at least one is located.'],
 'a1-25':['Explain why you need a doctor’s appointment.','Ask politely about a date or time.'],
 'a1-26':['Describe the weather today.','Describe tomorrow’s weather.'],
 'a1-27':['Name an activity you enjoy.','State when or with whom you do it.','Use three short sentences.'],
 'a1-28':['Write three polite requests or permissions.','Use at least two modal verb patterns.'],
 'a1-29':['Request a room politely.','Mention a date or number of nights.'],
 'a1-30':['Describe two things that happened yesterday.','Check the past-tense auxiliary and participle.'],
 'a1-31':['Explain that an appointment is cancelled.','Suggest a new day or time.','Use a polite greeting and closing.'],
 'a1-32':['Complete each requested form field with fictional details.','Check numbers, dates and spelling.'],
 'a1-33':['Write a clear public notice or sign.','Include opening hours and the entry price.'],
 'a1-34':['Explain that an appointment has changed.','State the new date or time.'],
 'a1-35':['Introduce your name, country and town.','Name a language and a hobby.'],
 'a1-36':['Explain politely why you will be late.','Ask for the missing information.','Add an appropriate greeting and ending.']
};
const dialogues={
 'a1-mock-1':[
  {title:'Meet a new classmate',turns:[
   ['Wie heißen Sie?','What is your name?','तपाईंको नाम के हो?','Ich heiße Asha.'],
   ['Woher kommen Sie?','Where are you from?','तपाईं कहाँबाट आउनुभएको हो?','Ich komme aus Nepal.'],
   ['Was machen Sie gern in Ihrer Freizeit?','What do you enjoy in your free time?','तपाईं फुर्सदमा के गर्न मन पराउनुहुन्छ?','Ich lese gern Bücher.']
  ]},
  {title:'Ask about a German course',turns:[
   ['Was möchten Sie wissen?','What would you like to know?','तपाईं के जान्न चाहनुहुन्छ?','Wann beginnt der Deutschkurs?'],
   ['Der Kurs beginnt um neun Uhr. Haben Sie noch eine Frage?','The course starts at nine. Do you have another question?','कक्षा नौ बजे सुरु हुन्छ। अर्को प्रश्न छ?','In welchem Raum ist der Kurs?'],
   ['Der Kurs ist in Raum drei.','The course is in room three.','कक्षा कोठा तीनमा छ।','Vielen Dank!']
  ]},
  {title:'Ask for water politely',turns:[
   ['Guten Tag! Was möchten Sie?','Good day! What would you like?','नमस्कार! तपाईंलाई के चाहिन्छ?','Ich hätte gern ein Glas Wasser, bitte.'],
   ['Mit oder ohne Kohlensäure?','Sparkling or still?','ग्यास भएको वा नभएको?','Ohne Kohlensäure, bitte.'],
   ['Hier ist Ihr Wasser.','Here is your water.','यो तपाईंको पानी हो।','Vielen Dank!']
  ]}
 ],
 'a1-mock-2':[
  {title:'Introduce yourself and spell a name',turns:[
   ['Wie heißen Sie?','What is your name?','तपाईंको नाम के हो?','Ich heiße Suman Sharma.'],
   ['Können Sie Ihren Nachnamen bitte buchstabieren?','Could you spell your surname, please?','कृपया आफ्नो थरको हिज्जे भन्नुहुन्छ?','S-H-A-R-M-A.'],
   ['Wie alt sind Sie?','How old are you?','तपाईं कति वर्षको हुनुहुन्छ?','Ich bin vierundzwanzig Jahre alt.']
  ]},
  {title:'Buy a notebook',turns:[
   ['Guten Tag! Kann ich Ihnen helfen?','Hello! Can I help you?','नमस्कार! म सहयोग गर्न सक्छु?','Was kostet dieses Heft?'],
   ['Das Heft kostet zwei Euro.','The notebook costs two euros.','कापी दुई युरो पर्छ।','Gut, ich nehme ein Heft.'],
   ['Bitte schön. Möchten Sie noch etwas?','Here you are. Would you like anything else?','लिनुहोस्। अरू केही चाहिन्छ?','Nein, danke!']
  ]},
  {title:'Ask for a pen politely',turns:[
   ['Was brauchen Sie?','What do you need?','तपाईंलाई के चाहिन्छ?','Haben Sie bitte einen Stift für mich?'],
   ['Ja, hier bitte.','Yes, here you are.','हुन्छ, लिनुहोस्।','Vielen Dank!'],
   ['Gern geschehen!','You are welcome!','स्वागत छ!','Auf Wiedersehen!']
  ]}
 ]
};
window.DEUTSCH_PRODUCTIVE_GUIDES={writingGoals,dialogues};
})();