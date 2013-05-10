#node-ObjTree.js

node-ObjTree.js is a parser/generater for XML source code and JavaScript object. The original version is [XML.ObjTree](http://www.kawa.net/works/js/xml/objtree-e.html) developed by Yusuke Kawasaki. It is modified by Ronald Ranauro so that it can be used both in the [node.js](http://nodejs.org) and browser.

##Download

The source code is available for download from [GitHub](https://github.com/rranauro/node-ObjTree). Besides that, you can also install using Node Package Manager [npm](https://npmjs.org):

    npm install node-ObjTree

##Documentation

* [XML.ObjTree](#XML.ObjTree)
* [parseXML](#parseXML)
* [attr_prefix](#attr_prefix)
* [force_array](#force_array)
* [writeXML](#writeXML)

<a name="XML.ObjTree" />
### XML.ObjTree()

Initialize and return a new XML.ObjTree object.

__Example:__

    xotree = new XML.ObjTree()

<a name="parseXML" />
### parseXML(xml)

Load an XML document using the supplied string and return its JavaScript object converted. 

__Example:__

    objtree_xml = '
    <?xml version="1.0" encoding="UTF-8"?>
    <family name="Kawasaki">
    <father>Yasuhisa</father>
    <mother>Chizuko</mother>
    <children>
    <girl>Shiori</girl>
    <boy>Yusuke</boy>
    <boy>Kairi</boy>
    </children>
    </family>';
    
    var xotree_out = xotree.parseXML( objtree_xml );
    
__Result:__

    xctree_out == 
    {
      'family': {
           '-name':    'Kawasaki',
           'father':   'Yasuhisa',
           'mother':   'Chizuko',
           'children': {
               'girl': 'Shiori',
               'boy': [
                   'Yusuke',
                   'Kairi'
               ]
           }
       }
    }
* How to get the attribute of an element:

__Example:__

    xotree_out.family['-name'];

__Result:__

    Kawasaki
    
* How to get the text of an element:

__Example:__

    xotree_out.family.father
    xotree_out.family.children.boy[1]

__Result:__

    Yasuhisa
    Kairi
    
<a name="attr_prefix" />
### attr_prefix

Set the prefix character which is inserted before each attribute names. Default is '-'.

__Example:__

    xotree.attr_prefix = '@';
    xotree_out = xotree.parseXML( objtree_xml );
    xotree_out.family['@name'];

__Result:__

    Kawasaki
    
<a name="force_array" />
### force_array

Specify a list of element names which should always be forced into an array representation. The default value is null.

__Example:__

    xotree.force_array = ['boy', 'father'];
    xotree_out = xotree.parseXML( objtree_xml );
    xotree_out.family.father //is an array now
    xotree_out.family.father[0]

__Result:__

    ['Yasuhisa']
    Yasuhisa

     xctree_out == 
    {
      'family': {
           '-name':    'Kawasaki',
           'father':   ['Yasuhisa'],
           'mother':   'Chizuko',
           'children': {
               'girl': 'Shiori',
               'boy': [
                   'Yusuke',
                   'Kairi'
               ]
           }
       }
    }
    
<a name="writeXML" />
### writeXML(json)

Parse a JavaScript object tree and returns its XML source string generated.

__Example:__

    var xml_out = xotree.writeXML( objtree_json )

__Result:__

    xml_out =='
    <?xml version="1.0" encoding="UTF-8"?>
    <family name="Kawasaki">
    <father>Yasuhisa</father>
    <mother>Chizuko</mother>
    <children>
    <girl>Shiori</girl>
    <boy>Yusuke</boy>
    <boy>Kairi</boy>
    </children>
    </family>';
    
    
 
