import { CityInfo, ServiceDetail, Review, Technician } from './types';

export const CITIES: Record<string, CityInfo> = {
  barcelona: {
    id: 'barcelona',
    name: 'Barcelona',
    phone: '664065855',
    phoneFormatted: '664 065 855',
    whatsappNumber: '+34664065855',
    regionLabel: 'BARCELONA Y ALREDEDORES',
    description: 'Soporte técnico inmediato en toda la provincia de Barcelona y área metropolitana (Hospitalet, Badalona, Sabadell, Terrassa, etc.).'
  },
  madrid: {
    id: 'madrid',
    name: 'Madrid',
    phone: '664065855',
    phoneFormatted: '664 065 855',
    whatsappNumber: '+34664065855',
    regionLabel: 'MADRID Y COMUNIDAD',
    description: 'Servicio urgente y ordinario en Madrid capital, Móstoles, Alcalá de Henares, Leganés, Getafe, Alcorcón y resto de la Comunidad.'
  },
  valencia: {
    id: 'valencia',
    name: 'Valencia',
    phone: '664065855',
    phoneFormatted: '664 065 855',
    whatsappNumber: '+34664065855',
    regionLabel: 'VALENCIA Y PROVINCIA',
    description: 'Atención rápida en Valencia capital, Torrent, Gandia, Paterna, Sagunt, Alzira y municipios limítrofes.'
  }
};

export const SERVICES: ServiceDetail[] = [
  {
    id: 'fontaneria',
    name: 'Fontanería',
    iconName: 'Droplet',
    tagline: 'Fugas de agua, desatascos, grifería y sanitarios',
    longDescription: 'Ofrecemos soluciones rápidas y duraderas para cualquier problema de agua, desagües o humedad en su hogar o local comercial.',
    imageUrl: 'https://uxxkrliutucqfaoortdb.supabase.co/storage/v1/object/public/web%20urge%20ya/inagenes/Wrench_tightening_pipe_under_sink-ezgif.com-jpg-to-webp-converter.webp',
    commonIssues: [
      { id: 'f_leak', name: 'Reparación de fugas de agua y humedades', avgPrice: 'Desde 45€', duration: '30-60 min', description: 'Localización y sellado rápido de tuberías rotas o goteras.' },
      { id: 'f_clog', name: 'Desatasco de tuberías y fregaderos', avgPrice: 'Desde 50€', duration: '40-80 min', description: 'Limpieza profesional de obstrucciones persistentes en desagües.' },
      { id: 'f_tap', name: 'Cambio de grifería y llaves de paso', avgPrice: 'Desde 35€', duration: '20-40 min', description: 'Instalación de grifos monomando, termostáticos o llaves de paso generales.' },
      { id: 'f_wc', name: 'Reparación de cisternas y sanitarios', avgPrice: 'Desde 40€', duration: '30-50 min', description: 'Solución a pérdidas de agua continuas en inodoros o cambios de mecanismos.' }
    ]
  },
  {
    id: 'electricidad',
    name: 'Electricidad',
    iconName: 'Bolt',
    tagline: 'Apagones, boletines, cortocircuitos e instalaciones',
    longDescription: 'Técnicos electricistas autorizados para solucionar averías de luz, aumentos de potencia, instalaciones nuevas y reformas eléctricas.',
    imageUrl: 'https://uxxkrliutucqfaoortdb.supabase.co/storage/v1/object/public/web%20urge%20ya/inagenes/Electrician_using_multimeter_on__202607231421-ezgif.com-jpg-to-webp-converter.webp',
    commonIssues: [
      { id: 'e_blackout', name: 'Reparación de apagones y cortocircuitos', avgPrice: 'Desde 50€', duration: '30-70 min', description: 'Diagnóstico urgente para restablecer el suministro eléctrico seguro.' },
      { id: 'e_panel', name: 'Cambios de cuadro eléctrico / fusibles', avgPrice: 'Desde 120€', duration: '1-2 horas', description: 'Modernización del cuadro de distribución con diferenciales de seguridad.' },
      { id: 'e_boletin', name: 'Emisión de Boletín Eléctrico (CIE)', avgPrice: 'Desde 90€', duration: '24-48 horas', description: 'Certificados oficiales para altas de luz o aumentos de potencia.' },
      { id: 'e_points', name: 'Instalación de enchufes, lámparas o LED', avgPrice: 'Desde 30€', duration: '20-50 min', description: 'Montaje de nuevos puntos de luz, tomas de corriente o iluminación decorativa.' }
    ]
  },
  {
    id: 'calentadores',
    name: 'Calentadores',
    iconName: 'Flame',
    tagline: 'Instalación y reparación de termos, calderas y calentadores',
    longDescription: 'Especialistas multimarca en sistemas de calefacción y agua caliente sanitaria. Solucionamos fallos de encendido, fugas de gas o goteos.',
    imageUrl: 'https://uxxkrliutucqfaoortdb.supabase.co/storage/v1/object/public/web%20urge%20ya/inagenes/Calderas_electric_water_heater_h_202607231433-ezgif.com-jpg-to-webp-converter.webp',
    commonIssues: [
      { id: 'c_repair', name: 'Reparación de termo eléctrico o caldera', avgPrice: 'Desde 65€', duration: '45-90 min', description: 'Reparación de resistencias, termostatos, placas electrónicas o vasos de expansión.' },
      { id: 'c_install', name: 'Instalación de caldera / termo nuevo', avgPrice: 'Desde 180€', duration: '2-4 horas', description: 'Montaje y puesta en marcha de equipos de las principales marcas con garantía.' },
      { id: 'c_cleaning', name: 'Limpieza de quemadores y mantenimiento', avgPrice: 'Desde 55€', duration: '30-60 min', description: 'Mantenimiento preventivo para mejorar el rendimiento y seguridad de su caldera.' }
    ]
  },
  {
    id: 'aire',
    name: 'Aire acondicionado',
    iconName: 'Wind',
    tagline: 'Cargas de gas, limpieza de filtros y averías de climatización',
    longDescription: 'Mantenga su hogar a la temperatura ideal. Realizamos cargas de refrigerante ecológico, desinfección y reparación de compresores.',
    imageUrl: 'https://uxxkrliutucqfaoortdb.supabase.co/storage/v1/object/public/web%20urge%20ya/inagenes/an_air_conditioner_2K_202607231435-ezgif.com-jpg-to-webp-converter.webp',
    commonIssues: [
      { id: 'a_gas', name: 'Carga de gas refrigerante', avgPrice: 'Desde 70€', duration: '40-80 min', description: 'Recarga de gas R32 o R410A con previa prueba de estanqueidad para evitar fugas.' },
      { id: 'a_clean', name: 'Limpieza de filtros y desinfección', avgPrice: 'Desde 45€', duration: '30-50 min', description: 'Tratamiento antibacterias para eliminar malos olores y mejorar la calidad del aire.' },
      { id: 'a_leak', name: 'Goteo de agua de la unidad interior', avgPrice: 'Desde 40€', duration: '30-60 min', description: 'Desatascado de la tubería de condensados y nivelación del split.' }
    ]
  },
  {
    id: 'gas',
    name: 'Gas',
    iconName: 'Activity',
    tagline: 'Corrección de anomalías, instalaciones y certificados de gas',
    longDescription: 'Técnicos certificados para solventar problemas detectados en la inspección periódica de los 5 años, fugas en llaves y adaptaciones.',
    imageUrl: 'https://uxxkrliutucqfaoortdb.supabase.co/storage/v1/object/public/web%20urge%20ya/inagenes/Technician_fixing_gas_leak_kitchen_202607231441-ezgif.com-jpg-to-webp-converter.webp',
    commonIssues: [
      { id: 'g_anomaly', name: 'Corrección de anomalías (Inspección de 5 años)', avgPrice: 'Desde 80€', duration: '1-2 horas', description: 'Subsanación inmediata de defectos leves o graves reportados por la distribuidora.' },
      { id: 'g_leak', name: 'Reparación de fugas de gas y llaves de paso', avgPrice: 'Desde 75€', duration: '45-90 min', description: 'Detección precisa mediante manómetro y sustitución de uniones o llaves en mal estado.' },
      { id: 'g_cert', name: 'Certificados oficiales e instalación de cocinas', avgPrice: 'Desde 85€', duration: '1 hora', description: 'Conexión segura de encimeras de gas y expedición del boletín correspondiente.' }
    ]
  },
  {
    id: 'manitas',
    name: 'Manitas',
    iconName: 'Wrench',
    tagline: 'Pintura, paletería, montaje de muebles y reparaciones del hogar',
    longDescription: 'Para todas esas pequeñas tareas domésticas que requieren destreza y herramientas profesionales. Soluciones integrales.',
    imageUrl: 'https://uxxkrliutucqfaoortdb.supabase.co/storage/v1/object/public/web%20urge%20ya/inagenes/manitas-ezgif.com-jpg-to-webp-converter.webp',
    commonIssues: [
      { id: 'm_furniture', name: 'Montaje de muebles (Ikea, Leroy, etc.)', avgPrice: 'Desde 40€', duration: '1-3 horas', description: 'Ensamblaje profesional de armarios, cómodas, mesas o estanterías.' },
      { id: 'm_hang', name: 'Colgar cuadros, soportes TV, cortinas o espejos', avgPrice: 'Desde 30€', duration: '20-40 min', description: 'Fijación segura y nivelada en todo tipo de paredes (pladur, ladrillo, etc.).' },
      { id: 'm_paint', name: 'Pintura de habitaciones o pequeñas humedades', avgPrice: 'Desde 90€', duration: 'Variable', description: 'Saneamiento de manchas y aplicación de pintura de alta cubrición plástica.' }
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    name: 'Carlos Ruiz',
    city: 'Barcelona',
    rating: 5,
    text: 'Tuve una fuga grave de agua en el baño un domingo por la tarde. Vinieron en menos de 35 minutos y lo solucionaron muy rápido. Trato excelente y precio muy razonable para ser de urgencia.',
    date: '2026-07-15',
    service: 'Fontanería'
  },
  {
    id: 'r2',
    name: 'Elena Martínez',
    city: 'Madrid',
    rating: 5,
    text: 'Electricista súper profesional. Necesitaba un boletín eléctrico urgente para dar de alta la luz y se encargó de todo en un día. Súper recomendado.',
    date: '2026-07-18',
    service: 'Electricidad'
  },
  {
    id: 'r3',
    name: 'Juan Antonio S.',
    city: 'Valencia',
    rating: 4,
    text: 'Vinieron a arreglar el calentador que no encendía. Cambiaron la pieza al momento porque llevaban repuestos en la furgoneta. Muy satisfecho con el servicio.',
    date: '2026-07-20',
    service: 'Calentadores'
  },
  {
    id: 'r4',
    name: 'Marta G.',
    city: 'Barcelona',
    rating: 5,
    text: 'La inspección de gas me detectó una fuga en la llave general. El técnico de Urge Ya llegó a las 2 horas, reparó la fuga y me emitió el documento de subsanación. Servicio impecable.',
    date: '2026-07-19',
    service: 'Gas'
  }
];

export const MOCK_TECHNICIANS: Technician[] = [
  {
    name: 'Francisco Javier L.',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format,compress&fit=crop&w=120&h=120&q=70&fm=webp',
    specialty: 'Técnico Senior de Fontanería y Gas',
    rating: 4.9,
    completedJobs: 1240,
    etaMinutes: 20
  },
  {
    name: 'Andrés Manuel Torres',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format,compress&fit=crop&w=120&h=120&q=70&fm=webp',
    specialty: 'Instalador Electricista Autorizado',
    rating: 4.8,
    completedJobs: 980,
    etaMinutes: 15
  },
  {
    name: 'Roberto Gómez',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format,compress&fit=crop&w=120&h=120&q=70&fm=webp',
    specialty: 'Técnico Especialista en Climatización y Calderas',
    rating: 4.9,
    completedJobs: 1450,
    etaMinutes: 25
  },
  {
    name: 'Miguel Ángel Ruiz',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format,compress&fit=crop&w=120&h=120&q=70&fm=webp',
    specialty: 'Manitas y Reformas Multidisciplinares',
    rating: 4.7,
    completedJobs: 650,
    etaMinutes: 30
  }
];

export const FAQS = [
  {
    question: '¿Cuánto tiempo tardan en llegar para un servicio urgente?',
    answer: 'Nuestra media de llegada para servicios de urgencias es de 30 a 45 minutos en Barcelona, Madrid y Valencia, dependiendo del tráfico. Disponemos de unidades móviles repartidas estratégicamente para asegurar la respuesta más rápida.'
  },
  {
    question: '¿Cobran el desplazamiento si acepto el presupuesto?',
    answer: 'No. Si usted acepta el presupuesto elaborado por nuestro técnico autorizado para realizar la reparación, el desplazamiento es totalmente gratuito.'
  },
  {
    question: '¿Los trabajos tienen garantía por escrito?',
    answer: 'Sí. Todos nuestros trabajos están garantizados por escrito por un periodo mínimo de 3 meses, y hasta 2 años en el caso de instalación de equipos nuevos, según establece la ley vigente.'
  },
  {
    question: '¿Atienden domingos y festivos?',
    answer: 'Sí, funcionamos las 24 horas del día, los 365 días del año. Tenemos retenes de técnicos de guardia para atender cualquier incidencia urgente de fontanería, electricidad, gas o calefacción en fin de semana o festivo.'
  },
  {
    question: '¿Son técnicos homologados y certificados?',
    answer: 'Por supuesto. Todos nuestros electricistas, técnicos de gas y calefacción cuentan con su correspondiente carnet de instalador autorizado expedido por el Ministerio de Industria.'
  }
];
