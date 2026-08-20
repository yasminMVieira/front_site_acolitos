export interface ExternalLink {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: string;
  /** Aparece em destaque na Home, não só na página de Links. */
  featured?: boolean;
}

export const externalLinks: ExternalLink[] = [
  {
    id: 'paroquia',
    title: 'Paróquia N. S. do Caminho',
    description:
      'Site oficial da paróquia. É lá que fica a liturgia da missa de cada dia: leituras, salmo e evangelho.',
    url: 'https://www.paroquianscaminho.com.br',
    icon: 'pi pi-home',
    featured: true,
  },
  {
    id: 'sophya',
    title: 'SophYA',
    description:
      'Assistente católica de inteligência artificial. Tire dúvidas sobre fé, liturgia e o serviço no altar.',
    url: 'https://sophya.tinkermin.com.br',
    icon: 'pi pi-sparkles',
    featured: true,
  },
  {
    id: 'calendario',
    title: 'Calendário Litúrgico',
    description: 'Tempo litúrgico, cor do dia e o santo celebrado.',
    url: 'https://acolyte.guilhermerodovalho.com',
    icon: 'pi pi-calendar',
  },
  {
    id: 'instagram',
    title: 'Instagram dos Acólitos',
    description: 'Fotos, avisos e os bastidores do grupo.',
    url: 'https://www.instagram.com/acolitos.nsc/',
    icon: 'pi pi-instagram',
  },
];

export const featuredLinks = externalLinks.filter((link) => link.featured);
