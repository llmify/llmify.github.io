var articles = [
  {
    slug: 'nemotron-3-super',
    date: '2026-03-18',
    category: 'open-source',
    title: {
      de: 'Nemotron 3 Super',
      fr: 'Nemotron 3 Super',
      it: 'Nemotron 3 Super',
      en: 'Nemotron 3 Super'
    },
    summary: {
      de: 'NVIDIA veröffentlicht ein Open-Weight-Modell, das bei massiv höherem Durchsatz mit Qwen 3.5 konkurriert. Für On-Premise-Setups wird die Wahl strategisch.',
      fr: 'NVIDIA publie un modèle open-weight qui rivalise avec Qwen 3.5 avec un débit nettement supérieur. Pour les installations on-premise, le choix devient stratégique.',
      it: 'NVIDIA pubblica un modello open-weight che compete con Qwen 3.5 con un throughput nettamente superiore. Per le installazioni on-premise, la scelta diventa strategica.',
      en: 'NVIDIA releases an open-weight model that competes with Qwen 3.5 at massively higher throughput. For on-premise setups, the choice becomes strategic.'
    }
  },
  {
    slug: 'us-exportkontrollen-ki',
    date: '2026-03-16',
    category: 'ai-sovereignty',
    title: {
      de: 'US-Exportkontrollen auf KI',
      fr: 'Contrôles d\u2019exportation américains sur l\u2019IA',
      it: 'Controlli all\u2019esportazione USA sull\u2019IA',
      en: 'US Export Controls on AI'
    },
    summary: {
      de: 'Der «Remote Access Security Act» könnte bald auch den Cloud-Zugriff auf KI regulieren. Wer US-Cloud nutzt, macht sich abhängig von politischen Entscheidungen.',
      fr: 'Le «Remote Access Security Act» pourrait bientôt réguler l\u2019accès cloud à l\u2019IA. Utiliser le cloud américain crée une dépendance aux décisions politiques.',
      it: 'Il «Remote Access Security Act» potrebbe presto regolamentare anche l\u2019accesso cloud all\u2019IA. Chi usa il cloud USA dipende da decisioni politiche.',
      en: 'The "Remote Access Security Act" could soon regulate cloud access to AI. Using US cloud creates dependency on political decisions.'
    }
  },
  {
    slug: 'qwen-35-release',
    date: '2026-03-12',
    category: 'open-source',
    title: {
      de: 'Qwen 3.5 Release',
      fr: 'Sortie de Qwen 3.5',
      it: 'Release di Qwen 3.5',
      en: 'Qwen 3.5 Release'
    },
    summary: {
      de: 'Qwen 3.5 bringt native Bildverarbeitung und stärkeres Reasoning — und läuft auf derselben Hardware wie bisher. Open Source schliesst die Lücke schneller als erwartet.',
      fr: 'Qwen 3.5 apporte le traitement d\u2019images natif et un raisonnement renforcé — sur le même matériel. L\u2019open source comble l\u2019écart plus vite que prévu.',
      it: 'Qwen 3.5 porta elaborazione immagini nativa e reasoning potenziato — sullo stesso hardware. L\u2019open source colma il divario più velocemente del previsto.',
      en: 'Qwen 3.5 brings native vision and stronger reasoning — running on the same hardware. Open source is closing the gap faster than expected.'
    }
  },
  {
    slug: 'benchmarks-schweizer-kmu',
    date: '2026-03-10',
    category: 'open-source',
    title: {
      de: 'Welche Benchmarks zählen für Schweizer KMUs',
      fr: 'Quels benchmarks comptent pour les PME suisses',
      it: 'Quali benchmark contano per le PMI svizzere',
      en: 'Which Benchmarks Matter for Swiss SMEs'
    },
    summary: {
      de: 'GPT-5.2 führt bei PhD-Mathematik. Aber bei Allgemeinwissen in 14 Sprachen beträgt der Vorsprung nur 2.5%. Für den KMU-Alltag ist der Unterschied vernachlässigbar.',
      fr: 'GPT-5.2 mène en mathématiques de niveau doctorat. Mais en connaissances générales dans 14 langues, l\u2019avance n\u2019est que de 2,5%. Pour le quotidien des PME, la différence est négligeable.',
      it: 'GPT-5.2 è in testa nella matematica a livello dottorato. Ma nelle conoscenze generali in 14 lingue, il vantaggio è solo del 2,5%. Per la quotidianità delle PMI, la differenza è trascurabile.',
      en: 'GPT-5.2 leads in PhD-level math. But in general knowledge across 14 languages, the lead is just 2.5%. For everyday SME work, the difference is negligible.'
    }
  },
  {
    slug: 'eu-parlament-ki',
    date: '2026-02-20',
    category: 'ai-sovereignty',
    title: {
      de: 'EU-Parlament schaltet KI ab',
      fr: 'Le Parlement européen désactive l\u2019IA',
      it: 'Il Parlamento UE disattiva l\u2019IA',
      en: 'EU Parliament Shuts Down AI'
    },
    summary: {
      de: 'Das EU-Parlament deaktiviert KI auf allen Geräten — die IT kann nicht garantieren, wohin die Daten fliessen. Die Antwort muss nicht «keine KI» sein.',
      fr: 'Le Parlement européen désactive l\u2019IA sur tous les appareils — l\u2019IT ne peut pas garantir où vont les données. La réponse ne doit pas être «pas d\u2019IA».',
      it: 'Il Parlamento UE disattiva l\u2019IA su tutti i dispositivi — l\u2019IT non può garantire dove vanno i dati. La risposta non deve essere «niente IA».',
      en: 'The EU Parliament disables AI on all devices — IT cannot guarantee where data flows. The answer doesn\u2019t have to be "no AI".'
    }
  },
  {
    slug: 'icc-vorfall',
    date: '2026-02-17',
    category: 'ai-sovereignty',
    title: {
      de: 'Der ICC-Vorfall',
      fr: 'L\u2019incident de la CPI',
      it: 'L\u2019incidente della CPI',
      en: 'The ICC Incident'
    },
    summary: {
      de: 'Der Internationale Strafgerichtshof verliert den Zugriff auf sein Microsoft-E-Mail-Konto und steigt auf Open Source um. Digitale Abhängigkeit ist operationelles Risiko.',
      fr: 'La Cour pénale internationale perd l\u2019accès à sa messagerie Microsoft et passe à l\u2019open source. La dépendance numérique est un risque opérationnel.',
      it: 'La Corte penale internazionale perde l\u2019accesso alla posta Microsoft e passa all\u2019open source. La dipendenza digitale è un rischio operativo.',
      en: 'The International Criminal Court loses access to its Microsoft email and switches to open source. Digital dependency is an operational risk.'
    }
  },
  {
    slug: 'cloud-act',
    date: '2026-02-15',
    category: 'ai-sovereignty',
    title: {
      de: 'CLOUD Act',
      fr: 'CLOUD Act',
      it: 'CLOUD Act',
      en: 'CLOUD Act'
    },
    summary: {
      de: 'Der US CLOUD Act verpflichtet amerikanische Unternehmen zur Datenherausgabe — auch bei Servern in der Schweiz. Datenstandort ist nicht Datensouveränität.',
      fr: 'Le CLOUD Act oblige les entreprises américaines à fournir des données — même pour des serveurs en Suisse. L\u2019emplacement des données n\u2019est pas la souveraineté des données.',
      it: 'Il CLOUD Act obbliga le aziende americane a consegnare i dati — anche per server in Svizzera. La localizzazione dei dati non è sovranità dei dati.',
      en: 'The US CLOUD Act requires American companies to hand over data — even from servers in Switzerland. Data location is not data sovereignty.'
    }
  }
];
