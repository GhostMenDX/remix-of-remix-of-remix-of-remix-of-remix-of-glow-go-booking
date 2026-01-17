// Mapeamento de serviços para especialidades
// Isso define quais especialistas podem atender cada serviço

export const serviceToSpecialties: Record<string, string[]> = {
  // Serviços de cabelo
  "coloracao": ["Coloração"],
  "corte": ["Corte"],
  "manutencao": ["Coloração", "Corte"],
  "alisamento-express": ["Progressiva"],
  "transformacao-total": ["Progressiva", "Coloração"],
  
  // Tratamentos
  "hidratacao-profunda": ["Hidratação", "Tratamentos Capilares"],
  
  // Unhas
  "spa-maos-pes": ["Manicure", "Pedicure"],
  "pedicure": ["Pedicure"],
  "manicure": ["Manicure"],
  
  // Estética
  "sobrancelha": ["Design de Sobrancelhas"],
};

// Função para verificar se um especialista pode atender um serviço
export const canSpecialistDoService = (
  specialistSpecialties: string[],
  serviceId: string
): boolean => {
  const requiredSpecialties = serviceToSpecialties[serviceId];
  
  if (!requiredSpecialties) {
    return true; // Se não há mapeamento, qualquer um pode atender
  }
  
  // Verifica se o especialista tem pelo menos uma das especialidades necessárias
  return requiredSpecialties.some(specialty => 
    specialistSpecialties.includes(specialty)
  );
};
