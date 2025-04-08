import { Style as PDFStyle } from "@react-pdf/stylesheet";
import { getUlSymbol, getOlSymbol } from "./utils";
import {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  Image,
  Line,
  LinearGradient,
  Link,
  Path,
  Polygon,
  Polyline,
  RadialGradient,
  Rect,
  Stop,
  Svg,
  Text,
  Tspan,
  View,
} from "@react-pdf/renderer";
import { kebabToCamelCase } from "../styles/cssUtils";
import Table from "../table/Table";
import TableRow from "../table/TableRow";
import TableCell from "../table/TableCell";


type ElementRenderer = (props: ElementRendererProps) => React.ReactNode;
//React.FC<React.PropsWithChildren<ElementRendererProps>>;
//({}: ElementRendererProps) => React.ReactNode;
export interface ElementRendererProps {
  element: HTMLElement;
  childIndex: number;
  style: PDFStyle | (PDFStyle & LiStyles);
  children: React.ReactNode;
}
export interface LiStyles {
  li_bullet: PDFStyle;
  li_content: PDFStyle;
}
export interface ElementRenderers {
  [key: string]: ElementRenderer;
}

export const defaultRenderer: ElementRenderer = (props) => {
  const { style, children } = props;
  return <View style={style}>{children}</View>;
};

export type WrapperRenderer = (
  Wrapper: React.ElementType,
  renderer: ElementRendererProps
) => React.ReactElement;

export const renderSvgs: WrapperRenderer = (
  Wrapper,
  { element, style, children }
) => {
  return (
    <Wrapper
      {...Array.from(element?.attributes).reduce(
        (acc, { name, value }) => ({ ...acc, [kebabToCamelCase(name)]: value }),
        {} as Record<string, string>
      )}
      {...style}
    >
      {children}
    </Wrapper>
  );
};

const skip: ElementRenderer = () => null;
const forward: ElementRenderer = ({ children }) => children;

export const defaultElementRenderers: ElementRenderers = {
  // Elements to skip
  style: skip,
  script: skip,
  noscript: skip,
  meta: skip,
  link: skip,
  
  // Document structure elements
  html: forward,
  head: skip,
  body: forward,
  
  // Headings
  h1: ({ style, children }) => <Text style={style}>{children}</Text>,
  h2: ({ style, children }) => <Text style={style}>{children}</Text>,
  h3: ({ style, children }) => <Text style={style}>{children}</Text>,
  h4: ({ style, children }) => <Text style={style}>{children}</Text>,
  h5: ({ style, children }) => <Text style={style}>{children}</Text>,
  h6: ({ style, children }) => <Text style={style}>{children}</Text>,
  
  // Block elements
  div: ({ style, children }) => <View style={style}>{children}</View>,
  p: ({ style, children }) => <Text style={style}>{children}</Text>,
  
  // Inline elements
  span: ({ style, children }) => <Text style={style}>{children}</Text>,
  b: ({ style, children }) => <Text style={{...style, fontWeight: 'bold'}}>{children}</Text>,
  strong: ({ style, children }) => <Text style={{...style, fontWeight: 'bold'}}>{children}</Text>,
  i: ({ style, children }) => <Text style={{...style, fontStyle: 'italic'}}>{children}</Text>,
  em: ({ style, children }) => <Text style={{...style, fontStyle: 'italic'}}>{children}</Text>,
  u: ({ style, children }) => <Text style={{...style, textDecoration: 'underline'}}>{children}</Text>,
  s: ({ style, children }) => <Text style={{...style, textDecoration: 'line-through'}}>{children}</Text>,
  code: ({ style, children }) => <Text style={style}>{children}</Text>,
  pre: ({ style, children }) => <View style={{...style/*, whiteSpace: 'pre-wrap'*/}}><Text>{children}</Text></View>,
  mark: ({ style, children }) => <Text style={{...style, backgroundColor: '#ffff00'}}>{children}</Text>,
  small: ({ style, children }) => <Text style={{...style, fontSize: '0.8em'}}>{children}</Text>,
  sub: ({ style, children }) => <Text style={{...style, fontSize: '0.8em', verticalAlign: 'sub'}}>{children}</Text>,
  sup: ({ style, children }) => <Text style={{...style, fontSize: '0.8em', verticalAlign: 'super'}}>{children}</Text>,
  // List elements
  ul: ({ style, children }) => <View style={style}>{children}</View>,
  ol: ({ style, children }) => <View style={style}>{children}</View>,
  dl: ({ style, children }) => <View style={style}>{children}</View>,
  dt: ({ style, children }) => <Text style={style}>{children}</Text>,
  dd: ({ style, children }) => <View style={style}>{children}</View>,
  
  // Semantic elements
  article: ({ style, children }) => <View style={style}>{children}</View>,
  section: ({ style, children }) => <View style={style}>{children}</View>,
  aside: ({ style, children }) => <View style={style}>{children}</View>,
  header: ({ style, children }) => <View style={style}>{children}</View>,
  footer: ({ style, children }) => <View style={style}>{children}</View>,
  nav: ({ style, children }) => <View style={style}>{children}</View>,
  main: ({ style, children }) => <View style={style}>{children}</View>,
  
  // Other block elements
  blockquote: ({ style, children }) => <View style={style}>{children}</View>,
  figure: ({ style, children }) => <View style={style}>{children}</View>,
  figcaption: ({ style, children }) => <Text style={style}>{children}</Text>,
  hr: ({ style }) => <View style={{...style, height: 1, backgroundColor: '#000000'}} />,
  
  // The inline formatting elements like code, pre, mark, small, sub, sup are defined above
  
  li: ({ element, style, children }) => {
    /*/const bulletStyles = stylesheets.map((stylesheet) => stylesheet.li_bullet);
      const contentStyles = stylesheets.map(
        (stylesheet) => stylesheet.li_content
      );*/
    const list: HTMLOListElement | HTMLUListElement | null =
      element.closest("ol, ul");
    const ordered = list instanceof HTMLOListElement;
    const liElem = element as HTMLLIElement;

    const listStyleType =
      liElem.style.listStyleType ||
      liElem.style.listStyle ||
      list?.style.listStyleType ||
      list?.style.listStyle ||
      "";

    let bullet;
    if (listStyleType.includes("none")) {
      bullet = false;
    } else if (listStyleType.includes("url(")) {
      const imgSrcMatch = listStyleType.match(/\((.*?)\)/);
      const imgSrc = imgSrcMatch ? imgSrcMatch[1].replace(/(['"])/g, "") : "";
      bullet = <Image src={imgSrc} />;
    } else if (ordered) {
      const start = list.start || 1;
      let liNr = liElem.hasAttribute("value") ? liElem.value : undefined;
      if (!liNr) {
        liNr = start;
        let prevLi = liElem.previousElementSibling;
        while (prevLi) {
          if (prevLi instanceof HTMLLIElement) {
            if (prevLi.hasAttribute("value")) {
              liNr += prevLi.value - start;
              break;
            }
            liNr += 1;
          }
          prevLi = liElem.previousElementSibling;
        }
      }
      bullet = <Text>{getOlSymbol(liNr, listStyleType)}.</Text>;
    } else {
      bullet = <Text>{getUlSymbol(listStyleType)}</Text>;
    }

    return (
      <View style={style}>
        {bullet && <View style={(style as LiStyles).li_bullet}>{bullet}</View>}
        <View style={(style as LiStyles).li_content}>{children}</View>
      </View>
    );
  },
  a: ({ style, element, children }) => (
    <Link style={style} src={(element as HTMLAnchorElement).href}>
      {children}
    </Link>
  ),
  img: ({ style, element }) => (
    <Image
      style={style}
      source={{
        uri: (element as HTMLImageElement).src,
        body: null,
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }}
    />
  ),
  /*table: ({ element, style, children }) => {
      const tableStyles = element.style.reduce(
        (combined, tableStyle) => Object.assign(combined, tableStyle),
        {} as HtmlStyle
      );
      const overrides: HtmlStyle = {};
      if (
        !tableStyles.borderSpacing ||
        tableStyles.borderCollapse === 'collapse'
      ) {
        overrides.borderLeftWidth = 0;
        overrides.borderTopWidth = 0;
      }
  
      return <View style={[...style, overrides]}>{children}</View>;
    },
    tr: ({ style, children }) => (
      <View wrap={false} style={style}>
        {children}
      </View>
    ),*/
  table: ({ style, children }) => {
    return <Table style={style}>{children}</Table>;
  },
  thead: forward,
  tbody: forward,
  tr: ({ style, children }) => {
    return <TableRow style={style}>{children}</TableRow>;
  },
  td: ({ style, children }) => {
    return <TableCell style={style}>{children}</TableCell>;
  },
  th: ({ style, children }) => {
    return <TableCell style={style}>{children}</TableCell>;
  },
  br: ({ style }) => (
    <Text wrap={false} style={style}>
      {"\n"}
    </Text>
  ),
  svg: renderSvgs.bind(null, Svg),
  line: renderSvgs.bind(null, Line),
  polyline: renderSvgs.bind(null, Polyline),
  polygon: renderSvgs.bind(null, Polygon),
  path: renderSvgs.bind(null, Path),
  rect: renderSvgs.bind(null, Rect),
  circle: renderSvgs.bind(null, Circle),
  ellipse: renderSvgs.bind(null, Ellipse),
  text: renderSvgs.bind(null, Text),
  tspan: renderSvgs.bind(null, Tspan),
  g: renderSvgs.bind(null, G),
  stop: renderSvgs.bind(null, Stop),
  defs: renderSvgs.bind(null, Defs),
  clippath: renderSvgs.bind(null, ClipPath),
  lineargradient: renderSvgs.bind(null, LinearGradient),
  radialgradient: renderSvgs.bind(null, RadialGradient),
};