export function calculateAge(birthDateString: string): { years: number; months: number; text: string } {
  if (!birthDateString) return { years: 0, months: 0, text: '' };

  const birthDate = new Date(birthDateString);
  if (isNaN(birthDate.getTime())) return { years: 0, months: 0, text: '' };

  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  const days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years < 0) {
    return { years: 0, months: 0, text: '0 años, 0 meses' };
  }

  let text = '';
  if (years === 0 && months === 0) {
    text = 'Recién nacido (menos de 1 mes)';
  } else if (years === 0) {
    text = `${months} ${months === 1 ? 'mes' : 'meses'}`;
  } else if (months === 0) {
    text = `${years} ${years === 1 ? 'año' : 'años'}`;
  } else {
    text = `${years} ${years === 1 ? 'año' : 'años'} y ${months} ${months === 1 ? 'mes' : 'meses'}`;
  }

  return { years, months, text };
}

export function formatDateToDMY(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return dateStr;
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}
