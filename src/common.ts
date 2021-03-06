import { Chars } from './chars';
import { Statement, ExpressionStatement, Literal, Expression, Pattern } from './estree';
import { Token } from './token';
import { Flags, Context } from './masks';

export const hasOwn = Object.prototype.hasOwnProperty;

export function tryCreate(pattern: string, flags: string) {
    try {
        return new RegExp(pattern, flags);
    } catch (e) {
        return null;
    }
}

/**
 * Convert code points
 * @param codePoint
 */
export function fromCodePoint(codePoint: Chars): string {
    if (codePoint <= 0xFFFF) return String.fromCharCode(codePoint);
    return String.fromCharCode(((codePoint - 0x10000) >> 10) + 0x0D800, ((codePoint - 0x10000) & (1024 - 1)) + 0x0DC00);
}

export function toHex(code: Chars): number {
    if (code < Chars.Zero) return -1;
    if (code <= Chars.Nine) return code - Chars.Zero;
    if (code < Chars.UpperA) return -1;
    if (code <= Chars.UpperF) return code - Chars.UpperA + 10;
    if (code < Chars.LowerA) return -1;
    if (code <= Chars.LowerF) return code - Chars.LowerA + 10;
    return -1;
}

/**
 * Returns true if the "node" contains a directive prologue
 *
 * @param node Statement
 */
/**
 * Returns true if the "node" contains a directive prologue
 *
 * @param node Statement
 */
export function isDirective(node: Statement): node is ExpressionStatement & {
    expression: Literal & {
        value: string
    };
} {
    return node.type === 'ExpressionStatement' &&
        node.expression.type === 'Literal' &&
        typeof node.expression.value === 'string';
}

/**
 * Returns true if match
 *
 * @param mask number
 * @param flags number
 */
export function hasMask(mask: number, flags: number) {
    return (mask & flags) === flags;
}

// Fully qualified element name, e.g. <svg:path> returns "svg:path"
export function getQualifiedJSXName(elementName: any): any{
    switch (elementName.type) {
        case 'JSXIdentifier':
            return elementName.name;
        case 'JSXNamespacedName':
            return elementName.namespace + ':' + elementName.name;
        case 'JSXMemberExpression':
            return (
                getQualifiedJSXName(elementName.object) + '.' +
                getQualifiedJSXName(elementName.property)
            );
       /* istanbul ignore next */
        default:
            // ignore
    }
}

export function isValidDestructuringAssignmentTarget(expr: Expression | Pattern): boolean {
    switch (expr.type) {
        case 'Identifier':
        case 'ArrayExpression':
        case 'ArrayPattern':
        case 'ObjectExpression':
        case 'ObjectPattern':
        case 'MemberExpression':
        case 'ClassExpression':
        case 'CallExpression':
        case 'TemplateLiteral':
        case 'AssignmentExpression':
        case 'NewExpression':
            return true;
        default:
            return false;
    }
}

export function isValidSimpleAssignmentTarget(expr: Expression | Pattern): boolean {
    switch (expr.type) {
        case 'Identifier':
        case 'MemberExpression':
            return true;
        default:
            return false;
    }
}

export function isKeyword(context: Context, t: Token): boolean {
    switch (t) {
        case Token.AsKeyword:
        case Token.AsyncKeyword:
        case Token.BreakKeyword:
        case Token.CaseKeyword:
        case Token.CatchKeyword:
        case Token.ClassKeyword:
        case Token.ConstKeyword:
        case Token.ConstructorKeyword:
        case Token.ContinueKeyword:
        case Token.DebuggerKeyword:
        case Token.DefaultKeyword:
        case Token.DeleteKeyword:
        case Token.DoKeyword:
        case Token.ElseKeyword:
        case Token.ExportKeyword:
        case Token.ExtendsKeyword:
        case Token.FalseKeyword:
        case Token.FinallyKeyword:
        case Token.ForKeyword:
        case Token.EnumKeyword:
        case Token.FromKeyword:
        case Token.FunctionKeyword:
        case Token.GetKeyword:
        case Token.IfKeyword:
        case Token.ImplementsKeyword:
        case Token.ImportKeyword:
        case Token.InKeyword:
        case Token.InstanceofKeyword:
        case Token.InterfaceKeyword:
        case Token.LetKeyword:
        case Token.NewKeyword:
        case Token.NullKeyword:
        case Token.OfKeyword:
        case Token.PackageKeyword:
        case Token.PrivateKeyword:
        case Token.ProtectedKeyword:
        case Token.PublicKeyword:
        case Token.ReturnKeyword:
        case Token.SetKeyword:
        case Token.StaticKeyword:
        case Token.SuperKeyword:
        case Token.SwitchKeyword:
        case Token.ThisKeyword:
        case Token.ThrowKeyword:
        case Token.TrueKeyword:
        case Token.TryKeyword:
        case Token.TypeofKeyword:
        case Token.VarKeyword:
        case Token.VoidKeyword:
        case Token.WhileKeyword:
        case Token.WithKeyword:
            return true;
        default:
            return false;
    }
}