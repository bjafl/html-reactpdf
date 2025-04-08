
import { Rule, walk, parse, generate, Declaration, CssNode } from 'css-tree';
import { kebabToCamelCase } from './cssUtils';


export interface ParsedCssStyles {
    [selector: string]: {
        [property: string]: string;
    };
}
export function parseCssNode(cssString: string) {
  // Parse the CSS string into an AST
  const ast = parse(cssString);
  const rules = getNodeRules(ast);
  const style: ParsedCssStyles = {};
  rules.forEach((rule) => {
    const declarations = getNodeDeclarations(rule);
    const selector = generate(rule.prelude);
    const parsedDecl: Record<string, string> = {};
    declarations.forEach((declaration) => {
      const property = declaration.property;
      const value = declaration.value;
      if ('value' in value) {
        const camelCaseProperty = kebabToCamelCase(property);
        parsedDecl[camelCaseProperty] = generate(value);
      }
    });
    style[selector] = parsedDecl;
  });
  return style;
}

function getNodeDeclarations(node: CssNode): Declaration[] {
    const declarations: Declaration[] = [];
    walk(node, {
      visit: 'Declaration',
      enter(decl) {
        declarations.push(decl);
      }
    });
    return declarations;
  }

function getNodeRules(node: CssNode): Rule[] {
    const rules: Rule[] = [];
    walk(node, {
      visit: 'Rule',
      enter(rule) {
        rules.push(rule);
      }
    });
    return rules;
  }

  /*
function getNodeAtRules(node: CssNode): Atrule[] {
    const atRules: Atrule[] = [];
    walk(node, {
      visit: 'Atrule',
      enter(atRule) {
        atRules.push(atRule);
      }
    });
    return atRules;
  }
  */