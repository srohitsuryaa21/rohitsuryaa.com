// All page copy, in English and German. Keep it plain and free of dashes.
export type Lang = 'en' | 'de';
export const langs: Lang[] = ['en', 'de'];

export const site = {
  email: 'Rohitsuryaas21@gmail.com',
  linkedin: 'https://www.linkedin.com/in/rohitsuryaa/',
  github: 'https://github.com/srohitsuryaa21',
  cvEn: '/resumes/Rohit-Suryaa-Saravanan-CV-EN.pdf',
  cvDe: '/resumes/Rohit-Suryaa-Saravanan-CV-DE.pdf',
};

/** Path of the same page in another language. */
export const localePath = (lang: Lang, path = '/') => (lang === 'en' ? path : `/de${path}`);

export const home = {
  en: {
    htmlTitle: 'Rohit Suryaa | Software Developer and Data Scientist',
    description: 'Rohit Suryaa Saravanan is a software developer and data scientist in Fulda, Germany, building backend systems, data pipelines, machine learning models and AI agents.',
    role: 'Software developer & data scientist',
    loaderWords: ['Code', 'Data', 'Models', 'Systems'],
    nav: { work: 'Work', about: 'About', experience: 'Experience', contact: 'Contact', home: 'Rohit Suryaa, back to top', switchLabel: 'Deutsch', switchText: 'DE' },
    hero: {
      sr: 'Rohit Suryaa Saravanan. I turn raw data into forecasts, AI agents, APIs, pipelines and decisions people trust.',
      before: 'I turn raw data', mid: 'into', after: 'people trust.',
      words: ['forecasts', 'AI agents', 'APIs', 'pipelines', 'decisions'],
      sub: 'Software developer & data scientist · Fulda, Germany',
      open: 'Open to opportunities',
      ctaWork: 'See the work', ctaContact: 'Get in touch',
      scroll: 'Scroll ↓', found: 'Signal found.',
    },
    about: {
      label: 'About me', aside: 'Engineer by training, researcher by habit',
      manifesto: 'I work where data science meets software engineering. I care about the model, and just as much about the API around it, the screen people use, the pipeline that ships it, and whether any of it actually helps.',
      cursor: 'Hallo!', caption: 'Chennai 13.08° N → Fulda 50.55° N',
      lead: 'I like the moment a hard problem starts to make sense.',
      body: [
        'I grew up in Chennai and studied Big Data Computer Science at SRM University. After that I spent a year building enterprise software for a US cybersecurity startup. Now I live in Fulda, Germany, where I’m doing an MSc in Data Science.',
        'Half my work is backend services and .NET applications. The other half is forecasting, machine learning and AI agents. The problems I enjoy most need both.',
      ],
      facts: [['Based', 'Fulda, Germany'], ['From', 'Chennai, India'], ['Languages', 'English · Deutsch'], ['Looking for', 'Software, backend, data and ML roles']],
      cv: [{ label: 'Résumé (English)', href: site.cvEn, lang: 'en' }, { label: 'Lebenslauf (Deutsch)', href: site.cvDe, lang: 'de' }],
    },
    stats: [
      { value: 96, suffix: '%', label: 'Prediction accuracy', note: 'Windmill pitch model, IEEE 2023', why: 'My blade pitch model was right 96% of the time. The error fell from 8.6% to 2.3%, and the turbine made 21% more power.' },
      { value: 110123, suffix: '', label: 'Orders analysed', note: 'Supply chain pipeline', why: 'Every order in a real online store dataset, cleaned and joined into one dashboard: 92.1% delivered on time, 881 sellers scored for risk.' },
      { value: 63, suffix: 'K', label: 'Flights modelled', note: 'Aviation delay model', why: 'US flights turned into a model of connected flights and airports. Chicago O’Hare averaged 21.1 minutes of delay, Atlanta 13.6.' },
      { value: 2, suffix: '', label: 'IEEE papers', note: 'Machine learning and blockchain finance', pad: true, why: 'Two peer reviewed IEEE papers: the windmill pitch model in 2023 and a blockchain platform for small farmers in 2024.' },
    ],
    work: {
      label: 'Selected work', title: 'Eight projects,', titleEm: 'all open source.',
      intro: 'Research, data engineering, AI agents and fintech. Each one started with a real question, and the code for every one of them is on GitHub.',
      index: 'Project index', cursor: 'View case', caseStudy: 'Case study', source: 'Source', more: 'More on GitHub',
      prev: 'Previous project', next: 'Next project',
    },
    principles: {
      label: 'How I work', aside: 'Three habits',
      items: [
        { title: 'Measure the outcome.', body: 'A model is only worth something if it improves a decision, a process or a product. Accuracy is where the conversation starts, not where it ends.' },
        { title: 'Build for production.', body: 'Clean APIs, logs you can read, code someone else can maintain. The boring parts are what let people trust the clever parts.' },
        { title: 'Explain it simply.', body: 'If the team cannot follow the reasoning, the work is not finished. I write and present for engineers and everyone else in the room.' },
      ],
    },
    experience: {
      label: 'Experience and education', title: 'Built across', titleEm: 'the stack.',
      timeline: [
        { when: '2025 to now', what: 'MSc Data Science', where: 'Hochschule Fulda · Germany', body: 'Statistics, machine learning and data engineering. Most of the projects on this page were built alongside the course.', tags: [] as string[] },
        { when: '2024 to 2025', what: 'Associate Software Developer', where: 'EigenSecure · USA, remote', body: 'Built enterprise software for a cybersecurity startup: backend APIs, access control and evidence workflows, compliance data, responsive interfaces and delivery automation, as part of an Agile team.', tags: ['C# / .NET', 'REST APIs', 'SQL', 'Agile'] },
        { when: '2020 to 2024', what: 'BTech, Big Data Computer Science', where: 'SRM University · Chennai, India', body: 'Distributed data, algorithms and software engineering. Both IEEE papers came out of these years.', tags: [] as string[] },
      ],
      papersLabel: 'IEEE publications',
      papers: ['Windmill pitch prediction with XGBoost and residual correction', 'A DeFi platform for transparent agricultural finance'],
      certsLabel: 'Certifications',
      certs: [{ name: 'IBM Data Science Professional', by: 'IBM, Coursera' }],
    },
    contact: {
      label: 'Contact', aside: 'Open to software, backend, data and ML roles in Germany or remote',
      kicker: 'Have a problem worth solving?', title: 'Let’s build something', titleEm: 'worth using.',
      write: ['Get in', 'touch'], writeCursor: 'Say hi', linkedinCursor: 'Connect',
      copy: 'Copy', copied: 'Copied ✓', copyFail: 'Press Ctrl+C to copy',
      rights: 'Rohit Suryaa Saravanan', time: 'Fulda local time', top: 'Back to top ↑',
    },
    network: {
      label: 'Toolkit', title: 'From raw data', titleEm: 'to results.', layerWord: 'Layer',
      layers: [
        { name: 'Raw data', title: 'It always starts messy.', body: 'Turbine logs, 110,123 online orders, 63,000 flights, race telemetry. Real data arrives incomplete, inconsistent and spread across places.', nodes: ['Sensors', 'Orders', 'Flights', 'Telemetry', 'Text'] },
        { name: 'Clean and shape', title: 'Most of the work happens here.', body: 'Joining tables, fixing types, building features. If the data is wrong, everything after it is wrong too.', nodes: ['Python', 'Pandas', 'SQL', 'PySpark'] },
        { name: 'Model', title: 'Then the patterns.', body: 'Forecasts, classifiers, and a second model to correct the first when one is not enough. Always checked against a simple baseline.', nodes: ['Scikit-learn', 'XGBoost', 'TensorFlow', 'Time series', 'Statistics'] },
        { name: 'Build', title: 'A model nobody can call is just a notebook.', body: 'Services, APIs and agents that put the model where people actually use it.', nodes: ['C# / .NET', 'Java', 'FastAPI', 'LangGraph', 'RAG'] },
        { name: 'Ship', title: 'Deployed, versioned, boring.', body: 'Containers, pipelines and databases that keep running when nobody is watching.', nodes: ['Azure', 'Docker', 'CI/CD', 'PostgreSQL', 'Git'] },
        { name: 'Results', title: 'The part people see.', body: 'More power from a wind turbine, a forecast under 20% error, an agent that never invents a price. That is the output layer.', nodes: ['+21% power', '18.5% MAPE', '63K flights', '2 IEEE papers'] },
      ],
    },
    numberLocale: 'en-US',
  },
  de: {
    htmlTitle: 'Rohit Suryaa | Softwareentwickler und Data Scientist',
    description: 'Rohit Suryaa Saravanan ist Softwareentwickler und Data Scientist in Fulda. Er entwickelt Backends, Datenpipelines, Modelle für Machine Learning und Agentensysteme.',
    role: 'Softwareentwickler & Data Scientist',
    loaderWords: ['Code', 'Daten', 'Modelle', 'Systeme'],
    nav: { work: 'Projekte', about: 'Über mich', experience: 'Erfahrung', contact: 'Kontakt', home: 'Rohit Suryaa, nach oben', switchLabel: 'English', switchText: 'EN' },
    hero: {
      sr: 'Rohit Suryaa Saravanan. Ich mache aus Rohdaten Prognosen, Agenten, APIs, Pipelines und Entscheidungen, denen man vertraut.',
      before: 'Ich mache Rohdaten', mid: 'zu', after: 'denen man vertraut.',
      words: ['Prognosen,', 'Agenten,', 'APIs,', 'Pipelines,', 'Entscheidungen,'],
      sub: 'Softwareentwickler & Data Scientist · Fulda',
      open: 'Offen für neue Aufgaben',
      ctaWork: 'Projekte ansehen', ctaContact: 'Kontakt aufnehmen',
      scroll: 'Scrollen ↓', found: 'Signal gefunden.',
    },
    about: {
      label: 'Über mich', aside: 'Informatiker von Haus aus, Forscher aus Gewohnheit',
      manifesto: 'Ich arbeite dort, wo Data Science auf Softwareentwicklung trifft. Mir ist das Modell wichtig, aber genauso die API drumherum, die Oberfläche, die Menschen benutzen, die Pipeline, die es ausliefert, und ob das Ganze am Ende wirklich hilft.',
      cursor: 'Hallo!', caption: 'Chennai 13,08° N → Fulda 50,55° N',
      lead: 'Ich mag den Moment, in dem ein schweres Problem plötzlich Sinn ergibt.',
      body: [
        'Aufgewachsen bin ich in Chennai, wo ich Big Data Computer Science an der SRM University studiert habe. Danach habe ich ein Jahr lang Unternehmenssoftware für ein Startup aus den USA entwickelt, das Sicherheitssoftware baut. Heute lebe ich in Fulda und mache dort meinen Master in Data Science.',
        'Die eine Hälfte meiner Arbeit sind Dienste im Backend und Anwendungen in .NET. Die andere Hälfte sind Prognosen, Machine Learning und Agentensysteme. Die Probleme, die mir am meisten Spaß machen, brauchen beides.',
      ],
      facts: [['Wohnort', 'Fulda, Deutschland'], ['Herkunft', 'Chennai, Indien'], ['Sprachen', 'Englisch · Deutsch'], ['Gesucht', 'Stellen in Software, Backend, Data und ML']],
      cv: [{ label: 'Lebenslauf (Deutsch)', href: site.cvDe, lang: 'de' }, { label: 'Résumé (English)', href: site.cvEn, lang: 'en' }],
    },
    stats: [
      { value: 96, suffix: ' %', label: 'Vorhersagegenauigkeit', note: 'Pitchmodell für Windkraftanlagen, IEEE 2023', why: 'Mein Modell für den Blattwinkel lag in 96 % der Fälle richtig. Der Fehler sank von 8,6 % auf 2,3 %, und die Turbine erzeugte 21 % mehr Strom.' },
      { value: 110123, suffix: '', label: 'Analysierte Bestellungen', note: 'Pipeline für Lieferketten', why: 'Jede Bestellung aus einem echten Onlineshop, bereinigt und in einem Dashboard vereint: 92,1 % pünktlich geliefert, 881 Verkäufer nach Risiko bewertet.' },
      { value: 63, suffix: 'K', label: 'Modellierte Flüge', note: 'Modell für Flugverspätungen', why: 'Flüge in den USA als Modell aus verbundenen Flügen und Flughäfen. Chicago O’Hare kam im Schnitt auf 21,1 Minuten Verspätung, Atlanta auf 13,6.' },
      { value: 2, suffix: '', label: 'Veröffentlichungen', note: 'IEEE, Machine Learning und Blockchain', pad: true, why: 'Zwei begutachtete Paper bei der IEEE: das Pitchmodell für Windräder 2023 und eine Plattform auf der Blockchain für Kleinbauern 2024.' },
    ],
    work: {
      label: 'Ausgewählte Projekte', title: 'Acht Projekte,', titleEm: 'alle Open Source.',
      intro: 'Forschung, Data Engineering, Agentensysteme und Fintech. Jedes Projekt begann mit einer echten Frage, und der Code zu allen liegt auf GitHub.',
      index: 'Projektübersicht', cursor: 'Ansehen', caseStudy: 'Fallstudie', source: 'Code', more: 'Mehr auf GitHub',
      prev: 'Vorheriges Projekt', next: 'Nächstes Projekt',
    },
    principles: {
      label: 'Wie ich arbeite', aside: 'Drei Gewohnheiten',
      items: [
        { title: 'Das Ergebnis messen.', body: 'Ein Modell ist nur etwas wert, wenn es eine Entscheidung, einen Prozess oder ein Produkt besser macht. Genauigkeit ist der Anfang des Gesprächs, nicht das Ende.' },
        { title: 'Für den Betrieb bauen.', body: 'Saubere APIs, Logs, die man lesen kann, Code, den jemand anderes pflegen kann. Die langweiligen Teile sorgen dafür, dass man den cleveren vertraut.' },
        { title: 'Einfach erklären.', body: 'Wenn das Team die Überlegung nicht nachvollziehen kann, ist die Arbeit nicht fertig. Ich schreibe und präsentiere für Entwickler und für alle anderen im Raum.' },
      ],
    },
    experience: {
      label: 'Erfahrung und Ausbildung', title: 'Vom Backend', titleEm: 'bis zum Modell.',
      timeline: [
        { when: '2025 bis heute', what: 'M.Sc. Data Science', where: 'Hochschule Fulda · Deutschland', body: 'Statistik, Machine Learning und Data Engineering. Die meisten Projekte auf dieser Seite sind neben dem Studium entstanden.', tags: [] as string[] },
        { when: '2024 bis 2025', what: 'Associate Software Developer', where: 'EigenSecure · USA, remote', body: 'Unternehmenssoftware für ein Startup im Bereich Cybersecurity: APIs im Backend, Zugriffskontrolle und Nachweisprozesse, Daten für Compliance, responsive Oberflächen und automatisierte Auslieferung, als Teil eines agilen Teams.', tags: ['C# / .NET', 'REST APIs', 'SQL', 'Agile'] },
        { when: '2020 bis 2024', what: 'B.Tech. Big Data Computer Science', where: 'SRM University · Chennai, Indien', body: 'Verteilte Daten, Algorithmen und Softwareentwicklung. Beide Veröffentlichungen bei IEEE sind in dieser Zeit entstanden.', tags: [] as string[] },
      ],
      papersLabel: 'Veröffentlichungen bei IEEE',
      papers: ['Vorhersage des Blattwinkels von Windkraftanlagen mit XGBoost und Fehlerkorrektur', 'Transparente Agrarfinanzierung auf der Blockchain'],
      certsLabel: 'Zertifikate',
      certs: [{ name: 'IBM Data Science Professional', by: 'IBM, Coursera' }],
    },
    contact: {
      label: 'Kontakt', aside: 'Offen für Stellen in Software, Backend, Data und ML, in Deutschland oder remote',
      kicker: 'Ein Problem, das sich zu lösen lohnt?', title: 'Bauen wir etwas,', titleEm: 'das man gern benutzt.',
      write: ['Nachricht', 'schreiben'], writeCursor: 'Hallo', linkedinCursor: 'Vernetzen',
      copy: 'Kopieren', copied: 'Kopiert ✓', copyFail: 'Mit Strg+C kopieren',
      rights: 'Rohit Suryaa Saravanan', time: 'Ortszeit Fulda', top: 'Nach oben ↑',
    },
    network: {
      label: 'Werkzeuge', title: 'Von Rohdaten', titleEm: 'zu Ergebnissen.', layerWord: 'Schicht',
      layers: [
        { name: 'Rohdaten', title: 'Am Anfang ist es immer chaotisch.', body: 'Turbinenlogs, 110.123 Onlinebestellungen, 63.000 Flüge, Telemetrie aus der Formel 1. Echte Daten kommen unvollständig, widersprüchlich und über viele Orte verteilt.', nodes: ['Sensoren', 'Bestellungen', 'Flüge', 'Telemetrie', 'Text'] },
        { name: 'Aufbereiten', title: 'Hier passiert die meiste Arbeit.', body: 'Tabellen verbinden, Datentypen korrigieren, Merkmale bauen. Wenn die Daten falsch sind, ist alles danach auch falsch.', nodes: ['Python', 'Pandas', 'SQL', 'PySpark'] },
        { name: 'Modellieren', title: 'Dann kommen die Muster.', body: 'Prognosen, Klassifikatoren und ein zweites Modell, das das erste korrigiert, wenn eins nicht reicht. Immer im Vergleich mit einer einfachen Baseline.', nodes: ['Scikit-learn', 'XGBoost', 'TensorFlow', 'Zeitreihen', 'Statistik'] },
        { name: 'Bauen', title: 'Ein Modell, das niemand aufrufen kann, ist nur ein Notebook.', body: 'Services, APIs und Agenten, die das Modell dorthin bringen, wo Menschen es wirklich nutzen.', nodes: ['C# / .NET', 'Java', 'FastAPI', 'LangGraph', 'RAG'] },
        { name: 'Ausliefern', title: 'Deployt, versioniert, langweilig.', body: 'Container, Pipelines und Datenbanken, die weiterlaufen, auch wenn keiner hinschaut.', nodes: ['Azure', 'Docker', 'CI/CD', 'PostgreSQL', 'Git'] },
        { name: 'Ergebnisse', title: 'Der Teil, den man sieht.', body: 'Mehr Strom aus einem Windrad, eine Prognose mit unter 20 % Fehler, ein Agent, der nie einen Preis erfindet. Das ist die Ausgabeschicht.', nodes: ['+21 % Leistung', '18,5 % MAPE', '63K Flüge', '2 Paper'] },
      ],
    },
    numberLocale: 'de-DE',
  },
};

export const caseCopy = {
  en: { studies: 'Case study', back: '← Back to selected work', all: 'All work', contact: 'Contact', problem: '01 The problem', built: '02 What I built', outcome: '03 What came out of it', code: 'View the code', paper: 'Read the IEEE paper', next: 'Next project' },
  de: { studies: 'Fallstudie', back: '← Zurück zu den Projekten', all: 'Alle Projekte', contact: 'Kontakt', problem: '01 Das Problem', built: '02 Was ich gebaut habe', outcome: '03 Was dabei herauskam', code: 'Code ansehen', paper: 'Veröffentlichung lesen', next: 'Nächstes Projekt' },
};
