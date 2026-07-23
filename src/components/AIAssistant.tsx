import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Send, X, Phone, Check, AlertCircle, RefreshCw, 
  ChevronRight, User, Mic, MicOff, Volume2, VolumeX, MapPin, 
  Clock, Shield, Image, Camera, RotateCcw, Plus 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SERVICES } from '../data';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
  isDispatchForm?: boolean;
  usedModel?: string;
}

interface AIAssistantProps {
  currentCity: {
    name: string;
    phone: string;
    phoneFormatted: string;
  };
  selectedServiceId?: string;
  onOpenBookingWizard: (serviceId?: string, issue?: string) => void;
}

// Multi-language definitions
const LANGUAGES = [
  { code: 'es' as const, name: 'ESP', flag: '🇪🇸', label: 'Castellano' },
  { code: 'en' as const, name: 'ENG', flag: '🇬🇧', label: 'English' },
  { code: 'ca' as const, name: 'CAT', flag: '💛', label: 'Català' },
  { code: 'fr' as const, name: 'FRA', flag: '🇫🇷', label: 'Français' }
];

const WELCOME_MESSAGES = {
  es: {
    text: `Hola, soy LUNA. ¿En qué emergencia del hogar te puedo ayudar hoy?`,
    spoken: `Hola, soy LUNA. ¿En qué emergencia del hogar te puedo ayudar hoy?`
  },
  en: {
    text: `Hello! I am **LUNA**, your **AI Voice Assistant** from **Urge Ya** in **{city}**. 🤖🔊\n\nI am ready to speak and understand your language (English, Spanish, Catalan, or French).\n\n📸 **NEW FEATURE!** You can now **upload/snap a photo of your breakdown** (leaking pipe, burned wire, stuck door) using the camera button, and I will instantly analyze the image using Gemini AI.\n\nHow can I help you with your **plumbing**, **electrical**, **locksmith**, or **boiler** emergency today?`,
    spoken: `Hello! I am LUNA, your voice assistant from Urge Ya in {city}. You can now upload a photo of your breakdown using the camera button for an instant artificial intelligence analysis. Please tell me what emergency you have.`
  },
  ca: {
    text: `Hola! Soc la **LUNA**, la seva **Assistent de Veu Intel·ligent** d'**Urge Ya** a **{city}**. 🤖🔊\n\nEstic preparada per respondre-li per veu en l'idioma que prefereixi (Català, Castellà, Anglès o Francès).\n\n📸 **NOVA FUNCIÓ!** Ara pot **pujar una foto de la seva avaria** (fuga d'aigua, pany trencat, cables cremats) prement el botó de la càmera perquè l'analitzi immediatament amb Intel·ligència Artificial.\n\nExpliqui'm, té alguna emergència amb **fuga d'aigua**, **tall de llum**, **serralleria** o **caldera**? O seleccioni un idioma a la barra de dalt.`,
    spoken: `Hola, soc la LUNA, la seva assistenta de veu d'Urge Ya a {city}. Ara pot pujar una foto de la seva avaria prement el botó de la càmera perquè l'analitzi amb Intel·ligència Artificial. Expliqui'm quina avaria urgent té o seleccioni el seu idioma.`
  },
  fr: {
    text: `Bonjour ! Je suis **LUNA**, votre **Assistant Vocal Intelligent** d'**Urge Ya** à **{city}**. 🤖🔊\n\nJe suis prête à vous répondre par voix dans votre langue préférée (Français, Espagnol, Anglais ou Catalan).\n\n📸 **NOUVEAU !** Vous pouvez maintenant **télécharger/prendre une photo de votre panne** (fuite, court-circuit, serrure bloquée) en cliquant sur le bouton de l'appareil photo, et je l'analyserai instantanément grâce à l'IA.\n\nQuelle est votre urgence aujourd'hui (fuite d'eau, panne de courant, serrurerie ou chaudière) ? Vous pouvez aussi choisir une langue ci-dessus.`,
    spoken: `Bonjour, je suis LUNA, votre assistante vocale d'Urge Ya à {city}. Vous pouvez maintenant charger une photo de votre panne avec l'appareil photo pour une analyse par intelligence artificielle. Dites-moi quel est votre problème.`
  }
};

const UI_LABELS = {
  es: {
    quickTitle: "Consultar Emergencia de Voz:",
    quickFuga: "Plomería y Goteras",
    quickApagon: "Luz / Cuadros",
    quickCerrajeria: "Apertura de Puertas",
    quickCaldera: "Agua Caliente",
    btnUploadPhoto: "📸 Analizar Foto (IA)",
    inputPlaceholder: "Hable o escriba su avería...",
    btnCall: "Llamar",
    btnDispatch: "⚡ Pedir Técnico 24h",
    btnWhatsApp: "💬 WhatsApp 24h",
    btnExit: "Volver a la Web / Cerrar Asistente",
    dispatchTitle: "PROTOCOLO DE DESPACHO URGENTE",
    labelName: "Nombre Completo",
    labelPhone: "Móvil de Contacto",
    labelType: "Tipo de Avería",
    labelAddress: "Dirección de la Emergencia",
    optPlumbing: "💧 Fontanería",
    optElectric: "⚡ Electricidad",
    optLocksmith: "🔑 Cerrajería",
    optBoiler: "🔥 Calderas / Gas",
    btnSubmitDispatch: "⚡ SOLICITAR Y DESPACHAR TÉCNICO YA",
    successTitle: "¡TÉCNICO DE GUARDIA DESPACHADO!",
    successText: "El protocolo de asistencia urgente se ha iniciado para",
    lblDestiny: "Destino:",
    lblTime: "Tiempo Estimado:",
    lblPhone: "Llamada Móvil:",
    lblMinutes: "15 Minutos",
    btnCallCentral: "Llamar a Central",
    btnCloseTicket: "Cerrar Ticket",
    processingVoice: "Procesando mensaje de voz",
    dictateTitle: "Dictar por Voz (Hablar)",
    speakWelBtn: "LUNA - Gestor de Voz",
    headerSubtitle: "Asistencia Técnica de Urgencia 24h",
    muteVoice: "Mutear Asistencia de Voz",
    unmuteVoice: "Desmutear Asistencia de Voz",
    close: "Cerrar",
    floatBtnText: "Asistente de Voz LUNA"
  },
  en: {
    quickTitle: "Inquire by Voice Emergency:",
    quickFuga: "Plumbing & Leaks",
    quickApagon: "Electricity & Breakers",
    quickCerrajeria: "Door Openings",
    quickCaldera: "Hot Water & Boiler",
    btnUploadPhoto: "📸 Analyze Photo (AI)",
    inputPlaceholder: "Speak or type your issue...",
    btnCall: "Call",
    btnDispatch: "⚡ Request Tech 24h",
    btnWhatsApp: "💬 WhatsApp 24h",
    btnExit: "Return to Web / Close Assistant",
    dispatchTitle: "URGENT DISPATCH PROTOCOL",
    labelName: "Full Name",
    labelPhone: "Contact Phone",
    labelType: "Emergency Type",
    labelAddress: "Emergency Address",
    optPlumbing: "💧 Plumbing",
    optElectric: "⚡ Electricity",
    optLocksmith: "🔑 Locksmith",
    optBoiler: "🔥 Boiler / Gas",
    btnSubmitDispatch: "⚡ DISPATCH URGENT TECHNICIAN NOW",
    successTitle: "DUTY TECHNICIAN DISPATCHED!",
    successText: "The urgent assistance protocol has been activated for",
    lblDestiny: "Destination:",
    lblTime: "Estimated Time:",
    lblPhone: "Mobile Call:",
    lblMinutes: "15 Minutes",
    btnCallCentral: "Call Support",
    btnCloseTicket: "Close Ticket",
    processingVoice: "Processing voice input",
    dictateTitle: "Dictate by Voice (Speak)",
    speakWelBtn: "LUNA - Voice Manager",
    headerSubtitle: "24/7 Urgent Technical Assistance",
    muteVoice: "Mute Voice Assistance",
    unmuteVoice: "Unmute Voice Assistance",
    close: "Close",
    floatBtnText: "LUNA Voice Assistant"
  },
  ca: {
    quickTitle: "Consultar Emergència de Veu:",
    quickFuga: "Fontaneria i Goteres",
    quickApagon: "Llum i Quadres",
    quickCerrajeria: "Obertura de Portes",
    quickCaldera: "Aigua Calenta / Calderes",
    btnUploadPhoto: "📸 Analitzar Foto (IA)",
    inputPlaceholder: "Parli o escrigui la seva avaria...",
    btnCall: "Trucar",
    btnDispatch: "⚡ Demanar Tècnic 24h",
    btnWhatsApp: "💬 WhatsApp 24h",
    btnExit: "Tornar a la Web / Tancar Assistent",
    dispatchTitle: "PROTOCOL DE DESPATX URGENT",
    labelName: "Nom Complet",
    labelPhone: "Mòbil de Contacte",
    labelType: "Tipus d'Avaria",
    labelAddress: "Adreça de l'Emergència",
    optPlumbing: "💧 Fontaneria",
    optElectric: "⚡ Electricitat",
    optLocksmith: "🔑 Serralleria",
    optBoiler: "🔥 Calderes / Gas",
    btnSubmitDispatch: "⚡ SOL·LICITAR TÈCNIC URGENT JA",
    successTitle: "TÈCNIC DE GUÀRDIA ENVIAT!",
    successText: "El protocol d'assistència urgent s'ha iniciat per a",
    lblDestiny: "Destí:",
    lblTime: "Temps Estimat:",
    lblPhone: "Trucada Mòbil:",
    lblMinutes: "15 Minuts",
    btnCallCentral: "Trucar a Central",
    btnCloseTicket: "Tancar Ticket",
    processingVoice: "Processant missatge de veu",
    dictateTitle: "Dictar per Veu (Parlar)",
    speakWelBtn: "LUNA - Gestor de Veu",
    headerSubtitle: "Assistència Tècnica d'Urgència 24h",
    muteVoice: "Silenciar Assistència de Veu",
    unmuteVoice: "Activar Assistència de Veu",
    close: "Tancar",
    floatBtnText: "Assistent de Veu LUNA"
  },
  fr: {
    quickTitle: "Consulter l'Urgence par Voix :",
    quickFuga: "Plomberie & Fuites",
    quickApagon: "Électricité & Tableau",
    quickCerrajeria: "Ouverture de Portes",
    quickCaldera: "Eau Chaude & Chaudière",
    btnUploadPhoto: "📸 Analyser Photo (IA)",
    inputPlaceholder: "Parlez ou tapez votre problème...",
    btnCall: "Appeler",
    btnDispatch: "⚡ Demander Technicien 24h",
    btnWhatsApp: "💬 WhatsApp 24h",
    btnExit: "Retour au Site / Fermer l'Assistant",
    dispatchTitle: "PROTOCOLE D'INTERVENTION URGENTE",
    labelName: "Nom Complet",
    labelPhone: "Téléphone Mobile",
    labelType: "Type de Panne",
    labelAddress: "Adresse de l'Urgence",
    optPlumbing: "💧 Plomberie",
    optElectric: "⚡ Électricité",
    optLocksmith: "🔑 Serrurerie",
    optBoiler: "🔥 Chaudière / Gaz",
    btnSubmitDispatch: "⚡ DÉPÊCHER TECHNICIEN D'URGENCE",
    successTitle: "TECHNICIEN DE GARDE DÉPÊCHÉ !",
    successText: "Le protocole d'assistance d'urgence a été activé pour",
    lblDestiny: "Destination :",
    lblTime: "Temps Estimé :",
    lblPhone: "Appel Mobile :",
    lblMinutes: "15 Minutes",
    btnCallCentral: "Appeler le Support",
    btnCloseTicket: "Fermer le Ticket",
    processingVoice: "Traitement de la voix en cours",
    dictateTitle: "Dicter par Voix (Parler)",
    speakWelBtn: "LUNA - Gestionnaire Vocal",
    headerSubtitle: "Assistance Technique d'Urgence 24h/24",
    muteVoice: "Couper l'assistance vocale",
    unmuteVoice: "Activar l'assistance vocale",
    close: "Fermer",
    floatBtnText: "Assistant Vocal LUNA"
  }
};

const MULTILINGUAL_RESPONSES: Record<string, Record<string, { text: string; spoken: string }>> = {
  es: {
    fuga: {
      text: "🔍 **1. Diagnóstico rápido:**\nParece tratarse de un fallo o fuga activa en la instalación de fontanería o tuberías.\n\n🚨 **2. Acción de emergencia:**\n**Cierre de inmediato la llave de paso general de agua** de su hogar para detener la inundación.\n\n🛠️ **3. Solución / Pasos a seguir:**\nNuestros fontaneros urgentes en **{city}** pueden llegar en **15 a 20 minutos**. ¿Nos confirma su dirección para enviar a un operario de inmediato?",
      spoken: "Hola, soy LUNA. Le recomiendo cerrar de inmediato la llave de paso principal de su vivienda para detener la inundación. Nuestros fontaneros en {city} llegarán en menos de veinte minutos. ¿Confirmamos el envío?"
    },
    apagón: {
      text: "🔍 **1. Diagnóstico rápido:**\nAvería eléctrica o cortocircuito detectado en el cuadro de luz o en la instalación.\n\n🚨 **2. Acción de emergencia:**\n**Baja el diferencial principal inmediatamente** y no toques ningún cable expuesto ni con las manos húmedas.\n\n🛠️ **3. Solución / Pasos a seguir:**\nContamos con electricistas de guardia en **{city}** listos para acudir en **15 a 25 minutos**. ¿Le despachamos un técnico de urgencia?",
      spoken: "Hola, le saluda LUNA. Por su seguridad, baje el diferencial principal y no toque cables expuestos. Nuestros electricistas en {city} llegarán en menos de veinte minutos."
    },
    cerrajeria: {
      text: "🔍 **1. Diagnóstico rápido:**\nBloqueo de cerradura, llaves extraviadas o puerta atrancada que impide el acceso seguro.\n\n🚨 **2. Acción de emergencia:**\n**Manténgase en un lugar seguro** y no intente forzar la cerradura con objetos metálicos para evitar romper el bombín.\n\n🛠️ **3. Solución / Pasos a seguir:**\nUn cerrajero homologado de **{city}** llegará a su domicilio en **15 a 20 minutos** para realizar una apertura limpia. ¿Enviamos un operario ahora?",
      spoken: "Soy LUNA. No intente forzar la cerradura. Contamos con cerrajeros de guardia en {city} que realizarán una apertura limpia en quince a veinte minutos."
    },
    caldera: {
      text: "🔍 **1. Diagnóstico rápido:**\nFallo de presión, bloqueo de encendido o pérdida de agua en caldera/termo eléctrico.\n\n🚨 **2. Acción de emergencia:**\n**Compruebe si la presión está entre 1.2 y 1.5 bar** y no intente manipular tubos o conductos de gas internos.\n\n🛠️ **3. Solución / Pasos a seguir:**\nNuestros técnicos certificados en **{city}** pueden acudir en **20 a 30 minutos** para solucionar la avería. ¿Le enviamos un técnico?",
      spoken: "Hola, soy LUNA. Compruebe si la presión de la caldera está entre 1.2 y 1.5 bar. Nuestros técnicos certificados en {city} llegarán en veinte a treinta minutos."
    },

    precio: {
      text: "📋 **POLÍTICA DE TARIFAS TRANSPARENTS DE URGE YA:**\n\n• **Desplazamiento 100% Gratuito:** No cobramos costes de viaje si se aprueba y realiza la reparación técnica.\n• **Presupuestos Cerrados por Escrito:** El técnico evalúa la avería en persona y le da un coste fijo garantizado antes de trabajar.\n• **Tarifas Directas:** Sin intermediarios ni costes ocultos.\n\n¿Quiere indicarnos qué avería tiene para orientarle mejor en el precio?",
      spoken: "Soy LUNA. Le confirmo que el desplazamiento es completamente gratuito si realiza la reparación con nosotros. Además, el técnico le facilitará un presupuesto cerrado por escrito antes de comenzar a trabajar para su total tranquilidad."
    },
    urgencia: {
      text: "🚨 **COBERTURA Y TIEMPOS DE RESPUESTA INMEDIATA:**\n\n• **Zonas de Cobertura:** Ofrecemos asistencia domiciliaria en todas las áreas de **Barcelona**, **Madrid** y **Valencia**.\n• **Tiempo de Llegada:** La media oscila entre **15 y 25 minutos** de forma garantizada.\n• **Operativos 24/7/365:** Trabajamos fines de semana y festivos de manera ininterrumpida.\n\n¿Desea que un técnico le llame directamente en menos de 5 minutos?",
      spoken: "Hola, le saluda LUNA. Ofrecemos cobertura completa de urgencia en Madrid, Barcelona y Valencia. Nuestro tiempo de respuesta habitual es de quince a veinticinco minutos las veinticuatro horas del día. Estamos listos para salir de inmediato hacia su domicilio."
    }
  },
  en: {
    fuga: {
      text: "🚨 **PLUMBING EMERGENCY INSTRUCTIONS:**\n\n1. **Close the main water valve** immediately to stop the flooding.\n2. **Turn off electricity** in the affected areas to prevent short circuits.\n3. **Collect standing water** and protect your belongings.\n\nWe have certified emergency plumbers in **{city}** ready to go. Average arrival time is **15 to 20 minutes**. Should we dispatch a technician right away?",
      spoken: "Hello, this is LUNA. Please remain calm. I highly recommend closing your main water valve immediately to stop the leak. Our emergency plumbers in {city} are ready. We will arrive in less than twenty minutes."
    },
    apagón: {
      text: "⚡ **ELECTRICAL EMERGENCY INSTRUCTIONS:**\n\n1. **Do not touch exposed wires** or handle the fuse box with wet hands.\n2. **Check the circuit breaker:** If it tripped, try resetting it after unplugging the last used appliance.\n3. **Avoid water contact** near flooded outlets.\n\nWe have licensed 24/7 electricians on duty in **{city}**. Shall we send an authorized technician now?",
      spoken: "Hello, LUNA here. For your safety, do not touch any exposed wires or handle the electrical panel with wet hands. If you have a short circuit or a blackout, our duty electricians in {city} will arrive in less than twenty minutes to safely restore your power."
    },
    cerrajeria: {
      text: "🔑 **LOCKSMITH EMERGENCY INSTRUCTIONS:**\n\n1. **Stay in a safe**, visible area while waiting.\n2. **Do not force the lock** with cards or metal objects; it could damage the internal mechanism.\n3. **Prepare an ID** confirming your access to the property.\n\nOur certified locksmiths in **{city}** perform clean door openings and lock replacements in 15 minutes. Should we dispatch one now?",
      spoken: "I am LUNA. If you are locked out, lost your keys, or need an urgent lock replacement, don't worry. We have on-duty locksmiths in {city} ready. We will open your door cleanly, without any damage, in fifteen to twenty minutes."
    },
    caldera: {
      text: "🔥 **BOILER & HEATING QUICK CHECKS:**\n\n1. **Check water pressure:** The boiler gauge should be between **1.2 and 1.5 bar**.\n2. **Check gas supply:** Make sure the main gas valve is open.\n3. **Do not manipulate internal parts:** It is extremely dangerous without certified training.\n\nOur gas technicians in **{city}** repair all brands (Vaillant, Junkers, Saunier Duval). Would you like to schedule immediate service?",
      spoken: "Hello, LUNA speaking. I suggest checking if your water pressure gauge is between 1.2 and 1.5 bar. Also, ensure the gas valve is fully open. Our certified boiler technicians in {city} are fully ready to help you immediately."
    },
    precio: {
      text: "📋 **URGE YA TRANSPARENT PRICING POLICY:**\n\n• **100% Free Dispatch:** We don't charge travel fees if the repair work is approved and completed.\n• **Written Fixed Estimates:** The technician inspects the issue in person and gives a guaranteed fixed cost before starting.\n• **Direct Rates:** No intermediaries or hidden fees.\n\nWould you like to describe your issue so we can guide you on the cost?",
      spoken: "This is LUNA. I confirm that dispatch and travel are completely free if you proceed with the repair. Additionally, the technician will provide a fixed estimate in writing before starting any work for your peace of mind."
    },
    urgencia: {
      text: "🚨 **COVERAGE AND IMMEDIATE RESPONSE TIMES:**\n\n• **Coverage Areas:** We provide home assistance throughout **Barcelona**, **Madrid**, and **Valencia**.\n• **Arrival Time:** Guaranteed response time of **15 to 25 minutes**.\n• **24/7/365 Operations:** We work non-stop during weekends and holidays.\n\nWould you like a technician to call you directly in less than 5 minutes?",
      spoken: "Hello, LUNA here. We offer full emergency coverage in Madrid, Barcelona, and Valencia. Our response time is fifteen to twenty-five minutes, twenty-four hours a day. We are ready to head to your address immediately."
    }
  },
  ca: {
    fuga: {
      text: "🚨 **ALERTA DE FONTANERIA! INSTRUCCIONS D'EMERGÈNCIA:**\n\n1. **Tanqui immediatament la clau de pas general** per aturar la inundació.\n2. **Talli el subministrament elèctric** a les zones afectades per evitar curtcircuits.\n3. **Reculli l'aigua** i protegeixi els seus béns.\n\nTenim fontaners urgents homologats a **{city}** llestos per sortir. Temps d'arribada: **15-20 minuts**. Enviem un tècnic immediat?",
      spoken: "Hola, soc la LUNA. Per favor, mantingui la calma. Li recomano tancar immediatament la clau de pas general de casa seva per aturar la inundació, i desconnectar l'electricitat si l'aigua s'estén. Els nostres fontaners a {city} estan disponibles. Arribarem en menys de vint minuts."
    },
    apagón: {
      text: "⚡ **ALERTA D'ELECTRICITAT! INSTRUCCIONS D'EMERGÈNCIA:**\n\n1. **No toqui cables exposats** ni el quadre elèctric amb les mans humides.\n2. **Verifiqui el diferencial:** Si ha saltat, intenti rearmar-lo un cop desendollat l'últim aparell.\n3. **Eviti el contacte amb l'aigua** prop d'endolls inundats.\n\nElectricistes autoritzats de guàrdia 24h a **{city}**. Enviem un tècnic urgent?",
      spoken: "Hola, soc la LUNA. Per la seva seguretat, no toqui cap cable exposat ni el quadre elèctric amb les mans humides. Si té un curtcircuit o una apagada general, els nostres electricistes a {city} arribaran en menys de vint minuts per restablir el servei amb total seguretat."
    },
    cerrajeria: {
      text: "🔑 **URGÈNCIA DE SERRALLERIA! INSTRUCCIONS DE SEGURIDAD:**\n\n1. **Estigui en una zona segura** i visible mentre espera el serraller.\n2. **No versi o forci la fusta o pany** amb targetes per no danyar el mecanisme.\n3. **Prepari un document d'identitat** que confirmi l'accés a l'habitatge.\n\nSerrallers autoritzats a **{city}** obren portes i canvien bombins en 15 minuts. Enviem un serraller de guàrdia?",
      spoken: "Soc la LUNA. Si s'ha quedat fora de casa, ha perdut les claus o necessita un canvi urgent de pany per seguretat, no es preocupi. Tenim serrallers a {city} de guàrdia. Realitzarem una obertura neta en uns quinze minuts."
    },
    caldera: {
      text: "🔥 **AVÍS DE CALDERES I CALEFACCIÓ! COMPROBACIONS RÀPIDES:**\n\n1. **Pressió de l'aigua:** El manòmetre de la caldera ha d'estar entre **1.2 i 1.5 bar**.\n2. **Subministrament de gas:** Comprovi que la clau de pas està oberta.\n3. **No manipuli tubs interns**: És molt perillós si no s'és tècnic homologat.\n\nTècnics de gas de guàrdia a **{city}**. Vol agendar assistència immediata?",
      spoken: "Hola, soc la LUNA. Li suggereixo comprovar si la pressió d'aigua de la caldera està entre un punt dos i un punt cinc bar. Els nostres tècnics homologats a {city} estan preparats per venir i solucionar el problema de forma immediata."
    },
    precio: {
      text: "📋 **POLÍTICA DE PREUS TRANSPARENTS D'URGE YA:**\n\n• **Desplaçament Gratuït:** Sense despeses de viatge si es realitza la reparació amb nosaltres.\n• **Pressupostos Tancats per Escrit:** El tècnic avalua l'avaria i dóna un cost tancat abans de començar.\n• **Tarifes Directes:** Sense sorpreses ni intermediaris.\n\nEns indica quina avaria té per donar-li un preu orientatiu?",
      spoken: "Soc la LUNA. El desplaçament és completament gratuït si realitza la reparació con nosotros. A més, el tècnic li farà un pressupost tancat per escrit abans de començar a treballar per a la seva tranquil·litat."
    },
    urgencia: {
      text: "🚨 **COBERTURA I TEMPS DE RESPOSTA IMMEDIATA:**\n\n• **Cobertura:** Assistència a tot **Barcelona**, **Madrid** i **València**.\n• **Temps d'Arribada:** Entre **15 i 25 minuts** garantits.\n• **Guàrdia 24h/365:** Treballem dissabtes, diumenges i festius de forma ininterrompuda.\n\nVol que un tècnic li truqui en menys de 5 minuts?",
      spoken: "Hola, soc la LUNA. Oferim cobertura de guàrdia a Madrid, Barcelona i València. Arribem habitualment en un termini de quinze a vint-i-cinc minuts, les vint-i-quatre hores del dia."
    }
  },
  fr: {
    fuga: {
      text: "🚨 **INSTRUCTIONS D'URGENCE PLOMBERIE :**\n\n1. **Fermez immédiatement la vanne d'arrivée d'eau** générale pour stopper l'inondation.\n2. **Coupez l'électricité** dans les zones touchées pour éviter les courts-circuits.\n3. **Épongez l'eau stagnante** et mettez vos biens à l'abri.\n\nNos plombiers certifiés à **{city}** sont prêts à intervenir. Délai moyen : **15 à 20 minutes**. Devons-nous envoyer un technicien ?",
      spoken: "Bonjour, c'est LUNA. Gardez votre calme. Je vous conseille de fermer immédiatement la vanne d'eau générale. Nos plombiers à {city} sont prêts à partir et arriveront en moins de vingt minutes."
    },
    apagón: {
      text: "⚡ **INSTRUCTIONS D'URGENCE ÉLECTRICITÉ :**\n\n1. **Ne touchez pas aux fils dénudés** et ne manipulez pas le tableau électrique les mains humides.\n2. **Vérifiez le disjoncteur :** S'il a sauté, essayez de le réarmer après avoir débranché le dernier appareil utilisé.\n3. **Évitez tout contact avec l'eau** près des prises.\n\nÉlectriciens agréés 24h/24 à **{city}**. Devons-nous envoyer un dépanneur ?",
      spoken: "Bonjour, ici LUNA. Pour votre sécurité, ne touchez à aucun fil dénudé et ne manipulez pas le disjoncteur les mains mouillées. Nos électriciens d'urgence à {city} interviendront en moins de vingt minutes pour rétablir le courant en toute sécurité."
    },
    cerrajeria: {
      text: "🔑 **INSTRUCTIONS D'URGENCE SERRURERIE :**\n\n1. **Restez dans un endroit sûr** et visible en attendant le serrurier.\n2. **Ne forcez pas la serrure** avec une carte ou des objets métalliques pour éviter d'endommager le cylindre.\n3. **Préparez une pièce d'identité** prouvant votre accès au logement.\n\nSerruriers agréés à **{city}** pour ouvertures propres et remplacements en 15 min. On vous envoie un serrurier de garde ?",
      spoken: "Je suis LUNA. Si vous êtes coincé dehors ou si vous devez changer votre serrure en urgence, ne vous inquiétez pas. Nos serruriers de garde à {city} interviendront pour une ouverture propre, sans dégâts, en quinze minutes."
    },
    caldera: {
      text: "🔥 **VÉRIFICATIONS CHAUDIÈRE & CHAUFFAGE :**\n\n1. **Pression d'eau :** Le manomètre de la chaudière doit être entre **1,2 et 1,5 bar**.\n2. **Arrivée de gaz :** Assurez-vous que la vanne de gaz générale est ouverte.\n3. **Ne touchez pas aux conduits internes :** C'est extrêmement dangereux sans certification.\n\nTechniciens agréés toutes marques à **{city}**. Souhaitez-vous planifier une intervention immédiate ?",
      spoken: "Bonjour, c'est LUNA. Je vous conseille de vérifier si la pression d'eau est entre un point deux et un point cinq bar. Nos techniciens certifiés à {city} sont prêts à réparer votre chaudière immédiatement."
    },
    precio: {
      text: "📋 **CHARTE DES TARIFS TRANSPARENTS URGE YA :**\n\n• **Déplacement Gratuit :** Aucun frais de transport si la réparation est effectuée par notre technicien.\n• **Devis Écrit Ferme :** Le technicien évalue le problème sur place et vous donne un coût fixe garanti avant travaux.\n• **Tarifs Directs :** Pas d'intermédiaires ni de frais cachés.\n\nDécrivez-nous votre panne pour obtenir une estimation de tarif ?",
      spoken: "C'est LUNA. Le déplacement est entièrement gratuit si vous effectuez la réparation avec nous. De plus, le technicien vous remettra un devis écrit et fermé avant de commencer pour votre totale sérénité."
    },
    urgencia: {
      text: "🚨 **COUVERTURE ET DÉLAIS D'INTERVENTION :**\n\n• **Zones couvertes :** Assistance rapide à **Barcelone**, **Madrid** et **Valence**.\n• **Délai d'arrivée :** Garanti en **15 à 25 minutes**.\n• **Opérationnel 24h/24, 7j/7 :** Nous travaillons les week-ends et jours fériés.\n\nSouhaitez-vous qu'un technicien vous rappelle en moins de 5 minutes ?",
      spoken: "Bonjour, ici LUNA. Nous couvrons Madrid, Barcelone et Valence. Notre délai d'intervention habituel est de quinze à vingt-cinq minutes, vingt-quatre heures sur vingt-quatre."
    }
  }
};

export default function AIAssistant({ currentCity, selectedServiceId = 'fontaneria', onOpenBookingWizard }: AIAssistantProps) {
  const selectedService = SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(() => {
    const saved = localStorage.getItem('urgeya_voice_muted');
    return saved ? JSON.parse(saved) : false;
  });

  const [currentLang, setCurrentLang] = useState<'es' | 'en' | 'ca' | 'fr'>(() => {
    const saved = localStorage.getItem('urgeya_voice_lang');
    return (saved as 'es' | 'en' | 'ca' | 'fr') || 'es';
  });

  const [aiMode, setAiMode] = useState<'auto' | 'fast' | 'thinking'>('auto');

  useEffect(() => {
    localStorage.setItem('urgeya_voice_lang', currentLang);
  }, [currentLang]);
  
  const [messages, setMessages] = useState<Message[]>([]);

  // Initialize/Update initial welcome message based on language
  useEffect(() => {
    const welcome = WELCOME_MESSAGES[currentLang];
    const textWelcome = welcome.text.replace(/{city}/g, currentCity.name);
    
    // Only replace or set the welcome message if the user has not started chatting
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: textWelcome,
          timestamp: new Date()
        }
      ]);
    }
  }, [currentLang, currentCity.name]);
  
  const [inputValue, setInputValue] = useState('');
  const [uploadedImages, setUploadedImages] = useState<Array<{ base64: string; mimeType: string }>>([]);
  const [sessionImages, setSessionImages] = useState<string[]>([]);
  const [totalSessionPhotosCount, setTotalSessionPhotosCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const stopCameraStream = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(track => track.stop());
      cameraStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const openCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        if (cameraStreamRef.current) {
          cameraStreamRef.current.getTracks().forEach(track => track.stop());
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facingMode } }
        });
        cameraStreamRef.current = stream;
        setIsCameraActive(true);
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(err => console.log("Video play error:", err));
          }
        }, 100);
      } catch (err) {
        console.warn("MediaDevices camera access failed or denied, falling back to native input:", err);
        cameraInputRef.current?.click();
      }
    } else {
      cameraInputRef.current?.click();
    }
  };

  const flipCamera = async () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(track => track.stop());
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: newMode } }
      });
      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(err => console.log(err));
      }
    } catch (err) {
      console.warn("Error flipping camera:", err);
    }
  };

  const capturePhotoFromStream = () => {
    if (!videoRef.current) return;
    if (uploadedImages.length >= 3) {
      const msg = currentLang === 'en' ? "Maximum 3 photos allowed." : "Máximo 3 fotos alcanzado.";
      setSpeechError(msg);
      setTimeout(() => setSpeechError(null), 3000);
      stopCameraStream();
      return;
    }
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      const parts = dataUrl.split(';base64,');
      if (parts.length === 2) {
        setUploadedImages(prev => [...prev, { base64: parts[1], mimeType: 'image/jpeg' }]);
        setSessionImages(prev => {
          if (prev.length >= 3) return prev;
          return [...prev, dataUrl];
        });
        setTotalSessionPhotosCount(prev => prev + 1);
      }
    }
    stopCameraStream();
  };
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  
  // Interactive Dispatch Form State inside chat
  const [dispatchStep, setDispatchStep] = useState<'idle' | 'form' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    type: 'Fontanería'
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Synchronize mute setting to localStorage
  useEffect(() => {
    localStorage.setItem('urgeya_voice_muted', JSON.stringify(isVoiceMuted));
    if (isVoiceMuted) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
  }, [isVoiceMuted]);

  // Scroll to bottom on updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, dispatchStep]);

  // Keyboard Support: Escape keypress closes the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        window.speechSynthesis?.cancel();
        setIsSpeaking(false);
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Language detection helper
  const detectLanguage = (text: string): 'es' | 'en' | 'ca' | 'fr' => {
    const lower = text.toLowerCase();
    let scores = { es: 0, en: 0, ca: 0, fr: 0 };
    
    const enPatterns = [
      'hello', 'hi', 'leak', 'flooding', 'pipe', 'key', 'lock', 'boiler', 'heater', 'power', 'blackout', 
      'light', 'price', 'emergency', 'urgent', 'yes', 'no', 'please', 'toilet', 'door', 'electricity', 
      'plumber', 'electrician', 'locksmith', 'cost', 'fee', 'how much', 'water', 'sink', 'faucet', 'outage',
      'thanks', 'thank you', 'ok', 'okay', 'help', 'is there'
    ];
    
    const caPatterns = [
      'hola', 'aigua', 'gotera', 'clau', 'caldera', 'llum', 'preu', 'urgència', 'urgencia', 'urgents', 
      'si', 'no', 'fontaner', 'porta', 'electricista', 'serraller', 'inundació', 'inundacio', 'grifó', 
      'grifo', 'apagar', 'apagada', 'taller', 'quant', 'costa', 'tarifes', 'gràcies', 'merci', 'ajuda', 
      'parlo', 'parlar', 'castellà', 'anglès', 'francès', 'per favor', 'tècnic'
    ];
    
    const frPatterns = [
      'bonjour', 'salut', 'fuite', 'eau', 'inondation', 'cle', 'serrure', 'porte', 'chaudiere', 'panne', 
      'electricite', 'urgence', 'urgent', 'oui', 'non', 'plombier', 'electricien', 'serrurier', 'prix', 
      'tarif', 'combien', 'gratuit', 's\'il vous plait', 'sil vous plait', 'merci', 'aide', 'chauffage',
      'courant', 'prise', 'robinet', 'depannage', 'devis'
    ];
    
    const esPatterns = [
      'hola', 'agua', 'gotera', 'grifo', 'inundación', 'inundacion', 'plomero', 'fontanero', 'luz', 
      'apagón', 'apagon', 'corriente', 'cuadro', 'enchufe', 'cortocircuito', 'llave', 'cerradura', 
      'puerta', 'cerrajero', 'caldera', 'calefacción', 'calefaccion', 'gas', 'calentador', 'termo', 
      'precio', 'coste', 'costo', 'cuanto', 'tarifa', 'presupuesto', 'gratis', 'urgente', 'rapido', 
      'cobertura', 'sí', 'no', 'por favor', 'gracias', 'ayuda', 'técnico'
    ];

    enPatterns.forEach(word => {
      if (lower.includes(word)) scores.en += 1;
    });
    caPatterns.forEach(word => {
      if (lower.includes(word)) scores.ca += 1.2;
    });
    frPatterns.forEach(word => {
      if (lower.includes(word)) scores.fr += 1;
    });
    esPatterns.forEach(word => {
      if (lower.includes(word)) scores.es += 1;
    });

    let maxScore = 0;
    let detected: 'es' | 'en' | 'ca' | 'fr' | null = null;
    
    (Object.keys(scores) as Array<'es' | 'en' | 'ca' | 'fr'>).forEach(lang => {
      if (scores[lang] > maxScore) {
        maxScore = scores[lang];
        detected = lang;
      }
    });

    return detected || currentLang;
  };

  // MOTOR DE VOZ UTILIZADO: Web Speech API (window.speechSynthesis)
  // Ubicación: /src/components/AIAssistant.tsx (alrededor de la línea 475)
  // Text-To-Speech function with strict female voice selection for Spanish (es-ES)
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Proactively load and cache browser voices
  useEffect(() => {
    const updateVoices = () => {
      if (window.speechSynthesis) {
        const loaded = window.speechSynthesis.getVoices();
        if (loaded && loaded.length > 0) {
          voicesRef.current = loaded;
        }
      }
    };

    updateVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const speakText = (text: string, overrideLang?: 'es' | 'en' | 'ca' | 'fr') => {
    if (isVoiceMuted) return;
    
    // Cancel any active speech
    window.speechSynthesis?.cancel();
    
    // Clean text format for speech synthesizer to avoid spelling markdown markers
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/•/g, '')
      .replace(/🚨|⚡|🔥|👋|🤖|✨|📋|🔑|🔊/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetLang = overrideLang || currentLang;
    
    // Get latest available voices from API or cache
    let voices = window.speechSynthesis?.getVoices() || [];
    if ((!voices || voices.length === 0) && voicesRef.current.length > 0) {
      voices = voicesRef.current;
    }
    
    let targetLocale = 'es-ES';
    if (targetLang === 'en') {
      targetLocale = 'en-US';
    } else if (targetLang === 'ca') {
      targetLocale = 'ca-ES';
    } else if (targetLang === 'fr') {
      targetLocale = 'fr-FR';
    } else {
      targetLocale = 'es-ES';
    }

    utterance.lang = targetLocale;

    let selectedVoice: SpeechSynthesisVoice | null = null;

    if (targetLang === 'es') {
      // STRICT SPANISH FEMALE VOICE SELECTION (NOELIA)
      // 1. Get all Spanish voices (es-ES, es_ES, or es-*)
      const esVoices = voices.filter(v => {
        const vLang = v.lang.toLowerCase().replace('_', '-');
        return vLang.startsWith('es');
      });

      const maleNames = ['pablo', 'jorge', 'alvaro', 'julio', 'diego', 'manuel', 'david', 'daniel', 'raul', 'raúl', 'enrique', 'carlos', 'miguel', 'hombre', 'male'];

      // Filter out male voices for Spanish
      const femaleOrNeutralEsVoices = esVoices.filter(v => {
        const nameL = v.name.toLowerCase();
        return !maleNames.some(m => nameL.includes(m));
      });

      const listToSearch = femaleOrNeutralEsVoices.length > 0 ? femaleOrNeutralEsVoices : esVoices;

      // Priority 1: Top Microsoft Laura or Elvira Online / Natural (Windows/Edge)
      selectedVoice = listToSearch.find(v => {
        const n = v.name.toLowerCase();
        return n.includes('laura') || n.includes('elvira') || n.includes('dalia');
      }) || null;

      // Priority 2: Google Español (Chrome / Android)
      if (!selectedVoice) {
        selectedVoice = listToSearch.find(v => {
          const n = v.name.toLowerCase();
          return n.includes('google') && (n.includes('español') || n.includes('espanol') || n.includes('spanish'));
        }) || null;
      }

      // Priority 3: Named Apple / iOS / macOS / System female voices (Monica, Marta, Lucia, Helena, Paloma, Carmen)
      if (!selectedVoice) {
        selectedVoice = listToSearch.find(v => {
          const n = v.name.toLowerCase();
          return ['monica', 'marta', 'lucia', 'lucía', 'helena', 'paloma', 'paulina', 'carmen', 'victoria', 'silvia', 'conchita', 'francisca', 'inma', 'maría', 'maria', 'soledad'].some(fname => n.includes(fname));
        }) || null;
      }

      // Priority 4: Any voice marked as female / natural / neural / online
      if (!selectedVoice) {
        selectedVoice = listToSearch.find(v => {
          const n = v.name.toLowerCase();
          return n.includes('female') || n.includes('mujer') || n.includes('dona') || n.includes('natural') || n.includes('neural') || n.includes('online') || n.includes('enhanced');
        }) || null;
      }

      // Priority 5: Any non-male Spanish voice
      if (!selectedVoice && femaleOrNeutralEsVoices.length > 0) {
        selectedVoice = femaleOrNeutralEsVoices[0];
      }

      // Priority 6: Fallback to any Spanish voice if nothing else matched
      if (!selectedVoice && esVoices.length > 0) {
        selectedVoice = esVoices[0];
      }

      // Voice tone for Noelia in Spanish: rate = 0.95 (deliberate & comforting), pitch = 1.08 (natural female tone)
      utterance.rate = 0.95;
      utterance.pitch = 1.08;
    } else {
      // Other languages (en, ca, fr)
      const exactLocaleVoices = voices.filter(v => v.lang.toLowerCase().replace('_', '-') === targetLocale.toLowerCase());
      const fallbackVoices = voices.filter(v => v.lang.toLowerCase().replace('_', '-').startsWith(targetLang));
      const candidates = exactLocaleVoices.length > 0 ? exactLocaleVoices : fallbackVoices;

      selectedVoice = candidates.find(v => {
        const n = v.name.toLowerCase();
        return n.includes('female') || n.includes('natural') || n.includes('neural') || n.includes('online') || n.includes('siri') || n.includes('google');
      }) || candidates[0] || voices[0] || null;

      utterance.rate = 0.95;
      utterance.pitch = 1.05;
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e: any) => {
      // 'interrupted' is normal and expected when calling speechSynthesis.cancel() to start a new voice response
      if (e.error === 'interrupted' || e.error === 'canceled') {
        setIsSpeaking(false);
        return;
      }
      
      if (e.error === 'not-allowed') {
        console.info("Speech synthesis autoplay was blocked by the browser. Interaction required before audio can play.");
      } else {
        console.warn(`Speech synthesis issue (code: ${e.error || 'unknown'}):`, e);
      }
      setIsSpeaking(false);
    };

    window.speechSynthesis?.speak(utterance);
  };

  // Speech Recognition wrapper for voice dictation supporting active language
  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const errorMsg = currentLang === 'en' 
        ? "Voice recognition is not supported in this browser. Please type your emergency."
        : currentLang === 'ca'
        ? "El reconeixement de veu no és compatible amb aquest navegador. Per favor escrigui la seva avaria."
        : currentLang === 'fr'
        ? "La reconnaissance vocale n'est pas supportée par ce navigateur. Veuillez écrire votre panne."
        : "El reconocimiento de voz no es compatible con este navegador. Por favor escriba su avería.";
      
      setSpeechError(errorMsg);
      setTimeout(() => setSpeechError(null), 4000);
      return;
    }

    // Cancel current speech output to prevent echo
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);

    try {
      const recognition = new SpeechRecognition();
      
      let langCode = 'es-ES';
      if (currentLang === 'en') langCode = 'en-US';
      else if (currentLang === 'ca') langCode = 'ca-ES';
      else if (currentLang === 'fr') langCode = 'fr-FR';
      
      recognition.lang = langCode;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        
        const errType = event.error;
        
        // Quietly ignore or handle normal/expected/aborted states
        if (errType === 'aborted') {
          console.log("Speech recognition was stopped or aborted.");
          return;
        }

        if (errType === 'no-speech') {
          let noSpeechMsg = "No se ha detectado voz. Por favor, vuelva a hablar.";
          if (currentLang === 'en') noSpeechMsg = "No speech was detected. Please try speaking again.";
          else if (currentLang === 'ca') noSpeechMsg = "No s'ha detectat veu. Per favor, torneu a parlar.";
          else if (currentLang === 'fr') noSpeechMsg = "Aucune voix n'a été détectée. Veuillez parler à nouveau.";
          
          setSpeechError(noSpeechMsg);
          setTimeout(() => setSpeechError(null), 4000);
          console.info("Speech recognition ended: no speech detected.");
          return;
        }

        // Handle other specific errors with clear localized messages
        let errorMsg = "";
        if (errType === 'not-allowed') {
          if (currentLang === 'en') {
            errorMsg = "Microphone access denied. Please enable microphone permission in your browser.";
          } else if (currentLang === 'ca') {
            errorMsg = "Accés al micròfon denegat. Per favor, permeteu l'ús del micròfon al navegador.";
          } else if (currentLang === 'fr') {
            errorMsg = "Accès au microphone refusé. Veuillez autoriser l'utilisation du microphone.";
          } else {
            errorMsg = "Acceso al micrófono denegado. Por favor, permita el uso del micrófono en su navegador.";
          }
        } else if (errType === 'network') {
          if (currentLang === 'en') {
            errorMsg = "Network connection error during voice recognition.";
          } else if (currentLang === 'ca') {
            errorMsg = "Error de connexió de xarxa durant el reconeixement de veu.";
          } else if (currentLang === 'fr') {
            errorMsg = "Erreur de connexion réseau lors de la reconnaissance vocale.";
          } else {
            errorMsg = "Error de conexión de red durante el reconocimiento de voz.";
          }
        } else {
          errorMsg = `${currentLang === 'en' ? "Voice input issue" : "Aviso en la entrada de voz"}: ${errType || 'unknown'}`;
        }

        console.warn(`Speech recognition issue: ${errType}`, event);
        setSpeechError(errorMsg);
        setTimeout(() => setSpeechError(null), 4500);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.trim()) {
          handleSendMessage(transcript);
        }
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const availableSlots = 3 - uploadedImages.length;
    if (availableSlots <= 0) {
      const msg = currentLang === 'en' ? "Maximum 3 photos allowed." : "Máximo 3 fotos alcanzado.";
      setSpeechError(msg);
      setTimeout(() => setSpeechError(null), 3000);
      if (e.target) e.target.value = '';
      return;
    }

    const filesToProcess = files.slice(0, availableSlots);

    filesToProcess.forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        const parts = base64Data.split(';base64,');
        if (parts.length === 2) {
          setUploadedImages(prev => {
            if (prev.length >= 3) return prev;
            return [...prev, { base64: parts[1], mimeType: file.type || 'image/jpeg' }];
          });
          setSessionImages(prev => {
            if (prev.length >= 3) return prev;
            return [...prev, base64Data];
          });
          setTotalSessionPhotosCount(prev => prev + 1);
        }
      };
      reader.readAsDataURL(file);
    });

    if (e.target) e.target.value = '';
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() && uploadedImages.length === 0) return;

    const currentImages = [...uploadedImages];
    const hasImages = currentImages.length > 0;

    let defaultText = currentLang === 'en' ? "Please analyze this image" : "Por favor, analiza esta foto de mi avería";
    if (currentImages.length > 1) {
      defaultText = currentLang === 'en' 
        ? `Please analyze these ${currentImages.length} images` 
        : `Por favor, analiza estas ${currentImages.length} fotos de mi avería`;
    }

    const messageText = text.trim() || defaultText;

    // User message object
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Reset active image uploads
    setUploadedImages([]);

    const targetLang = currentLang;

    try {
      let textResponse = '';
      let spokenResponse = '';
      let category = 'other';
      let suggestDispatch = false;

      let usedModel = '';

      if (hasImages) {
        const res = await fetch('/api/gemini/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            images: currentImages,
            currentCity,
            currentLang: targetLang,
            textPrompt: messageText,
            selectedServiceId,
            selectedServiceDetails: selectedService,
            mode: aiMode
          })
        });

        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }

        const data = await res.json();
        textResponse = data.text;
        spokenResponse = data.spoken;
        category = data.category || 'other';
        suggestDispatch = !!data.suggestDispatch;
        usedModel = data.usedModel || '';
      } else {
        const recentMessages = [...messages, userMessage].slice(-6);
        const res = await fetch('/api/gemini/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: recentMessages,
            currentCity,
            currentLang: targetLang,
            selectedServiceId,
            selectedServiceDetails: selectedService,
            mode: aiMode
          })
        });

        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }

        const data = await res.json();
        textResponse = data.text;
        spokenResponse = data.spoken;
        category = data.category || 'other';
        suggestDispatch = !!data.suggestDispatch;
        usedModel = data.usedModel || '';
      }

      setIsTyping(false);

      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: textResponse,
        timestamp: new Date(),
        usedModel
      }]);

      if (suggestDispatch) {
        setTimeout(() => {
          setDispatchStep('form');
        }, 1200);
      }

      speakText(spokenResponse, targetLang);

    } catch (err) {
      console.warn("Gemini server-side API failed, falling back to local responsive rule-engine:", err);
      
      // Local fallback execution
      setTimeout(() => {
        const lowerText = messageText.toLowerCase();
        let matchKey = 'default';
        let fallbackText = '';
        let fallbackSpoken = '';

        if (lowerText.includes('fuga') || lowerText.includes('agua') || lowerText.includes('gotera') || lowerText.includes('grifo') || lowerText.includes('inund') || lowerText.includes('plom') || lowerText.includes('fontan') || lowerText.includes('desatasc') ||
            lowerText.includes('leak') || lowerText.includes('pipe') || lowerText.includes('water') || lowerText.includes('sink') || lowerText.includes('flood') || lowerText.includes('plumb') ||
            lowerText.includes('taps') || lowerText.includes('faucet') ||
            lowerText.includes('gotera') || lowerText.includes('aigua') || lowerText.includes('fontaner') || lowerText.includes('grifó') ||
            lowerText.includes('fuite') || lowerText.includes('plombier') || lowerText.includes('robinet')) {
          matchKey = 'fuga';
        } else if (lowerText.includes('luz') || lowerText.includes('apag') || lowerText.includes('electr') || lowerText.includes('enchufe') || lowerText.includes('corrient') || lowerText.includes('quadro') || lowerText.includes('cuadro') || lowerText.includes('cortocir') ||
                   lowerText.includes('power') || lowerText.includes('blackout') || lowerText.includes('light') || lowerText.includes('fuse') || lowerText.includes('breaker') || lowerText.includes('electricity') ||
                   lowerText.includes('llum') || lowerText.includes('apagada') || lowerText.includes('electricista') ||
                   lowerText.includes('panne') || lowerText.includes('courant') || lowerText.includes('prise') || lowerText.includes('tableau') || lowerText.includes('disjoncteur')) {
          matchKey = 'apagón';
        } else if (lowerText.includes('cerraj') || lowerText.includes('puerta') || lowerText.includes('llave') || lowerText.includes('cerradur') || lowerText.includes('candad') || lowerText.includes('abrir') ||
                   lowerText.includes('lock') || lowerText.includes('key') || lowerText.includes('door') || lowerText.includes('unlock') || lowerText.includes('locksmith') ||
                   lowerText.includes('clau') || lowerText.includes('porta') || lowerText.includes('serraller') ||
                   lowerText.includes('cle') || lowerText.includes('serrure') || lowerText.includes('verrou') || lowerText.includes('serrurier')) {
          matchKey = 'cerrajeria';
        } else if (lowerText.includes('caldera') || lowerText.includes('calefac') || lowerText.includes('gas') || lowerText.includes('calentador') || lowerText.includes('termo') || lowerText.includes('calor') ||
                   lowerText.includes('boiler') || lowerText.includes('heater') || lowerText.includes('heating') ||
                   lowerText.includes('calenta') || lowerText.includes('calentador') ||
                   lowerText.includes('chaudiere') || lowerText.includes('chauffage') || lowerText.includes('chaudière')) {
          matchKey = 'caldera';
        } else if (lowerText.includes('precio') || lowerText.includes('costa') || lowerText.includes('costo') || lowerText.includes('cuanto') || lowerText.includes('tarifa') || lowerText.includes('presupuesto') || lowerText.includes('gratis') ||
                   lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('fee') || lowerText.includes('how much') || lowerText.includes('estimate') || lowerText.includes('free') ||
                   lowerText.includes('preu') || lowerText.includes('quant') || lowerText.includes('tarifes') ||
                   lowerText.includes('prix') || lowerText.includes('tarif') || lowerText.includes('combien') || lowerText.includes('devis') || lowerText.includes('gratuit')) {
          matchKey = 'precio';
        } else if (lowerText.includes('urgente') || lowerText.includes('rapido') || lowerText.includes('tard') || lowerText.includes('ahora') || lowerText.includes('ya') || lowerText.includes('cobertura') || lowerText.includes('madrid') || lowerText.includes('barcelona') || lowerText.includes('valencia') ||
                   lowerText.includes('urgent') || lowerText.includes('fast') || lowerText.includes('quick') || lowerText.includes('now') || lowerText.includes('time') || lowerText.includes('coverage') ||
                   lowerText.includes('urgència') || lowerText.includes('urgents') ||
                   lowerText.includes('urgence') || lowerText.includes('rapide')) {
          matchKey = 'urgencia';
        }

        if (matchKey !== 'default') {
          if (matchKey === 'precio' && selectedService) {
            const issuesText = selectedService.commonIssues.map(i => `• **${i.name}**: ${i.avgPrice} *(Tiempo est.: ${i.duration})*\n  ${i.description}`).join('\n\n');
            if (targetLang === 'en') {
              fallbackText = `💰 **Rates & Pricing for ${selectedService.name} in ${currentCity.name}:**\n\n${selectedService.longDescription}\n\n**Estimated Tariffs:**\n${issuesText}\n\n• **On-site Assessment**: Transparent upfront quote before starting any work.\n• **Guarantee**: Written guarantee on all repairs.\n\nWould you like to dispatch an emergency technician for **${selectedService.name}** right away?`;
              fallbackSpoken = `Rates for ${selectedService.name} in ${currentCity.name} start at ${selectedService.commonIssues[0]?.avgPrice || '35 euros'}. Would you like to schedule a technician now?`;
            } else if (targetLang === 'ca') {
              fallbackText = `💰 **Tarifes i Preus de ${selectedService.name} a ${currentCity.name}:**\n\n${selectedService.longDescription}\n\n**Tarifes estimades:**\n${issuesText}\n\n• **Desplaçament i Diagnòstic**: Pressupost tancat al domicili abans de començar.\n• **Garantia**: Reparacions garantides per escrit.\n\nVol que li enviem un tècnic de **${selectedService.name}** ara mateix?`;
              fallbackSpoken = `Les tarifes per a ${selectedService.name} a ${currentCity.name} comencen des de ${selectedService.commonIssues[0]?.avgPrice || '35 euros'}. Vol agendar un tècnic ara mateix?`;
            } else if (targetLang === 'fr') {
              fallbackText = `💰 **Tarifs et Prix pour ${selectedService.name} à ${currentCity.name} :**\n\n${selectedService.longDescription}\n\n**Tarifs estimés :**\n${issuesText}\n\n• **Déplacement et Diagnostic** : Devis transparent sur place avant toute intervention.\n• **Garantie** : Réparations garanties par écrit.\n\nSouhaitez-vous planifier un technicien **${selectedService.name}** dès maintenant ?`;
              fallbackSpoken = `Les tarifs pour ${selectedService.name} à ${currentCity.name} commencent à partir de ${selectedService.commonIssues[0]?.avgPrice || '35 euros'}. Souhaitez-vous réserver un technicien ?`;
            } else {
              fallbackText = `💰 **Tarifas y Precios Oficiales de ${selectedService.name} en ${currentCity.name}:**\n\n${selectedService.longDescription}\n\n**Desglose detallado de tarifas estimadas:**\n${issuesText}\n\n• **Desplazamiento y Diagnóstico**: Presupuesto cerrado en su domicilio antes de realizar cualquier trabajo.\n• **Garantía por escrito**: Todos los trabajos de ${selectedService.name} están 100% garantizados.\n\n¿Desea que despachemos un técnico de **${selectedService.name}** de urgencia ahora mismo?`;
              fallbackSpoken = `Para el servicio de ${selectedService.name} en ${currentCity.name}, nuestras tarifas oficiales comienzan desde ${selectedService.commonIssues[0]?.avgPrice || '35 euros'}. El presupuesto exacto se aprueba en mano antes de trabajar. ¿Quieres agendar un técnico ahora?`;
            }
          } else {
            const matched = MULTILINGUAL_RESPONSES[targetLang][matchKey];
            fallbackText = matched.text.replace(/{city}/g, currentCity.name);
            fallbackSpoken = matched.spoken.replace(/{city}/g, currentCity.name);
          }
        } else {
          const isDispatchKeywords = 
            lowerText.includes('enviar') || lowerText.includes('mandar') || lowerText.includes('tecnico') || lowerText.includes('operario') || lowerText.includes('solicitar') ||
            lowerText.includes('send') || lowerText.includes('dispatch') || lowerText.includes('technician') || lowerText.includes('worker') || lowerText.includes('request') ||
            lowerText.includes('enviar') || lowerText.includes('tècnic') || lowerText.includes('sol·licitar') ||
            lowerText.includes('envoyer') || lowerText.includes('technicien') || lowerText.includes('demander');

          if (isDispatchKeywords) {
            setDispatchStep('form');
            if (targetLang === 'en') {
              fallbackText = "📋 **IMMEDIATE DISPATCH REQUEST:**\n\nPlease provide your address and phone number so we can coordinate your technician right away. They will arrive in less than 20 minutes.";
              fallbackSpoken = "I have activated the emergency dispatch protocol. Please fill out your address and phone number on the screen to send the nearest technician immediately.";
            } else if (targetLang === 'ca') {
              fallbackText = "📋 **SOL·LICITUD D'ENVIAMENT IMMEDIAT:**\n\nPer favor, faciliti'ns l'adreça i telèfon per coordinar l'enviament immediat del tècnic. Arribarà en menys de 20 minuts.";
              fallbackSpoken = "He activat el protocol d'enviament urgent. Per favor, ompli les dades de contacte a la pantalla per enviar el tècnic més proper immediatament.";
            } else if (targetLang === 'fr') {
              fallbackText = "📋 **DEMANDE D'INTERVENTION IMMÉDIATE :**\n\nMerci de renseigner votre adresse et téléphone afin de planifier l'envoi du technicien le plus proche. Arrivée en moins de 20 minutes.";
              fallbackSpoken = "J'ai activé le protocole d'intervention urgente. Merci de compléter votre adresse et numéro de téléphone à l'écran pour que nous puissions envoyer le dépanneur immédiatement.";
            } else {
              fallbackText = "📋 **SOLICITUD DE DESPACHO INMEDIATO:**\n\nPor favor, facilíteme los detalles de su domicilio para coordinar el envío de su técnico homologado de inmediato. Estará allí en menos de 20 minutos.";
              fallbackSpoken = "He activado el protocolo de despacho urgente. Por favor, complete la dirección y su teléfono en la pantalla para enviar al operario más cercano de inmediato.";
            }
          } else {
            if (targetLang === 'en') {
              fallbackText = `I understand completely. Your situation in **${currentCity.name}** requires professional attention.\n\nOur specialists are on duty **24 hours a day**.\n\n• **Response time:** 15 to 20 minutes.\n• **Guaranteed repairs** provided in writing.\n\nWould you like us to dispatch an emergency technician or do you have a pricing question?`;
              fallbackSpoken = `Understood. We are on duty twenty-four hours a day in ${currentCity.name} to solve your emergency in less than twenty minutes. Would you like to schedule an emergency technician right now?`;
            } else if (targetLang === 'ca') {
              fallbackText = `Ho entenc perfectament. La seva incidència a **${currentCity.name}** requereix l'atenció d'un tècnic.\n\nEls nostres especialistes estan de guàrdia **24 hores**.\n\n• **Temps de resposta:** 15 a 20 minuts.\n• **Reparacions garantides** per escrit.\n\nPrefereix que li enviem un tècnic urgent o vol fer una consulta de preus?`;
              fallbackSpoken = `Rebut. Estem de guàrdia les vint-i-quatre hores a ${currentCity.name} per resoldre la seva incidència en menys de vint minuts. Vol que li enviem un tècnic ara mateix?`;
            } else if (targetLang === 'fr') {
              fallbackText = `Je comprends tout à fait. Votre problème technique à **${currentCity.name}** nécessite l'aide d'un expert.\n\nNos spécialistes sont de garde **24h/24**.\n\n• **Délai d'intervention :** 15 à 20 minutes.\n• **Réparations garanties** par écrit.\n\nSouhaitez-vous l'envoi d'un technicien d'urgence ou avez-vous des questions sur les tarifs?`;
              fallbackSpoken = `Bien reçu. Nous sommes de garde vingt-quatre heures sur vingt-quatre à ${currentCity.name} pour résoudre votre urgence en moins de vingt minutes. Souhaitez-vous que nous vous envoyions un technicien maintenant?`;
            } else {
              fallbackText = `Entiendo perfectamente. Su situación técnica en **${currentCity.name}** requiere atención experta.\n\n` +
                             "Nuestros especialistas están de guardia las **24 horas**.\n\n" +
                             "• **Tiempo de respuesta:** 15 a 20 minutos.\n" +
                             "• **Boletines y reparaciones garantizadas** por escrito.\n\n" +
                             "¿Prefiere que le despachemos un técnico urgente o quiere realizar una consulta de precios?";
              fallbackSpoken = `Recibido. Estamos de guardia las veinticuatro horas en ${currentCity.name} para resolver su emergencia en menos de veinte minutos. ¿Desea que le agendemos un técnico de urgencia ahora mismo?`;
            }
          }
        }

        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: `ai-fallback-${Date.now()}`,
          sender: 'ai',
          text: fallbackText,
          timestamp: new Date()
        }]);

        speakText(fallbackSpoken, targetLang);
      }, 1000);
    }
  };

  const handleQuickQuestion = (label: string, keyword: string) => {
    handleSendMessage(label);
  };

  const triggerDispatchForm = () => {
    setDispatchStep('form');
    const promptText = currentLang === 'en'
      ? "Please provide your name, address and phone number so we can dispatch the technician immediately."
      : currentLang === 'ca'
      ? "Per favor, faciliti el seu nom, adreça i número de telèfon per enviar el tècnic immediatament."
      : currentLang === 'fr'
      ? "Veuillez renseigner votre nom, adresse et téléphone pour envoyer le technicien immédiatement."
      : "Por favor, facilíteme su nombre, dirección y número de contacto para enviar al técnico homologado de guardia inmediatamente.";
    speakText(promptText);
  };

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) return;
    
    setDispatchStep('success');
    
    let confirmSpoken = "";
    if (currentLang === 'en') {
      confirmSpoken = `Confirmed! Mr or Ms ${formData.name}, the urgent dispatch protocol for ${formData.type} is fully active. Your duty technician has been notified and is heading to your address. Estimated arrival time is fifteen minutes. Please keep your phone reachable.`;
    } else if (currentLang === 'ca') {
      confirmSpoken = `Atenció confirmada! Senyor o senyora ${formData.name}, el protocol d'urgència per a ${formData.type} ha estat activat amb èxit. El seu tècnic ha estat notificat i es dirigeix a l'adreça indicada. El temps estimat d'arribada és de quinze minuts. Mantingui's localitzable al mòbil.`;
    } else if (currentLang === 'fr') {
      confirmSpoken = `Confirmation reçue ! Monsieur ou Madame ${formData.name}, l'intervention d'urgence pour ${formData.type} est activée avec succès. Votre dépanneur a été notifié et se dirige vers votre adresse. Heure d'arrivée estimée dans quinze minutes. Veuillez rester joignable par téléphone.`;
    } else {
      confirmSpoken = `¡Atención confirmada! Don ${formData.name}, el protocolo de urgencia para ${formData.type} ha sido activado con éxito. Su técnico de guardia ha sido notificado y se dirige a la dirección indicada. Su tiempo estimado de llegada es de quince minutos. Manténgase localizable en su teléfono móvil.`;
    }

    speakText(confirmSpoken);
  };

  const handleWhatsAppClick = () => {
    // 1. Gather client data from state
    const clientName = formData.name?.trim() || 'Cliente Urge-Ya';
    const clientPhone = formData.phone?.trim() || 'No facilitado';
    const clientAddress = formData.address?.trim() || `No facilitada (${currentCity?.name || 'España'})`;
    const serviceType = formData.type || selectedService?.name || 'Emergencia Técnica del Hogar';

    // 2. Gather chat problem description and messages
    const userMsgs = messages.filter(m => m.sender === 'user').map(m => m.text.replace(/\*\*/g, '').trim()).filter(Boolean);
    const aiMsgs = messages.filter(m => m.sender === 'ai' && m.id !== 'welcome').map(m => m.text.replace(/\*\*/g, '').trim()).filter(Boolean);

    let problemDescription = '';
    if (userMsgs.length > 0) {
      problemDescription = userMsgs.join('\n  • ');
    } else {
      problemDescription = `Servicio urgente de ${serviceType} en ${currentCity?.name || 'mi zona'}.`;
    }

    let aiDiagnosis = '';
    if (aiMsgs.length > 0) {
      const lastAi = aiMsgs[aiMsgs.length - 1];
      aiDiagnosis = lastAi.length > 280 ? lastAi.slice(0, 280) + '...' : lastAi;
    }

    // 3. Gather up to 3 uploaded images (URLs or Data URLs)
    const currentUploadUrls = uploadedImages.map(img => `data:${img.mimeType};base64,${img.base64}`);
    const allSessionPhotos = Array.from(new Set([...currentUploadUrls, ...sessionImages])).slice(0, 3);

    // 4. Construct formatted message
    const messageLines = [
      `🚨 *SOLICITUD DE TÉCNICO DE GUARDIA 24H - LUNA IA*`,
      ``,
      `📋 *DATOS DEL CLIENTE Y UBICACIÓN:*`,
      `• *Nombre:* ${clientName}`,
      `• *Teléfono:* ${clientPhone}`,
      `• *Dirección:* ${clientAddress}`,
      `• *Servicio Requerido:* ${serviceType}`,
      `• *Delegación/Zona:* ${currentCity?.name || 'España'}`,
      ``,
      `🛠️ *DESCRIPCIÓN DEL PROBLEMA (MENSAJES EN CHAT):*`,
      `  • ${problemDescription}`
    ];

    if (aiDiagnosis) {
      messageLines.push(``);
      messageLines.push(`🤖 *DIAGNÓSTICO PREVIO DE LUNA IA:*`);
      messageLines.push(`${aiDiagnosis}`);
    }

    messageLines.push(``);
    messageLines.push(`📸 *IMÁGENES SUBIDAS DE LA AVERÍA (${allSessionPhotos.length}/3):*`);
    if (allSessionPhotos.length > 0) {
      allSessionPhotos.forEach((imgUrl, index) => {
        if (imgUrl.startsWith('data:')) {
          const mime = imgUrl.substring(5, imgUrl.indexOf(';') > 0 ? imgUrl.indexOf(';') : 15);
          messageLines.push(`  • Imagen ${index + 1}: [Foto adjunta en chat LUNA (${mime})] (${imgUrl.slice(0, 80)}...)`);
        } else {
          messageLines.push(`  • Imagen ${index + 1}: ${imgUrl}`);
        }
      });
    } else {
      messageLines.push(`  • Ninguna imagen adjunta`);
    }

    messageLines.push(``);
    messageLines.push(`⚡ Solicitamos atención prioritaria y envío de un técnico de guardia a la ubicación. ¡Muchas gracias!`);

    const fullMessage = messageLines.join('\n');
    const encodedText = encodeURIComponent(fullMessage);

    const rawWa = '+34664065855';
    const cleanWa = rawWa.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${cleanWa}?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
  };

  const currentLabels = UI_LABELS[currentLang];

  return (
    <>
      {/* Floating Action Button - Same layout, size & positioning as user requested */}
      <div className="fixed bottom-3 left-3 sm:bottom-6 sm:left-6 z-40">
        <button
          onClick={() => {
            setIsOpen(true);
            // Read out loud welcoming greeting on open if not muted
            setTimeout(() => {
              const welcome = WELCOME_MESSAGES[currentLang];
              speakText(welcome.spoken.replace(/{city}/g, currentCity.name), currentLang);
            }, 300);
          }}
          className="flex items-center gap-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:to-pink-600 text-white px-5 py-3.5 rounded-full text-sm font-extrabold shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border-2 border-white/20 animate-pulse-subtle group"
          id="btn-ai-assistant"
        >
          <div className="relative">
            {isSpeaking ? (
              // Live Equalizer Visualizer when speaking
              <div className="flex gap-0.5 items-end justify-center w-5 h-5 h-[14px]">
                <span className="w-1 bg-amber-300 rounded-full animate-voice-bar-1"></span>
                <span className="w-1 bg-amber-300 rounded-full animate-voice-bar-2"></span>
                <span className="w-1 bg-amber-300 rounded-full animate-voice-bar-3"></span>
                <span className="w-1 bg-amber-300 rounded-full animate-voice-bar-4"></span>
              </div>
            ) : (
              <Sparkles className="w-5 h-5 animate-spin-slow text-amber-200 group-hover:scale-110 transition-transform" />
            )}
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-300"></span>
            </span>
          </div>
          <span className="tracking-tight font-display">{currentLabels.floatBtnText}</span>
          <span className="bg-white/20 text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider text-white">IA</span>
        </button>
      </div>

      {/* AI Voice Support Chat Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop with high z-index and blur effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                window.speechSynthesis?.cancel();
                setIsSpeaking(false);
                setIsOpen(false);
              }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[9998] cursor-pointer"
            />

            {/* Modal Container Wrapper for Responsiveness & Desktop centering */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 pointer-events-none pb-[calc(0.5rem+env(safe-area-inset-bottom))] overflow-y-auto">
              {/* Premium Chat Window */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="pointer-events-auto w-full max-w-[480px] h-[620px] max-h-[96dvh] sm:max-h-[90dvh] bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col font-sans my-auto"
                id="ai-chat-window"
              >
                {/* Voice Centered Gradient Header */}
                <div className="relative p-3 sm:p-4 pr-24 sm:pr-28 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="relative p-2 sm:p-2.5 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl text-white shadow-lg">
                      {isSpeaking ? (
                        <div className="flex gap-0.5 items-end justify-center w-5 h-5 h-[16px]">
                          <span className="w-0.5 bg-white rounded-full animate-voice-bar-1"></span>
                          <span className="w-0.5 bg-white rounded-full animate-voice-bar-2"></span>
                          <span className="w-0.5 bg-white rounded-full animate-voice-bar-3"></span>
                          <span className="w-0.5 bg-white rounded-full animate-voice-bar-4"></span>
                        </div>
                      ) : (
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200 animate-pulse" />
                      )}
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-success rounded-full border border-slate-900"></span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-display font-black text-white text-xs sm:text-sm tracking-tight">{currentLabels.speakWelBtn}</h4>
                        <span className="bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse">24H</span>
                      </div>
                      <p className="text-[9px] sm:text-[10px] text-slate-400">{currentLabels.headerSubtitle}</p>
                    </div>
                  </div>

                  {/* Speaker Control & Absolute Close Button (Min 44x44px tap targets) */}
                  <div className="absolute right-14 sm:right-16 top-2.5 sm:top-3.5 z-20">
                    <button
                      onClick={() => setIsVoiceMuted(!isVoiceMuted)}
                      className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full transition cursor-pointer border ${
                        isVoiceMuted 
                          ? 'bg-slate-800/80 border-rose-800 text-rose-400 hover:text-rose-300' 
                          : 'bg-indigo-600/20 border-indigo-500/20 text-indigo-300 hover:text-white hover:bg-indigo-600/30'
                      }`}
                      title={isVoiceMuted ? currentLabels.unmuteVoice : currentLabels.muteVoice}
                      style={{ width: '40px', height: '40px' }}
                    >
                      {isVoiceMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      window.speechSynthesis?.cancel();
                      setIsSpeaking(false);
                      setIsOpen(false);
                    }}
                    className="absolute top-2.5 sm:top-3.5 right-3 sm:right-4 z-20 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition cursor-pointer border border-slate-700/60 shadow-lg"
                    title={currentLabels.close}
                    style={{ width: '40px', height: '40px' }}
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Multilingual Selector Row */}
                <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-950/60 border-b border-slate-800/60 gap-1 overflow-x-auto shrink-0">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest shrink-0">Idioma / Lang:</span>
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLang(lang.code);
                          const welcome = WELCOME_MESSAGES[lang.code];
                          const textWelcome = welcome.text.replace(/{city}/g, currentCity.name);
                          
                          setMessages([
                            {
                              id: `welcome-${Date.now()}`,
                              sender: 'ai',
                              text: textWelcome,
                              timestamp: new Date()
                            }
                          ]);
                          
                          // Trigger new audio in the newly selected language
                          speakText(welcome.spoken.replace(/{city}/g, currentCity.name), lang.code);
                        }}
                        className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                          currentLang === lang.code
                            ? 'bg-indigo-600/90 text-white font-extrabold shadow-sm border border-indigo-500'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/60'
                        }`}
                        title={lang.label}
                        style={{ minHeight: '28px' }}
                      >
                        <span>{lang.flag}</span>
                        <span className="text-[9px]">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

              {/* Speech Error Banner */}
              {speechError && (
                <div className="bg-rose-950/80 border-b border-rose-800 px-4 py-2 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{speechError}</span>
                </div>
              )}

              {/* Chat Log View */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/40 custom-scrollbar">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400 mt-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] rounded-2xl p-3.5 text-xs md:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-tr-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {/* Markdown processing support */}
                      <div className="space-y-1.5 whitespace-pre-wrap">
                        {msg.text.split('\n').map((line, i) => {
                          let content: React.ReactNode = line;
                          const boldRegex = /\*\*(.*?)\*\*/g;
                          if (line.match(boldRegex)) {
                            const parts = line.split(boldRegex);
                            content = parts.map((part, index) => 
                              index % 2 === 1 ? <strong key={index} className="font-extrabold text-white text-shadow-sm">{part}</strong> : part
                            );
                          }
                          if (line.trim().startsWith('•')) {
                            return <div key={i} className="pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-indigo-400">{line.replace(/^•\s*/, '')}</div>;
                          }
                          return <p key={i}>{content}</p>;
                        })}
                      </div>
                      
                      <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-white/5 text-[9px] text-slate-500">
                        <span className="uppercase font-bold flex items-center gap-1">
                          {msg.usedModel?.includes('flash-lite') ? (
                            <span className="text-amber-400 font-extrabold flex items-center gap-1">⚡ Baja Latencia (3.1-flash-lite)</span>
                          ) : msg.usedModel?.includes('pro-preview') ? (
                            <span className="text-purple-400 font-extrabold flex items-center gap-1">🧠 Pensamiento Profundo (3.1-pro)</span>
                          ) : (
                            <span className="text-slate-400 font-bold">🤖 Respuesta IA</span>
                          )}
                        </span>
                        <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-7 h-7 rounded-lg bg-indigo-600/20 flex items-center justify-center shrink-0 text-indigo-300 mt-1 font-extrabold text-[10px]">
                        TU
                      </div>
                    )}
                  </div>
                ))}

                {/* RENDER INLINE DISPATCH WORKFLOW */}
                {dispatchStep === 'form' && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900 border border-rose-500/40 rounded-2xl p-4 space-y-3.5 shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-400 to-rose-500 animate-pulse"></div>

                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
                        <MapPin className="w-4 h-4 text-rose-400" />
                        <h5 className="text-xs font-black text-white uppercase tracking-wider">{currentLabels.dispatchTitle}</h5>
                      </div>
                      <span className="text-[10px] bg-rose-950/80 text-rose-300 font-extrabold px-2 py-0.5 rounded-full border border-rose-800/60">
                        24H ACTIVO
                      </span>
                    </div>

                    <form onSubmit={handleDispatchSubmit} className="space-y-3">
                      <div>
                        <label className="block text-[10px] text-slate-300 font-bold mb-1">{currentLabels.labelName}</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Ej: Marta Gómez"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] text-slate-300 font-bold mb-1">{currentLabels.labelPhone}</label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="Ej: 696 669 689"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-300 font-bold mb-1">{currentLabels.labelType}</label>
                          <select
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                          >
                            <option value="Fontanería">{currentLabels.optPlumbing}</option>
                            <option value="Electricidad">{currentLabels.optElectric}</option>
                            <option value="Cerrajería">{currentLabels.optLocksmith}</option>
                            <option value="Calderas/Gas">{currentLabels.optBoiler}</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-300 font-bold mb-1">{currentLabels.labelAddress}</label>
                        <input
                          type="text"
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          placeholder="Calle, Número, Piso y Ciudad"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                        />
                      </div>

                      <div className="space-y-2 pt-1">
                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-rose-600/20 transition cursor-pointer active:scale-98 flex items-center justify-center gap-2"
                        >
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span>{currentLabels.btnSubmitDispatch}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleWhatsAppClick}
                          className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md shadow-emerald-600/20 transition cursor-pointer active:scale-98 flex items-center justify-center gap-2"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.432h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
                          </svg>
                          <span>ENVIAR FICHA COMPLETA A WHATSAPP</span>
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {dispatchStep === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-4 text-center space-y-3.5 shadow-2xl"
                  >
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/30 animate-pulse">
                      <Check className="w-6 h-6 stroke-[3px]" />
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-white uppercase tracking-wider">{currentLabels.successTitle}</h5>
                      <p className="text-[11px] text-slate-300 mt-1">{currentLabels.successText} <strong>Don {formData.name}</strong>.</p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl space-y-2 text-left text-xs border border-slate-800">
                      <div className="flex gap-2 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span><strong>{currentLabels.lblDestiny}</strong> {formData.address}</span>
                      </div>
                      <div className="flex gap-2 text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong>{currentLabels.lblTime}</strong> {currentLabels.lblMinutes}</span>
                      </div>
                      <div className="flex gap-2 text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span><strong>{currentLabels.lblPhone}</strong> {formData.phone}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <button
                        onClick={handleWhatsAppClick}
                        className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-2 shadow-md uppercase tracking-wider"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.432h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
                        </svg>
                        <span>ABRIR EN WHATSAPP (34664065855)</span>
                      </button>

                      <div className="flex gap-2">
                        <a
                          href={`tel:${currentCity.phone}`}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          <span>{currentLabels.btnCallCentral}</span>
                        </a>
                        <button
                          onClick={() => setDispatchStep('idle')}
                          className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          {currentLabels.btnCloseTicket}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 text-xs flex items-center gap-1.5 text-slate-400">
                      <span>{currentLabels.processingVoice}</span>
                      <div className="flex gap-1 items-center justify-center">
                        <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Trigger Panel */}
              <div className="p-2.5 sm:p-3 bg-slate-900 border-t border-slate-800 flex flex-col gap-2 shrink-0 max-h-[50vh] overflow-y-auto custom-scrollbar">
                {/* Live Camera Viewfinder Modal/Overlay */}
                {isCameraActive && (
                  <div className="p-2 sm:p-3 bg-slate-950 border border-indigo-500/40 rounded-2xl flex flex-col items-center gap-2 shadow-2xl relative animate-fadeIn">
                    <div className="relative w-full h-36 sm:h-52 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Top action controls */}
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          type="button"
                          onClick={flipCamera}
                          className="p-1.5 bg-slate-950/80 hover:bg-slate-900 text-white rounded-full transition cursor-pointer backdrop-blur-md border border-slate-700"
                          title="Cambiar Cámara"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
                        </button>
                        <button
                          type="button"
                          onClick={stopCameraStream}
                          className="p-1.5 bg-slate-950/80 hover:bg-slate-900 text-white rounded-full transition cursor-pointer backdrop-blur-md border border-slate-700"
                          title="Cerrar Cámara"
                        >
                          <X className="w-3.5 h-3.5 text-slate-300" />
                        </button>
                      </div>

                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-600/90 text-white text-[9px] font-bold rounded-md flex items-center gap-1 backdrop-blur-sm animate-pulse">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        <span>CÁMARA EN VIVO</span>
                      </div>
                    </div>

                    {/* Shutter capture bar */}
                    <div className="flex items-center justify-center gap-2 w-full pt-0.5">
                      <button
                        type="button"
                        onClick={capturePhotoFromStream}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow-lg shadow-indigo-500/25 active:scale-95 uppercase tracking-wider"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>CAPTURAR FOTO</span>
                      </button>
                      <button
                        type="button"
                        onClick={stopCameraStream}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick 4-action grid bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  <input
                    type="file"
                    ref={cameraInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    capture="environment"
                    multiple
                    className="hidden"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />

                  <a
                    href={`tel:${currentCity.phone}`}
                    className="flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px] font-bold py-1.5 px-2 rounded-xl transition cursor-pointer text-center truncate"
                    title={`Llamar ${currentCity.phoneFormatted}`}
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{currentLabels.btnCall}</span>
                  </a>

                  <button
                    type="button"
                    onClick={triggerDispatchForm}
                    className="flex items-center justify-center gap-1 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-[11px] font-black py-1.5 px-2 rounded-xl transition cursor-pointer shadow-md uppercase tracking-wider text-center truncate"
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{currentLabels.btnDispatch}</span>
                  </button>

                  <button
                    type="button"
                    onClick={openCamera}
                    className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-950 hover:bg-slate-800 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 hover:border-indigo-400/60 rounded-xl text-[11px] font-bold transition cursor-pointer shadow-sm active:scale-95 text-center truncate"
                  >
                    <Camera className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{currentLang === 'en' ? 'Camera' : currentLang === 'ca' ? 'Càmera' : currentLang === 'fr' ? 'Appareil photo' : 'Usar Cámara'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-950 hover:bg-slate-800 text-purple-300 hover:text-purple-200 border border-purple-500/30 hover:border-purple-400/60 rounded-xl text-[11px] font-bold transition cursor-pointer shadow-sm active:scale-95 text-center truncate"
                  >
                    <Image className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">{currentLang === 'en' ? 'Upload Photo' : currentLang === 'ca' ? 'Carregar Foto' : currentLang === 'fr' ? 'Charger Photo' : 'Subir Fotos'}</span>
                  </button>
                </div>

                {/* Image upload preview widget - Supporting up to 3 photos */}
                {uploadedImages.length > 0 && (
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-indigo-300 font-bold flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5 text-indigo-400" />
                        {currentLang === 'en' ? `Attached Photos (${uploadedImages.length}/3)` : `Fotos de Avería (${uploadedImages.length}/3)`}
                      </span>
                      {uploadedImages.length < 3 ? (
                        <span className="text-[9px] text-amber-400 font-semibold">
                          {currentLang === 'en' ? "Can add up to 3 photos" : "Puedes subir hasta 3 fotos"}
                        </span>
                      ) : (
                        <span className="text-[9px] text-emerald-400 font-semibold">
                          {currentLang === 'en' ? "Max photos reached (3/3)" : "Máximo alcanzado (3/3 fotos)"}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                      {uploadedImages.map((img, idx) => (
                        <div key={idx} className="relative group shrink-0">
                          <img
                            src={`data:${img.mimeType};base64,${img.base64}`}
                            alt={`Preview ${idx + 1}`}
                            className="w-12 h-12 object-cover rounded-lg border border-slate-700 shadow-md"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            type="button"
                            onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute -top-1.5 -right-1.5 bg-slate-900 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700 rounded-full p-0.5 shadow transition cursor-pointer"
                            title="Eliminar esta foto"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <span className="absolute bottom-0 left-0 bg-slate-950/80 text-white text-[8px] font-black px-1 rounded-tr-md">
                            #{idx + 1}
                          </span>
                        </div>
                      ))}

                      {uploadedImages.length < 3 && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-12 h-12 rounded-lg border border-dashed border-indigo-500/40 hover:border-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 flex flex-col items-center justify-center text-indigo-300 transition cursor-pointer shrink-0"
                          title="Añadir otra foto"
                        >
                          <Plus className="w-4 h-4 text-indigo-400" />
                          <span className="text-[8px] font-bold">+ Foto</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Text input form with real-time mic input fallback */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputValue);
                  }}
                  className="flex gap-2 items-center"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={currentLabels.inputPlaceholder}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                  
                  {/* Real-time speech input trigger */}
                  <button
                    type="button"
                    onClick={startSpeechRecognition}
                    className={`p-2 rounded-xl transition flex items-center justify-center shrink-0 cursor-pointer ${
                      isListening 
                        ? 'bg-rose-600 text-white animate-pulse' 
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                    }`}
                    title={currentLabels.dictateTitle}
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <button
                    type="submit"
                    disabled={!inputValue.trim() && uploadedImages.length === 0}
                    className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* Secondary Exit Button */}
                <button
                  type="button"
                  onClick={() => {
                    window.speechSynthesis?.cancel();
                    setIsSpeaking(false);
                    setIsOpen(false);
                  }}
                  className="w-full text-center text-slate-400 hover:text-slate-300 text-[9px] sm:text-[10px] uppercase tracking-widest font-extrabold py-1.5 transition cursor-pointer bg-slate-950/50 hover:bg-slate-950 border border-slate-800/80 rounded-xl"
                >
                  {currentLabels.btnExit}
                </button>
              </div>
            </motion.div>
          </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
