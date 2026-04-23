export const capitalizeFirstLetter = (text?: string) => {
  if (!text) return "";
  const str = String(text);
  return str.charAt(0).toUpperCase() + str.slice(1);
};

type TruncateOptions = {
  suffix?: string;
};

const DEFAULT_TRUNCATE_SUFFIX = ".";

export const truncate = (
  s?: string,
  max = 10,
  suffixOrOptions: string | TruncateOptions = DEFAULT_TRUNCATE_SUFFIX,
) => {
  if (!s) return ""; // ✅ SAFE

  const str = String(s);
  const suffix =
    typeof suffixOrOptions === "string"
      ? suffixOrOptions
      : (suffixOrOptions.suffix ?? DEFAULT_TRUNCATE_SUFFIX);

  return str.length > max ? str.slice(0, max) + suffix : str;
};
