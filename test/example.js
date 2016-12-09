var ObjTree = require('../index');
var test = require('tape');
var _ = require('underscore');

var objtree_json = {
    'family': {
        '@name':    'Kawasaki',
        'father':   'Yasuhisa',
        'mother':   'Chizuko',
        'children': {
            'girl': ['Shiori'],
            'boy': [
                'Yusuke',
                'Kairi'
            ]
        }
    }
}
, objtree_xml = '<?xml version="1.0" encoding="UTF-8"?><family name="Kawasaki"><father>Yasuhisa</father><mother>Chizuko</mother><children><girl>Shiori</girl><boy>Yusuke</boy><boy>Kairi</boy></children></family>'
, xotree = new ObjTree()
, xotree_out;

// tests to convert XML strings to JSON objects
xotree.attr_prefix = '@';
xotree_out = xotree.parseXML( objtree_xml );

test('xotree-test', function(t) {
	t.plan(6);
	
	t.equal(xotree_out.family['@name'], 'Kawasaki');
	t.equal(typeof xotree_out.family.children.boy, 'object');
	t.equal(typeof xotree_out.family.children.girl, 'string');

	xotree.force_array = ['boy', 'girl'];
	xotree_out = xotree.parseXML( objtree_xml );
	t.equal(typeof xotree_out.family.children.girl, 'object');
	t.equal(_.isEqual(objtree_json, xotree.parseXML( objtree_xml )), true);
	// round trip support
	t.equal(_.isEqual(xotree.parseXML( xotree.writeXML( objtree_json )), xotree.parseXML( objtree_xml )), true);	
});

