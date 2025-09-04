


export const validateRodneCislo = (rc: string): boolean => {
    const rcRegex = /^\d{6}\/?\d{3,4}$/;
    if (!rcRegex.test(rc)) return false;

    const cleanRC = rc.replace("/", "");
    const y = parseInt(cleanRC.substring(0, 2), 10);
    let m = parseInt(cleanRC.substring(2, 4), 10);
    const d = parseInt(cleanRC.substring(4, 6), 10);

    if (m > 50) m -= 50; // ženy

    const year = y + (y < 54 ? 2000 : 1900);
    const date = new Date(year, m - 1, d);
    if (date.getFullYear() !== year || date.getMonth() !== m - 1 || date.getDate() !== d) {
      return false;
    }

    if (cleanRC.length === 10) {
      const num = parseInt(cleanRC, 10);
      if (num % 11 !== 0) return false;
    }
    return true;
  };

  export const normalizeText = (text: string): string => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

