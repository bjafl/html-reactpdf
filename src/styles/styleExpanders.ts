import {
  StyleExpander,
  StyleExpanderCompact,
  StyleExpansionMap,
  StyleExpansionMapping,
  StyleExpansionMappingCompact,
  StyleExpansionValueCheckMapping,
} from "./types";
import { VALUE_CHECKS } from "./validateStyle";

const partSeparator = /(?<![0-9],) /;
const expand: StyleExpander = (keys, value) => {
  const values = value.toString().split(partSeparator);
  const newVals = keys.map((key, index) => {
    const keyArr = Array.isArray(key) ? key : [key];
    return keyArr.reduce((acc, k) => {
      const newPart = { [k]: values[index] };
      return { ...acc, ...newPart };
    }, {} as Record<string, string>);
  });
  return newVals.reduce(
    (acc, val) => ({ ...acc, ...val }),
    {} as Record<string, string>
  );
};

const expandFlex = (value: string) => {
  const values = safeSplitValue(value);
  switch (values.length) {
    case 1:
      return {
        //TODO!
        flexGrow: values[0],
        flexShrink: values[0],
        flexBasis: "auto",
      };
    case 2:
      return {
        //TODO!
        flexGrow: values[0],
        flexShrink: values[1],
        flexBasis: "auto",
      };
    default:
      return {
        flexGrow: values[0],
        flexShrink: values[1],
        flexBasis: values[2],
      };
  }
};

function newExpansionNParts(
  value: string,
  mappings: StyleExpansionMappingCompact,
  defaultKey?: number // Defaults to the largest key
) {
  const mappingsObj: StyleExpansionMapping = Object.entries(mappings).reduce(
    (acc, [numKey, keyListMap]) => {
      const newKey = parseInt(numKey);
      const keyListTyped = keyListMap as (string | string[])[];
      const mapFunc: StyleExpanderCompact = (val) => expand(keyListTyped, val);
      return { ...acc, [newKey]: mapFunc };
    },
    {} as StyleExpansionMapping
  );
  if (!defaultKey) {
    defaultKey = Math.max(...Object.keys(mappingsObj).map(Number));
  }
  const nParts = safeSplitValue(value).length;
  const key = nParts in mappingsObj ? nParts : defaultKey;
  return mappingsObj[key](value);
}
function safeSplitValue(value: unknown) {
  let valueStr = "";
  if (typeof value === "string") {
    valueStr = value;
  } else if (typeof value === "number" || typeof value === "object") {
    valueStr = (value == null || value == undefined) ? "" : value.toString();
    console.warn(`Value ${value} is not a string. Converted to string: ${valueStr}`);
  }
  const parts = valueStr.split(partSeparator).map((part) => part.trim());
  return parts;
}
function newExpansionSeperateChecks(
  value: string,
  mappings: StyleExpansionValueCheckMapping,
  specialCases?: [(val: string) => Record<string, string | number> | undefined] | undefined
) {
  for (const specialCase of specialCases || []) {
    const specialCaseResult = specialCase(value);
    if (specialCaseResult) {
      return specialCaseResult;
    }
  }
  const parts = safeSplitValue(value);
  const newVals: Record<string, string> = {};
  parts.forEach((part) => {
    Object.entries(mappings).forEach(([propName, valueCheck]) => {
      if (valueCheck(part)) {
        newVals[propName] = part;
      }
    });
  });
  return newVals;
}

export const expansionMap: StyleExpansionMap = {
  padding: (value) => newExpansionNParts(value, {
    1: [["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"]],
    2: [
      ["paddingTop", "paddingBottom"],
      ["paddingRight", "paddingLeft"],
    ],
    3: ["paddingTop", ["paddingLeft", "paddingRight"], "paddingBottom"],

    4: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
  }),
  margin: (value) => newExpansionNParts(value, {
    1: [["marginTop", "marginRight", "marginBottom", "marginLeft"]],
    2: [
      ["marginTop", "marginBottom"],
      ["marginRight", "marginLeft"],
    ],

    3: ["marginTop", ["marginLeft", "marginRight"], "marginBottom"],
    4: ["marginTop", "marginRight", "marginBottom", "marginLeft"],
  }),
  flex: (val) => expandFlex(val),
  gap: (val) => newExpansionNParts(val, {
    1: [["rowGap", "columnGap"]],
    2: ["rowGap", "columnGap"],
  }),
  objectPosition: (value) => newExpansionNParts(value, {
    1: ["objectFit"],
    2: ["objectPositionX", "objectPositionY"],
  }),
  transform: (val) => ({ transform: val }), //TODO
  border: (val) => newExpansionSeperateChecks(val, {
    borderWidth: VALUE_CHECKS.isLineWidth,
    borderColor: VALUE_CHECKS.isColor,
    borderStyle: VALUE_CHECKS.isLineStyle,
    }, [
      (val) => {
        if (val === "none") {
          return {
            borderTopWidth: 0,
            borderRightWidth: 0,
            borderBottomWidth: 0,
            borderLeftWidth: 0,
          } as Record<string, number>;
        }
        return undefined;
      },
    ]),
  borderTop: (val) => newExpansionSeperateChecks(val , {
    borderTopWidth: VALUE_CHECKS.isLineWidth,
    borderTopColor: VALUE_CHECKS.isColor,
    borderTopStyle: VALUE_CHECKS.isLineStyle,    
  }),
  borderRight: (val) => newExpansionSeperateChecks(val, {
    borderRightWidth: VALUE_CHECKS.isLineWidth,
    borderRightColor: VALUE_CHECKS.isColor,
    borderRightStyle: VALUE_CHECKS.isLineStyle,    
  }),
  borderBottom: (val) => newExpansionSeperateChecks(val, {
    borderBottomWidth: VALUE_CHECKS.isLineWidth,
    borderBottomColor: VALUE_CHECKS.isColor,
    borderBottomStyle: VALUE_CHECKS.isLineStyle,
  }),
  borderLeft: (val) => newExpansionSeperateChecks(val, {
    borderLeftWidth: VALUE_CHECKS.isLineWidth,
    borderLeftColor: VALUE_CHECKS.isColor,
    borderLeftStyle: VALUE_CHECKS.isLineStyle,
  }),
  borderWidth: (value) => newExpansionNParts(value, {
    1: [
      [
        "borderTopWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "borderLeftWidth",
      ],
    ],

    2: [
      ["borderTopWidth", "borderBottomWidth"],
      ["borderRightWidth", "borderLeftWidth"],
    ],

    3: [
      "borderTopWidth",
      ["borderLeftWidth", "borderRightWidth"],
      "borderBottomWidth",
    ],

    4: [
      "borderTopWidth",
      "borderRightWidth",
      "borderBottomWidth",
      "borderLeftWidth",
    ],
  }),
  borderColor: (value) => newExpansionNParts(value,{
    1: [
      [
        "borderTopColor",
        "borderRightColor",
        "borderBottomColor",
        "borderLeftColor",
      ],
    ],

    2: [
      ["borderTopColor", "borderBottomColor"],
      ["borderRightColor", "borderLeftColor"],
    ],

    3: [
      "borderTopColor",
      ["borderLeftColor", "borderRightColor"],
      "borderBottomColor",
    ],

    4: [
      "borderTopColor",
      "borderRightColor",
      "borderBottomColor",
      "borderLeftColor",
    ],
  }),
  borderStyle: (value) => newExpansionNParts(value,{
    1: [
      [
        "borderTopStyle",
        "borderRightStyle",
        "borderBottomStyle",
        "borderLeftStyle",
      ],
    ],

    2: [
      ["borderTopStyle", "borderBottomStyle"],
      ["borderRightStyle", "borderLeftStyle"],
    ],

    3: [
      "borderTopStyle",
      ["borderLeftStyle", "borderRightStyle"],
      "borderBottomStyle",
    ],

    4: [
      "borderTopStyle",
      "borderRightStyle",
      "borderBottomStyle",
      "borderLeftStyle",
    ],
  }),
};
