import * as carto from '../../../../src/';
import * as util from '../../util';

describe('Layer', () => {
    let source, div, viz, viz2, layer, map;

    beforeEach(() => {
        const setup = util.createMap('map');
        div = setup.div;
        map = setup.map;

        source = new carto.source.GeoJSON(featureJSON);
        viz = new carto.Viz(`
            @myColor: red
            color: @myColor
        `);
        viz2 = new carto.Viz(`
            color: blue
        `);
        layer = new carto.Layer('layer', source, viz);
        layer.addTo(map);
    });

    describe('.blendToViz', () => {
        it('should resolve the Promise with a valid viz', (done) => {
            layer.on('loaded', () => {
                layer.blendToViz(viz2).then(done);
            });
        });
    });

    afterEach(() => {
        document.body.removeChild(div);
    });

    const featureJSON = {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [0, 0]
        },
        properties: {}
    };
});