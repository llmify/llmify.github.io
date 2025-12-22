// Throttled scroll functions for better performance
let scrollTicking = false;

// ============================================
// LANGUAGE SYSTEM
// ============================================

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.workshop": "Workshop",
    "nav.privateAi": "Private AI",
    "nav.agents": "Agents",
    "nav.team": "Team",
    "nav.contact": "Contact Us",

    // Index page - Hero
    "index.hero.title": "Turn AI into your competitive advantage",
    "index.hero.subtitle": "From strategy to implementation – we guide your journey to intelligent automation that actually works.",

    // Index page - Solutions/Approach
    "index.approach.title": "Our Approach",
    "index.approach.intro": "We understand that all the new AI possibilities can feel overwhelming. That's why we're here to guide you through every step of your AI transition, helping you find a clear, structured path to adopting AI with measurable value for your business.",
    "index.approach.step1.title": "Discovery & Assessment",
    "index.approach.step1.desc": "We understand your business, current AI usage, and infrastructure to map out your unique starting point and identify the best path forward.",
    "index.approach.step2.title": "AI Infrastructure Setup",
    "index.approach.step2.desc": "We deploy secure AI infrastructure with powerful models and set up a user-friendly interface for your employees. This creates the foundation for exploration and implementation.",
    "index.approach.step3.title": "Strategic Workshop & Opportunity Identification",
    "index.approach.step3.desc": "We conduct hands-on workshops where your team explores AI for real tasks while we collaboratively identify the most promising automation opportunities.",
    "index.approach.step4.title": "Workflow Analysis & Prioritization",
    "index.approach.step4.desc": "We evaluate automation workflows by complexity and strategic value to focus on your biggest pain points first and avoid redundant solutions.",
    "index.approach.step5.title": "Systematic Implementation & Monitoring",
    "index.approach.step5.desc": "We deploy our Agent Cockpit for real-time monitoring and systematically implement automation solutions step by step, ensuring measurable value at each stage.",
    "index.approach.conclusion": "This collaborative partnership approach ensures we focus on automating your actual pain points rather than delivering one-size-fits-all solutions. Together, we transform AI from an overwhelming concept into practical, valuable automation that drives real business results.",

    // Index page - Workshop Service
    "index.workshop.title": "AI Strategy Workshop",
    "index.workshop.desc": "Navigate the complex AI landscape with confidence and identify your best opportunities. Our structured workshop cuts through the hype to deliver actionable insights tailored to your business.",
    "index.workshop.item1.title": "Technology Landscape Analysis",
    "index.workshop.item1.desc": "Understand available models, tools, and emerging technologies. We help you separate genuine opportunities from marketing noise.",
    "index.workshop.item2.title": "Security & Validation Framework",
    "index.workshop.item2.desc": "Learn what data you can safely process with public AI tools versus what requires private solutions. Get clear guidelines on risk management.",
    "index.workshop.item3.title": "Strategic Prioritization",
    "index.workshop.item3.desc": "Collaborate with your team to identify and rank AI opportunities by implementation complexity and strategic value.",
    "index.workshop.cta": "Explore Our Workshop →",

    // Index page - Private AI Service
    "index.privateAi.title": "Private AI Solutions",
    "index.privateAi.desc": "Harness AI's power while maintaining complete control over your sensitive data. From cloud-based private instances to fully local deployments, we ensure your critical information stays secure.",
    "index.privateAi.item1.title": "Cloud-Based Private Instances",
    "index.privateAi.item1.desc": "EU and Swiss server hosting ensures data compliance with local regulations. Enjoy top-tier AI models in a fully isolated environment.",
    "index.privateAi.item2.title": "Local AI Deployment",
    "index.privateAi.item2.desc": "We can help with setting up specialized local hardware for AI inference.",
    "index.privateAi.item3.title": "Performance & Security Balance",
    "index.privateAi.item3.desc": "Experience optimal performance while maintaining 100% data control.",
    "index.privateAi.cta": "Discover Private AI →",

    // Index page - Agents Service
    "index.agents.title": "Custom AI Agents",
    "index.agents.desc": "Transform AI into reliable digital team members that work around the clock. Our agents integrate seamlessly into your workflows, handling routine tasks with consistent accuracy while your team focuses on strategic initiatives.",
    "index.agents.item1.title": "Built for Reliability",
    "index.agents.item1.desc": "Unlike systems that rely entirely on LLMs, our agents use them strategically for unstructured inputs, then perform transformations deterministically for maximum reliability.",
    "index.agents.item2.title": "Transparent Operations",
    "index.agents.item2.desc": "Our Agent Cockpit provides real-time visibility into what your digital team member is working on, their backlog, and detailed result visualizations.",
    "index.agents.item3.title": "3-Phase Implementation",
    "index.agents.item3.desc": "We build, test, and refine your agent until it meets your exact requirements. You validate results at each stage, ensuring complete satisfaction.",
    "index.agents.cta": "Meet Our Agents →",

    // Index page - CTA
    "index.cta.title": "Stop Losing Hours to Manual Work",
    "index.cta.subtitle": "Transform your business with AI that actually works.",
    "index.cta.button": "Get Free Consultation",

    // Workshop page
    "workshop.hero.title": "AI Strategy Workshop",
    "workshop.hero.subtitle": "Discover your best AI opportunities and build a clear roadmap for implementation.",
    "workshop.intro.title": "From AI Confusion to Clear Strategy",
    "workshop.intro.desc": "Navigate the AI landscape with confidence. Our workshop cuts through the hype to identify real opportunities that drive measurable business value for your organization.",
    "workshop.intro.item1.title": "Technology Landscape Overview",
    "workshop.intro.item1.desc": "Understand the current AI ecosystem, available models, and tools. We provide insights into the rapid development process and help you separate genuine opportunities from marketing hype.",
    "workshop.intro.item2.title": "Security & Validation Insights",
    "workshop.intro.item2.desc": "Learn critical data security aspects and result validation techniques. Discover what data you can safely use with public AI tools and what requires private solutions.",
    "workshop.intro.item3.title": "Strategic Opportunity Mapping",
    "workshop.intro.item3.desc": "Identify and prioritize your highest-value AI applications using proven decision frameworks. Leave with a ranked list of opportunities based on complexity and strategic importance.",
    "workshop.outcomes.title": "What You'll Achieve",
    "workshop.outcomes.intro": "Leave with a clear AI strategy, ranked opportunities, and the foundation for successful implementation. Our structured approach ensures you identify the highest-value applications for your specific business context.",
    "workshop.outcomes.item1.title": "Practical AI Knowledge",
    "workshop.outcomes.item1.desc": "Deep understanding of the AI landscape, available tools, and emerging technologies. Cut through the hype and focus on solutions that deliver real business value.",
    "workshop.outcomes.item1.tag": "Technology Insights",
    "workshop.outcomes.item2.title": "Team Confidence & Buy-in",
    "workshop.outcomes.item2.desc": "Your team gains hands-on AI experience, reduced anxiety about adoption, and shared understanding for the transformation journey ahead. Foundation for successful implementation.",
    "workshop.outcomes.item2.tag": "Change Management",
    "workshop.outcomes.item3.title": "Security & Risk Framework",
    "workshop.outcomes.item3.desc": "Clear guidelines on data handling, security requirements, and validation processes. Understand what can be processed with public tools versus what requires private AI solutions.",
    "workshop.outcomes.item3.tag": "Risk Management",
    "workshop.outcomes.item4.title": "Prioritized AI Roadmap",
    "workshop.outcomes.item4.desc": "Receive a comprehensive analysis of your AI opportunities ranked by implementation complexity, robustness, and strategic value. Know exactly where to focus your efforts first.",
    "workshop.outcomes.item4.tag": "Strategic Planning",
    "workshop.cta.title": "Ready to turn AI confusion into competitive advantage?",
    "workshop.cta.subtitle": "Start your AI journey with our comprehensive education workshop.",
    "workshop.cta.button": "Book a Workshop",

    // Private AI page
    "privateAi.hero.title": "Private AI Solutions",
    "privateAi.hero.subtitle": "Keep your critical and confidential data secure while harnessing the power of AI.<br>No compromises on privacy. No compromises on performance.",
    "privateAi.why.title": "Why Private AI?",
    "privateAi.why.intro": "Modern AI models like ChatGPT have hundreds of billions of parameters and require highly specialized hardware to run at useful speeds. That's why most companies rely on cloud providers. But when you use AI online, a key question always comes up:",
    "privateAi.why.question": "What happens to your data?",
    "privateAi.why.answer": "Most business processes involve sensitive or even regulated data. Simply putting that into a public AI service is rarely an option. That's where our Private AI Solutions come in: secure, tailored setups that let you use AI with full confidence.",
    "privateAi.cloud.title": "1. Cloud Solution – Scalable & Always Up to Date",
    "privateAi.cloud.desc": "Our cloud solution is the best choice if you want scalability and the very latest AI capabilities.",
    "privateAi.cloud.item1.title": "EU & Swiss Compliance",
    "privateAi.cloud.item1.desc": "Runs on EU or Swiss servers, ensuring local data residency and compliance.",
    "privateAi.cloud.item2.title": "Logically Private Instance",
    "privateAi.cloud.item2.desc": "Your data is isolated from other users. Microsoft guarantees: data is used only to deliver the service, never stored or reused.",
    "privateAi.cloud.item3.title": "Latest AI Models",
    "privateAi.cloud.item3.desc": "Always access the latest models, with no hardware limitations. Perfect for teams with many users, heavy workloads, or fast-changing AI needs.",
    "privateAi.cloud.bestFor": "<strong>Best for:</strong> Companies that want maximum performance, scalability, and regulatory compliance with strong guarantees on privacy.",
    "privateAi.local.title": "2. Local Solution – Ultimate Control",
    "privateAi.local.desc": "If your top concern is absolute control of your data, we also provide a fully local setup.",
    "privateAi.local.item1.title": "Specialized Hardware",
    "privateAi.local.item1.desc": "Delivered with a specialized rack system we designed to optimize for cost and AI performance.",
    "privateAi.local.item2.title": "Open-Source Models",
    "privateAi.local.item2.desc": "Runs powerful open-source AI models at usable speeds without requiring million-dollar hardware.",
    "privateAi.local.item3.title": "Complete Control",
    "privateAi.local.item3.desc": "Tailored to your business needs: we adjust model size and hardware configuration depending on your output requirements. Your data never leaves your premises, so you're in full control.",
    "privateAi.local.bestFor": "<strong>Best for:</strong> Organizations with highly confidential data or strict regulatory environments that do not allow cloud usage.",
    "privateAi.beyond.title": "More Than Just AI Access",
    "privateAi.beyond.intro": "Setting up Private AI is more than just getting secure access to an AI model. It's a foundation for future innovation.",
    "privateAi.beyond.item1.title": "Secure Experimentation",
    "privateAi.beyond.item1.desc": "Your private AI environment provides the perfect foundation for secure experimentation with AI technologies, allowing you to explore possibilities without compromising sensitive data.",
    "privateAi.beyond.item2.title": "Foundation for Automation",
    "privateAi.beyond.item2.desc": "Once established, your private AI becomes the foundation for any following automation projects, from document processing to comprehensive AI-driven business workflows.",
    "privateAi.cta.title": "Ready to Secure Your AI Journey?",
    "privateAi.cta.subtitle": "We'll help you find the setup that's right for your business.",
    "privateAi.cta.button": "Get Free Consultation",

    // Agents page
    "agents.hero.title": "We transform AI into your custom digital team member",
    "agents.hero.subtitle": "Free your team to focus on creative, high-value work while AI handles the routine tasks.",
    "agents.philosophy.title": "Our Philosophy",
    "agents.philosophy.intro": "We believe when it comes to building successful integrations of agents, there are a few key things to consider.",
    "agents.philosophy.item1.title": "Built for Reliability",
    "agents.philosophy.item1.desc": "Rather than building agents that deliver astonishing results 50% of the time like many fully autonomous agent systems advertise, we believe there's great value in carefully designed systems. We leverage LLMs when confronted with uncertain structures, using them systematically to restructure data, then perform transformations deterministically. This approach improves overall system reliability and explainability – crucial properties for highly regulated tasks.",
    "agents.philosophy.item2.title": "Transparent Operations",
    "agents.philosophy.item2.desc": "Our Agent Cockpit gives you a unique view of what the agent is working on, their current backlog, and well-thought-through visualizations of results. This allows co-workers to easily confirm results, building trust while making everything validatable and decisions traceable.",
    "agents.philosophy.item3.title": "Intuitive Integration",
    "agents.philosophy.item3.desc": "We leverage LLM capabilities to make usage as intuitive as possible – it should feel like onboarding another employee. Our agents integrate seamlessly via standard business communication channels like email or other platforms.",
    "agents.demo.title": "From Overwhelmed to Automated",
    "agents.demo.subtitle": "See the transformation in action. Watch how our AI agents take complex, time-consuming tasks off your plate while keeping you in complete control through our monitoring interface.",
    "agents.meet.title": "Meet Our Agents",
    "agents.meet.intro": "Every team deserves reliable colleagues. Ours just happen to be digital. These are the AI agents we're building for regulated environments. Each one is designed to handle specific, complex workflows that currently consume hours of human time. See exactly how they would integrate into your processes and deliver the reliability your business demands.",
    "agents.reto.title": "The Onboarding Agent",
    "agents.reto.name": "Reto",
    "agents.reto.desc": "Reto takes care of client onboarding in regulated environments. From verifying KYC documents for individuals and legal entities to ensuring compliance checks, Reto relieves your legal and compliance teams of repetitive work. He integrates smoothly into your workflow, just like another team member.",
    "agents.beat.title": "The Auditing Agent",
    "agents.beat.name": "Beat",
    "agents.beat.desc": "Beat automates balance sheet reviews and document preparation. Instead of manually transferring financial statements into spreadsheets and running validations, Beat takes over these steps with precision and speed. He supports your audit team in ensuring accuracy while saving valuable hours.",
    "agents.comingSoon.title": "More Agents Coming Soon",
    "agents.comingSoon.desc": "We're constantly developing new AI agents for different industries and use cases. From legal document processing to customer service automation, your next digital team member is on the way.",
    "agents.comingSoon.badge": "Stay Tuned",
    "agents.custom.title": "Different Process, Same Approach",
    "agents.custom.intro": "Every business has repetitive workflows that consume valuable time – whether it's document processing, data validation, compliance checks, or approval workflows. We focus on understanding the specific steps, rules, and requirements that make your processes unique. Let's explore together how we can automate your particular workflow and build an AI agent that handles your exact process requirements.",
    "agents.slider.text1": "Slide to Unlock",
    "agents.slider.text2": "Your Custom Agent",
    "agents.pricing.title": "AI as a Team Member",
    "agents.pricing.intro": "Our 3-phase approach ensures your AI agent completes tasks to your complete satisfaction. We build, test, and refine until the agent meets your exact requirements. At each stage, you validate the results before moving forward, guaranteeing a solution that truly works for your business.",
    "agents.pricing.approach": "Our 3 Phase Approach",
    "agents.pricing.phase1.title": "Study Phase",
    "agents.pricing.phase1.item1": "Requirements Analysis",
    "agents.pricing.phase1.item2": "Process Mapping",
    "agents.pricing.phase1.item3": "Initial Development",
    "agents.pricing.phase1.duration": "1-3 Months",
    "agents.pricing.phase2.title": "Internship Phase",
    "agents.pricing.phase2.item1": "Live Deployment",
    "agents.pricing.phase2.item2": "Performance Monitoring",
    "agents.pricing.phase2.item3": "Continuous Feedback",
    "agents.pricing.phase2.duration": "1-3 Months",
    "agents.pricing.phase3.title": "Full-Time Position",
    "agents.pricing.phase3.item1": "Fully Trained Agent",
    "agents.pricing.phase3.item2": "24/7 Availability",
    "agents.pricing.phase3.item3": "Ongoing Support",
    "agents.pricing.phase3.duration": "Unlimited",
    "agents.cta.title": "Ready to add a digital team member to your company?",
    "agents.cta.subtitle": "See how our AI Agents can seamlessly integrate into your workflows.",
    "agents.cta.button": "Contact Us",

    // Team page
    "team.hero.title": "Meet Our Team",
    "team.hero.subtitle": "Behind LLMify is a passionate team of experts combining deep technical knowledge with proven business experience to revolutionize how companies work with AI.",
    "team.section.title": "Our Team",
    "team.axel.role": "Developer",
    "team.axel.roleDesc": "Founder",
    "team.axel.education": "Computer Science, ETH Zurich",
    "team.francesco.role": "Developer",
    "team.francesco.education": "Computer Science, ETH Zurich",
    "team.niklas.role": "Developer",
    "team.niklas.education": "Computer Science, ETH Zurich",
    "team.philipp.role": "President of the Board",
    "team.philipp.education": "Founder of Z22 Technologies AG and Araneum Technologies GmbH",
    "team.armin.role": "Board Member",
    "team.armin.education": "Founder of Z22 Technologies AG and Araneum Technologies GmbH",
    "team.matthias.role": "Board Member",
    "team.matthias.education": "Managing Partner at Interpharma Link",
    "team.cta.title": "Ready to work with our team?",
    "team.cta.subtitle": "Let's discuss how our expertise can help transform your business with AI.",
    "team.cta.button": "Get in Touch",

    // Contact page
    "contact.hero.title": "Contact Us",
    "contact.hero.subtitle": "Have questions or want to learn more? Get in touch with our team.",
    "contact.form.title": "Send Us a Message",
    "contact.form.subtitle": "Prefer to use a contact form? Fill out the details below and we'll get back to you.",
    "contact.form.name": "Name",
    "contact.form.namePlaceholder": "Your Name",
    "contact.form.email": "Email",
    "contact.form.emailPlaceholder": "Your Email",
    "contact.form.message": "Message",
    "contact.form.messagePlaceholder": "How can we help you with AI integration?",
    "contact.form.submit": "Send Message",

    // Common
    "common.scroll": "Scroll",
    "common.learnMore": "Learn more",

    // Footer
    "footer.copyright": "© 2025 LLMify. All Rights Reserved.",
    "footer.privacy": "Privacy Policy",
    "footer.impressum": "Impressum",
    "footer.cookies": "Cookie Settings",

    // Cookie banner
    "cookie.text": "This website uses cookies to ensure you get the best experience on our website.",
    "cookie.decline": "Decline",
    "cookie.accept": "Accept",

    // Modals
    "modal.privacy.title": "Privacy Policy",
    "modal.privacy.updated": "Last updated: January 2025",
    "modal.privacy.section1.title": "1. Information We Collect",
    "modal.privacy.section1.text": "We collect information you provide directly to us, such as when you contact us through our website form. This may include your name, email address, and message content.",
    "modal.privacy.section2.title": "2. How We Use Your Information",
    "modal.privacy.section2.intro": "We use the information we collect to:",
    "modal.privacy.section2.list": "• Respond to your inquiries and provide customer support<br>• Improve our services and develop new features<br>• Send you marketing communications (with your consent)<br>• Comply with legal obligations",
    "modal.privacy.section3.title": "3. Data Security",
    "modal.privacy.section3.text": "We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. All data processing is performed in accordance with Swiss data protection laws.",
    "modal.privacy.section4.title": "4. Your Rights",
    "modal.privacy.section4.intro": "Under Swiss data protection law, you have the right to:",
    "modal.privacy.section4.list": "• Access your personal data<br>• Correct inaccurate data<br>• Delete your data<br>• Object to data processing<br>• Data portability",
    "modal.privacy.section5.title": "5. Contact Us",
    "modal.privacy.section5.text": "If you have any questions about this Privacy Policy, please contact us through our contact form.",

    "modal.impressum.title": "Impressum",
    "modal.impressum.company.title": "Company Information",
    "modal.impressum.company.text": "<strong>LLMify AG</strong><br>Alte Steinhauserstrasse 19<br>6330 Cham<br>Switzerland",
    "modal.impressum.company.details": "<strong>Legal Form:</strong> Aktiengesellschaft (Corporation)<br><strong>Company Registration:</strong> CHE-479.856.227<br><strong>Registered Office:</strong> Cham, Switzerland",
    "modal.impressum.purpose.title": "Business Purpose",
    "modal.impressum.purpose.text": "Software development and the sale of services, products, and consulting in the IT sector.",
    "modal.impressum.contact.title": "Contact Information",
    "modal.impressum.contact.text": "<strong>Address:</strong> Alte Steinhauserstrasse 19, 6330 Cham, Switzerland<br><strong>Email:</strong> Contact us through our contact form<br><strong>Website:</strong> www.llmify.ch",
    "modal.impressum.regulatory.title": "Regulatory Information",
    "modal.impressum.regulatory.text": "<strong>Commercial Register:</strong> Registered in the Commercial Register of Zug<br><strong>Registration Date:</strong> March 19, 2025<br><strong>Official Publication:</strong> Swiss Official Gazette of Commerce (SHAB)",
    "modal.impressum.disclaimer.title": "Disclaimer",
    "modal.impressum.disclaimer.text": "The information on this website is provided on an \"as is\" basis. To the fullest extent permitted by law, LLMify AG excludes all representations, warranties, undertakings, and guarantees relating to the content of this website.",
    "modal.impressum.copyright.title": "Copyright",
    "modal.impressum.copyright.text": "All content on this website, including text, graphics, logos, and images, is the property of LLMify AG and is protected by copyright laws. Unauthorized use is prohibited.",
    "modal.impressum.law.title": "Applicable Law",
    "modal.impressum.law.text": "This website and its content are governed by Swiss law. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the Swiss courts, with the place of jurisdiction being Zug, Switzerland.",

    // Demo/Booking modal
    "modal.demo.title": "Book a Demo",
    "modal.demo.intro": "Let's explore how LLMify can transform your business with custom AI solutions. Fill out the form below and we'll schedule a personalized demo.",
    "modal.demo.name": "Full Name *",
    "modal.demo.namePlaceholder": "Your Full Name",
    "modal.demo.email": "Business Email *",
    "modal.demo.emailPlaceholder": "your.email@company.com",
    "modal.demo.company": "Company Name *",
    "modal.demo.companyPlaceholder": "Your Company",
    "modal.demo.role": "Your Role",
    "modal.demo.rolePlaceholder": "e.g., CTO, Product Manager",
    "modal.demo.useCase": "Primary Use Case *",
    "modal.demo.useCaseDefault": "Select your primary interest",
    "modal.demo.useCasePrivacy": "Data Privacy & Swiss Hosting",
    "modal.demo.useCaseProcess": "Process Optimization",
    "modal.demo.useCaseIntegration": "Custom LLM Integration",
    "modal.demo.useCaseConsulting": "AI Strategy Consulting",
    "modal.demo.useCaseOther": "Other",
    "modal.demo.description": "Tell us about your project",
    "modal.demo.descriptionPlaceholder": "Briefly describe your AI integration needs or current challenges...",
    "modal.demo.timeline": "Timeline",
    "modal.demo.timelineDefault": "When do you plan to implement?",
    "modal.demo.timelineImmediate": "Immediate (within 1 month)",
    "modal.demo.timelineShort": "Short-term (1-3 months)",
    "modal.demo.timelineMedium": "Medium-term (3-6 months)",
    "modal.demo.timelineLong": "Long-term (6+ months)",
    "modal.demo.timelineResearch": "Research phase",
    "modal.demo.preferredTime": "Preferred Demo Time",
    "modal.demo.preferredTimeDefault": "Select preferred time",
    "modal.demo.preferredTimeMorning": "Morning (9-12 CET)",
    "modal.demo.preferredTimeAfternoon": "Afternoon (12-17 CET)",
    "modal.demo.preferredTimeEvening": "Evening (17-19 CET)",
    "modal.demo.preferredTimeFlexible": "Flexible",
    "modal.demo.submit": "Schedule Demo",

    // Workshop booking modal
    "modal.workshop.title": "Book a Workshop",
    "modal.workshop.intro": "Transform your team's relationship with AI through our comprehensive education workshop. Fill out the form below and we'll schedule a customized session for your organization.",
    "modal.workshop.rolePlaceholder": "e.g., HR Director, CTO",
    "modal.workshop.teamSize": "Team Size *",
    "modal.workshop.teamSizeDefault": "Select team size",
    "modal.workshop.teamSize5": "5-15 people",
    "modal.workshop.teamSize16": "16-30 people",
    "modal.workshop.teamSize31": "31-50 people",
    "modal.workshop.teamSize50": "50+ people",
    "modal.workshop.format": "Preferred Format",
    "modal.workshop.formatDefault": "Select format",
    "modal.workshop.formatHalf": "Half-day (4 hours)",
    "modal.workshop.formatFull": "Full-day (8 hours)",
    "modal.workshop.formatMulti": "Multi-day program",
    "modal.workshop.formatFlexible": "Flexible",
    "modal.workshop.description": "Tell us about your team's AI experience and goals",
    "modal.workshop.descriptionPlaceholder": "Describe your team's current AI knowledge level, specific interests, or challenges you'd like the workshop to address...",
    "modal.workshop.timeline": "Timeline",
    "modal.workshop.timelineDefault": "When would you like to schedule?",
    "modal.workshop.timeline2weeks": "Within 2 weeks",
    "modal.workshop.timeline1month": "Within 1 month",
    "modal.workshop.timeline3months": "Within 3 months",
    "modal.workshop.timelineFlexible": "Flexible timing",
    "modal.workshop.location": "Location Preference",
    "modal.workshop.locationDefault": "Select preference",
    "modal.workshop.locationOnsite": "On-site at our office",
    "modal.workshop.locationVirtual": "Virtual workshop",
    "modal.workshop.locationHybrid": "Hybrid format",
    "modal.workshop.locationFlexible": "No preference",
    "modal.workshop.submit": "Book Workshop"
  },

  de: {
    // Navigation
    "nav.home": "Startseite",
    "nav.services": "Leistungen",
    "nav.workshop": "Workshop",
    "nav.privateAi": "Private KI",
    "nav.agents": "Agenten",
    "nav.team": "Team",
    "nav.contact": "Kontakt",

    // Index page - Hero
    "index.hero.title": "Machen Sie KI zu Ihrem Wettbewerbsvorteil",
    "index.hero.subtitle": "Von der Strategie bis zur Umsetzung – wir begleiten Sie auf dem Weg zur intelligenten Automatisierung, die wirklich funktioniert.",

    // Index page - Solutions/Approach
    "index.approach.title": "Unser Ansatz",
    "index.approach.intro": "Wir verstehen, dass all die neuen KI-Möglichkeiten überwältigend wirken können. Deshalb sind wir hier, um Sie durch jeden Schritt Ihrer KI-Transformation zu begleiten und Ihnen zu helfen, einen klaren, strukturierten Weg zur KI-Einführung mit messbarem Mehrwert für Ihr Unternehmen zu finden.",
    "index.approach.step1.title": "Analyse & Bewertung",
    "index.approach.step1.desc": "Wir verstehen Ihr Geschäft, Ihre aktuelle KI-Nutzung und Infrastruktur, um Ihren individuellen Ausgangspunkt zu erfassen und den besten Weg nach vorne zu identifizieren.",
    "index.approach.step2.title": "KI-Infrastruktur einrichten",
    "index.approach.step2.desc": "Wir implementieren eine sichere KI-Infrastruktur mit leistungsstarken Modellen und richten eine benutzerfreundliche Oberfläche für Ihre Mitarbeiter ein. Dies schafft die Grundlage für Erkundung und Implementierung.",
    "index.approach.step3.title": "Strategischer Workshop & Chancenidentifikation",
    "index.approach.step3.desc": "Wir führen praxisorientierte Workshops durch, in denen Ihr Team KI für echte Aufgaben erkundet, während wir gemeinsam die vielversprechendsten Automatisierungsmöglichkeiten identifizieren.",
    "index.approach.step4.title": "Workflow-Analyse & Priorisierung",
    "index.approach.step4.desc": "Wir bewerten Automatisierungs-Workflows nach Komplexität und strategischem Wert, um uns zuerst auf Ihre grössten Schmerzpunkte zu konzentrieren und redundante Lösungen zu vermeiden.",
    "index.approach.step5.title": "Systematische Implementierung & Monitoring",
    "index.approach.step5.desc": "Wir setzen unser Agent Cockpit für Echtzeit-Monitoring ein und implementieren systematisch Automatisierungslösungen Schritt für Schritt, um messbaren Mehrwert in jeder Phase sicherzustellen.",
    "index.approach.conclusion": "Dieser partnerschaftliche Ansatz stellt sicher, dass wir uns auf die Automatisierung Ihrer tatsächlichen Schmerzpunkte konzentrieren, anstatt Einheitslösungen zu liefern. Gemeinsam verwandeln wir KI von einem überwältigenden Konzept in praktische, wertvolle Automatisierung, die echte Geschäftsergebnisse liefert.",

    // Index page - Workshop Service
    "index.workshop.title": "KI-Strategie-Workshop",
    "index.workshop.desc": "Navigieren Sie mit Zuversicht durch die komplexe KI-Landschaft und identifizieren Sie Ihre besten Chancen. Unser strukturierter Workshop schneidet durch den Hype und liefert umsetzbare Erkenntnisse, die auf Ihr Unternehmen zugeschnitten sind.",
    "index.workshop.item1.title": "Technologie-Landschaftsanalyse",
    "index.workshop.item1.desc": "Verstehen Sie verfügbare Modelle, Tools und aufkommende Technologien. Wir helfen Ihnen, echte Chancen von Marketing-Lärm zu unterscheiden.",
    "index.workshop.item2.title": "Sicherheits- & Validierungsrahmen",
    "index.workshop.item2.desc": "Erfahren Sie, welche Daten Sie sicher mit öffentlichen KI-Tools verarbeiten können und welche private Lösungen erfordern. Erhalten Sie klare Richtlinien zum Risikomanagement.",
    "index.workshop.item3.title": "Strategische Priorisierung",
    "index.workshop.item3.desc": "Arbeiten Sie mit Ihrem Team zusammen, um KI-Chancen nach Implementierungskomplexität und strategischem Wert zu identifizieren und zu bewerten.",
    "index.workshop.cta": "Workshop entdecken →",

    // Index page - Private AI Service
    "index.privateAi.title": "Private KI-Lösungen",
    "index.privateAi.desc": "Nutzen Sie die Kraft der KI und behalten Sie dabei die vollständige Kontrolle über Ihre sensiblen Daten. Von Cloud-basierten privaten Instanzen bis hin zu vollständig lokalen Implementierungen – wir sorgen dafür, dass Ihre kritischen Informationen sicher bleiben.",
    "index.privateAi.item1.title": "Cloud-basierte Private Instanzen",
    "index.privateAi.item1.desc": "EU- und Schweizer Server-Hosting gewährleistet Datenkonformität mit lokalen Vorschriften. Geniessen Sie erstklassige KI-Modelle in einer vollständig isolierten Umgebung.",
    "index.privateAi.item2.title": "Lokale KI-Implementierung",
    "index.privateAi.item2.desc": "Wir können bei der Einrichtung spezialisierter lokaler Hardware für KI-Inferenz helfen.",
    "index.privateAi.item3.title": "Balance zwischen Leistung & Sicherheit",
    "index.privateAi.item3.desc": "Erleben Sie optimale Leistung bei 100% Datenkontrolle.",
    "index.privateAi.cta": "Private KI entdecken →",

    // Index page - Agents Service
    "index.agents.title": "Massgeschneiderte KI-Agenten",
    "index.agents.desc": "Verwandeln Sie KI in zuverlässige digitale Teammitglieder, die rund um die Uhr arbeiten. Unsere Agenten integrieren sich nahtlos in Ihre Workflows und erledigen Routineaufgaben mit konstanter Genauigkeit, während sich Ihr Team auf strategische Initiativen konzentriert.",
    "index.agents.item1.title": "Gebaut für Zuverlässigkeit",
    "index.agents.item1.desc": "Im Gegensatz zu Systemen, die vollständig auf LLMs angewiesen sind, setzen unsere Agenten diese strategisch für unstrukturierte Eingaben ein und führen dann Transformationen deterministisch für maximale Zuverlässigkeit durch.",
    "index.agents.item2.title": "Transparente Abläufe",
    "index.agents.item2.desc": "Unser Agent Cockpit bietet Echtzeit-Einblick in die Arbeit Ihres digitalen Teammitglieds, dessen Backlog und detaillierte Ergebnisvisualisierungen.",
    "index.agents.item3.title": "3-Phasen-Implementierung",
    "index.agents.item3.desc": "Wir bauen, testen und verfeinern Ihren Agenten, bis er Ihre genauen Anforderungen erfüllt. Sie validieren die Ergebnisse in jeder Phase und stellen so vollständige Zufriedenheit sicher.",
    "index.agents.cta": "Unsere Agenten kennenlernen →",

    // Index page - CTA
    "index.cta.title": "Hören Sie auf, Stunden mit manueller Arbeit zu verlieren",
    "index.cta.subtitle": "Transformieren Sie Ihr Unternehmen mit KI, die wirklich funktioniert.",
    "index.cta.button": "Kostenlose Beratung",

    // Workshop page
    "workshop.hero.title": "KI-Strategie-Workshop",
    "workshop.hero.subtitle": "Entdecken Sie Ihre besten KI-Chancen und erstellen Sie eine klare Roadmap für die Implementierung.",
    "workshop.intro.title": "Von KI-Verwirrung zu klarer Strategie",
    "workshop.intro.desc": "Navigieren Sie mit Zuversicht durch die KI-Landschaft. Unser Workshop schneidet durch den Hype, um echte Chancen zu identifizieren, die messbaren Geschäftswert für Ihre Organisation schaffen.",
    "workshop.intro.item1.title": "Technologie-Landschaftsübersicht",
    "workshop.intro.item1.desc": "Verstehen Sie das aktuelle KI-Ökosystem, verfügbare Modelle und Tools. Wir geben Einblicke in den schnellen Entwicklungsprozess und helfen Ihnen, echte Chancen von Marketing-Hype zu unterscheiden.",
    "workshop.intro.item2.title": "Sicherheits- & Validierungseinblicke",
    "workshop.intro.item2.desc": "Lernen Sie kritische Datensicherheitsaspekte und Ergebnisvalidierungstechniken. Entdecken Sie, welche Daten Sie sicher mit öffentlichen KI-Tools verwenden können und welche private Lösungen erfordern.",
    "workshop.intro.item3.title": "Strategische Chancenkartierung",
    "workshop.intro.item3.desc": "Identifizieren und priorisieren Sie Ihre wertvollsten KI-Anwendungen mit bewährten Entscheidungsrahmen. Verlassen Sie den Workshop mit einer nach Komplexität und strategischer Bedeutung geordneten Liste von Chancen.",
    "workshop.outcomes.title": "Was Sie erreichen werden",
    "workshop.outcomes.intro": "Verlassen Sie den Workshop mit einer klaren KI-Strategie, priorisierten Chancen und der Grundlage für eine erfolgreiche Implementierung. Unser strukturierter Ansatz stellt sicher, dass Sie die wertvollsten Anwendungen für Ihren spezifischen Geschäftskontext identifizieren.",
    "workshop.outcomes.item1.title": "Praktisches KI-Wissen",
    "workshop.outcomes.item1.desc": "Tiefes Verständnis der KI-Landschaft, verfügbarer Tools und aufkommender Technologien. Schneiden Sie durch den Hype und konzentrieren Sie sich auf Lösungen, die echten Geschäftswert liefern.",
    "workshop.outcomes.item1.tag": "Technologie-Einblicke",
    "workshop.outcomes.item2.title": "Team-Vertrauen & Akzeptanz",
    "workshop.outcomes.item2.desc": "Ihr Team gewinnt praktische KI-Erfahrung, reduzierte Ängste bezüglich der Einführung und ein gemeinsames Verständnis für die bevorstehende Transformationsreise. Grundlage für erfolgreiche Implementierung.",
    "workshop.outcomes.item2.tag": "Change Management",
    "workshop.outcomes.item3.title": "Sicherheits- & Risikorahmen",
    "workshop.outcomes.item3.desc": "Klare Richtlinien für Datenhandhabung, Sicherheitsanforderungen und Validierungsprozesse. Verstehen Sie, was mit öffentlichen Tools verarbeitet werden kann und was private KI-Lösungen erfordert.",
    "workshop.outcomes.item3.tag": "Risikomanagement",
    "workshop.outcomes.item4.title": "Priorisierte KI-Roadmap",
    "workshop.outcomes.item4.desc": "Erhalten Sie eine umfassende Analyse Ihrer KI-Chancen, geordnet nach Implementierungskomplexität, Robustheit und strategischem Wert. Wissen Sie genau, worauf Sie Ihre Bemühungen zuerst konzentrieren sollten.",
    "workshop.outcomes.item4.tag": "Strategische Planung",
    "workshop.cta.title": "Bereit, KI-Verwirrung in Wettbewerbsvorteil zu verwandeln?",
    "workshop.cta.subtitle": "Starten Sie Ihre KI-Reise mit unserem umfassenden Bildungs-Workshop.",
    "workshop.cta.button": "Workshop buchen",

    // Private AI page
    "privateAi.hero.title": "Private KI-Lösungen",
    "privateAi.hero.subtitle": "Halten Sie Ihre kritischen und vertraulichen Daten sicher, während Sie die Kraft der KI nutzen.<br>Keine Kompromisse bei der Privatsphäre. Keine Kompromisse bei der Leistung.",
    "privateAi.why.title": "Warum Private KI?",
    "privateAi.why.intro": "Moderne KI-Modelle wie ChatGPT haben Hunderte von Milliarden Parametern und benötigen hochspezialisierte Hardware, um mit nützlicher Geschwindigkeit zu laufen. Deshalb verlassen sich die meisten Unternehmen auf Cloud-Anbieter. Aber wenn Sie KI online nutzen, kommt immer eine wichtige Frage auf:",
    "privateAi.why.question": "Was passiert mit Ihren Daten?",
    "privateAi.why.answer": "Die meisten Geschäftsprozesse beinhalten sensible oder sogar regulierte Daten. Diese einfach in einen öffentlichen KI-Dienst einzugeben, ist selten eine Option. Hier kommen unsere Private KI-Lösungen ins Spiel: sichere, massgeschneiderte Setups, die es Ihnen ermöglichen, KI mit vollem Vertrauen zu nutzen.",
    "privateAi.cloud.title": "1. Cloud-Lösung – Skalierbar & Immer aktuell",
    "privateAi.cloud.desc": "Unsere Cloud-Lösung ist die beste Wahl, wenn Sie Skalierbarkeit und die neuesten KI-Fähigkeiten wünschen.",
    "privateAi.cloud.item1.title": "EU- & Schweizer Konformität",
    "privateAi.cloud.item1.desc": "Läuft auf EU- oder Schweizer Servern und gewährleistet lokale Datenhaltung und Compliance.",
    "privateAi.cloud.item2.title": "Logisch private Instanz",
    "privateAi.cloud.item2.desc": "Ihre Daten sind von anderen Nutzern isoliert. Microsoft garantiert: Daten werden nur zur Bereitstellung des Dienstes verwendet, niemals gespeichert oder wiederverwendet.",
    "privateAi.cloud.item3.title": "Neueste KI-Modelle",
    "privateAi.cloud.item3.desc": "Immer Zugang zu den neuesten Modellen, ohne Hardware-Einschränkungen. Perfekt für Teams mit vielen Nutzern, hoher Arbeitslast oder sich schnell ändernden KI-Anforderungen.",
    "privateAi.cloud.bestFor": "<strong>Am besten für:</strong> Unternehmen, die maximale Leistung, Skalierbarkeit und regulatorische Konformität mit starken Datenschutzgarantien wünschen.",
    "privateAi.local.title": "2. Lokale Lösung – Ultimative Kontrolle",
    "privateAi.local.desc": "Wenn Ihre oberste Priorität die absolute Kontrolle über Ihre Daten ist, bieten wir auch ein vollständig lokales Setup an.",
    "privateAi.local.item1.title": "Spezialisierte Hardware",
    "privateAi.local.item1.desc": "Geliefert mit einem spezialisierten Rack-System, das wir für optimale Kosten und KI-Leistung entwickelt haben.",
    "privateAi.local.item2.title": "Open-Source-Modelle",
    "privateAi.local.item2.desc": "Betreibt leistungsstarke Open-Source-KI-Modelle mit nutzbarer Geschwindigkeit, ohne millionenteure Hardware zu benötigen.",
    "privateAi.local.item3.title": "Vollständige Kontrolle",
    "privateAi.local.item3.desc": "Auf Ihre Geschäftsanforderungen zugeschnitten: Wir passen Modellgrösse und Hardware-Konfiguration je nach Ihren Ausgabeanforderungen an. Ihre Daten verlassen niemals Ihre Räumlichkeiten, sodass Sie die volle Kontrolle haben.",
    "privateAi.local.bestFor": "<strong>Am besten für:</strong> Organisationen mit hochvertraulichen Daten oder strengen regulatorischen Umgebungen, die keine Cloud-Nutzung erlauben.",
    "privateAi.beyond.title": "Mehr als nur KI-Zugang",
    "privateAi.beyond.intro": "Private KI einzurichten bedeutet mehr als nur sicheren Zugang zu einem KI-Modell zu erhalten. Es ist eine Grundlage für zukünftige Innovation.",
    "privateAi.beyond.item1.title": "Sicheres Experimentieren",
    "privateAi.beyond.item1.desc": "Ihre private KI-Umgebung bietet die perfekte Grundlage für sicheres Experimentieren mit KI-Technologien und ermöglicht es Ihnen, Möglichkeiten zu erkunden, ohne sensible Daten zu gefährden.",
    "privateAi.beyond.item2.title": "Grundlage für Automatisierung",
    "privateAi.beyond.item2.desc": "Einmal eingerichtet, wird Ihre private KI zur Grundlage für alle folgenden Automatisierungsprojekte, von der Dokumentenverarbeitung bis hin zu umfassenden KI-gesteuerten Geschäfts-Workflows.",
    "privateAi.cta.title": "Bereit, Ihre KI-Reise abzusichern?",
    "privateAi.cta.subtitle": "Wir helfen Ihnen, das richtige Setup für Ihr Unternehmen zu finden.",
    "privateAi.cta.button": "Kostenlose Beratung",

    // Agents page
    "agents.hero.title": "Wir verwandeln KI in Ihr massgeschneidertes digitales Teammitglied",
    "agents.hero.subtitle": "Befreien Sie Ihr Team, um sich auf kreative, wertschöpfende Arbeit zu konzentrieren, während KI die Routineaufgaben übernimmt.",
    "agents.philosophy.title": "Unsere Philosophie",
    "agents.philosophy.intro": "Wir glauben, dass es bei der Entwicklung erfolgreicher Agenten-Integrationen einige wichtige Dinge zu beachten gibt.",
    "agents.philosophy.item1.title": "Gebaut für Zuverlässigkeit",
    "agents.philosophy.item1.desc": "Anstatt Agenten zu bauen, die in 50% der Fälle erstaunliche Ergebnisse liefern, wie es viele vollautonome Agentensysteme bewerben, glauben wir an den grossen Wert sorgfältig gestalteter Systeme. Wir nutzen LLMs bei unsicheren Strukturen, verwenden sie systematisch zur Datenrestrukturierung und führen dann Transformationen deterministisch durch. Dieser Ansatz verbessert die Gesamtsystemzuverlässigkeit und Erklärbarkeit – entscheidende Eigenschaften für stark regulierte Aufgaben.",
    "agents.philosophy.item2.title": "Transparente Abläufe",
    "agents.philosophy.item2.desc": "Unser Agent Cockpit gibt Ihnen einen einzigartigen Einblick in die Arbeit des Agenten, dessen aktuelles Backlog und durchdachte Visualisierungen der Ergebnisse. Dies ermöglicht es Kollegen, Ergebnisse einfach zu bestätigen, baut Vertrauen auf und macht alles validierbar und Entscheidungen nachvollziehbar.",
    "agents.philosophy.item3.title": "Intuitive Integration",
    "agents.philosophy.item3.desc": "Wir nutzen LLM-Fähigkeiten, um die Nutzung so intuitiv wie möglich zu gestalten – es sollte sich anfühlen wie das Onboarding eines weiteren Mitarbeiters. Unsere Agenten integrieren sich nahtlos über Standard-Geschäftskommunikationskanäle wie E-Mail oder andere Plattformen.",
    "agents.demo.title": "Von überwältigt zu automatisiert",
    "agents.demo.subtitle": "Sehen Sie die Transformation in Aktion. Beobachten Sie, wie unsere KI-Agenten komplexe, zeitaufwändige Aufgaben von Ihren Schultern nehmen, während Sie durch unser Monitoring-Interface die volle Kontrolle behalten.",
    "agents.meet.title": "Lernen Sie unsere Agenten kennen",
    "agents.meet.intro": "Jedes Team verdient zuverlässige Kollegen. Unsere sind zufällig digital. Dies sind die KI-Agenten, die wir für regulierte Umgebungen entwickeln. Jeder ist darauf ausgelegt, spezifische, komplexe Workflows zu handhaben, die derzeit Stunden menschlicher Zeit verbrauchen. Sehen Sie genau, wie sie sich in Ihre Prozesse integrieren und die Zuverlässigkeit liefern würden, die Ihr Unternehmen verlangt.",
    "agents.reto.title": "Der Onboarding-Agent",
    "agents.reto.name": "Reto",
    "agents.reto.desc": "Reto kümmert sich um das Kunden-Onboarding in regulierten Umgebungen. Von der Überprüfung von KYC-Dokumenten für Einzelpersonen und juristische Personen bis hin zur Sicherstellung von Compliance-Prüfungen – Reto entlastet Ihre Rechts- und Compliance-Teams von repetitiver Arbeit. Er integriert sich reibungslos in Ihren Workflow, genau wie ein weiteres Teammitglied.",
    "agents.beat.title": "Der Prüfungs-Agent",
    "agents.beat.name": "Beat",
    "agents.beat.desc": "Beat automatisiert Bilanzprüfungen und Dokumentenvorbereitung. Anstatt Jahresabschlüsse manuell in Tabellenkalkulationen zu übertragen und Validierungen durchzuführen, übernimmt Beat diese Schritte mit Präzision und Geschwindigkeit. Er unterstützt Ihr Prüfungsteam dabei, Genauigkeit zu gewährleisten und gleichzeitig wertvolle Stunden zu sparen.",
    "agents.comingSoon.title": "Weitere Agenten kommen bald",
    "agents.comingSoon.desc": "Wir entwickeln ständig neue KI-Agenten für verschiedene Branchen und Anwendungsfälle. Von der Verarbeitung juristischer Dokumente bis zur Automatisierung des Kundenservice – Ihr nächstes digitales Teammitglied ist auf dem Weg.",
    "agents.comingSoon.badge": "Bleiben Sie dran",
    "agents.custom.title": "Anderer Prozess, gleicher Ansatz",
    "agents.custom.intro": "Jedes Unternehmen hat repetitive Workflows, die wertvolle Zeit verbrauchen – sei es Dokumentenverarbeitung, Datenvalidierung, Compliance-Prüfungen oder Genehmigungsworkflows. Wir konzentrieren uns darauf, die spezifischen Schritte, Regeln und Anforderungen zu verstehen, die Ihre Prozesse einzigartig machen. Lassen Sie uns gemeinsam erkunden, wie wir Ihren speziellen Workflow automatisieren und einen KI-Agenten bauen können, der Ihre genauen Prozessanforderungen erfüllt.",
    "agents.slider.text1": "Schieben zum Freischalten",
    "agents.slider.text2": "Ihres eigenen Agenten",
    "agents.pricing.title": "KI als Teammitglied",
    "agents.pricing.intro": "Unser 3-Phasen-Ansatz stellt sicher, dass Ihr KI-Agent Aufgaben zu Ihrer vollsten Zufriedenheit erledigt. Wir bauen, testen und verfeinern, bis der Agent Ihre genauen Anforderungen erfüllt. In jeder Phase validieren Sie die Ergebnisse, bevor es weitergeht, und garantieren so eine Lösung, die wirklich für Ihr Unternehmen funktioniert.",
    "agents.pricing.approach": "Unser 3-Phasen-Ansatz",
    "agents.pricing.phase1.title": "Lernphase",
    "agents.pricing.phase1.item1": "Anforderungsanalyse",
    "agents.pricing.phase1.item2": "Prozessmapping",
    "agents.pricing.phase1.item3": "Erste Entwicklung",
    "agents.pricing.phase1.duration": "1-3 Monate",
    "agents.pricing.phase2.title": "Praktikumsphase",
    "agents.pricing.phase2.item1": "Live-Deployment",
    "agents.pricing.phase2.item2": "Leistungsüberwachung",
    "agents.pricing.phase2.item3": "Kontinuierliches Feedback",
    "agents.pricing.phase2.duration": "1-3 Monate",
    "agents.pricing.phase3.title": "Festanstellung",
    "agents.pricing.phase3.item1": "Voll trainierter Agent",
    "agents.pricing.phase3.item2": "24/7 Verfügbarkeit",
    "agents.pricing.phase3.item3": "Laufende Unterstützung",
    "agents.pricing.phase3.duration": "Unbegrenzt",
    "agents.cta.title": "Bereit, ein digitales Teammitglied zu Ihrem Unternehmen hinzuzufügen?",
    "agents.cta.subtitle": "Sehen Sie, wie unsere KI-Agenten sich nahtlos in Ihre Workflows integrieren können.",
    "agents.cta.button": "Kontaktieren Sie uns",

    // Team page
    "team.hero.title": "Lernen Sie unser Team kennen",
    "team.hero.subtitle": "Hinter LLMify steht ein leidenschaftliches Team von Experten, das tiefes technisches Wissen mit bewährter Geschäftserfahrung kombiniert, um die Art und Weise zu revolutionieren, wie Unternehmen mit KI arbeiten.",
    "team.section.title": "Unser Team",
    "team.axel.role": "Entwickler",
    "team.axel.roleDesc": "Gründer",
    "team.axel.education": "Informatik, ETH Zürich",
    "team.francesco.role": "Entwickler",
    "team.francesco.education": "Informatik, ETH Zürich",
    "team.niklas.role": "Entwickler",
    "team.niklas.education": "Informatik, ETH Zürich",
    "team.philipp.role": "Verwaltungsratspräsident",
    "team.philipp.education": "Gründer von Z22 Technologies AG und Araneum Technologies GmbH",
    "team.armin.role": "Verwaltungsratsmitglied",
    "team.armin.education": "Gründer von Z22 Technologies AG und Araneum Technologies GmbH",
    "team.matthias.role": "Verwaltungsratsmitglied",
    "team.matthias.education": "Managing Partner bei Interpharma Link",
    "team.cta.title": "Bereit, mit unserem Team zu arbeiten?",
    "team.cta.subtitle": "Lassen Sie uns besprechen, wie unsere Expertise Ihr Unternehmen mit KI transformieren kann.",
    "team.cta.button": "Kontakt aufnehmen",

    // Contact page
    "contact.hero.title": "Kontakt",
    "contact.hero.subtitle": "Haben Sie Fragen oder möchten Sie mehr erfahren? Nehmen Sie Kontakt mit unserem Team auf.",
    "contact.form.title": "Senden Sie uns eine Nachricht",
    "contact.form.subtitle": "Bevorzugen Sie ein Kontaktformular? Füllen Sie die Details unten aus und wir melden uns bei Ihnen.",
    "contact.form.name": "Name",
    "contact.form.namePlaceholder": "Ihr Name",
    "contact.form.email": "E-Mail",
    "contact.form.emailPlaceholder": "Ihre E-Mail",
    "contact.form.message": "Nachricht",
    "contact.form.messagePlaceholder": "Wie können wir Ihnen bei der KI-Integration helfen?",
    "contact.form.submit": "Nachricht senden",

    // Common
    "common.scroll": "Scrollen",
    "common.learnMore": "Mehr erfahren",

    // Footer
    "footer.copyright": "© 2025 LLMify. Alle Rechte vorbehalten.",
    "footer.privacy": "Datenschutz",
    "footer.impressum": "Impressum",
    "footer.cookies": "Cookie-Einstellungen",

    // Cookie banner
    "cookie.text": "Diese Website verwendet Cookies, um Ihnen das beste Erlebnis auf unserer Website zu bieten.",
    "cookie.decline": "Ablehnen",
    "cookie.accept": "Akzeptieren",

    // Modals
    "modal.privacy.title": "Datenschutzerklärung",
    "modal.privacy.updated": "Zuletzt aktualisiert: Januar 2025",
    "modal.privacy.section1.title": "1. Welche Informationen wir sammeln",
    "modal.privacy.section1.text": "Wir sammeln Informationen, die Sie uns direkt zur Verfügung stellen, z.B. wenn Sie uns über unser Website-Formular kontaktieren. Dies kann Ihren Namen, Ihre E-Mail-Adresse und den Nachrichteninhalt umfassen.",
    "modal.privacy.section2.title": "2. Wie wir Ihre Informationen verwenden",
    "modal.privacy.section2.intro": "Wir verwenden die gesammelten Informationen, um:",
    "modal.privacy.section2.list": "• Auf Ihre Anfragen zu antworten und Kundensupport zu bieten<br>• Unsere Dienste zu verbessern und neue Funktionen zu entwickeln<br>• Ihnen Marketingmitteilungen zu senden (mit Ihrer Zustimmung)<br>• Gesetzlichen Verpflichtungen nachzukommen",
    "modal.privacy.section3.title": "3. Datensicherheit",
    "modal.privacy.section3.text": "Wir implementieren angemessene technische und organisatorische Sicherheitsmassnahmen, um Ihre personenbezogenen Daten vor unbefugtem Zugriff, Änderung, Offenlegung oder Zerstörung zu schützen. Die gesamte Datenverarbeitung erfolgt in Übereinstimmung mit den Schweizer Datenschutzgesetzen.",
    "modal.privacy.section4.title": "4. Ihre Rechte",
    "modal.privacy.section4.intro": "Nach Schweizer Datenschutzrecht haben Sie das Recht auf:",
    "modal.privacy.section4.list": "• Zugang zu Ihren personenbezogenen Daten<br>• Berichtigung unrichtiger Daten<br>• Löschung Ihrer Daten<br>• Widerspruch gegen die Datenverarbeitung<br>• Datenübertragbarkeit",
    "modal.privacy.section5.title": "5. Kontaktieren Sie uns",
    "modal.privacy.section5.text": "Wenn Sie Fragen zu dieser Datenschutzerklärung haben, kontaktieren Sie uns bitte über unser Kontaktformular.",

    "modal.impressum.title": "Impressum",
    "modal.impressum.company.title": "Unternehmensinformationen",
    "modal.impressum.company.text": "<strong>LLMify AG</strong><br>Alte Steinhauserstrasse 19<br>6330 Cham<br>Schweiz",
    "modal.impressum.company.details": "<strong>Rechtsform:</strong> Aktiengesellschaft<br><strong>Handelsregisternummer:</strong> CHE-479.856.227<br><strong>Sitz:</strong> Cham, Schweiz",
    "modal.impressum.purpose.title": "Geschäftszweck",
    "modal.impressum.purpose.text": "Softwareentwicklung und der Verkauf von Dienstleistungen, Produkten und Beratung im IT-Bereich.",
    "modal.impressum.contact.title": "Kontaktinformationen",
    "modal.impressum.contact.text": "<strong>Adresse:</strong> Alte Steinhauserstrasse 19, 6330 Cham, Schweiz<br><strong>E-Mail:</strong> Kontaktieren Sie uns über unser Kontaktformular<br><strong>Website:</strong> www.llmify.ch",
    "modal.impressum.regulatory.title": "Regulatorische Informationen",
    "modal.impressum.regulatory.text": "<strong>Handelsregister:</strong> Eingetragen im Handelsregister des Kantons Zug<br><strong>Registrierungsdatum:</strong> 19. März 2025<br><strong>Offizielle Publikation:</strong> Schweizerisches Handelsamtsblatt (SHAB)",
    "modal.impressum.disclaimer.title": "Haftungsausschluss",
    "modal.impressum.disclaimer.text": "Die Informationen auf dieser Website werden ohne Gewähr bereitgestellt. Im weitesten gesetzlich zulässigen Umfang schliesst LLMify AG alle Zusicherungen, Garantien, Verpflichtungen und Gewährleistungen in Bezug auf den Inhalt dieser Website aus.",
    "modal.impressum.copyright.title": "Urheberrecht",
    "modal.impressum.copyright.text": "Alle Inhalte dieser Website, einschliesslich Texte, Grafiken, Logos und Bilder, sind Eigentum der LLMify AG und durch Urheberrechtsgesetze geschützt. Unbefugte Nutzung ist untersagt.",
    "modal.impressum.law.title": "Anwendbares Recht",
    "modal.impressum.law.text": "Diese Website und ihre Inhalte unterliegen dem Schweizer Recht. Alle Streitigkeiten, die sich aus der Nutzung dieser Website ergeben, unterliegen der ausschliesslichen Zuständigkeit der Schweizer Gerichte, mit Gerichtsstand in Zug, Schweiz.",

    // Demo/Booking modal
    "modal.demo.title": "Demo buchen",
    "modal.demo.intro": "Lassen Sie uns erkunden, wie LLMify Ihr Unternehmen mit massgeschneiderten KI-Lösungen transformieren kann. Füllen Sie das Formular unten aus und wir vereinbaren eine personalisierte Demo.",
    "modal.demo.name": "Vollständiger Name *",
    "modal.demo.namePlaceholder": "Ihr vollständiger Name",
    "modal.demo.email": "Geschäftliche E-Mail *",
    "modal.demo.emailPlaceholder": "ihre.email@firma.com",
    "modal.demo.company": "Firmenname *",
    "modal.demo.companyPlaceholder": "Ihre Firma",
    "modal.demo.role": "Ihre Rolle",
    "modal.demo.rolePlaceholder": "z.B. CTO, Produktmanager",
    "modal.demo.useCase": "Hauptanwendungsfall *",
    "modal.demo.useCaseDefault": "Wählen Sie Ihr Hauptinteresse",
    "modal.demo.useCasePrivacy": "Datenschutz & Schweizer Hosting",
    "modal.demo.useCaseProcess": "Prozessoptimierung",
    "modal.demo.useCaseIntegration": "Individuelle LLM-Integration",
    "modal.demo.useCaseConsulting": "KI-Strategieberatung",
    "modal.demo.useCaseOther": "Sonstiges",
    "modal.demo.description": "Erzählen Sie uns von Ihrem Projekt",
    "modal.demo.descriptionPlaceholder": "Beschreiben Sie kurz Ihre KI-Integrationsbedürfnisse oder aktuellen Herausforderungen...",
    "modal.demo.timeline": "Zeitrahmen",
    "modal.demo.timelineDefault": "Wann planen Sie die Implementierung?",
    "modal.demo.timelineImmediate": "Sofort (innerhalb 1 Monat)",
    "modal.demo.timelineShort": "Kurzfristig (1-3 Monate)",
    "modal.demo.timelineMedium": "Mittelfristig (3-6 Monate)",
    "modal.demo.timelineLong": "Langfristig (6+ Monate)",
    "modal.demo.timelineResearch": "Recherchephase",
    "modal.demo.preferredTime": "Bevorzugte Demo-Zeit",
    "modal.demo.preferredTimeDefault": "Bevorzugte Zeit wählen",
    "modal.demo.preferredTimeMorning": "Vormittag (9-12 MEZ)",
    "modal.demo.preferredTimeAfternoon": "Nachmittag (12-17 MEZ)",
    "modal.demo.preferredTimeEvening": "Abend (17-19 MEZ)",
    "modal.demo.preferredTimeFlexible": "Flexibel",
    "modal.demo.submit": "Demo vereinbaren",

    // Workshop booking modal
    "modal.workshop.title": "Workshop buchen",
    "modal.workshop.intro": "Transformieren Sie die Beziehung Ihres Teams zur KI durch unseren umfassenden Bildungs-Workshop. Füllen Sie das Formular unten aus und wir vereinbaren eine massgeschneiderte Session für Ihre Organisation.",
    "modal.workshop.rolePlaceholder": "z.B. HR-Direktor, CTO",
    "modal.workshop.teamSize": "Teamgrösse *",
    "modal.workshop.teamSizeDefault": "Teamgrösse wählen",
    "modal.workshop.teamSize5": "5-15 Personen",
    "modal.workshop.teamSize16": "16-30 Personen",
    "modal.workshop.teamSize31": "31-50 Personen",
    "modal.workshop.teamSize50": "50+ Personen",
    "modal.workshop.format": "Bevorzugtes Format",
    "modal.workshop.formatDefault": "Format wählen",
    "modal.workshop.formatHalf": "Halbtag (4 Stunden)",
    "modal.workshop.formatFull": "Ganztag (8 Stunden)",
    "modal.workshop.formatMulti": "Mehrtägiges Programm",
    "modal.workshop.formatFlexible": "Flexibel",
    "modal.workshop.description": "Erzählen Sie uns von der KI-Erfahrung und den Zielen Ihres Teams",
    "modal.workshop.descriptionPlaceholder": "Beschreiben Sie den aktuellen KI-Wissensstand Ihres Teams, spezifische Interessen oder Herausforderungen, die der Workshop ansprechen soll...",
    "modal.workshop.timeline": "Zeitrahmen",
    "modal.workshop.timelineDefault": "Wann möchten Sie den Workshop durchführen?",
    "modal.workshop.timeline2weeks": "Innerhalb von 2 Wochen",
    "modal.workshop.timeline1month": "Innerhalb von 1 Monat",
    "modal.workshop.timeline3months": "Innerhalb von 3 Monaten",
    "modal.workshop.timelineFlexible": "Flexible Terminierung",
    "modal.workshop.location": "Standortpräferenz",
    "modal.workshop.locationDefault": "Präferenz wählen",
    "modal.workshop.locationOnsite": "Vor Ort in unserem Büro",
    "modal.workshop.locationVirtual": "Virtueller Workshop",
    "modal.workshop.locationHybrid": "Hybridformat",
    "modal.workshop.locationFlexible": "Keine Präferenz",
    "modal.workshop.submit": "Workshop buchen"
  }
};

// Current language (default: German)
let currentLanguage = localStorage.getItem('language') || 'de';

// Get translation by key
function t(key) {
  return translations[currentLanguage][key] || translations['en'][key] || key;
}

// Apply translations to all elements with data-i18n attribute
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = t(key);

    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      if (element.placeholder) {
        element.placeholder = translation;
      }
    } else if (element.tagName === 'OPTION') {
      element.textContent = translation;
    } else {
      // Check if translation contains HTML
      if (translation.includes('<') && translation.includes('>')) {
        element.innerHTML = translation;
      } else {
        element.textContent = translation;
      }
    }
  });

  // Update HTML lang attribute
  document.documentElement.lang = currentLanguage;

  // Update language selector button
  updateLanguageButton();
}

// Update language selector button display
function updateLanguageButton() {
  const langBtn = document.querySelector('.language-btn');
  if (langBtn) {
    const code = currentLanguage.toUpperCase();
    langBtn.querySelector('.lang-code').textContent = code;
  }

  // Update active state in dropdown
  document.querySelectorAll('.language-option').forEach(option => {
    const lang = option.getAttribute('data-lang');
    option.classList.toggle('active', lang === currentLanguage);
  });
}

// Switch language
function switchLanguage(lang) {
  if (lang === currentLanguage) return;

  currentLanguage = lang;
  localStorage.setItem('language', lang);
  applyTranslations();

  // Close dropdown
  const dropdown = document.querySelector('.language-dropdown');
  if (dropdown) {
    dropdown.classList.remove('show');
  }
}

// Toggle language dropdown
function toggleLanguageDropdown(event) {
  event.stopPropagation();
  const dropdown = document.querySelector('.language-dropdown');
  if (dropdown) {
    dropdown.classList.toggle('show');
  }
}

// Close language dropdown when clicking outside
document.addEventListener('click', function(event) {
  if (!event.target.closest('.language-selector')) {
    const dropdown = document.querySelector('.language-dropdown');
    if (dropdown) {
      dropdown.classList.remove('show');
    }
  }
});

// Dropdown toggle function
function toggleDropdown(event) {
  event.preventDefault();
  const dropdown = event.target.closest('.dropdown');
  const menu = dropdown.querySelector('.dropdown-menu');
  const arrow = dropdown.querySelector('.dropdown-arrow');
  
  // Check if we're on mobile
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    // On mobile, just toggle visibility without animations
    if (menu.style.display === 'block') {
      menu.style.display = 'none';
      arrow.style.transform = 'rotate(0deg)';
    } else {
      // Close other dropdowns first
      document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
        if (otherMenu !== menu) {
          otherMenu.style.display = 'none';
        }
      });
      menu.style.display = 'block';
      arrow.style.transform = 'rotate(180deg)';
    }
  } else {
    // Desktop behavior
    // Close other dropdowns
    document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
      if (otherMenu !== menu) {
        otherMenu.style.opacity = '0';
        otherMenu.style.visibility = 'hidden';
        otherMenu.style.transform = 'translateY(-10px)';
      }
    });
    
    // Toggle current dropdown
    if (menu.style.opacity === '1') {
      menu.style.opacity = '0';
      menu.style.visibility = 'hidden';
      menu.style.transform = 'translateY(-10px)';
      arrow.style.transform = 'rotate(0deg)';
    } else {
      menu.style.opacity = '1';
      menu.style.visibility = 'visible';
      menu.style.transform = 'translateY(0)';
      arrow.style.transform = 'rotate(180deg)';
    }
  }
}

function updateScrollProgress() {
  const scrollProgress = document.querySelector('.scroll-progress');
  if (scrollProgress) {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    scrollProgress.style.width = scrolled + '%';
  }
}

function updateNavbar() {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
}

// Throttled scroll handler using requestAnimationFrame
function handleScroll() {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      updateScrollProgress();
      updateNavbar();
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Fix mobile layout immediately to prevent initial sizing issues
function fixMobileLayout() {
  const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    
    // Force proper viewport constraints
    document.documentElement.style.width = '100%';
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.width = '100%';
    document.body.style.overflowX = 'hidden';
    document.body.style.position = 'relative';
    
    // Fix navigation container immediately
    const navContainer = document.querySelector('.nav-container');
    if (navContainer) {
      navContainer.style.width = '100%';
      navContainer.style.maxWidth = '100%';
      navContainer.style.padding = '0.75rem 4%';
      navContainer.style.margin = '0';
      navContainer.style.boxSizing = 'border-box';
      navContainer.style.position = 'relative';
      navContainer.style.overflow = 'visible';
    }
    
    // Fix navigation element
    const nav = document.querySelector('nav');
    if (nav) {
      nav.style.width = '100%';
      nav.style.maxWidth = '100%';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.position = 'fixed';
      nav.style.overflow = 'visible';
    }
  }
}

// Optimized video autoplay functionality with lazy loading
function initVideoAutoplay() {
  const video = document.getElementById('teaser-video');
  if (!video) return;

  const isLowPerformance = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                          window.innerWidth <= 768 ||
                          (navigator.deviceMemory && navigator.deviceMemory < 4);

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!video.src && video.dataset.src) {
          video.src = video.dataset.src;
          video.load();
        }
        
        if (!isLowPerformance) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              // Video autoplay started successfully
            }).catch(error => {
              // Video autoplay failed (likely due to browser policy)
            });
          }
        }
      } else {
        if (!video.paused) {
          video.pause();
        }
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '50px'
  });

  videoObserver.observe(video);
  video.preload = 'metadata';
}

// Performance optimization utilities
const PerformanceOptimizer = {
  isLowPerformance: false,
  
  init() {
    this.detectPerformance();
    this.optimizeForDevice();
  },
  
  detectPerformance() {
    this.isLowPerformance = 
      (navigator.deviceMemory && navigator.deviceMemory < 2) ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 2) ||
      (navigator.connection && (navigator.connection.effectiveType === 'slow-2g' || navigator.connection.effectiveType === '2g'));
    
    // Performance mode detected
  },
  
  optimizeForDevice() {
    if (this.isLowPerformance) {
      this.disableExpensiveEffects();
      this.reduceAnimationQuality();
      this.optimizeImages();
    }
  },
  
  disableExpensiveEffects() {
    const style = document.createElement('style');
    style.textContent = `
      .card::before,
      .value-point::before,
      .security-feature::before,
      .timeline-content::before,
      .philosophy-card::before,
      .benefit-item::before {
        display: none !important;
      }
      
      .btn, .card, .value-point, .security-feature {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
      }
      
      .glass, .modal-content, .nav-links, nav {
        backdrop-filter: none !important;
      }
      
      .card:hover, .value-point:hover, .security-feature:hover {
        transform: none !important;
      }
    `;
    document.head.appendChild(style);
  },
  
  reduceAnimationQuality() {
    const style = document.createElement('style');
    style.textContent = `
      .fade-in, .slide-in-left, .slide-in-right, .scale-in {
        transition-duration: 0.2s !important;
      }
    `;
    document.head.appendChild(style);
  },
  
  optimizeImages() {
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      img.loading = 'lazy';
    });
  }
};

fixMobileLayout();
PerformanceOptimizer.init();

// OPTIMIZED particle animation - only runs for current page's canvas
function initParticleAnimation() {
  const isVeryLowPerformance = (navigator.deviceMemory && navigator.deviceMemory < 2) ||
                               (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 2) ||
                               (navigator.connection && (navigator.connection.effectiveType === 'slow-2g' || navigator.connection.effectiveType === '2g'));
  
  if (isVeryLowPerformance) {
    // Very low performance device detected - disabling particle animations
    return;
  }

  // Find the canvas that actually exists on this page
  const canvasSelectors = [
    '#hero-particle-canvas',
    '#agents-particle-canvas', 
    '#security-particle-canvas',
    '#team-particle-canvas',
    '#contact-particle-canvas'
  ];
  
  let canvas = null;
  let canvasId = null;
  
  for (const selector of canvasSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      canvas = element;
      canvasId = selector.substring(1); // Remove the # from selector
      break;
    }
  }
  
  if (!canvas) {
    // No particle canvas found on this page
    return;
  }

  // Initializing particles for current page
  
  const ctx = canvas.getContext('2d');
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
  
  let particles = [];
  let connections = [];
  let animationId;
  let isVisible = true;
  let isInViewport = true; // Start as true since hero sections are typically initially visible
  let lastFrameTime = 0;
  let connectionTimer;
  
  const targetFPS = 25;
  const frameInterval = 1000 / targetFPS;
  
  // Page-specific colors
  const colorMap = {
    'hero-particle-canvas': 'rgba(168, 85, 247, ',      // Purple for home
    'agents-particle-canvas': 'rgba(59, 130, 246, ',    // Blue for agents  
    'security-particle-canvas': 'rgba(6, 182, 212, ',   // Cyan for security
    'team-particle-canvas': 'rgba(37, 99, 235, ',       // Deep blue for team
    'contact-particle-canvas': 'rgba(14, 165, 233, '    // Sky blue for contact
  };
  
  const particleColor = colorMap[canvasId] || 'rgba(92, 159, 255, ';
  const connectionColor = particleColor;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    const size = Math.random() * 4 + 3; // Simplified size: 3-7px
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: size,
      opacity: Math.random() * 0.3 + 0.5
    };
  }

  function initParticles() {
    particles = [];
    // Use 50 particles on desktop, 25 on mobile
    const particleCount = isMobile ? 25 : 50;
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
    buildConnections();
    startConnectionTimer();
  }

  function buildConnections() {
    connections = [];
    const maxDistance = isMobile ? 250 : 320; // Increased distance for more connections
    const minConnections = 3; // Guarantee minimum connections per particle
    
    // First pass: Connect particles within maxDistance
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const distance = Math.sqrt(
          Math.pow(particles[i].x - particles[j].x, 2) + 
          Math.pow(particles[i].y - particles[j].y, 2)
        );
        
        if (distance < maxDistance) {
          connections.push({
            i: i,
            j: j,
            opacity: (1 - distance / maxDistance) * 0.6, // Increased opacity
            distance: distance
          });
        }
      }
    }
    
    // Second pass: Ensure each particle has minimum connections
    for (let i = 0; i < particles.length; i++) {
      const particleConnections = connections.filter(conn => conn.i === i || conn.j === i);
      
      if (particleConnections.length < minConnections) {
        // Find nearest particles not yet connected
        const distances = [];
        for (let j = 0; j < particles.length; j++) {
          if (i !== j) {
            const distance = Math.sqrt(
              Math.pow(particles[i].x - particles[j].x, 2) + 
              Math.pow(particles[i].y - particles[j].y, 2)
            );
            const alreadyConnected = connections.some(conn => 
              (conn.i === i && conn.j === j) || (conn.i === j && conn.j === i)
            );
            
            if (!alreadyConnected) {
              distances.push({ index: j, distance: distance });
            }
          }
        }
        
        // Sort by distance and add nearest connections
        distances.sort((a, b) => a.distance - b.distance);
        const needed = minConnections - particleConnections.length;
        
        for (let k = 0; k < needed && k < distances.length; k++) {
          const target = distances[k];
          connections.push({
            i: Math.min(i, target.index),
            j: Math.max(i, target.index),
            opacity: Math.max(0.2, (1 - target.distance / (maxDistance * 1.5)) * 0.5),
            distance: target.distance,
            forced: true // Mark as guaranteed connection
          });
        }
      }
    }
    
    // Rebuilt particle connections
  }

  function startConnectionTimer() {
    if (connectionTimer) clearInterval(connectionTimer);
    connectionTimer = setInterval(() => {
      if (isVisible) {
        buildConnections();
      }
    }, 3000); // 3 seconds as requested
  }

  function updateParticles() {
    particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections first
    connections.forEach(conn => {
      const p1 = particles[conn.i];
      const p2 = particles[conn.j];
      
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = connectionColor + conn.opacity + ')';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
    
    // Draw particles
    particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particleColor + particle.opacity + ')';
      ctx.fill();
      
      // Simple glow effect
      ctx.shadowColor = particleColor + (particle.opacity * 0.6) + ')';
      ctx.shadowBlur = particle.size * 1.2;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  function animate(currentTime) {
    if (!isVisible || !isInViewport) {
      animationId = requestAnimationFrame(animate);
      return;
    }
    
    if (currentTime - lastFrameTime >= frameInterval) {
      updateParticles();
      drawParticles();
      lastFrameTime = currentTime;
    }
    
    animationId = requestAnimationFrame(animate);
  }

  function start() {
    resizeCanvas();
    initParticles();
    animate();
  }

  function stop() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    if (connectionTimer) {
      clearInterval(connectionTimer);
      connectionTimer = null;
    }
    if (intersectionObserver) {
      intersectionObserver.disconnect();
    }
  }

  // Visibility optimization
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  // Viewport visibility optimization
  const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isInViewport = entry.isIntersecting;
      // Particles viewport visibility changed
    });
  }, {
    rootMargin: '100px', // Start animating 100px before entering viewport
    threshold: 0.1 // Trigger when at least 10% of canvas is visible
  });

  intersectionObserver.observe(canvas);

  // Resize handling
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      initParticles();
    }, 250);
  });

  // Cleanup
  window.addEventListener('beforeunload', stop);

  // Start animation
  start();
}

// Toggle mobile navigation menu
function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  const menuIcon = document.querySelector('.menu-icon');
  
  if (navLinks) {
    navLinks.classList.toggle('active');
    if (menuIcon) {
      menuIcon.classList.toggle('active');
    }
  }
}

// Form message helper
function showMessage(message) {
  const messageDiv = document.getElementById("form-message");
  if (messageDiv) {
    messageDiv.innerText = message;
    setTimeout(() => { messageDiv.innerText = ""; }, 3000);
  }
}

// Cookie banner functionality
function showCookieBanner() {
  document.getElementById('cookie-banner').classList.add('show');
}

function hideCookieBanner() {
  document.getElementById('cookie-banner').classList.remove('show');
}

function acceptCookies() {
  localStorage.setItem('cookiesAccepted', 'true');
  hideCookieBanner();
}

function declineCookies() {
  localStorage.setItem('cookiesAccepted', 'false');
  hideCookieBanner();
}

function showCookieSettings() {
  showCookieBanner();
}

// Privacy Modal functionality
function showPrivacyModal() {
  document.getElementById('privacy-modal').classList.add('show');
  document.body.classList.add('modal-open');
}

function hidePrivacyModal() {
  document.getElementById('privacy-modal').classList.remove('show');
  document.body.classList.remove('modal-open');
}

// Impressum Modal functionality
function showImpressumModal() {
  document.getElementById('impressum-modal').classList.add('show');
  document.body.classList.add('modal-open');
}

function hideImpressumModal() {
  document.getElementById('impressum-modal').classList.remove('show');
  document.body.classList.remove('modal-open');
}

// Demo Modal functionality
function showDemoModal() {
  document.getElementById('demo-modal').classList.add('show');
  document.body.classList.add('modal-open');
}

function hideDemoModal() {
  document.getElementById('demo-modal').classList.remove('show');
  document.body.classList.remove('modal-open');
}

function showDemoMessage(message, isError = false) {
  const messageDiv = document.getElementById("demo-message");
  if (messageDiv) {
    messageDiv.innerText = message;
    messageDiv.style.color = isError ? '#ef4444' : '#10b981';
    setTimeout(() => { messageDiv.innerText = ""; }, 5000);
  }
}

// Timeline scroll activation
function initTimelineScrollActivation() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineItems.length === 0) return;
  
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        timelineItems.forEach(item => item.classList.remove('active'));
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.6,
    rootMargin: '-20% 0px -20% 0px'
  });
  
  timelineItems.forEach(item => timelineObserver.observe(item));
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // DOM loaded, initializing components

  // Apply translations on page load
  applyTranslations();

  fixMobileLayout();
  initParticleAnimation(); // Only runs for current page's canvas
  initTimelineScrollActivation();
  
  // Initialize animations
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
  animatedElements.forEach(el => observer.observe(el));
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.dropdown')) {
      const isMobile = window.innerWidth <= 768;
      
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        if (isMobile) {
          menu.style.display = 'none';
        } else {
          menu.style.opacity = '0';
          menu.style.visibility = 'hidden';
          menu.style.transform = 'translateY(-10px)';
        }
      });
      document.querySelectorAll('.dropdown-arrow').forEach(arrow => {
        arrow.style.transform = 'rotate(0deg)';
      });
    }
  });
  
  initVideoAutoplay();
  
  // Contact form submission
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      const formData = new FormData(form);
      const button = form.querySelector('button');
      const originalText = button.textContent;
      
      button.textContent = 'Sending...';
      button.disabled = true;
      
      fetch(form.action, {
        method: form.method,
        headers: { 'Accept': 'application/json' },
        body: formData
      }).then(response => {
        if (response.ok) {
          form.reset();
          showMessage("Message sent successfully! We'll get back to you soon.");
        } else {
          response.json().then(data => {
            if (data.errors) {
              showMessage(data.errors.map(error => error.message).join(", "));
            } else {
              showMessage("Oops! There was a problem submitting your form");
            }
          });
        }
      }).catch(error => {
        showMessage("Oops! There was a problem submitting your form");
      }).finally(() => {
        button.textContent = originalText;
        button.disabled = false;
      });
    });
  }
  
  // Demo form submission
  const demoForm = document.getElementById("demoForm");
  if (demoForm) {
    demoForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const formData = new FormData(demoForm);
      const button = demoForm.querySelector('button');
      const originalText = button.textContent;
      
      button.textContent = 'Scheduling...';
      button.disabled = true;
      
      fetch(demoForm.action, {
        method: demoForm.method,
        headers: { 'Accept': 'application/json' },
        body: formData
      }).then(response => {
        if (response.ok) {
          demoForm.reset();
          // Check form type to show appropriate message
          const formType = formData.get('form_type');
          if (formType === 'workshop_booking') {
            showDemoMessage("Workshop request sent successfully! We'll contact you within 24 hours to schedule your customized workshop session.");
          } else {
            showDemoMessage("Demo request sent successfully! We'll contact you within 24 hours to schedule your personalized demo.");
          }
          setTimeout(() => hideDemoModal(), 2000);
        } else {
          response.json().then(data => {
            if (data.errors) {
              showDemoMessage(data.errors.map(error => error.message).join(", "), true);
            } else {
              showDemoMessage("Oops! There was a problem submitting your request", true);
            }
          });
        }
      }).catch(error => {
        showDemoMessage("Oops! There was a problem submitting your request", true);
      }).finally(() => {
        button.textContent = originalText;
        button.disabled = false;
      });
    });
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      if (href && href.length > 1) { // Check if href exists and is not just '#'
        try {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        } catch (error) {
          // Silently handle invalid selectors
        }
      }
    });
  });
  
  // Cookie banner
  const cookiesAccepted = localStorage.getItem('cookiesAccepted');
  if (cookiesAccepted === null) {
    setTimeout(showCookieBanner, 1000);
  }

  // Initialize slide button
  initializeSlideButton();
});

// Optimized event listeners
window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('resize', fixMobileLayout);
window.addEventListener('orientationchange', () => {
  setTimeout(fixMobileLayout, 100);
});

// Make toggleMenu available globally
window.toggleMenu = toggleMenu;

// Slide Button Functionality
function initializeSlideButton() {
  const slideButton = document.getElementById('customAgentSlider');
  const slideThumb = document.getElementById('slideThumb');
  
  if (!slideButton || !slideThumb) return;

  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let thumbStartX = 0;
  let maxDistance = 0;
  const threshold = 0.8; // 80% of the track needs to be covered

  function calculateMaxDistance() {
    const buttonRect = slideButton.getBoundingClientRect();
    const thumbRect = slideThumb.getBoundingClientRect();
    maxDistance = buttonRect.width - thumbRect.width - 8; // 8px for padding
  }

  function getEventX(e) {
    return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
  }

  function startDrag(e) {
    if (slideButton.classList.contains('completed')) return;
    
    isDragging = true;
    slideButton.classList.add('sliding');
    startX = getEventX(e);
    
    const thumbRect = slideThumb.getBoundingClientRect();
    const buttonRect = slideButton.getBoundingClientRect();
    thumbStartX = thumbRect.left - buttonRect.left;
    
    calculateMaxDistance();
    
    e.preventDefault();
  }

  function drag(e) {
    if (!isDragging) return;
    
    currentX = getEventX(e);
    const deltaX = currentX - startX;
    let newPosition = thumbStartX + deltaX;
    
    // Constrain movement
    newPosition = Math.max(4, Math.min(newPosition, maxDistance));
    
    slideThumb.style.left = newPosition + 'px';
    
    // Update button opacity based on progress
    const progress = (newPosition - 4) / (maxDistance - 4);
    const textOpacity = Math.max(0.2, 1 - progress * 1.2);
    const textContainer = slideButton.querySelector('.slide-text-container');
    textContainer.style.opacity = textOpacity;
    
    // Add cool scale effect during drag
    const scale = 1 + (progress * 0.05);
    textContainer.style.transform = `scale(${scale})`;
    
    e.preventDefault();
  }

  function endDrag(e) {
    if (!isDragging) return;
    
    isDragging = false;
    slideButton.classList.remove('sliding');
    
    const currentPosition = parseFloat(slideThumb.style.left) || 4;
    const progress = (currentPosition - 4) / (maxDistance - 4);
    
    if (progress >= threshold) {
      // Success! Complete the action
      completeSlide();
    } else {
      // Return to start position
      resetSlide();
    }
  }

  function completeSlide() {
    slideButton.classList.add('completed', 'success');
    slideThumb.style.left = maxDistance + 'px';
    
    // Trigger success animation and navigate
    setTimeout(() => {
      window.location.href = 'contact.html';
    }, 500);
  }

  function resetSlide() {
    slideThumb.style.left = '4px';
    const textContainer = slideButton.querySelector('.slide-text-container');
    textContainer.style.opacity = '1';
    textContainer.style.transform = 'scale(1)';
  }

  // Mouse events
  slideThumb.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', endDrag);

  // Touch events
  slideThumb.addEventListener('touchstart', startDrag, { passive: false });
  document.addEventListener('touchmove', drag, { passive: false });
  document.addEventListener('touchend', endDrag);

  // Prevent context menu on long press
  slideThumb.addEventListener('contextmenu', e => e.preventDefault());

  // Handle window resize
  window.addEventListener('resize', () => {
    if (!isDragging) {
      calculateMaxDistance();
      resetSlide();
    }
  });
}