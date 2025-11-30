export const generateTahunAjaranOptions = () => {
  const currentYear = new Date().getFullYear();
  const options = [];

  for (let i = 0; i <= 5; i++) {
    const year = currentYear + i;
    const nextYear = year + 1;
    options.push({
      value: `${year}/${nextYear}`,
      label: `${year}/${nextYear}`,
    });
  }

  return options;
};
