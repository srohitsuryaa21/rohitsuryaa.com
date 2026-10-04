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
    nav: { work: 'Work', about: 'Who am I', experience: 'Experience', contact: 'Contact', home: 'Rohit Suryaa, back to top', switchLabel: 'Deutsch', switchText: 'DE' },
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
      label: 'Who am I?', aside: 'Engineer by training. Researcher by habit.',
      manifesto: 'Data science meets software engineering. I build the model and the system it lives in.',
      cursor: 'Hallo!', caption: 'Chennai 13.08° N → Fulda 50.55° N',
      lead: 'I like the moment a hard problem starts to make sense.',
      body: [
        'Grew up in Chennai. Built enterprise software for a US cybersecurity startup. Now an MSc in Data Science in Fulda.',
        'Half backend and .NET, half forecasting, ML and AI agents. My favourite problems need both.',
      ],
      facts: [['Based', 'Fulda, Germany'], ['From', 'Chennai, India'], ['Languages', 'English · Deutsch'], ['Looking for', 'Software, backend, data and ML roles']],
      cv: [{ label: 'Résumé (English)', href: site.cvEn, lang: 'en' }, { label: 'Lebenslauf (Deutsch)', href: site.cvDe, lang: 'de' }],
    },
    statsMore: 'The story',
    stats: [
      { value: 96, suffix: '%', label: 'Prediction accuracy', note: 'Windmill pitch model, IEEE 2023', why: 'Pitch error fell from 8.6% to 2.3%. The turbine made 21% more power.' },
      { value: 110123, suffix: '', label: 'Orders analysed', note: 'Supply chain pipeline', why: 'Every order of a real online store: 92.1% on time, 881 sellers scored for risk.' },
      { value: 63, suffix: 'K', label: 'Flights modelled', note: 'Aviation delay model', why: 'O’Hare averaged 21.1 minutes of delay. Atlanta, 13.6.' },
      { value: 2, suffix: '', label: 'IEEE papers', note: 'Machine learning and blockchain finance', pad: true, why: 'Windmill pitch prediction (2023) and blockchain finance for farmers (2024).' },
    ],
    work: {
      label: 'What I built', title: 'Nine projects.', titleEm: 'Real questions.',
      intro: 'One from a real factory line. Eight with all the code on GitHub.',
      index: 'Project index', cursor: 'View case', caseStudy: 'Case study', story: 'Interactive story', source: 'Source', more: 'More on GitHub',
      prev: 'Previous project', next: 'Next project',
    },
    principles: {
      label: 'How I think', aside: 'Three rules',
      items: [
        { title: 'Measure the outcome.', body: 'A model only matters if it improves a decision.' },
        { title: 'Build for production.', body: 'Clean APIs and readable logs. The boring parts earn trust.' },
        { title: 'Explain it simply.', body: 'If the team cannot follow it, it is not finished.' },
      ],
    },
    experience: {
      label: 'Where I have been', title: 'Built across', titleEm: 'the stack.',
      timeline: [
        { when: '2020 to 2024', what: 'BTech, Big Data Computer Science', where: 'SRM University · Chennai, India', body: 'Distributed data and algorithms. Both IEEE papers came from here.', tags: [] as string[] },
        { when: '2024 to 2025', what: 'Associate Software Developer', where: 'EigenSecure · USA, remote', body: 'Backend APIs, access control and compliance workflows for a cybersecurity startup.', tags: ['C# / .NET', 'REST APIs', 'SQL', 'Agile'] },
        { when: '2025 to now', what: 'MSc Data Science', where: 'Hochschule Fulda · Germany', body: 'Statistics, ML and data engineering. Most projects here grew from it.', tags: [] as string[] },
      ],
      papersLabel: 'IEEE publications',
      papers: ['Windmill pitch prediction with XGBoost and residual correction', 'A DeFi platform for transparent agricultural finance'],
      more: 'More coming',
      certsLabel: 'Certifications',
      certs: [{ name: 'IBM Data Science Professional', by: 'IBM, Coursera' }],
    },
    contact: {
      label: 'Say hello', aside: 'Software, backend, data and ML roles. Germany or remote.',
      kicker: 'Have a problem worth solving?', title: 'Let’s build something', titleEm: 'worth using.',
      write: ['Get in', 'touch'], writeCursor: 'Say hi', linkedinCursor: 'Connect',
      copy: 'Copy', copied: 'Copied ✓', copyFail: 'Press Ctrl+C to copy',
      rights: 'Rohit Suryaa Saravanan', time: 'Fulda local time', top: 'Back to top ↑',
    },
    network: {
      label: 'What I use', title: 'From raw data', titleEm: 'to results.', layerWord: 'Layer',
      layers: [
        { name: 'Raw data', title: 'It always starts messy.', body: 'Turbine logs, 110,123 orders, 63,000 flights, race telemetry. Always messy.', nodes: ['Sensors', 'Orders', 'Flights', 'Telemetry', 'Text'] },
        { name: 'Clean and shape', title: 'Most of the work happens here.', body: 'Join, fix, build features. Wrong data in, wrong answers out.', nodes: ['Python', 'Pandas', 'SQL', 'PySpark'] },
        { name: 'Model', title: 'Then the patterns.', body: 'Forecasts and classifiers, always checked against a simple baseline.', nodes: ['Scikit-learn', 'XGBoost', 'TensorFlow', 'Time series', 'Statistics'] },
        { name: 'Build', title: 'A model nobody can call is just a notebook.', body: 'Services, APIs and agents, so people can actually use the model.', nodes: ['C# / .NET', 'Java', 'FastAPI', 'LangGraph', 'RAG'] },
        { name: 'Ship', title: 'Deployed, versioned, boring.', body: 'Containers, pipelines and databases that keep running.', nodes: ['Azure', 'Docker', 'CI/CD', 'PostgreSQL', 'Git'] },
        { name: 'Results', title: 'The part people see.', body: '+21% turbine power, 18.5% forecast error, an agent that never invents a price.', nodes: ['+21% power', '18.5% MAPE', '63K flights', '2 IEEE papers'] },
      ],
    },
    numberLocale: 'en-US',
  },
  de: {
    htmlTitle: 'Rohit Suryaa | Softwareentwickler und Data Scientist',
    description: 'Rohit Suryaa Saravanan ist Softwareentwickler und Data Scientist in Fulda. Er entwickelt Backends, Datenpipelines, Modelle für Machine Learning und Agentensysteme.',
    role: 'Softwareentwickler & Data Scientist',
    loaderWords: ['Code', 'Daten', 'Modelle', 'Systeme'],
    nav: { work: 'Projekte', about: 'Wer bin ich', experience: 'Erfahrung', contact: 'Kontakt', home: 'Rohit Suryaa, nach oben', switchLabel: 'English', switchText: 'EN' },
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
      label: 'Wer bin ich?', aside: 'Informatiker von Haus aus. Forscher aus Gewohnheit.',
      manifesto: 'Data Science trifft Softwareentwicklung. Ich baue das Modell und das System drumherum.',
      cursor: 'Hallo!', caption: 'Chennai 13,08° N → Fulda 50,55° N',
      lead: 'Ich mag den Moment, in dem ein schweres Problem plötzlich Sinn ergibt.',
      body: [
        'Aufgewachsen in Chennai. Unternehmenssoftware für ein US Startup in der Cybersecurity. Jetzt M.Sc. Data Science in Fulda.',
        'Halb Backend und .NET, halb Prognosen, ML und KI Agenten. Die besten Probleme brauchen beides.',
      ],
      facts: [['Wohnort', 'Fulda, Deutschland'], ['Herkunft', 'Chennai, Indien'], ['Sprachen', 'Englisch · Deutsch'], ['Gesucht', 'Stellen in Software, Backend, Data und ML']],
      cv: [{ label: 'Lebenslauf (Deutsch)', href: site.cvDe, lang: 'de' }, { label: 'Résumé (English)', href: site.cvEn, lang: 'en' }],
    },
    statsMore: 'Hintergrund',
    stats: [
      { value: 96, suffix: ' %', label: 'Vorhersagegenauigkeit', note: 'Pitchmodell für Windkraftanlagen, IEEE 2023', why: 'Der Fehler beim Blattwinkel sank von 8,6 % auf 2,3 %. Die Turbine erzeugte 21 % mehr Strom.' },
      { value: 110123, suffix: '', label: 'Analysierte Bestellungen', note: 'Pipeline für Lieferketten', why: 'Jede Bestellung eines echten Onlineshops: 92,1 % pünktlich, 881 Verkäufer bewertet.' },
      { value: 63, suffix: 'K', label: 'Modellierte Flüge', note: 'Modell für Flugverspätungen', why: 'O’Hare: im Schnitt 21,1 Minuten Verspätung. Atlanta: 13,6.' },
      { value: 2, suffix: '', label: 'Veröffentlichungen', note: 'IEEE, Machine Learning und Blockchain', pad: true, why: 'Windrad Pitch Prognose (2023) und Blockchain Finanzierung für Bauern (2024).' },
    ],
    work: {
      label: 'Was ich gebaut habe', title: 'Neun Projekte.', titleEm: 'Echte Fragen.',
      intro: 'Eins aus einer echten Fertigungslinie. Acht mit dem ganzen Code auf GitHub.',
      index: 'Projektübersicht', cursor: 'Ansehen', caseStudy: 'Fallstudie', story: 'Interaktive Story', source: 'Code', more: 'Mehr auf GitHub',
      prev: 'Vorheriges Projekt', next: 'Nächstes Projekt',
    },
    principles: {
      label: 'Wie ich denke', aside: 'Drei Regeln',
      items: [
        { title: 'Das Ergebnis messen.', body: 'Ein Modell zählt nur, wenn es eine Entscheidung verbessert.' },
        { title: 'Für den Betrieb bauen.', body: 'Saubere APIs und lesbare Logs. Die langweiligen Teile schaffen Vertrauen.' },
        { title: 'Einfach erklären.', body: 'Wenn das Team nicht folgen kann, ist es nicht fertig.' },
      ],
    },
    experience: {
      label: 'Wo ich war', title: 'Vom Backend', titleEm: 'bis zum Modell.',
      timeline: [
        { when: '2020 bis 2024', what: 'B.Tech. Big Data Computer Science', where: 'SRM University · Chennai, Indien', body: 'Verteilte Daten und Algorithmen. Beide IEEE Paper entstanden hier.', tags: [] as string[] },
        { when: '2024 bis 2025', what: 'Associate Software Developer', where: 'EigenSecure · USA, remote', body: 'Backend APIs, Zugriffskontrolle und Compliance Abläufe für ein Cybersecurity Startup.', tags: ['C# / .NET', 'REST APIs', 'SQL', 'Agile'] },
        { when: '2025 bis heute', what: 'M.Sc. Data Science', where: 'Hochschule Fulda · Deutschland', body: 'Statistik, ML und Data Engineering. Die meisten Projekte hier sind daraus entstanden.', tags: [] as string[] },
      ],
      papersLabel: 'Veröffentlichungen bei IEEE',
      papers: ['Vorhersage des Blattwinkels von Windkraftanlagen mit XGBoost und Fehlerkorrektur', 'Transparente Agrarfinanzierung auf der Blockchain'],
      more: 'Fortsetzung folgt',
      certsLabel: 'Zertifikate',
      certs: [{ name: 'IBM Data Science Professional', by: 'IBM, Coursera' }],
    },
    contact: {
      label: 'Sag hallo', aside: 'Stellen in Software, Backend, Data und ML. Deutschland oder remote.',
      kicker: 'Ein Problem, das sich zu lösen lohnt?', title: 'Bauen wir etwas,', titleEm: 'das man gern benutzt.',
      write: ['Nachricht', 'schreiben'], writeCursor: 'Hallo', linkedinCursor: 'Vernetzen',
      copy: 'Kopieren', copied: 'Kopiert ✓', copyFail: 'Mit Strg+C kopieren',
      rights: 'Rohit Suryaa Saravanan', time: 'Ortszeit Fulda', top: 'Nach oben ↑',
    },
    network: {
      label: 'Womit ich arbeite', title: 'Von Rohdaten', titleEm: 'zu Ergebnissen.', layerWord: 'Schicht',
      layers: [
        { name: 'Rohdaten', title: 'Am Anfang ist es immer chaotisch.', body: 'Turbinenlogs, 110.123 Bestellungen, 63.000 Flüge, Telemetrie. Immer chaotisch.', nodes: ['Sensoren', 'Bestellungen', 'Flüge', 'Telemetrie', 'Text'] },
        { name: 'Aufbereiten', title: 'Hier passiert die meiste Arbeit.', body: 'Verbinden, korrigieren, Merkmale bauen. Falsche Daten, falsche Antworten.', nodes: ['Python', 'Pandas', 'SQL', 'PySpark'] },
        { name: 'Modellieren', title: 'Dann kommen die Muster.', body: 'Prognosen und Klassifikatoren, immer gegen eine einfache Baseline geprüft.', nodes: ['Scikit-learn', 'XGBoost', 'TensorFlow', 'Zeitreihen', 'Statistik'] },
        { name: 'Bauen', title: 'Ein Modell, das niemand aufrufen kann, ist nur ein Notebook.', body: 'Services, APIs und Agenten, damit Menschen das Modell wirklich nutzen.', nodes: ['C# / .NET', 'Java', 'FastAPI', 'LangGraph', 'RAG'] },
        { name: 'Ausliefern', title: 'Deployt, versioniert, langweilig.', body: 'Container, Pipelines und Datenbanken, die einfach weiterlaufen.', nodes: ['Azure', 'Docker', 'CI/CD', 'PostgreSQL', 'Git'] },
        { name: 'Ergebnisse', title: 'Der Teil, den man sieht.', body: '+21 % Turbinenleistung, 18,5 % Prognosefehler, ein Agent, der nie einen Preis erfindet.', nodes: ['+21 % Leistung', '18,5 % MAPE', '63K Flüge', '2 Paper'] },
      ],
    },
    numberLocale: 'de-DE',
  },
};

export const caseCopy = {
  en: { studies: 'Case study', back: '← Back to selected work', all: 'All work', contact: 'Contact', problem: '01 The problem', built: '02 What I built', outcome: '03 What came out of it', code: 'View the code', paper: 'Read the IEEE paper', next: 'Next project' },
  de: { studies: 'Fallstudie', back: '← Zurück zu den Projekten', all: 'Alle Projekte', contact: 'Kontakt', problem: '01 Das Problem', built: '02 Was ich gebaut habe', outcome: '03 Was dabei herauskam', code: 'Code ansehen', paper: 'Veröffentlichung lesen', next: 'Nächstes Projekt' },
};
