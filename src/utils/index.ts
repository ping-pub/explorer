// dateUtils.ts
export const convertDateTime = (inputDate: string) => {
  const dateObject = new Date(inputDate);
  const formattedDate = dateObject.toLocaleString();
  return formattedDate;
};
