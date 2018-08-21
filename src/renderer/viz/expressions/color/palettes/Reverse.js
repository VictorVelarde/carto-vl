import Palette from './Palette';
import Base from '../../base';
import { implicitCast, checkMaxArguments } from '../../utils';

/**
 * Reverse the provided Palette.
 *
 * @param {Palette} palette - Numeric expression to compute the natural logarithm
 * @return {Palette}
 *
 * @example <caption>Invert a Palette.</caption>
 * const s = carto.expressions;
 * const viz = new carto.Viz({
 *   filter: s.ramp(s.prop('type'), s.reverse(s.palettes.PRISM));
 * });
 *
 * @example <caption>Invert a Palette. (String)</caption>
 * const viz = new carto.Viz(`
 *   color: ramp($type, reverse(PRISM))
 * `);
 *
 * @memberof carto.expressions
 * @name reverse
 * @function
 * @api
 */

export default function reverse (x) {
    checkMaxArguments(arguments, 1, 'reverse');
    x = implicitCast(x);
    if (x.type === 'palette') {
        return new ReversePalette(x);
    }
    return new ReverseArray(x);
}

class ReverseArray extends Base {
    constructor (array) {
        super({
            array
        });
        this.type = array.type;
    }
    get elems () {
        return [...this.array.elems].reverse();
    }
    get value () {
        return this.elems.map(c => c.value);
    }
    eval (feature) {
        return this.elems.map(c => c.eval(feature));
    }
}

class ReversePalette extends Palette {
    constructor (palette) {
        super(palette.name, palette.subPalettes);
        this.type = 'palette';
        this._originalPalette = palette;
        this.tags = palette.tags;
        this.subPalettes = new Proxy(palette.subPalettes, {
            get: (target, name) => {
                if (Number.isFinite(Number(name)) && Array.isArray(target[name])) {
                    return this._reversePalette(target[name]);
                }
                return target[name];
            }
        });
    }

    getLongestSubPalette () {
        return this._reversePalette(this._originalPalette.getLongestSubPalette());
    }

    _reversePalette (palette) {
        if (this.isQualitative()) {
            // Last color is 'others', therefore, we shouldn't change the order of that one
            const copy = [...palette];
            const others = copy.pop();
            return [...copy.reverse(), others];
        }
        return [...palette].reverse();
    }
}
