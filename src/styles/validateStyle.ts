/**
 * @fileoverview JSON schemas for use with AJV validator
 * @description This file contains JSON schemas automatically generated from TypeScript
 *              interfaces using typescript-json-schema, along with custom utility
 *              functions for working with these schemas.
 * @author Bjarte Lode <bjarte@flode.net>
 * @copyright Copyright (c) 2025, Bjarte Lode
 * @license MIT
 * @version 1.0.0
 * @generated PARTIALLY - The schema objects were automatically generated using
 *            typescript-json-schema (https://github.com/YousefED/typescript-json-schema)
 */
import Ajv, { JSONSchemaType } from "ajv";
import { Style, StyleKey, SafeStyle } from "@react-pdf/stylesheet";

export const VALUE_PATTERNS = {
  scalar: /^[0-9]+(\.[0-9]+)?(px|em|rem|%|vh|vw|vmin|vmax|cm|mm|in|pt|pc)?$/,
  hexColor: /^#[0-9a-fA-F]{6}$/,
  rgbColor: /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/,
  rgbaColor: /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(\d*.)?\d+\s*\)$/,
  hslColor: /^hsl\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*\)$/,
  hslaColor: /^hsla\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*,\s*(\d*.)?\d+\s*\)$/,
};

export const VALUE_CHECKS = {
  isScalar: (value: string): boolean => VALUE_PATTERNS.scalar.test(value),
  isColor: (value: string): boolean =>
    VALUE_PATTERNS.hexColor.test(value) ||
    VALUE_PATTERNS.rgbColor.test(value) ||
    VALUE_PATTERNS.rgbaColor.test(value) ||
    VALUE_PATTERNS.hslColor.test(value) ||
    VALUE_PATTERNS.hslaColor.test(value) ||
    value in COLOR_MAP ||
    COLOR_KEYWORDS.includes(value),
  isLineStyle: (value: string): boolean =>
    VALUE_ENUMS.lineStyle.includes(value),
  isLineWidth: (value: string): boolean =>
    VALUE_PATTERNS.scalar.test(value) || VALUE_ENUMS.lineWidth.includes(value),
};

export const VALUE_ENUMS = {
  fontStyle: ["normal", "italic", "oblique"],
  fontWeight: ["normal", "bold", "bolder", "lighter"],
  lineStyle: [
    "none",
    "hidden",
    "dotted",
    "dashed",
    "solid",
    "double",
    "groove",
    "ridge",
    "inset",
    "outset",
  ],
  lineWidth: ["thin", "medium", "thick"],
};

export const COLOR_KEYWORDS = ["transparent"];
export const COLOR_MAP: Record<string, string> = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  goldenrod: "#daa520",
  gold: "#ffd700",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  grey: "#808080",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavenderblush: "#fff0f5",
  lavender: "#e6e6fa",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32",
};

const styleKeySchema: JSONSchemaType<StyleKey> = {
  $schema: "http://json-schema.org/draft-07/schema#",
  enum: [
    "alignContent",
    "alignItems",
    "alignSelf",
    "aspectRatio",
    "backgroundColor",
    "border",
    "borderBottom",
    "borderBottomColor",
    "borderBottomLeftRadius",
    "borderBottomRightRadius",
    "borderBottomStyle",
    "borderBottomWidth",
    "borderColor",
    "borderLeft",
    "borderLeftColor",
    "borderLeftStyle",
    "borderLeftWidth",
    "borderRadius",
    "borderRight",
    "borderRightColor",
    "borderRightStyle",
    "borderRightWidth",
    "borderStyle",
    "borderTop",
    "borderTopColor",
    "borderTopLeftRadius",
    "borderTopRightRadius",
    "borderTopStyle",
    "borderTopWidth",
    "borderWidth",
    "bottom",
    "clipPath",
    "color",
    "columnGap",
    "direction",
    "display",
    "dominantBaseline",
    "fill",
    "fillOpacity",
    "fillRule",
    "flex",
    "flexBasis",
    "flexDirection",
    "flexFlow",
    "flexGrow",
    "flexShrink",
    "flexWrap",
    "fontFamily",
    "fontSize",
    "fontStyle",
    "fontWeight",
    "gap",
    "gradientTransform",
    "height",
    "justifyContent",
    "justifySelf",
    "left",
    "letterSpacing",
    "lineHeight",
    "margin",
    "marginBottom",
    "marginHorizontal",
    "marginLeft",
    "marginRight",
    "marginTop",
    "marginVertical",
    "maxHeight",
    "maxLines",
    "maxWidth",
    "minHeight",
    "minWidth",
    "objectFit",
    "objectPosition",
    "objectPositionX",
    "objectPositionY",
    "opacity",
    "overflow",
    "padding",
    "paddingBottom",
    "paddingHorizontal",
    "paddingLeft",
    "paddingRight",
    "paddingTop",
    "paddingVertical",
    "position",
    "right",
    "rowGap",
    "stroke",
    "strokeDasharray",
    "strokeLinecap",
    "strokeLinejoin",
    "strokeOpacity",
    "strokeWidth",
    "textAlign",
    "textAnchor",
    "textDecoration",
    "textDecorationColor",
    "textDecorationStyle",
    "textIndent",
    "textOverflow",
    "textTransform",
    "top",
    "transform",
    "transformOrigin",
    "transformOriginX",
    "transformOriginY",
    "verticalAlign",
    "visibility",
    "width",
    "zIndex",
  ],
  type: "string",
};

const styleSchema: JSONSchemaType<Style> = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object", //added
  required: [], //added
  allOf: [
    {
      properties: {
        border: {
          type: ["string", "number"],
        },
        borderBottom: {
          type: ["string", "number"],
        },
        borderColor: {
          type: "string",
        },
        borderLeft: {
          type: ["string", "number"],
        },
        borderRadius: {
          type: ["string", "number"],
        },
        borderRight: {
          type: ["string", "number"],
        },
        borderStyle: {
          $ref: "#/definitions/BorderStyleValue",
        },
        borderTop: {
          type: ["string", "number"],
        },
        borderWidth: {
          type: ["string", "number"],
        },
      },
      type: "object",
    },
    {
      properties: {
        borderBottomColor: {
          type: "string",
        },
        borderBottomLeftRadius: {
          type: ["string", "number"],
        },
        borderBottomRightRadius: {
          type: ["string", "number"],
        },
        borderBottomStyle: {
          $ref: "#/definitions/BorderStyleValue",
        },
        borderBottomWidth: {
          type: ["string", "number"],
        },
        borderLeftColor: {
          type: "string",
        },
        borderLeftStyle: {
          $ref: "#/definitions/BorderStyleValue",
        },
        borderLeftWidth: {
          type: ["string", "number"],
        },
        borderRightColor: {
          type: "string",
        },
        borderRightStyle: {
          $ref: "#/definitions/BorderStyleValue",
        },
        borderRightWidth: {
          type: ["string", "number"],
        },
        borderTopColor: {
          type: "string",
        },
        borderTopLeftRadius: {
          type: ["string", "number"],
        },
        borderTopRightRadius: {
          type: ["string", "number"],
        },
        borderTopStyle: {
          $ref: "#/definitions/BorderStyleValue",
        },
        borderTopWidth: {
          type: ["string", "number"],
        },
      },
      type: "object",
    },
    {
      properties: {
        backgroundColor: {
          type: "string",
        },
        color: {
          type: "string",
        },
        opacity: {
          type: ["string", "number"],
        },
      },
      type: "object",
    },
    {
      properties: {
        height: {
          type: ["string", "number"],
        },
        maxHeight: {
          type: ["string", "number"],
        },
        maxWidth: {
          type: ["string", "number"],
        },
        minHeight: {
          type: ["string", "number"],
        },
        minWidth: {
          type: ["string", "number"],
        },
        width: {
          type: ["string", "number"],
        },
      },
      type: "object",
    },
    {
      properties: {
        flex: {
          type: ["string", "number"],
        },
      },
      type: "object",
    },
    {
      properties: {
        alignContent: {
          $ref: "#/definitions/AlignContent",
        },
        alignItems: {
          $ref: "#/definitions/AlignItems",
        },
        alignSelf: {
          $ref: "#/definitions/AlignSelf",
        },
        flexBasis: {
          type: ["string", "number"],
        },
        flexDirection: {
          $ref: "#/definitions/FlexDirection",
        },
        flexFlow: {
          type: ["string", "number"],
        },
        flexGrow: {
          type: ["string", "number"],
        },
        flexShrink: {
          type: ["string", "number"],
        },
        flexWrap: {
          $ref: "#/definitions/FlexWrap",
        },
        justifyContent: {
          $ref: "#/definitions/JustifyContent",
        },
        justifySelf: {
          type: "string",
        },
      },
      type: "object",
    },
    {
      properties: {
        gap: {
          type: ["string", "number"],
        },
      },
      type: "object",
    },
    {
      properties: {
        columnGap: {
          type: ["string", "number"],
        },
        rowGap: {
          type: ["string", "number"],
        },
      },
      type: "object",
    },
    {
      properties: {
        aspectRatio: {
          type: ["string", "number"],
        },
        bottom: {
          type: ["string", "number"],
        },
        display: {
          $ref: "#/definitions/Display",
        },
        left: {
          type: ["string", "number"],
        },
        overflow: {
          const: "hidden",
          type: "string",
        },
        position: {
          $ref: "#/definitions/Position",
        },
        right: {
          type: ["string", "number"],
        },
        top: {
          type: ["string", "number"],
        },
        zIndex: {
          type: ["string", "number"],
        },
      },
      type: "object",
    },
    {
      properties: {
        margin: {
          type: ["string", "number"],
        },
        marginHorizontal: {
          type: ["string", "number"],
        },
        marginVertical: {
          type: ["string", "number"],
        },
      },
      type: "object",
    },
    {
      properties: {
        marginBottom: {
          type: ["string", "number"],
        },
        marginLeft: {
          type: ["string", "number"],
        },
        marginRight: {
          type: ["string", "number"],
        },
        marginTop: {
          type: ["string", "number"],
        },
      },
      type: "object",
    },
    {
      properties: {
        padding: {
          type: ["string", "number"],
        },
        paddingHorizontal: {
          type: ["string", "number"],
        },
        paddingVertical: {
          type: ["string", "number"],
        },
      },
      type: "object",
    },
    {
      properties: {
        paddingBottom: {
          type: ["string", "number"],
        },
        paddingLeft: {
          type: ["string", "number"],
        },
        paddingRight: {
          type: ["string", "number"],
        },
        paddingTop: {
          type: ["string", "number"],
        },
      },
      type: "object",
    },
    {
      properties: {
        objectPosition: {
          type: ["string", "number"],
        },
      },
      type: "object",
    },
    {
      properties: {
        objectFit: {
          type: "string",
        },
        objectPositionX: {
          type: ["string", "number"],
        },
        objectPositionY: {
          type: ["string", "number"],
        },
      },
      type: "object",
    },
    {
      properties: {
        direction: {
          enum: ["ltr", "rtl"],
          type: "string",
        },
        fontFamily: {
          anyOf: [
            {
              items: {
                type: "string",
              },
              type: "array",
            },
            {
              type: "string",
            },
          ],
        },
        fontSize: {
          type: ["string", "number"],
        },
        fontStyle: {
          $ref: "#/definitions/FontStyle",
        },
        fontWeight: {
          $ref: "#/definitions/FontWeight",
        },
        letterSpacing: {
          type: ["string", "number"],
        },
        lineHeight: {
          type: ["string", "number"],
        },
        maxLines: {
          type: "number",
        },
        textAlign: {
          $ref: "#/definitions/TextAlign",
        },
        textDecoration: {
          $ref: "#/definitions/TextDecoration",
        },
        textDecorationColor: {
          type: "string",
        },
        textDecorationStyle: {
          type: "string",
        },
        textIndent: {},
        textOverflow: {
          const: "ellipsis",
          type: "string",
        },
        textTransform: {
          $ref: "#/definitions/TextTransform",
        },
        verticalAlign: {
          $ref: "#/definitions/VerticalAlign",
        },
      },
      type: "object",
    },
    {
      properties: {
        transformOrigin: {
          type: ["string", "number"],
        },
      },
      type: "object",
    },
    {
      properties: {
        gradientTransform: {
          anyOf: [
            {
              items: {
                $ref: "#/definitions/ScaleTransform",
              },
              type: "array",
            },
            {
              items: {
                $ref: "#/definitions/TranslateTransform",
              },
              type: "array",
            },
            {
              items: {
                $ref: "#/definitions/RotateTransform",
              },
              type: "array",
            },
            {
              items: {
                $ref: "#/definitions/SkewTransform",
              },
              type: "array",
            },
            {
              items: {
                $ref: "#/definitions/MatrixTransform",
              },
              type: "array",
            },
            {
              type: "string",
            },
          ],
        },
        transform: {
          anyOf: [
            {
              items: {
                $ref: "#/definitions/ScaleTransform",
              },
              type: "array",
            },
            {
              items: {
                $ref: "#/definitions/TranslateTransform",
              },
              type: "array",
            },
            {
              items: {
                $ref: "#/definitions/RotateTransform",
              },
              type: "array",
            },
            {
              items: {
                $ref: "#/definitions/SkewTransform",
              },
              type: "array",
            },
            {
              items: {
                $ref: "#/definitions/MatrixTransform",
              },
              type: "array",
            },
            {
              type: "string",
            },
          ],
        },
        transformOriginX: {
          type: ["string", "number"],
        },
        transformOriginY: {
          type: ["string", "number"],
        },
      },
      type: "object",
    },
    {
      $ref: "#/definitions/SvgStyle",
    },
    {
      type: "object",
      /*patternProperties: {
        "^@media.*$": {
          //"$ref": "#/definitions/BaseStyle"
          
        },
      },*/
      //Simplified check for this type ....
      additionalProperties: true,
    },
  ],
  definitions: {
    AlignContent: {
      enum: [
        "center",
        "flex-end",
        "flex-start",
        "space-around",
        "space-between",
        "space-evenly",
        "stretch",
      ],
      type: "string",
    },
    AlignItems: {
      enum: ["baseline", "center", "flex-end", "flex-start", "stretch"],
      type: "string",
    },
    AlignSelf: {
      enum: ["auto", "baseline", "center", "flex-end", "flex-start", "stretch"],
      type: "string",
    },
    BorderStyleValue: {
      enum: ["dashed", "dotted", "solid"],
      type: "string",
    },
    Display: {
      enum: ["flex", "none"],
      type: "string",
    },
    FlexDirection: {
      enum: ["column", "column-reverse", "row", "row-reverse"],
      type: "string",
    },
    FlexWrap: {
      enum: ["nowrap", "wrap", "wrap-reverse"],
      type: "string",
    },
    FontStyle: {
      enum: ["italic", "normal", "oblique"],
      type: "string",
    },
    FontWeight: {
      type: ["string", "number"],
    },
    JustifyContent: {
      enum: [
        "center",
        "flex-end",
        "flex-start",
        "space-around",
        "space-between",
        "space-evenly",
      ],
      type: "string",
    },
    /*
    
    ** Issues with this def, moved it out of
    ** definitions and added to the main schema
    
    MediaQueryStyle: {
      type: "object",
      patternProperties: {
        "^@media.*$": { 
          "$ref": "#/definitions/BaseStyle"
        }
      },
      additionalProperties: false
    },*/
    Position: {
      enum: ["absolute", "relative", "static"],
      type: "string",
    },
    SvgStyle: {
      properties: {
        clipPath: {
          type: "string",
        },
        dominantBaseline: {
          enum: [
            "auto",
            "central",
            "hanging",
            "mathematical",
            "middle",
            "text-after-edge",
            "text-before-edge",
          ],
          type: "string",
        },
        fill: {
          type: "string",
        },
        fillOpacity: {
          type: ["string", "number"],
        },
        fillRule: {
          enum: ["evenodd", "nonzero"],
          type: "string",
        },
        stroke: {
          type: "string",
        },
        strokeDasharray: {
          type: "string",
        },
        strokeLinecap: {
          enum: ["butt", "round", "square"],
          type: "string",
        },
        strokeLinejoin: {
          enum: ["bevel", "butt", "miter", "round", "square"],
          type: "string",
        },
        strokeOpacity: {
          type: ["string", "number"],
        },
        strokeWidth: {
          type: ["string", "number"],
        },
        textAnchor: {
          enum: ["end", "middle", "start"],
          type: "string",
        },
        visibility: {
          enum: ["collapse", "hidden", "visible"],
          type: "string",
        },
      },
      type: "object",
      required: [],
    },
    TextAlign: {
      enum: ["center", "justify", "left", "right"],
      type: "string",
    },
    TextDecoration: {
      enum: [
        "line-through",
        "line-through underline",
        "none",
        "underline",
        "underline line-through",
      ],
      type: "string",
    },
    TextTransform: {
      enum: ["capitalize", "lowercase", "none", "uppercase", "upperfirst"],
      type: "string",
    },
    /*Transform: {
      anyOf: [
     
      ** Removed and replaced by individual transform types **

    */
    ScaleTransform: {
      properties: {
        operation: {
          const: "scale",
          type: "string",
        },
        value: {
          items: {
            type: "number",
          },
          maxItems: 2,
          minItems: 2,
          type: "array",
        },
      },
      required: ["operation", "value"],
      type: "object",
    },
    TranslateTransform: {
      properties: {
        operation: {
          const: "translate",
          type: "string",
        },
        value: {
          items: {
            type: "number",
          },
          maxItems: 2,
          minItems: 2,
          type: "array",
        },
      },
      required: ["operation", "value"],
      type: "object",
    },
    RotateTransform: {
      properties: {
        operation: {
          const: "rotate",
          type: "string",
        },
        value: {
          items: {
            type: "number",
          },

          maxItems: 1,
          minItems: 1,
          type: "array",
        },
      },
      required: ["operation", "value"],
      type: "object",
    },
    SkewTransform: {
      properties: {
        operation: {
          const: "skew",
          type: "string",
        },
        value: {
          items: {
            type: "number",
          },
          maxItems: 2,
          minItems: 2,
          type: "array",
        },
      },
      required: ["operation", "value"],
      type: "object",
    },
    MatrixTransform: {
      properties: {
        operation: {
          const: "matrix",
          type: "string",
        },
        value: {
          items: {
            type: "number",
          },
          maxItems: 6,
          minItems: 6,
          type: "array",
        },
      },
      required: ["operation", "value"],
      type: "object",
    },
    VerticalAlign: {
      enum: ["sub", "super"],
      type: "string",
    },
  },
};

const safeStyleSchema: JSONSchemaType<SafeStyle> = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object", //added
  required: [], //added
  allOf: [
    {
      properties: {
        borderBottomColor: {
          type: "string",
        },
        borderBottomLeftRadius: {
          type: ["string", "number"],
        },
        borderBottomRightRadius: {
          type: ["string", "number"],
        },
        borderBottomStyle: {
          $ref: "#/definitions/BorderStyleValue",
        },
        borderBottomWidth: {
          type: ["string", "number"],
        },
        borderLeftColor: {
          type: "string",
        },
        borderLeftStyle: {
          $ref: "#/definitions/BorderStyleValue",
        },
        borderLeftWidth: {
          type: ["string", "number"],
        },
        borderRightColor: {
          type: "string",
        },
        borderRightStyle: {
          $ref: "#/definitions/BorderStyleValue",
        },
        borderRightWidth: {
          type: ["string", "number"],
        },
        borderTopColor: {
          type: "string",
        },
        borderTopLeftRadius: {
          type: ["string", "number"],
        },
        borderTopRightRadius: {
          type: ["string", "number"],
        },
        borderTopStyle: {
          $ref: "#/definitions/BorderStyleValue",
        },
        borderTopWidth: {
          type: ["string", "number"],
        },
      },
      type: "object",
    },
    {
      properties: {
        borderBottomLeftRadius: {
          anyOf: [
            {
              pattern: "^.*%$",
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
        borderBottomRightRadius: {
          anyOf: [
            {
              pattern: "^.*%$",
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
        borderBottomWidth: {
          type: "number",
        },
        borderLeftWidth: {
          type: "number",
        },
        borderRightWidth: {
          type: "number",
        },
        borderTopLeftRadius: {
          anyOf: [
            {
              pattern: "^.*%$",
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
        borderTopRightRadius: {
          anyOf: [
            {
              pattern: "^.*%$",
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
        borderTopWidth: {
          type: "number",
        },
      },
      type: "object",
    },
    {
      properties: {
        backgroundColor: {
          type: "string",
        },
        color: {
          type: "string",
        },
        opacity: {
          type: "number",
        },
      },
      type: "object",
    },
    {
      properties: {
        height: {
          type: ["string", "number"],
        },
        maxHeight: {
          type: ["string", "number"],
        },
        maxWidth: {
          type: ["string", "number"],
        },
        minHeight: {
          type: ["string", "number"],
        },
        minWidth: {
          type: ["string", "number"],
        },
        width: {
          type: ["string", "number"],
        },
      },
      type: "object",
    },
    {
      properties: {
        height: {
          anyOf: [
            {
              pattern: "^.*%$",
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
        maxHeight: {
          anyOf: [
            {
              pattern: "^.*%$",
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
        maxWidth: {
          anyOf: [
            {
              pattern: "^.*%$",
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
        minHeight: {
          anyOf: [
            {
              pattern: "^.*%$",
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
        minWidth: {
          anyOf: [
            {
              pattern: "^.*%$",
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
        width: {
          anyOf: [
            {
              pattern: "^.*%$",
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
      },
      type: "object",
    },
    {
      properties: {
        alignContent: {
          $ref: "#/definitions/AlignContent",
        },
        alignItems: {
          $ref: "#/definitions/AlignItems",
        },
        alignSelf: {
          $ref: "#/definitions/AlignSelf",
        },
        flexBasis: {
          type: ["string", "number"],
        },
        flexDirection: {
          $ref: "#/definitions/FlexDirection",
        },
        flexFlow: {
          type: ["string", "number"],
        },
        flexGrow: {
          type: ["string", "number"],
        },
        flexShrink: {
          type: ["string", "number"],
        },
        flexWrap: {
          $ref: "#/definitions/FlexWrap",
        },
        justifyContent: {
          $ref: "#/definitions/JustifyContent",
        },
        justifySelf: {
          type: "string",
        },
      },
      type: "object",
    },
    {
      properties: {
        flexGrow: {
          type: "number",
        },
        flexShrink: {
          type: "number",
        },
      },
      type: "object",
    },
    {
      properties: {
        columnGap: {
          anyOf: [
            {
              pattern: "^.*%$",
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
        rowGap: {
          anyOf: [
            {
              pattern: "^.*%$",
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
      },
      type: "object",
    },
    {
      properties: {
        aspectRatio: {
          type: ["string", "number"],
        },
        bottom: {
          type: ["string", "number"],
        },
        display: {
          $ref: "#/definitions/Display",
        },
        left: {
          type: ["string", "number"],
        },
        overflow: {
          const: "hidden",
          type: "string",
        },
        position: {
          $ref: "#/definitions/Position",
        },
        right: {
          type: ["string", "number"],
        },
        top: {
          type: ["string", "number"],
        },
        zIndex: {
          type: ["string", "number"],
        },
      },
      type: "object",
    },
    {
      properties: {
        aspectRatio: {
          type: "number",
        },
        bottom: {
          type: "number",
        },
        left: {
          type: "number",
        },
        right: {
          type: "number",
        },
        top: {
          type: "number",
        },
        zIndex: {
          type: "number",
        },
      },
      type: "object",
    },
    {
      properties: {
        marginBottom: {
          type: ["string", "number"],
        },
        marginLeft: {
          type: ["string", "number"],
        },
        marginRight: {
          type: ["string", "number"],
        },
        marginTop: {
          type: ["string", "number"],
        },
      },
      type: "object",
    },
    {
      properties: {
        marginBottom: {
          anyOf: [
            {
              pattern: "^.*%$",
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
        marginLeft: {
          anyOf: [
            {
              pattern: "^.*%$",
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
        marginRight: {
          anyOf: [
            {
              pattern: "^.*%$",
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
        marginTop: {
          anyOf: [
            {
              pattern: "^.*%$",
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
      },
      type: "object",
    },
    {
      properties: {
        paddingBottom: {
          type: ["string", "number"],
        },
        paddingLeft: {
          type: ["string", "number"],
        },
        paddingRight: {
          type: ["string", "number"],
        },
        paddingTop: {
          type: ["string", "number"],
        },
      },
      type: "object",
    },
    {
      properties: {
        paddingBottom: {
          anyOf: [
            {
              pattern: "^.*%$",
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
        paddingLeft: {
          anyOf: [
            {
              pattern: "^.*%$",
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
        paddingRight: {
          anyOf: [
            {
              pattern: "^.*%$",
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
        paddingTop: {
          anyOf: [
            {
              pattern: "^.*%$",
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
      },
      type: "object",
    },
    {
      properties: {
        objectFit: {
          type: "string",
        },
        objectPositionX: {
          type: ["string", "number"],
        },
        objectPositionY: {
          type: ["string", "number"],
        },
      },
      type: "object",
    },
    {
      properties: {
        objectPositionX: {
          type: "number",
        },
        objectPositionY: {
          type: "number",
        },
      },
      type: "object",
    },
    {
      properties: {
        direction: {
          enum: ["ltr", "rtl"],
          type: "string",
        },
        fontFamily: {
          anyOf: [
            {
              items: {
                type: "string",
              },
              type: "array",
            },
            {
              type: "string",
            },
          ],
        },
        fontSize: {
          type: ["string", "number"],
        },
        fontStyle: {
          $ref: "#/definitions/FontStyle",
        },
        fontWeight: {
          $ref: "#/definitions/FontWeight",
        },
        letterSpacing: {
          type: ["string", "number"],
        },
        lineHeight: {
          type: ["string", "number"],
        },
        maxLines: {
          type: "number",
        },
        textAlign: {
          $ref: "#/definitions/TextAlign",
        },
        textDecoration: {
          $ref: "#/definitions/TextDecoration",
        },
        textDecorationColor: {
          type: "string",
        },
        textDecorationStyle: {
          type: "string",
        },
        textIndent: {},
        textOverflow: {
          const: "ellipsis",
          type: "string",
        },
        textTransform: {
          $ref: "#/definitions/TextTransform",
        },
        verticalAlign: {
          $ref: "#/definitions/VerticalAlign",
        },
      },
      type: "object",
    },
    {
      properties: {
        fontSize: {
          type: "number",
        },
        fontWeight: {
          type: "number",
        },
        letterSpacing: {
          type: "number",
        },
        lineHeight: {
          type: "number",
        },
      },
      type: "object",
    } /*
      {
          "$ref": "#/definitions/Omit<TransformExpandedStyle,\"transform\">"
      },*/,
    {
      //TransformSafeStyle
      properties: {
        gradientTransform: {
          items: {
            //TODO: Add transform types
            // $ref: "#/definitions/Transform",
            anyOf: [
              { $ref: "#/definitions/ScaleTransform" },
              { $ref: "#/definitions/TranslateTransform" },
              { $ref: "#/definitions/RotateTransform" },
              { $ref: "#/definitions/SkewTransform" },
              { $ref: "#/definitions/MatrixTransform" },
            ],
          },
          type: "array",
        },
        transform: {
          items: {
            //TODO add transform types
            //$ref: "#/definitions/Transform",
            anyOf: [
              { $ref: "#/definitions/ScaleTransform" },
              { $ref: "#/definitions/TranslateTransform" },
              { $ref: "#/definitions/RotateTransform" },
              { $ref: "#/definitions/SkewTransform" },
              { $ref: "#/definitions/MatrixTransform" },
            ],
          },
          type: "array",
        },
        transformOriginX: {
          anyOf: [
            {
              pattern: "^.*%$",
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
        transformOriginY: {
          anyOf: [
            {
              pattern: "^.*%$",
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
      },
      type: "object",
    },
    {
      $ref: "#/definitions/SvgSafeStyle",
    },
    {
      properties: {
        fillOpacity: {
          type: "number",
        },
        strokeOpacity: {
          type: "number",
        },
        strokeWidth: {
          type: "number",
        },
      },
      type: "object",
    },
  ],
  definitions: {
    AlignContent: {
      enum: [
        "center",
        "flex-end",
        "flex-start",
        "space-around",
        "space-between",
        "space-evenly",
        "stretch",
      ],
      type: "string",
    },
    AlignItems: {
      enum: ["baseline", "center", "flex-end", "flex-start", "stretch"],
      type: "string",
    },
    AlignSelf: {
      enum: ["auto", "baseline", "center", "flex-end", "flex-start", "stretch"],
      type: "string",
    },
    BorderStyleValue: {
      enum: ["dashed", "dotted", "solid"],
      type: "string",
    },
    Display: {
      enum: ["flex", "none"],
      type: "string",
    },
    FlexDirection: {
      enum: ["column", "column-reverse", "row", "row-reverse"],
      type: "string",
    },
    FlexWrap: {
      enum: ["nowrap", "wrap", "wrap-reverse"],
      type: "string",
    },
    FontStyle: {
      enum: ["italic", "normal", "oblique"],
      type: "string",
    },
    FontWeight: {
      type: ["string", "number"],
    },
    JustifyContent: {
      enum: [
        "center",
        "flex-end",
        "flex-start",
        "space-around",
        "space-between",
        "space-evenly",
      ],
      type: "string",
    },
    /*"Omit<TransformExpandedStyle,\"transform\">": {
          "properties": {
              "gradientTransform": {
                  "anyOf": [
                      {
                          "items": {
                              "$ref": "#/definitions/Transform"
                          },
                          "type": "array"
                      },
                      {
                          "type": "string"
                      }
                  ]
              },
              "transformOriginX": {
                  "type": [
                      "string",
                      "number"
                  ]
              },
              "transformOriginY": {
                  "type": [
                      "string",
                      "number"
                  ]
              }
          },
          "type": "object"
      },*/
    Position: {
      enum: ["absolute", "relative", "static"],
      type: "string",
    },
    SvgSafeStyle: {
      // Edited:
      // renamed from SvgStyle, changed accepted types
      // from string or number to number for
      // strokeWidth, fillOpacity and strokeOpacity
      // Also added empty required array

      properties: {
        clipPath: {
          type: "string",
        },
        dominantBaseline: {
          enum: [
            "auto",
            "central",
            "hanging",
            "mathematical",
            "middle",
            "text-after-edge",
            "text-before-edge",
          ],
          type: "string",
        },
        fill: {
          type: "string",
        },
        fillOpacity: {
          type: "number",
        },
        fillRule: {
          enum: ["evenodd", "nonzero"],
          type: "string",
        },
        stroke: {
          type: "string",
        },
        strokeDasharray: {
          type: "string",
        },
        strokeLinecap: {
          enum: ["butt", "round", "square"],
          type: "string",
        },
        strokeLinejoin: {
          enum: ["bevel", "butt", "miter", "round", "square"],
          type: "string",
        },
        strokeOpacity: {
          type: "number",
        },
        strokeWidth: {
          type: "number",
        },
        textAnchor: {
          enum: ["end", "middle", "start"],
          type: "string",
        },
        visibility: {
          enum: ["collapse", "hidden", "visible"],
          type: "string",
        },
      },
      type: "object",
      required: [],
    },
    TextAlign: {
      enum: ["center", "justify", "left", "right"],
      type: "string",
    },
    TextDecoration: {
      enum: [
        "line-through",
        "line-through underline",
        "none",
        "underline",
        "underline line-through",
      ],
      type: "string",
    },
    TextTransform: {
      enum: ["capitalize", "lowercase", "none", "uppercase", "upperfirst"],
      type: "string",
    },
    /*Transform: {
      anyOf: [
     
      ** Removed and replaced by individual transform types **

    */
    ScaleTransform: {
      properties: {
        operation: {
          const: "scale",
          type: "string",
        },
        value: {
          items: {
            type: "number",
          },
          maxItems: 2,
          minItems: 2,
          type: "array",
        },
      },
      required: ["operation", "value"],
      type: "object",
    },
    TranslateTransform: {
      properties: {
        operation: {
          const: "translate",
          type: "string",
        },
        value: {
          items: {
            type: "number",
          },
          maxItems: 2,
          minItems: 2,
          type: "array",
        },
      },
      required: ["operation", "value"],
      type: "object",
    },
    RotateTransform: {
      properties: {
        operation: {
          const: "rotate",
          type: "string",
        },
        value: {
          items: {
            type: "number",
          },

          maxItems: 1,
          minItems: 1,
          type: "array",
        },
      },
      required: ["operation", "value"],
      type: "object",
    },
    SkewTransform: {
      properties: {
        operation: {
          const: "skew",
          type: "string",
        },
        value: {
          items: {
            type: "number",
          },
          maxItems: 2,
          minItems: 2,
          type: "array",
        },
      },
      required: ["operation", "value"],
      type: "object",
    },
    MatrixTransform: {
      properties: {
        operation: {
          const: "matrix",
          type: "string",
        },
        value: {
          items: {
            type: "number",
          },
          maxItems: 6,
          minItems: 6,
          type: "array",
        },
      },
      required: ["operation", "value"],
      type: "object",
    },
    VerticalAlign: {
      enum: ["sub", "super"],
      type: "string",
    },
  },
};

const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  strict: true,
  allowUnionTypes: true,
});

export const validateStyle = ajv.compile(styleSchema);

export const validateStyleKey = ajv.compile(styleKeySchema);

export const validateSafeStyle = ajv.compile(safeStyleSchema);
