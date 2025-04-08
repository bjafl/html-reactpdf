
export function parseStyleString(fromString: string): Record<string, string> {
  /*const styleStringMatch = fromString.match(/(?:style=")([^"]*)(?:")/);
  if (!styleStringMatch) {
    return {};
  }
  const styleString = styleStringMatch[1];*/
  const styleString = fromString;
  if (!styleString) {
    return {};
  }
  return styleString
    .split(";")
    .map((style) => {
      const [key, value] = style.split(":");
      if (!value) return {};
      return { [key.trim()]: value.trim() };
    })
    .reduce((acc, style) => ({ ...acc, ...style }), {});
}

export function styleArrayToString(
  style: Record<string, string>,
  includeAttrName = true
): string {
  const styleString = Object.entries(style)
    .map(([key, value]) => `${key}:${value}`)
    .join("; ");
  return includeAttrName ? `style="${styleString}"` : styleString;
}

export const kebabToCamelCase = (str: string): string =>
  str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
/*const camelToKebabCase = (str: string): string =>
  str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();*/

export function convertInlineStyle(
  style: string | Record<string, string>
): Record<string, string> {
  const styleRecord: Record<string, string> =
    typeof style === "string" ? parseStyleString(style) : style;
  return Object.entries(styleRecord).reduce(
    (acc, [key, value]) => ({ ...acc, [kebabToCamelCase(key)]: value }),
    {} as Record<string, string>
  );
}


