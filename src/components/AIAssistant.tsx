import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Send, X, Phone, Check, AlertCircle, RefreshCw, 
  ChevronRight, User, Mic, MicOff, Volume2, VolumeX, MapPin, 
  Clock, Shield, Flame, Zap, Droplet, Key, Image 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
  isDispatchForm?: boolean;
}

interface AIAssistantProps {
  currentCity: {
    name: string;
    phone: string;
    phoneFormatted: string;
  };
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
    text: `¡Hola! Soy **Tony**, su **Asistente de Voz Inteligente** de **Urge Ya** en **{city}**. 🤖🔊\n\nEstoy preparado para responderle por voz de forma inmediata y gestionar su avería urgente.\n\n📸 **¡NUEVA FUNCIÓN DISPONIBLE!** Ahora puede **subir una foto de su avería** (tuberías rotas, llaves atascadas, cables quemados o fugas) pulsando el botón de la cámara para que la analice de inmediato con Inteligencia Artificial.\n\nOfrezco soporte en **castellano, inglés, catalán y francés**.\n\nCuénteme, ¿tiene alguna emergencia con **fugas de agua**, **apagones de luz**, **cerrajería de urgencia** o **fallos en su caldera**? O elija un idioma en la barra superior.`,
    spoken: `Hola, soy Tony, su asistente de voz de Urge Ya en {city}. Ahora puede subir una foto de su avería pulsando el botón de la cámara para que la analice con Inteligencia Artificial. Dígame qué avería urgente tiene o seleccione su idioma.`
  },
  en: {
    text: `Hello! I am **Tony**, your **AI Voice Assistant** from **Urge Ya** in **{city}**. 🤖🔊\n\nI am ready to speak and understand your language (English, Spanish, Catalan, or French).\n\n📸 **NEW FEATURE!** You can now **upload/snap a photo of your breakdown** (leaking pipe, burned wire, stuck door) using the camera button, and I will instantly analyze the image using Gemini AI.\n\nHow can I help you with your **plumbing**, **electrical**, **locksmith**, or **boiler** emergency today?`,
    spoken: `Hello! I am Tony, your voice assistant from Urge Ya in {city}. You can now upload a photo of your breakdown using the camera button for an instant artificial intelligence analysis. Please tell me what emergency you have.`
  },
  ca: {
    text: `Hola! Soc en **Tony**, el seu **Assistent de Veu Intel·ligent** d'**Urge Ya** a **{city}**. 🤖🔊\n\nEstic preparat per respondre-li per veu en l'idioma que prefereixi (Català, Castellà, Anglès o Francès).\n\n📸 **NOVA FUNCIÓ!** Ara pot **pujar una foto de la seva avaria** (fuga d'aigua, pany trencat, cables cremats) prement el botó de la càmera perquè l'analitzi immediatament amb Intel·ligència Artificial.\n\nExpliqui'm, té alguna emergència amb **fuga d'aigua**, **tall de llum**, **serralleria** o **caldera**? O seleccioni un idioma a la barra de dalt.`,
    spoken: `Hola, soc en Tony, el seu assistent de veu d'Urge Ya a {city}. Ara pot pujar una foto de la seva avaria prement el botó de la càmera perquè l'analitzi amb Intel·ligència Artificial. Expliqui'm quina avaria urgent té o seleccioni el seu idioma.`
  },
  fr: {
    text: `Bonjour ! Je suis **Tony**, votre **Assistant Vocal Intelligent** d'**Urge Ya** à **{city}**. 🤖🔊\n\nJe suis prêt à vous répondre par voix dans votre langue préférée (Français, Espagnol, Anglais ou Catalan).\n\n📸 **NOUVEAU !** Vous pouvez maintenant **télécharger/prendre une photo de votre panne** (fuite, court-circuit, serrure bloquée) en cliquant sur le bouton de l'appareil photo, et je l'analyserai instantanément grâce à l'IA.\n\nQuelle est votre urgence aujourd'hui (fuite d'eau, panne de courant, serrurerie ou chaudière) ? Vous pouvez aussi choisir une langue ci-dessus.`,
    spoken: `Bonjour, je suis Tony, votre assistant vocal d'Urge Ya à {city}. Vous pouvez maintenant charger une photo de votre panne avec l'appareil photo pour une analyse par intelligence artificielle. Dites-moi quel est votre problème.`
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
    btnDispatch: "Despacho Urgente",
    btnExit: "Volver a la Web / Cerrar Asistente",
    dispatchTitle: "Despacho Inmediato de Técnico",
    labelName: "Nombre Completo",
    labelPhone: "Móvil de Contacto",
    labelType: "Tipo de Avería",
    labelAddress: "Dirección de la Emergencia",
    optPlumbing: "💧 Fontanería",
    optElectric: "⚡ Electricidad",
    optLocksmith: "🔑 Cerrajería",
    optBoiler: "🔥 Calderas / Gas",
    btnSubmitDispatch: "Despachar Técnico Urgente 24h",
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
    speakWelBtn: "Tony - Gestor de Voz",
    headerSubtitle: "Asistencia Técnica de Urgencia 24h",
    muteVoice: "Mutear Asistencia de Voz",
    unmuteVoice: "Desmutear Asistencia de Voz",
    close: "Cerrar",
    floatBtnText: "Asistente de Voz"
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
    btnDispatch: "Urgent Dispatch",
    btnExit: "Return to Web / Close Assistant",
    dispatchTitle: "Immediate Technician Dispatch",
    labelName: "Full Name",
    labelPhone: "Contact Phone",
    labelType: "Emergency Type",
    labelAddress: "Emergency Address",
    optPlumbing: "💧 Plumbing",
    optElectric: "⚡ Electricity",
    optLocksmith: "🔑 Locksmith",
    optBoiler: "🔥 Boiler / Gas",
    btnSubmitDispatch: "Dispatch Urgent Technician 24h",
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
    speakWelBtn: "Tony - Voice Manager",
    headerSubtitle: "24/7 Urgent Technical Assistance",
    muteVoice: "Mute Voice Assistance",
    unmuteVoice: "Unmute Voice Assistance",
    close: "Close",
    floatBtnText: "Voice Assistant"
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
    btnDispatch: "Enviament Urgent",
    btnExit: "Tornar a la Web / Tancar Assistent",
    dispatchTitle: "Enviament Immediat de Tècnic",
    labelName: "Nom Complet",
    labelPhone: "Mòbil de Contacte",
    labelType: "Tipus d'Avaria",
    labelAddress: "Adreça de l'Emergència",
    optPlumbing: "💧 Fontaneria",
    optElectric: "⚡ Electricitat",
    optLocksmith: "🔑 Serralleria",
    optBoiler: "🔥 Calderes / Gas",
    btnSubmitDispatch: "Enviar Tècnic Urgent 24h",
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
    speakWelBtn: "Tony - Gestor de Veu",
    headerSubtitle: "Assistència Tècnica d'Urgència 24h",
    muteVoice: "Silenciar Assistència de Veu",
    unmuteVoice: "Activar Assistència de Veu",
    close: "Tancar",
    floatBtnText: "Assistent de Veu"
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
    btnDispatch: "Dépannage Urgent",
    btnExit: "Retour au Site / Fermer l'Assistant",
    dispatchTitle: "Déploiement Immédiat du Technicien",
    labelName: "Nom Complet",
    labelPhone: "Téléphone Mobile",
    labelType: "Type de Panne",
    labelAddress: "Adresse de l'Urgence",
    optPlumbing: "💧 Plomberie",
    optElectric: "⚡ Électricité",
    optLocksmith: "🔑 Serrurerie",
    optBoiler: "🔥 Chaudière / Gaz",
    btnSubmitDispatch: "Dépêcher un Technicien Urgent 24h",
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
    speakWelBtn: "Tony - Gestionnaire Vocal",
    headerSubtitle: "Assistance Technique d'Urgence 24h/24",
    muteVoice: "Couper l'assistance vocale",
    unmuteVoice: "Activar l'assistance vocale",
    close: "Fermer",
    floatBtnText: "Assistant Vocal"
  }
};

const MULTILINGUAL_RESPONSES: Record<string, Record<string, { text: string; spoken: string }>> = {
  es: {
    fuga: {
      text: "🚨 **¡ALERTA DE FONTANERÍA! INSTRUCCIONES DE EMERGENCIA:**\n\n1. **Cierre de inmediato la llave de paso general** de su hogar para detener la inundación.\n2. **Corte el suministro eléctrico** en las zonas afectadas para evitar un cortocircuito.\n3. **Recoja el agua estancada** y resguarde sus pertenencias.\n\nTenemos fontaneros urgentes homologados en **{city}** listos para salir ya. El tiempo medio de llegada es de **15 a 20 minutos**. ¿Facilitamos el envío de un técnico inmediato?",
      spoken: "Hola, soy Tony. Por favor, mantenga la calma. Le recomiendo cerrar de inmediato la llave de paso principal de su vivienda para detener la inundación, y desconectar la electricidad si el agua se extiende. Nuestros fontaneros en {city} están disponibles de inmediato. Llegaremos en menos de veinte minutos."
    },
    apagón: {
      text: "⚡ **¡ALERTA DE ELECTRICIDAD! INSTRUCCIONES DE EMERGENCIA:**\n\n1. **No manipule cables expuestos** ni toque el cuadro eléctrico con las manos húmedas.\n2. **Verifique el interruptor diferencial:** Si ha saltado, intente rearmarlo una vez desenchufado el último electrodoméstico.\n3. **Evite el contacto directo con agua** en áreas con enchufes inundados.\n\nDisponemos de electricistas autorizados de guardia 24 horas en **{city}**. ¿Le enviamos un técnico homologado de urgencia?",
      spoken: "Hola, le saluda Tony. Por favor, por su seguridad, no toque ningún cable expuesto ni manipule el cuadro eléctrico con las manos húmedas. Si se ha producido un cortocircuito o un apagón general, nuestros electricistas de guardia en {city} llegarán en menos de veinte minutos para restablecer su servicio de forma totalmente segura."
    },
    cerrajeria: {
      text: "🔑 **¡URGENCIA DE CERRAJERÍA! INSTRUCCIONES DE SEGURIDAD:**\n\n1. **Manténgase en una zona segura** y visible mientras espera al técnico.\n2. **No intente forzar la cerradura** con tarjetas u objetos metálicos; podría dañar el mecanismo interno.\n3. **Prepare un documento de identidad** que confirme su acceso a la vivienda.\n\nNuestros cerrajeros autorizados de **{city}** realizan aperturas limpias de puertas y cambios de bombines urgentes en 15 minutos. ¿Enviamos un cerrajero de guardia?",
      spoken: "Soy Tony. Si se ha quedado fuera de casa, ha perdido las llaves o necesita cambiar su cerradura por motivos de seguridad, no se preocupe. Contamos con cerrajeros autorizados en {city} de guardia constante. Realizaremos una apertura limpia, sin ningún tipo de daños, en unos quince minutos."
    },
    caldera: {
      text: "🔥 **¡AVISO DE CALDERAS Y CALEFACCIÓN! COMPROBACIONES RÁPIDAS:**\n\n1. **Verifique la presión del agua:** El manómetro de la caldera debe marcar entre **1.2 y 1.5 bar**.\n2. **Compruebe el suministro de gas:** Asegúrese de que la llave general de paso está abierta.\n3. **Evite manipular conductos internos:** Es extremadamente peligroso si no es un técnico autorizado.\n\nNuestros técnicos de gas en **{city}** reparan todas las marcas (Vaillant, Junkers, Saunier Duval). ¿Desea agendar asistencia inmediata?",
      spoken: "Hola, soy Tony. Le sugiero comprobar si el manómetro de agua está entre uno con dos y uno con cinco bar. Asegúrese también de que la llave de gas esté completamente abierta. Nuestros técnicos certificados en {city} están totalmente preparados para acudir y solucionar el fallo de inmediato."
    },
    precio: {
      text: "📋 **POLÍTICA DE TARIFAS TRANSPARENTES DE URGE YA:**\n\n• **Desplazamiento 100% Gratuito:** No cobramos costes de viaje si se aprueba y realiza la reparación técnica.\n• **Presupuestos Cerrados por Escrito:** El técnico evalúa la avería en persona y le da un coste fijo garantizado antes de trabajar.\n• **Tarifas Directas:** Sin intermediarios ni costes ocultos.\n\n¿Quiere indicarnos qué avería tiene para orientarle mejor en el precio?",
      spoken: "Soy Tony. Le confirmo que el desplazamiento es completamente gratuito si realiza la reparación con nosotros. Además, el técnico le facilitará un presupuesto cerrado por escrito antes de comenzar a trabajar para su total tranquilidad."
    },
    urgencia: {
      text: "🚨 **COBERTURA Y TIEMPOS DE RESPUESTA INMEDIATA:**\n\n• **Zonas de Cobertura:** Ofrecemos asistencia domiciliaria en todas las áreas de **Barcelona**, **Madrid** y **Valencia**.\n• **Tiempo de Llegada:** La media oscila entre **15 y 25 minutos** de forma garantizada.\n• **Operativos 24/7/365:** Trabajamos fines de semana y festivos de manera ininterrumpida.\n\n¿Desea que un técnico le llame directamente en menos de 5 minutos?",
      spoken: "Hola, le saluda Tony. Ofrecemos cobertura completa de urgencia en Madrid, Barcelona y Valencia. Nuestro tiempo de respuesta habitual es de quince a veinticinco minutos las veinticuatro horas del día. Estamos listos para salir de inmediato hacia su domicilio."
    }
  },
  en: {
    fuga: {
      text: "🚨 **PLUMBING EMERGENCY INSTRUCTIONS:**\n\n1. **Close the main water valve** immediately to stop the flooding.\n2. **Turn off electricity** in the affected areas to prevent short circuits.\n3. **Collect standing water** and protect your belongings.\n\nWe have certified emergency plumbers in **{city}** ready to go. Average arrival time is **15 to 20 minutes**. Should we dispatch a technician right away?",
      spoken: "Hello, this is Tony. Please remain calm. I highly recommend closing your main water valve immediately to stop the leak. Our emergency plumbers in {city} are ready. We will arrive in less than twenty minutes."
    },
    apagón: {
      text: "⚡ **ELECTRICAL EMERGENCY INSTRUCTIONS:**\n\n1. **Do not touch exposed wires** or handle the fuse box with wet hands.\n2. **Check the circuit breaker:** If it tripped, try resetting it after unplugging the last used appliance.\n3. **Avoid water contact** near flooded outlets.\n\nWe have licensed 24/7 electricians on duty in **{city}**. Shall we send an authorized technician now?",
      spoken: "Hello, Tony here. For your safety, do not touch any exposed wires or handle the electrical panel with wet hands. If you have a short circuit or a blackout, our duty electricians in {city} will arrive in less than twenty minutes to safely restore your power."
    },
    cerrajeria: {
      text: "🔑 **LOCKSMITH EMERGENCY INSTRUCTIONS:**\n\n1. **Stay in a safe**, visible area while waiting.\n2. **Do not force the lock** with cards or metal objects; it could damage the internal mechanism.\n3. **Prepare an ID** confirming your access to the property.\n\nOur certified locksmiths in **{city}** perform clean door openings and lock replacements in 15 minutes. Should we dispatch one now?",
      spoken: "I am Tony. If you are locked out, lost your keys, or need an urgent lock replacement, don't worry. We have on-duty locksmiths in {city} ready. We will open your door cleanly, without any damage, in fifteen to twenty minutes."
    },
    caldera: {
      text: "🔥 **BOILER & HEATING QUICK CHECKS:**\n\n1. **Check water pressure:** The boiler gauge should be between **1.2 and 1.5 bar**.\n2. **Check gas supply:** Make sure the main gas valve is open.\n3. **Do not manipulate internal parts:** It is extremely dangerous without certified training.\n\nOur gas technicians in **{city}** repair all brands (Vaillant, Junkers, Saunier Duval). Would you like to schedule immediate service?",
      spoken: "Hello, Tony speaking. I suggest checking if your water pressure gauge is between 1.2 and 1.5 bar. Also, ensure the gas valve is fully open. Our certified boiler technicians in {city} are fully ready to help you immediately."
    },
    precio: {
      text: "📋 **URGE YA TRANSPARENT PRICING POLICY:**\n\n• **100% Free Dispatch:** We don't charge travel fees if the repair work is approved and completed.\n• **Written Fixed Estimates:** The technician inspects the issue in person and gives a guaranteed fixed cost before starting.\n• **Direct Rates:** No intermediaries or hidden fees.\n\nWould you like to describe your issue so we can guide you on the cost?",
      spoken: "This is Tony. I confirm that dispatch and travel are completely free if you proceed with the repair. Additionally, the technician will provide a fixed estimate in writing before starting any work for your peace of mind."
    },
    urgencia: {
      text: "🚨 **COVERAGE AND IMMEDIATE RESPONSE TIMES:**\n\n• **Coverage Areas:** We provide home assistance throughout **Barcelona**, **Madrid**, and **Valencia**.\n• **Arrival Time:** Guaranteed response time of **15 to 25 minutes**.\n• **24/7/365 Operations:** We work non-stop during weekends and holidays.\n\nWould you like a technician to call you directly in less than 5 minutes?",
      spoken: "Hello, Tony here. We offer full emergency coverage in Madrid, Barcelona, and Valencia. Our response time is fifteen to twenty-five minutes, twenty-four hours a day. We are ready to head to your address immediately."
    }
  },
  ca: {
    fuga: {
      text: "🚨 **ALERTA DE FONTANERIA! INSTRUCCIONS D'EMERGÈNCIA:**\n\n1. **Tanqui immediatament la clau de pas general** per aturar la inundació.\n2. **Talli el subministrament elèctric** a les zones afectades per evitar curtcircuits.\n3. **Reculli l'aigua** i protegeixi els seus béns.\n\nTenim fontaners urgents homologats a **{city}** llestos per sortir. Temps d'arribada: **15-20 minuts**. Enviem un tècnic immediat?",
      spoken: "Hola, soc en Tony. Per favor, mantingui la calma. Li recomano tancar immediatament la clau de pas general de casa seva per aturar la inundació, i desconnectar l'electricitat si l'aigua s'estén. Els nostres fontaners a {city} estan disponibles. Arribarem en menys de vint minuts."
    },
    apagón: {
      text: "⚡ **ALERTA D'ELECTRICITAT! INSTRUCCIONS D'EMERGÈNCIA:**\n\n1. **No toqui cables exposats** ni el quadre elèctric amb les mans humides.\n2. **Verifiqui el diferencial:** Si ha saltat, intenti rearmar-lo un cop desendollat l'últim aparell.\n3. **Eviti el contacte amb l'aigua** prop d'endolls inundats.\n\nElectricistes autoritzats de guàrdia 24h a **{city}**. Enviem un tècnic urgent?",
      spoken: "Hola, soc en Tony. Per la seva seguretat, no toqui cap cable exposat ni el quadre elèctric amb les mans humides. Si té un curtcircuit o una apagada general, els nostres electricistes a {city} arribaran en menys de vint minuts per restablir el servei amb total seguretat."
    },
    cerrajeria: {
      text: "🔑 **URGÈNCIA DE SERRALLERIA! INSTRUCCIONS DE SEGURIDAD:**\n\n1. **Estigui en una zona segura** i visible mentre espera el serraller.\n2. **No versi o forci la fusta o pany** amb targetes per no danyar el mecanisme.\n3. **Prepari un document d'identitat** que confirmi l'accés a l'habitatge.\n\nSerrallers autoritzats a **{city}** obren portes i canvien bombins en 15 minuts. Enviem un serraller de guàrdia?",
      spoken: "Soc en Tony. Si s'ha quedat fora de casa, ha perdut les claus o necessita un canvi urgent de pany per seguretat, no es preocupi. Tenim serrallers a {city} de guàrdia. Realitzarem una obertura neta en uns quinze minuts."
    },
    caldera: {
      text: "🔥 **AVÍS DE CALDERES I CALEFACCIÓ! COMPROBACIONS RÀPIDES:**\n\n1. **Pressió de l'aigua:** El manòmetre de la caldera ha d'estar entre **1.2 i 1.5 bar**.\n2. **Subministrament de gas:** Comprovi que la clau de pas està oberta.\n3. **No manipuli tubs interns**: És molt perillós si no s'és tècnic homologat.\n\nTècnics de gas de guàrdia a **{city}**. Vol agendar assistència immediata?",
      spoken: "Hola, soc en Tony. Li suggereixo comprovar si la pressió d'aigua de la caldera està entre un punt dos i un punt cinc bar. Els nostres tècnics homologats a {city} estan preparats per venir i solucionar el problema de forma immediata."
    },
    precio: {
      text: "📋 **POLÍTICA DE PREUS TRANSPARENTS D'URGE YA:**\n\n• **Desplaçament Gratuït:** Sense despeses de viatge si es realitza la reparació amb nosaltres.\n• **Pressupostos Tancats per Escrit:** El tècnic avalua l'avaria i dóna un cost tancat abans de començar.\n• **Tarifes Directes:** Sense sorpreses ni intermediaris.\n\nEns indica quina avaria té per donar-li un preu orientatiu?",
      spoken: "Soc en Tony. El desplaçament és completament gratuït si realitza la reparació con nosotros. A més, el tècnic li farà un pressupost tancat per escrit abans de començar a treballar per a la seva tranquil·litat."
    },
    urgencia: {
      text: "🚨 **COBERTURA I TEMPS DE RESPOSTA IMMEDIATA:**\n\n• **Cobertura:** Assistència a tot **Barcelona**, **Madrid** i **València**.\n• **Temps d'Arribada:** Entre **15 i 25 minuts** garantits.\n• **Guàrdia 24h/365:** Treballem dissabtes, diumenges i festius de forma ininterrompuda.\n\nVol que un tècnic li truqui en menys de 5 minuts?",
      spoken: "Hola, soc en Tony. Oferim cobertura de guàrdia a Madrid, Barcelona i València. Arribem habitualment en un termini de quinze a vint-i-cinc minuts, les vint-i-quatre hores del dia."
    }
  },
  fr: {
    fuga: {
      text: "🚨 **INSTRUCTIONS D'URGENCE PLOMBERIE :**\n\n1. **Fermez immédiatement la vanne d'arrivée d'eau** générale pour stopper l'inondation.\n2. **Coupez l'électricité** dans les zones touchées pour éviter les courts-circuits.\n3. **Épongez l'eau stagnante** et mettez vos biens à l'abri.\n\nNos plombiers certifiés à **{city}** sont prêts à intervenir. Délai moyen : **15 à 20 minutes**. Devons-nous envoyer un technicien ?",
      spoken: "Bonjour, c'est Tony. Gardez votre calme. Je vous conseille de fermer immédiatement la vanne d'eau générale. Nos plombiers à {city} sont prêts à partir et arriveront en moins de vingt minutes."
    },
    apagón: {
      text: "⚡ **INSTRUCTIONS D'URGENCE ÉLECTRICITÉ :**\n\n1. **Ne touchez pas aux fils dénudés** et ne manipulez pas le tableau électrique les mains humides.\n2. **Vérifiez le disjoncteur :** S'il a sauté, essayez de le réarmer après avoir débranché le dernier appareil utilisé.\n3. **Évitez tout contact avec l'eau** près des prises.\n\nÉlectriciens agréés 24h/24 à **{city}**. Devons-nous envoyer un dépanneur ?",
      spoken: "Bonjour, ici Tony. Pour votre sécurité, ne touchez à aucun fil dénudé et ne manipulez pas le disjoncteur les mains mouillées. Nos électriciens d'urgence à {city} interviendront en moins de vingt minutes pour rétablir le courant en toute sécurité."
    },
    cerrajeria: {
      text: "🔑 **INSTRUCTIONS D'URGENCE SERRURERIE :**\n\n1. **Restez dans un endroit sûr** et visible en attendant le serrurier.\n2. **Ne forcez pas la serrure** avec une carte ou des objets métalliques pour éviter d'endommager le cylindre.\n3. **Préparez une pièce d'identité** prouvant votre accès au logement.\n\nSerruriers agréés à **{city}** pour ouvertures propres et remplacements en 15 min. On vous envoie un serrurier de garde ?",
      spoken: "Je suis Tony. Si vous êtes coincé dehors ou si vous devez changer votre serrure en urgence, ne vous inquiétez pas. Nos serruriers de garde à {city} interviendront pour une ouverture propre, sans dégâts, en quinze minutes."
    },
    caldera: {
      text: "🔥 **VÉRIFICATIONS CHAUDIÈRE & CHAUFFAGE :**\n\n1. **Pression d'eau :** Le manomètre de la chaudière doit être entre **1,2 et 1,5 bar**.\n2. **Arrivée de gaz :** Assurez-vous que la vanne de gaz générale est ouverte.\n3. **Ne touchez pas aux conduits internes :** C'est extrêmement dangereux sans certification.\n\nTechniciens agréés toutes marques à **{city}**. Souhaitez-vous planifier une intervention immédiate ?",
      spoken: "Bonjour, c'est Tony. Je vous conseille de vérifier si la pression d'eau est entre un point deux et un point cinq bar. Nos techniciens certifiés à {city} sont prêts à réparer votre chaudière immédiatement."
    },
    precio: {
      text: "📋 **CHARTE DES TARIFS TRANSPARENTS URGE YA :**\n\n• **Déplacement Gratuit :** Aucun frais de transport si la réparation est effectuée par notre technicien.\n• **Devis Écrit Ferme :** Le technicien évalue le problème sur place et vous donne un coût fixe garanti avant travaux.\n• **Tarifs Directs :** Pas d'intermédiaires ni de frais cachés.\n\nDécrivez-nous votre panne pour obtenir une estimation de tarif ?",
      spoken: "C'est Tony. Le déplacement est entièrement gratuit si vous effectuez la réparation avec nous. De plus, le technicien vous remettra un devis écrit et fermé avant de commencer pour votre totale sérénité."
    },
    urgencia: {
      text: "🚨 **COUVERTURE ET DÉLAIS D'INTERVENTION :**\n\n• **Zones couvertes :** Assistance rapide à **Barcelone**, **Madrid** et **Valence**.\n• **Délai d'arrivée :** Garanti en **15 à 25 minutes**.\n• **Opérationnel 24h/24, 7j/7 :** Nous travaillons les week-ends et jours fériés.\n\nSouhaitez-vous qu'un technicien vous rappelle en moins de 5 minutes ?",
      spoken: "Bonjour, ici Tony. Nous couvrons Madrid, Barcelone et Valence. Notre délai d'intervention habituel est de quinze à vingt-cinq minutes, vingt-quatre heures sur vingt-quatre."
    }
  }
};

export default function AIAssistant({ currentCity, onOpenBookingWizard }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(() => {
    const saved = localStorage.getItem('urgeya_voice_muted');
    return saved ? JSON.parse(saved) : false;
  });

  const [currentLang, setCurrentLang] = useState<'es' | 'en' | 'ca' | 'fr'>(() => {
    const saved = localStorage.getItem('urgeya_voice_lang');
    return (saved as 'es' | 'en' | 'ca' | 'fr') || 'es';
  });

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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // Load browser voices proactively
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis?.getVoices();
    };
    loadVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

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

  // Text-To-Speech function with natural, reassuring, male voice tuning per language
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
    
    // Set language and find appropriate voice
    const voices = window.speechSynthesis?.getVoices() || [];
    let langCode = 'es-ES';
    let maleVoiceHints: string[] = [];

    if (targetLang === 'en') {
      langCode = 'en-US';
      maleVoiceHints = ['daniel', 'james', 'david', 'mark', 'george', 'richard', 'google us english male', 'microsoft david', 'male'];
    } else if (targetLang === 'ca') {
      langCode = 'ca-ES';
      maleVoiceHints = ['pau', 'jordi', 'albert', 'male', 'home', 'local'];
    } else if (targetLang === 'fr') {
      langCode = 'fr-FR';
      maleVoiceHints = ['paul', 'jean', 'pierre', 'nicolas', 'male', 'homme'];
    } else {
      langCode = 'es-ES';
      maleVoiceHints = ['pablo', 'jorge', 'alvaro', 'julio', 'diego', 'manuel', 'david', 'male', 'hombre', 'esf-local', 'eed-local'];
    }

    utterance.lang = langCode;
    
    // Reassuring, natural human pacing
    utterance.rate = 1.0; 
    utterance.pitch = targetLang === 'en' ? 0.90 : 0.95;
    utterance.volume = 1.0;

    const filteredVoices = voices.filter(v => v.lang.toLowerCase().startsWith(targetLang));
    
    let selectedVoice = filteredVoices.find(voice => {
      const nameLower = voice.name.toLowerCase();
      return maleVoiceHints.some(hint => nameLower.includes(hint));
    });

    if (!selectedVoice) {
      selectedVoice = filteredVoices[0] || voices.find(v => v.lang.toLowerCase().startsWith('es')) || voices[0];
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

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
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      const parts = base64Data.split(';base64,');
      if (parts.length === 2) {
        setUploadedImage(parts[1]);
        setImageMime(file.type);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() && !uploadedImage) return;

    const messageText = text.trim() || (currentLang === 'en' ? "Please analyze this image" : "Por favor, analiza esta imagen");

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

    const hasImage = !!uploadedImage;
    const currentImg = uploadedImage;
    const currentMime = imageMime;

    // Reset image upload states
    setUploadedImage(null);
    setImageMime('');

    const detected = detectLanguage(messageText);
    let targetLang = currentLang;
    if (detected !== currentLang) {
      targetLang = detected;
      setCurrentLang(detected);
    }

    try {
      let textResponse = '';
      let spokenResponse = '';
      let category = 'other';
      let suggestDispatch = false;

      if (hasImage) {
        const res = await fetch('/api/gemini/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: currentImg,
            mimeType: currentMime,
            currentCity,
            currentLang: targetLang,
            textPrompt: messageText
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
      } else {
        const recentMessages = [...messages, userMessage].slice(-6);
        const res = await fetch('/api/gemini/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: recentMessages,
            currentCity,
            currentLang: targetLang
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
      }

      setIsTyping(false);

      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: textResponse,
        timestamp: new Date()
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
          const matched = MULTILINGUAL_RESPONSES[targetLang][matchKey];
          fallbackText = matched.text.replace(/{city}/g, currentCity.name);
          fallbackSpoken = matched.spoken.replace(/{city}/g, currentCity.name);
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

  const currentLabels = UI_LABELS[currentLang];

  return (
    <>
      {/* Floating Action Button - Same layout, size & positioning as user requested */}
      <div className="fixed bottom-6 left-6 z-40">
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
            <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-none pb-[calc(1rem+env(safe-area-inset-bottom))]">
              {/* Premium Chat Window */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="pointer-events-auto w-full max-w-[440px] h-[600px] max-h-[90vh] sm:max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col font-sans"
                id="ai-chat-window"
              >
                {/* Voice Centered Gradient Header */}
                <div className="relative p-4 pr-28 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="relative p-2.5 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl text-white shadow-lg">
                      {isSpeaking ? (
                        <div className="flex gap-0.5 items-end justify-center w-5 h-5 h-[16px]">
                          <span className="w-0.5 bg-white rounded-full animate-voice-bar-1"></span>
                          <span className="w-0.5 bg-white rounded-full animate-voice-bar-2"></span>
                          <span className="w-0.5 bg-white rounded-full animate-voice-bar-3"></span>
                          <span className="w-0.5 bg-white rounded-full animate-voice-bar-4"></span>
                        </div>
                      ) : (
                        <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
                      )}
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-success rounded-full border border-slate-900"></span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-display font-black text-white text-sm tracking-tight">{currentLabels.speakWelBtn}</h4>
                        <span className="bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse">24H</span>
                      </div>
                      <p className="text-[10px] text-slate-400">{currentLabels.headerSubtitle}</p>
                    </div>
                  </div>

                  {/* Speaker Control & Absolute Close Button (Min 44x44px tap targets) */}
                  <div className="absolute right-16 top-3.5 z-20">
                    <button
                      onClick={() => setIsVoiceMuted(!isVoiceMuted)}
                      className={`w-11 h-11 flex items-center justify-center rounded-full transition cursor-pointer border ${
                        isVoiceMuted 
                          ? 'bg-slate-800/80 border-rose-800 text-rose-400 hover:text-rose-300' 
                          : 'bg-indigo-600/20 border-indigo-500/20 text-indigo-300 hover:text-white hover:bg-indigo-600/30'
                      }`}
                      title={isVoiceMuted ? currentLabels.unmuteVoice : currentLabels.muteVoice}
                      style={{ width: '44px', height: '44px' }}
                    >
                      {isVoiceMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      window.speechSynthesis?.cancel();
                      setIsSpeaking(false);
                      setIsOpen(false);
                    }}
                    className="absolute top-3.5 right-4 z-20 w-11 h-11 flex items-center justify-center bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition cursor-pointer border border-slate-700/60 shadow-lg"
                    title={currentLabels.close}
                    style={{ width: '44px', height: '44px' }}
                  >
                    <X className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Multilingual Selector Row */}
                <div className="flex items-center justify-between px-4 py-2 bg-slate-950/60 border-b border-slate-800/60 gap-1 overflow-x-auto shrink-0">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest shrink-0">Idioma / Lang:</span>
                  <div className="flex items-center gap-1.5">
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
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          currentLang === lang.code
                            ? 'bg-indigo-600/90 text-white font-extrabold shadow-sm border border-indigo-500'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/60'
                        }`}
                        title={lang.label}
                        style={{ minHeight: '32px' }}
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
                        <span className="uppercase text-slate-400 font-bold">Respuesta Inteligente</span>
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
                    className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-4 space-y-3 shadow-lg"
                  >
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                      <MapPin className="w-4 h-4 text-rose-400 animate-bounce" />
                      <h5 className="text-xs font-black text-white uppercase tracking-wider">{currentLabels.dispatchTitle}</h5>
                    </div>

                    <form onSubmit={handleDispatchSubmit} className="space-y-2.5">
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold mb-1">{currentLabels.labelName}</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Ej: Marta Gómez"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold mb-1">{currentLabels.labelPhone}</label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="Ej: 696 669 689"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold mb-1">{currentLabels.labelType}</label>
                          <select
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none focus:border-indigo-500"
                          >
                            <option value="Fontanería">{currentLabels.optPlumbing}</option>
                            <option value="Electricidad">{currentLabels.optElectric}</option>
                            <option value="Cerrajería">{currentLabels.optLocksmith}</option>
                            <option value="Calderas/Gas">{currentLabels.optBoiler}</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold mb-1">{currentLabels.labelAddress}</label>
                        <input
                          type="text"
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          placeholder="Calle, Número, Piso y Ciudad"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-2 rounded-xl text-xs uppercase tracking-wide shadow-lg transition cursor-pointer"
                      >
                        {currentLabels.btnSubmitDispatch}
                      </button>
                    </form>
                  </motion.div>
                )}

                {dispatchStep === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-indigo-950/40 border-2 border-success/40 rounded-2xl p-4 text-center space-y-3"
                  >
                    <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto text-success">
                      <Check className="w-6 h-6 stroke-[3px]" />
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-white uppercase tracking-wider">{currentLabels.successTitle}</h5>
                      <p className="text-[11px] text-slate-300 mt-1">{currentLabels.successText} <strong>Don {formData.name}</strong>.</p>
                    </div>

                    <div className="bg-slate-950/60 p-3 rounded-xl space-y-1.5 text-left text-xs">
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

                    <div className="pt-1 flex gap-2">
                      <a
                        href={`tel:${currentCity.phone}`}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-xs font-bold transition flex items-center justify-center"
                      >
                        {currentLabels.btnCallCentral}
                      </a>
                      <button
                        onClick={() => setDispatchStep('idle')}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-xs font-bold transition"
                      >
                        {currentLabels.btnCloseTicket}
                      </button>
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

              {/* Quick Emergency Inquiries Area */}
              <div className="p-3 bg-slate-950 border-t border-slate-800/80 shrink-0">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2 px-1">{currentLabels.quickTitle}</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 text-[11px] bg-indigo-950/65 hover:bg-indigo-900 text-indigo-200 border-2 border-indigo-500/40 hover:border-indigo-500/80 rounded-lg px-3 py-1.5 transition text-left font-extrabold cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] animate-pulse-subtle"
                  >
                    <Image className="w-3.5 h-3.5 text-purple-400" />
                    <span>{currentLabels.btnUploadPhoto}</span>
                  </button>
                  <button
                    onClick={() => handleQuickQuestion("💧 Fugas e Inundaciones", "fuga")}
                    className="flex items-center gap-1 text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 transition text-left font-bold cursor-pointer"
                  >
                    <Droplet className="w-3.5 h-3.5 text-blue-400" />
                    <span>{currentLabels.quickFuga}</span>
                  </button>
                  <button
                    onClick={() => handleQuickQuestion("⚡ Apagón y Cortocircuito", "apagón")}
                    className="flex items-center gap-1 text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 transition text-left font-bold cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>{currentLabels.quickApagon}</span>
                  </button>
                  <button
                    onClick={() => handleQuickQuestion("🔑 Cerrajería de Urgencia", "cerrajeria")}
                    className="flex items-center gap-1 text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 transition text-left font-bold cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{currentLabels.quickCerrajeria}</span>
                  </button>
                  <button
                    onClick={() => handleQuickQuestion("🔥 Averías de Caldera", "caldera")}
                    className="flex items-center gap-1 text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 transition text-left font-bold cursor-pointer"
                  >
                    <Flame className="w-3.5 h-3.5 text-red-400" />
                    <span>{currentLabels.quickCaldera}</span>
                  </button>
                </div>
              </div>

              {/* Bottom Trigger Panel */}
              <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-col gap-2 shrink-0">
                {/* Immediate dispatcher or call widgets */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${currentCity.phone}`}
                    className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold py-2 rounded-xl transition cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-400" />
                    <span>{currentLabels.btnCall} {currentCity.phoneFormatted}</span>
                  </a>
                  <button
                    onClick={triggerDispatchForm}
                    className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-black py-2 rounded-xl transition cursor-pointer shadow-md uppercase tracking-wider"
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{currentLabels.btnDispatch}</span>
                  </button>
                </div>

                {/* Image upload preview widget */}
                {uploadedImage && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl">
                    <img
                      src={`data:${imageMime};base64,${uploadedImage}`}
                      alt="Preview"
                      className="w-10 h-10 object-cover rounded-lg border border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-slate-300 font-bold truncate">
                        {currentLang === 'en' ? "Image attached" : "Imagen adjunta"}
                      </p>
                      <p className="text-[9px] text-slate-500 truncate">
                        {currentLang === 'en' ? "Ready for Gemini analysis" : "Lista para ser analizada por Tony"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedImage(null);
                        setImageMime('');
                      }}
                      className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Text input form with real-time mic input fallback and image upload button */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputValue);
                  }}
                  className="flex gap-2 items-center"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition flex items-center justify-center shrink-0 cursor-pointer"
                    title={currentLang === 'en' ? "Upload Photo of Breakdown" : "Subir Foto de la Avería"}
                  >
                    <Image className="w-4 h-4 text-purple-400" />
                  </button>

                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={currentLabels.inputPlaceholder}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                  
                  {/* Real-time speech input trigger */}
                  <button
                    type="button"
                    onClick={startSpeechRecognition}
                    className={`p-2.5 rounded-xl transition flex items-center justify-center shrink-0 cursor-pointer ${
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
                    disabled={!inputValue.trim() && !uploadedImage}
                    className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* Secondary Exit Button (Mandatory) */}
                <button
                  type="button"
                  onClick={() => {
                    window.speechSynthesis?.cancel();
                    setIsSpeaking(false);
                    setIsOpen(false);
                  }}
                  className="w-full text-center text-slate-400 hover:text-slate-300 text-[10px] uppercase tracking-widest font-extrabold py-2 transition cursor-pointer bg-slate-950/50 hover:bg-slate-950 border border-slate-800/80 rounded-xl"
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
