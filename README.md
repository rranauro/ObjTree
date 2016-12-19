# ObjTree

## Overview

Based on the original version is [XML.ObjTree](http://www.kawa.net/works/js/xml/objtree-e.html) 
developed by Yusuke Kawasaki. ObjTree.js is a parser/generater for XML source 
code and JavaScript objects. We modified it by testing for [node.js](http://nodejs.org) and adding 
[xmldom](https://github.com/jindw/xmldom.git), which emulates browser data structures on the 
server side. In this way ObjTree.js can be used in server applications and in the
browser. We changed nothing in Yusuke's code, though we include his documentation here for 
convenience.

##Methods

* [XML.ObjTree](#ObjTree)
* [parseXML](#parseXML)
* [attr_prefix](#attr_prefix)
* [force_array](#force_array)
* [soft_arrays](#soft_arraya)
* [writeXML](#writeXML)

<a name="XML.ObjTree" />
### ObjTree()

Initialize and return a new ObjTree object.

__Example:__

    xotree = new ObjTree()

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
   
<a name="soft_arrays" />
### soft_arrays
Eliminate the need for <code>force_array</code>

	xotree.soft_arrays = true; 

 
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
    
##Install

The source code is available for download from [GitHub](https://github.com/rranauro/js-ObjTree). Besides that, you can also install using Node Package Manager [npm](https://npmjs.org):

    npm install objtree
    
##License

Copyright (c) 2005-2006 Yusuke Kawasaki. All rights reserved.
This program is free software; you can redistribute it and/or
modify it under the Artistic license. Or whatever license I choose,
which I will do instead of keeping this documentation like it is.
 
