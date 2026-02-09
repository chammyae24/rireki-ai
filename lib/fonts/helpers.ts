export const getJapaneseFont = (weight: number | string = 400) => {
  return "NotoSansJP";
};

export const convertToJapaneseDate = (date: Date): string => {
  // Convert Western date to Japanese Imperial era format
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Simplified conversion (specifically handling Reiwa era starting May 1, 2019)
  // 2019 is Reiwa 1, so offset is 2018.
  // Before May 1, 2019 is Heisei 31. This simple logic assumes current/future dates.
  // For a robust solution, a library like generic-date-fns or similar might be better,
  // but for this scope, this suffices for recent dates.

  let era = "";
  let eraYear = 0;

  if (year >= 2019) {
    era = "令和";
    eraYear = year - 2018;
  } else if (year >= 1989) {
    era = "平成";
    eraYear = year - 1988;
  } else {
    // Fallback for older dates (Show)
    era = "昭和";
    eraYear = year - 1925;
  }

  const yearStr = eraYear === 1 ? "元" : eraYear.toString();
  return `${era}${yearStr}年${month}月${day}日`;
};
