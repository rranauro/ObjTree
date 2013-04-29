/* ===================================================
 * boxspring.js v0.01
 * https://github.com/rranauro/boxspringjs
 * ===================================================
 * Copyright 2013 Incite Advisors, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

// regress.js -- wrapper for testing Boxspring toolkit library
/*jslint newcap: false, node: true, vars: true, white: true, nomen: true  */
/*global bx: true, _: true */

(function(Local) {
	"use strict";
	
	// regression test harness
	Local.Harness = function(sys, tests, onFinish, logFile) {
		var that = {}
			, status = {}
			, results = []
			, testRun = []
			, testList = _.isArray(tests) ? tests : [ tests ];
						
		testList.forEach(function(test) {
			status[test] = false;
		});
				
		var report = function (status) {
			sys.logf('Succeeded: (%d), Failed: (%d)', status.succeeded, status.failed);
			this.results.forEach(function(test) {
				sys.logf('  Module: %s \t\t%s', test.id, test.status);
			});				
		};
		that.report = report;

		var summarize = function () {
			var success = 0
				, failed = 0;

			_.map(status, function(test) {
				if (test===true) { success += 1; } else { failed += 1; }
			});

			return({
				'succeeded': success,
				'failed': failed,
				'test-list': testList,
				'test-run': testRun,
				'status': status,
				'did-not-run': _.difference(testList, testRun)
			});
		};
		that.summarize = summarize;

		var assert = function(testId, code, expected, info) {
			var notify = {}
				, pad = testId + '                    ';

			sys.logf('test-completed: %s \t%s \t%s \t%s', (code===expected), (code), expected, pad.substr(0,25)); 
			if (code!==expected && info) {
				sys.logf('\t%s - %s', code, info || '');
			}
			status[testId] = (code===expected);
			if (_.arrayFind(testId, testRun) === -1) { 
				testRun.push(testId);
				results.push({ 'id': testId, 'status': (code===expected) });
			}
			if (_.arrayFind(testId, testList) === -1) {
				throw 'testId: ' + testId + ' is not registered in testList.';
			}

			if (logFile) {
//				logFile.commit({'remaining-tests': _.difference(testList, testRun) });
			}

			if (testRun.length === testList.length) {
				if (_.isString(onFinish)) {
					sys.trigger(onFinish, summarize());
				}
			}
			return(code===expected);
		};
		that.assert = assert;

		var load = function (log) {
			var harness = this;

			testList.forEach(function(tag) {
				sys.on(tag, function (status) {
					harness.assert(tag, status.failed, 0, status);
				});				
			});
			return this;
		};
		that.load = load;

		var run = function (log) {
			
			testList.forEach(function(tag) {
				sys.trigger('/regress/'+tag, sys, tag, logFile);							
			});
			return this;
		};
		that.run = run;
		that.status = status;
		that.results = results;				
		return that;		
	};
	
	Local.regress = function (system) {
		var that = system || {}
			, log 
			, testList = [ 
				'system-ready',
				'list',
				'arith',
				'base-utils',
				'file-io',
				'boxspring'
				]
			, battery = Local.Harness(system, testList, '/regress/finished', log);
		
		that.init = function () {
			// Purpose: called by the system, to tell it what services this module provides
			system.on('/regress/start', function () {
				log = bx['log-events']().event('regress', 'system-'+ bx.date().docId());
				
				log.on('ready', function(r) {
					battery.load().assert('system-ready', true, true);
					battery.run();
				});
			}, bx);
			
			system.on('/regress/finished', function (status) {
				battery.report(status);
			});
			
			return ({ 
				'regress': {
					'start': { 
						'href': '/regress/start', 
						'rel': 'none'
					},
					'finished': { 
						'href': '/regress/finished', 
						'rel': 'none'
					}
				}
			});
		};
			
		system.on('/regress/base-utils', function(sys, onFinish, log) {
			// unit tests
			var testList = _.sortBy([
				'blank-date-test',
				'object-length-test',
				'arrayFind-test',
				'arrayFind-fail',
				'arrayMap',
				'exclude-with-strings',
				'exclude-with-array',
				'names-test',
				'select-test',
				'bfind-test',
				'toInt-test',
				'fetch-test-1',
				'fetch-test-2',
				'hfetch-test',
				'walk-test',
				'walk-hfetch-test',
				'date-key-test-1',
				'date-key-test-2',
				'date-key-test-3',
				'date-dateIn-1',
				'date-dateIn-2',
				'date-dateIn-3',
				'date-dateIn-4',
				'date-docId-test',
				'todays-date-test',
				'date-set-get-1',
				'date-set-get-2',
				'date-gt-1',
				'date-lt-1',
				'date-eq-1',
				'date-in-range-1',
				'date-in-range-2',
				'm2n-n2m-methods-1',
				'm2n-n2m-methods-2',
				'm2n-n2m-methods-3',
				'm2n-n2m-methods-4',
				'm2n-n2m-test',
				'btree-store-test',
				'get-rows-test',
				'get-rows-meta',
				'findall-test',
				'find-names-test',
				'reverse-lookup',
				'systemdb-queue',
				're-group-a1',
				're-group-a2',
				're-group-a3',
				're-group-a4',
				're-group-a5',
				'options-test-1',
				'options-test-2',
				'options-test-3',
				'options-test-4',
				'options-test-5',
				'options-test-6',				
				'options-test-7',
				'coerce-test-1',				
				'clean-test-1',
				'clean-test-2'

			], function (x) { return x; })
			, obj = {
				'var1': {
					'var2': {
						'var3': 'var3-value'
					},
					'var4': 'var4-value',
					'var6': 'another-value'
				},
				'var5': Date()
			}
			, testList2 = _.clone(testList)
			, tmp = 0
			, tmp2 = {}
			, msg = ''
			, nl = 3
			, t = Local.Harness(sys, testList, onFinish, log)
			, q = bx.Queue()
			, sample = function () {
					q.finish();
			}
			, today = bx.date();
			
			t.assert('arrayMap', _.difference(_.arrayMap(['a', 'b'], function(item) {
				return item;
			}), ['a', 'b']).length, 0); 

			t.assert('blank-date-test', 
				_.difference(bx.date().key(), 
					bx.date()
						.key()).length, 0);

			[1, 2, 3, 4, 5].forEach(function(item) {
				q.submit(sample, item);			
			});

			q.after(function() {
				t.assert('systemdb-queue', 1, 1);			
			});
			q.run();

			t.assert('object-length-test', _.objectLength(obj), 2);
			t.assert('arrayFind-test', _.arrayFind('arrayFind-test', testList2), 1);
			t.assert('arrayFind-fail', _.arrayFind('not-there', testList2), -1);
			t.assert('exclude-with-strings', 
				_.difference(_.keys(_.exclude(obj.var1, 'var4')), [ 'var2', 'var6' ]).length, 0);
			t.assert('exclude-with-array', 
				_.difference(_.keys(_.exclude(obj.var1, [ 'var2', 'var6', 'var-junk' ])), [ 'var4' ]).length, 0);
			t.assert('names-test', _.difference(_.names(obj), _.keys(obj)).length, 0);
			t.assert('select-test', 
				_.difference(_.keys(_.select(obj, ['var1', 'var5'])), _.keys(_.pick(obj, 'var1', 'var5'))).length, 0);
			tmp = 0;
			nl = 3;
			[ 
				_.arrayBfind(2, [0, 1, 2, 3, 4]),
				_.arrayBfind(7, [0, 1, 2, 3, 4]),
				_.arrayBfind(0, [0, 1, 2, 3, 4]),
				_.arrayBfind(4, [0, 1, 2, 3, 4]),
				_.arrayBfind("4", [0, 1, 2, 3, 4]),
				_.arrayBfind(7, [ { item: 0 }, { item: 7} ], function (x) { return x.item; } )
			].forEach(function(a) {
				var x = (a && a[0]) || null; 
				if (x===null) { nl-=1;}
				else if (_.has(x, 'item')) { tmp += x.item; }
				else { tmp += x;}
			});

			t.assert('bfind-test', tmp-nl, 13);
			t.assert('toInt-test', _.toInt("5") + _.toInt(4) + _.toInt(5.4), 14.4);

			tmp = [];
			['var1/var6', 'var1/var2/var3', '/var1/var5', 'var6'].forEach(function(path) {
				tmp.push(bx.Access(_.clone(obj)).fetch(path));
			});

			t.assert('hfetch-test', _.arrayIdentical(tmp,
				[ 'another-value', 'var3-value', undefined, 'another-value' ]), true);

			t.assert('fetch-test-1', _.keys(_.fetch(obj, ['varx', 'var2']))[0], 'var3');
			t.assert('fetch-test-2', _.fetch(obj, 'varx', 'var6')==='another-value', true);

			tmp = [];
			/*jslint unparam: true */
			_.walk(obj, function(item, name) {
				tmp.push(name);
			});
			/*jslint unparam: false */
			t.assert('walk-test', _.difference(tmp, ['var1','var2','var3','var4','var6','var5']).length,0);
			t.assert('date-key-test-1', 
				_.difference(bx.date({'format': 'mm yyyy', 'dateIn': 'January 2000'}).key('yyyy'),[2000]).length, 0);		
			// tests the hierarchy path from the walk function used as a selector for the hfetch
			_.walk(obj, function(v, k, path) {
				if (path === 'var1/var2/var3') {
					t.assert('walk-hfetch-test', v[k], _.hfetch(obj, path));
				}
			});

			t.assert('date-key-test-2', bx.date({'format': 'mm yyyy', 'dateIn': 'January 2000'}).key()[1], 2000);
			t.assert('date-key-test-3', bx.date({'format': 'mm dd yyyy', 'dateIn': 'February 28, 2011'}).key()[1], 28);
									
			tmp = true;
			bx.date().key().forEach(function(item) {
				if (typeof item==='undefined') { tmp = false; } 
			});
			t.assert('todays-date-test', tmp, true, bx.date().key());
			t.assert('m2n-n2m-methods-1', bx.date().n2m(7), 'aug');
			t.assert('m2n-n2m-methods-2', bx.date().m2n('August'), 7);
			t.assert('m2n-n2m-methods-3', 
				bx.date().m2n(bx.date().n2m()),
				bx.date().key()[2]);
			t.assert('m2n-n2m-methods-4', bx.date().m2n('DEC'), 11);
			
			tmp = 0;
			[
			'January 1970',
			'February 2000',
			'March 2000',
			'April 2000',
			'May 2000',
			'June 2000',
			'July 2000',
			'August 2000',
			'September 2000',
			'October 2000',
			'November 2000',
			'December 2000'
			].forEach(function(dat) {
				var d = bx.date({'format': 'mm yyyy', 'dateIn': dat });		
				tmp = d.m2n(d.n2m()) - d.getPart('mm');			
			});
			t.assert('m2n-n2m-test', tmp, 0);
			// formatting dates
			t.assert('date-dateIn-1', bx.date({'format': 'mm yyyy', 'dateIn': 'December 2012'}).print(), '11 2012');
			t.assert('date-dateIn-2', bx.date({'format': 'mm dd yyyy', 'dateIn': 'December 25, 2012'}).print('yyyy/dd/mm'), '2012/25/11');
			
			t.assert('date-dateIn-3', bx.date({'format': 'mm dd yyyy', 'dateIn': 'dec 7, 2012'}).print('mm/dd/yyyy'), '11/7/2012');
			t.assert('date-dateIn-4', bx.date({'format': 'mm-dd-yyyy', 'dateIn': '2-15-2012'}).print('mm yyyy'), '1 2012');

			t.assert('date-docId-test', _.arrayCompare(bx.date({'format': 'mm dd yyyy', 'dateIn': 'december 25, 2012' }).docId().split('-').slice(1), [ '2012', '11', '25']), true);

			today = bx.date({'dateIn': [2012, 6]})
				.setYear(2010)
				.setMonth(10)
				.setDate(15);
			t.assert('date-set-get-1', 
				_.difference([ today.getYear(), today.getMonth(), today.getDate(), today.print('mm-dd-yyyy') ], 
					[2010, 10, 15, '10-15-2010']).length, 0);

			today.setYear(2011)
				.setTime(today.valueOf());
			t.assert('date-set-get-2', today.print('mm-yyyy'), '10-2011');
			t.assert('date-gt-1', 
				bx.date({ 'dateIn': 'september 18, 2012'})
					.gt(bx.date({'dateIn': 'december 19, 2011'})), true);

			t.assert('date-lt-1', 
				bx.date({ 'dateIn': 'september 18, 2012'})
					.lt(bx.date({'dateIn': 'december 19, 2011'})), false);
					
			t.assert('date-eq-1', 
				bx.date({ 'dateIn': 'september 18, 2012'})
					.eq(bx.date({'dateIn': 'december 19, 2011'})), false);
			
			t.assert('date-in-range-1', 
				today.inRange(bx.date({'dateIn': [2010]}), bx.date({'dateIn': [ 2013 ]})), true);
																		
			t.assert('date-in-range-2', 
				today.inRange(bx.date({'dateIn': [2012]}), bx.date({'dateIn': [ 2013 ]})), false);
		
			// Btree tests
			tmp = Local.Btree();
			testList2.forEach(function(tag) {
				tmp.store(tag, Math.random());
			});
			// store, inorder, getName, getData
			tmp2 = false;
			tmp.inorder(function(name, value, node) {
				if (tmp2 === false) {
					tmp2 = !(name===node.getName() && value===node.getData());
					msg = name + ', ' + value;
				}
			});
			t.assert('btree-store-test', tmp2, false, msg);

			// find, set, get
			t.assert('find-names-test', tmp.find('names-test').set('new-val').get(), 'new-val');
			// getRows, length
			tmp2 = {};
			t.assert('get-rows-test', tmp.getRows(tmp2).rows.length, tmp.length());
			t.assert('get-rows-meta', (_.isArray(tmp2.rows) && 
												tmp2.Btree === tmp &&
												tmp2.rows.length===tmp2.total_rows), true);

			['a', 'b', 'c'].forEach(function(x) { tmp.store('names-test', x); });
			tmp2 = [];	
			tmp.findall('names-test').forEach(function(item) { tmp2.push(item.value); });
			t.assert('findall-test', 
				_.difference(tmp2, [ tmp.find('names-test').get(), 'a', 'b', 'c']).length, 0);

			tmp2 = [];
			[ 'new-val', 'a', 'b', 'c'].forEach(function(val) {
				tmp2.push(tmp.reverseLookup(val));
			});

			t.assert('reverse-lookup', 
			_.difference(tmp2, [ 'names-test', 'names-test', 'names-test', 'names-test']).length, 0);
			
			/* doc Object tests here */
			var a2 = _.flatten([ [ '1', 'a' ],
			  [ '1', 'b' ],
			  [ '1', 'x' ],
			  [ '1', 'y' ],
			  [ '2', 'a' ],
			  [ '2', 'b' ],
			  [ '2', 'x' ],
			  [ '2', 'y' ] ])
			, a3 = _.flatten([ [ '1', 'a', '00' ],
			  [ '1', 'a', '11' ],
			  [ '1', 'b', '00' ],
			  [ '1', 'b', '11' ],
			  [ '1', 'x', '00' ],
			  [ '1', 'x', '11' ],
			  [ '1', 'y', '00' ],
			  [ '1', 'y', '11' ],
			  [ '2', 'a', '00' ],
			  [ '2', 'a', '11' ],
			  [ '2', 'b', '00' ],
			  [ '2', 'b', '11' ],
			  [ '2', 'x', '00' ],
			  [ '2', 'x', '11' ],
			  [ '2', 'y', '00' ],
			  [ '2', 'y', '11' ] ]);

			t.assert('re-group-a1', _.difference(
				_.flatten(bx.Access().unGroup([['1', '2']])), 
				_.flatten([ [ '1' ], [ '2' ] ])).length, 0);	
			//console.log(_.flatten(bx.Access().unGroup([['1', '2']])), _.flatten([ [ '1' ], [ '2' ] ]));				

			t.assert('re-group-a2', _.difference(_.flatten(bx.Access().unGroup([['1', '2'],['a', 'b', 'x', 'y']])), a2).length, 0);
			t.assert('re-group-a3', _.difference(_.flatten(bx.Access().unGroup([['1', '2'],['a', 'b', 'x', 'y'],['00', '11']])), a3).length, 0);	
			t.assert('re-group-a4', _.difference(
				_.flatten(bx.Access().unGroup(['a', 'b', 'x', 'y'])), 
				_.flatten([ [ 'a' ], [ 'b' ], [ 'x' ], [ 'y' ] ])).length, 0);
			//console.log(bx.Access().unGroup([['a', 'b', 'x', 'y']]));
			t.assert('re-group-a5', _.difference(
				_.flatten(bx.Access().unGroup([[], ['a', 'b'], []])), 
				_.flatten([ [ '', 'a', '' ], [ '', 'b', '' ] ])).length, 0);
				
			// tests for 'options' helper
			var x = _.options({'a': 1, 'b': 2}, {'a': 5, 'b': 4, 'c': 3 });
			t.assert('options-test-1', _.isEqual(x.post(), {'a': 1, 'b': 2, 'c': 3}), true);
			t.assert('options-test-2', 
				_.isEqual(x.extend({'d': 4}).post(), {'a':1,'b':2,'c':3,'d':4}), true);
			t.assert('options-test-3', _.isEqual(x.pick('a', 'b'), {'a': 1, 'b': 2 }), true);
			t.assert('options-test-4', _.isEqual(x.pick(['a', 'b']), {'a': 1, 'b': 2 }), true);
			t.assert('options-test-5', 
				_.isEqual(x.update({'a': 2, 'd': 1}).post(), { a: 2, b: 2, c: 3, d: 1 }), true);
			t.assert('options-test-6', 
				_.isEqual(x.restore().post(), {'a': 1, 'b': 2, 'c': 3}), true);
			t.assert('options-test-7', 
				_.isEqual(x.defaults().post(), {'a': 5, 'b': 4, 'c': 3 }), true);
				
			t.assert('coerce-test-1', 
				_.isString(_.coerce('string', 0)) &&
				_.isNumber(_.coerce('number',"1")) &&
				_.isString(_.coerce('string')) &&
				_.isNumber(_.coerce('number')) &&
				_.isDate(_.coerce('date', new Date())) && 
				_.isDate(_.coerce('date', 'junk')) &&
				_.isBoolean(_.coerce('boolean', true)) &&
				_.isBoolean(_.coerce('boolean', 'false')) &&
				_.coerce('boolean', 'true'), true);
				
			t.assert('clean-test-1', 
				_.difference(_.values(_.clean({'a': 'yes', 'b': undefined, 'c': 'again!', 'd': undefined })),
					['yes', 'again!']).length, 0);
			t.assert('clean-test-2', _.difference(
				_.values(_.clean({'a': 'yes', 'b': undefined, 'c': 'again!', 'd': undefined }, 'yes')),
				[undefined, undefined, 'again!']).length, 0);	
		});
		
		system.on('/regress/list', function(syslib, onFinish, log) {
			var list = bx.List()
				, item1 = list.newItem({'name': 'a'})
				, item2 = list.newItem({'name': 'b'})
				, item3 = list.newItem({'name': 'three'})
				, item4 = list.newItem({'name': 'four'})
				, item5 = list.newItem({'name': 'five'})
				, item6 = list.newItem({'name': 'six'})
				, item7 = list.newItem({'name': 'seven'})
				, tmp1 = []
				, tmp2 = []
				, harness = Local.Harness(syslib, [
					'list-create',
					'list-insert-first',
					'list-insert-first-child',
					'list-insert-sibling',
					'list-siblings',
					'list-walk',
					'list-first-last',
					'list-sib-insert',
					'list-splice',
					'list-grand-parent',
					'list-caught' ], onFinish, log);
					
				//	verify the list
				harness.assert('list-create', list.hasOwnProperty('child'), _.has(list, 'sibling'));	
				// insert a child and be sure it got there
				list.insertChild(item1);
				harness.assert('list-insert-first', item1===list.firstChild(), true);
				// add another item, and be sure its a sibling of the first child (and the last child)
				list.insertChild(item2);
				harness.assert('list-insert-sibling', list.firstChild().sibling===list.lastChild(), true);
				// add another item in front and verify its insertion
				list.insertFirstChild(item3);
				harness.assert('list-insert-first-child', list.firstChild()===item3, true);
				// walk the tree and capture the names
				list.name = 'head';
				list.each(function() {
					tmp1.push(this && this.name);
				});
				harness.assert('list-walk', _.arrayCompare(['head', 'three', 'a', 'b'], tmp1), true, tmp1);
																
				// siblings
				list.lastChild().siblings(function(item) {
					tmp2.push(this && this.name);
				});	
				tmp1 = [];
				list.firstChild().siblings(function(item) {
					tmp1.push(this && this.name);
				});		
				harness.assert('list-siblings', _.arrayCompare(tmp1, tmp2), true);
				
				// firstSibling / lastSibling
				harness.assert('list-first-last', 
					item1.lastSibling().name==='b', 
					item1.firstSibling().name==='three');
				
				// inserting on sibling level
				item3.lastSibling().insertFirstSibling(item5);
				item2.firstSibling().insertLastSibling(item4);
				
				tmp1 = [];
				tmp2 = [];
				item3.siblings(function() {
					tmp1.push(this && this.name);
				});
				list.each(function() {
					tmp2.push(this && this.name);
				});
				harness.assert('list-sib-insert', _.arrayCompare(tmp1, tmp2.slice(1)), true, tmp1+tmp2);
				item3.spliceIn(item6);
				tmp1 = [];
				list.each(function() {
					tmp1.push(this && this.name);
				});
				item4.spliceOut();
				tmp2 = [];
				item5.parent().each(function() {
					tmp2.push(this && this.name);
				});
				harness.assert('list-splice', 
					_.arrayCompare(tmp1, [ 'head','five','three','six','a','b','four']),
					_.arrayCompare(tmp2, [ 'head', 'five', 'three', 'six', 'a', 'b' ]));
					
					
				item5.insertChild(item7);
				harness.assert('list-grand-parent', item7.grandParent().name, 'head');
				
				try {
					console.log(item5.grandParent().name);
				} catch (e) {
					harness.assert('list-caught', true, true);
				}				
		});
		
		system.on('/regress/arith', function(syslib, onFinish, log) {
			var arith = bx.arith()
				, text = bx['text-utils']()
				, queue = bx.Queue()
				, harness = Local.Harness(syslib, _.sortBy([
					'tfidf-calculation',
					'values-intersect',
					'dictionary-remove',
					'Arith-methods',
					'queue-complete',
					'queue-after-test',
					'total-docs',
					'doc-stats',
					'best-hit-sentence',
					'best-hit-value'
			], function(x) { return x; }), onFinish, log)
			, evt = bx.Events()
			, sentences = {
				'a' : "Mr. Green killed Colonel Mustard in the study with the candlestick. Mr. Green is not a very nice fellow.",
				'b' : "Professor Plumb has a green plant in his study.",
				'c' : "Miss Scarlett watered Professor Plumb's green plant while he was away from his office last week."
			}
			, corpus = {
				'dictionary': text.Text(),
				'docs': {}
			}
			, c = {}
			, hit = [];

			_.each(sentences, function (doc, index) {
				corpus.docs[doc] = text.Text(text.Sentence(doc)).Id(index);
				corpus.dictionary.merge(corpus.docs[doc]);
				return;			
			});

			harness.assert('total-docs', corpus.dictionary.docs().length, 3);

			// using the corpus, update the database with tfidf values for each document
			_.each(corpus.docs, function(doc) {
				doc.frequencies(corpus.dictionary);
			});		

			// text() and _.DICTIONARY() tests
			c = corpus.dictionary;
			harness.assert('tfidf-calculation', 
				corpus.docs[sentences.a].lookup('green').tfidf, 
				arith.tfidf(
					corpus.docs[sentences.a].lookup('green').count,
					corpus.docs[sentences.a].stats().wordCount,
					c.lookup('green').count,
					c.docs().length));


			// compute the interection of the keys of corpus and sentence.a
			harness.assert('values-intersect', 
				_.difference(c.intersects(corpus.docs[sentences.a]),
				_.keys(corpus.docs[sentences.a].hashValues)).length, 0);

			// given a query, calculate the document with the 'best-hit'		
			hit = c.bestHits(text.Text(text.Sentence('plant green')).frequencies(c))[0];		

			harness.assert('best-hit-sentence', hit[0], 'b', hit[0]);
			harness.assert('best-hit-value', hit[1], 0.2383190649627178, hit[1]);

			// stats and remove method test
			harness.assert('doc-stats', c.stats().wordCount+c.stats().uniqWords, 44);		
			c.remove('green');
			harness.assert('dictionary-remove', c.stats().wordCount, 22);

			harness.assert('Arith-methods', 
				(arith.sum([1,2,3])+arith.pow(2,3)+arith.sqrt(81)+arith.div(21,3)+arith.log10(10000)),
				(6+8+9+7+4));

			// exercise the QUEUE object	
			(function() {
				var i
					, count = 0
					, Q = queue.max(3)
					.after(function() {
						evt.trigger('summarize-and-exit');	
					});
				var waitfunc = function () {
					_.wait((1/2), function() {
						count += 1;
						if (count === 10) {
							harness.assert('queue-complete', count, 10);
						}
						Q.finish();
					});
				};
				for (i=0; i<11; i += 1) { Q.submit(waitfunc); }	
				Q.run();
			}());

			evt.on('summarize-and-exit', function() {
				harness.assert('queue-after-test', true, true);
			});
		});
		
		system.on('/regress/file-io', function(sys, onFinish, log) {
			var harness = Local.Harness(sys, _.sortBy([
				'fileio-url-parse1',
				'fileio-url-parse2',
				'fileio-url-format',
				'fileio-url-query',
				'fileio-file',
				'xotree-noforce-array',
				'xotree-force-array',
				'xotree-convert',
				'xotree-roundtrip',
				'xotree-@name' ]), onFinish, log)
				, reference
				, urlStr1 = 'http://user:pass@host.com:8080/p/a/t/h?query=string&query2=string2#hash'
				, errors = 0
				, objtree_json = {
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
				, objtree_xml = '<?xml version="1.0" encoding="UTF-8"?><family name="Kawasaki"><father>Yasuhisa</father><mother>Chizuko</mother><children><girl>Shiori</girl><boy>Yusuke</boy><boy>Kairi</boy></children></family>'				, xotree = bx.ObjTree()
				, xotree_out;

			// tests to convert XML strings to JSON objects
			xotree.attr_prefix = '@';
			xotree_out = xotree.parseXML( objtree_xml );
			// convert the xml to json and fetch the property '@name'
			harness.assert('xotree-@name', _.pfetch(xotree_out, '@name'), 'Kawasaki', JSON.stringify(xotree_out));
			
			xotree_out = xotree.parseXML( objtree_xml );
			// girl should be an object, and boy an Array
			harness.assert('xotree-noforce-array', (!(_.isArray(_.fetch(xotree_out, 'girl'))) && _.isArray(_.fetch(xotree_out, 'boy'))), true);

			xotree.force_array = ['boy', 'girl'];
			xotree_out = xotree.parseXML( objtree_xml );
			// girl and boy are Arrays
			harness.assert('xotree-force-array', (_.isArray(_.fetch(xotree_out, 'girl')) && _.isArray(_.fetch(xotree_out, 'boy'))), true);
			
			xotree = bx.ObjTree();
			harness.assert('xotree-convert', _.isEqual(objtree_json, xotree.parseXML( objtree_xml )), true);

			// JSON -> XML -> JSON === XML -> JSON
			harness.assert('xotree-roundtrip', 
				_.isEqual(xotree.parseXML( xotree.writeXML( objtree_json )), xotree.parseXML( objtree_xml )), true);

			if (bx.BROWSER === true) {
				reference = {
					protocol: 'http:',
					auth: 'user:pass',
					host: 'host.com:8080',
					port: '8080',
					hostname: 'host.com',
					href: 'http://user:pass@host.com:8080/p/a/t/h?query=string&query2=string2#hash',
					hash: '#hash',
					search: '?query=string&query2=string2',
					query: 'query=string&query2=string2',
					pathname: '/p/a/t/h',
					path: '/p/a/t/h?query=string&query2=string2' 
				};
			} else {
				reference = _.exclude(require('url').parse(urlStr1), 'slashes');
			}

			harness.assert('fileio-url-parse1', _.difference(_.keys(reference),
				_.keys(_.urlParse(urlStr1))).length, 0, 'bad keys');

			_.keys(reference).forEach(function(key) { 
				errors += (reference[key] === _.urlParse(urlStr1)[key]) ? 0 : 1;
				if (reference[key] !== _.urlParse(urlStr1)[key]) {
					console.log(key, reference[key], _.urlParse(urlStr1)[key]);
				}
			});
			harness.assert('fileio-url-parse2', errors, 0, 'bad values');
			errors = _.urlFormat(reference) === reference.href ? 0 : 1;
			harness.assert('fileio-url-format', errors, 0, _.urlFormat(reference));
			errors = (_.formatQuery(_.parseQuery(reference.search))) === reference.search 
				? 0 
				: _.formatQuery(_.parseQuery(reference.search));
			harness.assert('fileio-url-query', errors, 0, errors);
			
			bx.boxspring().file().get(bx.Paths[0]+'/underscore.js', function (response) {
				harness.assert('fileio-file', response.code, 200, response.request);
			});			
		});
		
		system.on('/regress/boxspring', function(system, onFinish, log) {
			var harness = Local.Harness(system, _.sortBy([
					'heartbeat',
					'session',
					'db_info',
					'all_dbs',
					'save-succeeds',
					'retrieve-succeeds',
					'newdoc-updated',
					'newdoc-head',
					'newdoc-remove',
					'design-saved',
					'design-read-back',
					'expect-save-fail',
					'expect-update-succeed',
					'bulk-save',
					'bulk-remove',
					'view-tests',
					'all-docs-couch',
					'all-docs-node',
					'update-with-data',
					'update-handler',
					'my-design-update',
					'my-view-test',
					'db-persist-test-1',
					'db-persist-test-2',
					'db-persist-test-3',
					'db-persist-test-4',
					'db-persist-test-5'
				], function (x) { return x; }), onFinish, log)
				, ddoc = function () {
					return {
						"updates": {
							"my-commit": function (doc, req) {
								doc['last-updated'] = Date();
								doc.size = JSON.stringify(doc).length;
								doc.junk = 'another-try';
								return [doc, JSON.stringify(doc) ];
							}
						},
						"views": {
							'my-view': {
								'map': function (doc) {
									if (doc && doc._id) {
										emit(doc._id, null);
									}
								}
							}
						}
					};
				}
				, db = bx.db.create({ 'name': 'regress', 'id': 'regress' })
				, anotherdb = bx.db.create({
					'id': 'anotherdb',
					'name': 'regress',
					'index': 'my-view',
					'designName': 'my-design',
					'maker': ddoc
				});

				var newdoc = db.doc('sample-content').docinfo({'content': Date() })
				, newdoc1 = db.doc('write-file-test').docinfo({'content': Date() })
				, doc1 = db.doc('first').docinfo({content: 'aw'})
				, doc2 = db.doc('second').docinfo({content: 'shucks'})
				, bulk = db.bulk([ doc1.docinfo(), doc2.docinfo() ])
				;		

			db.heartbeat(function(res) {
				harness.assert('heartbeat', res.code, 200, res.reason());
			});

			db.session(function(data) {
				harness.assert('session', data.code, 200, data.reason());			
			});

			db.db_info(function(data) {
				harness.assert('db_info', data.code, 200, data.reason());
			});

			db.all_dbs(function(data) {
				harness.assert('all_dbs', data.code, 200, data.reason());	
			});
						
			// gets root name by default, then tests getting name with id provided
			harness.assert('db-persist-test-1', 
				db.name, bx.db.Id('regress').name);
			harness.assert('db-persist-test-2', anotherdb.dbName, 'regress');
			// tests the defaultView method since not defined
			harness.assert('db-persist-test-3', anotherdb.index, 'my-view');
			// not explicitly defined 'default'
			harness.assert('db-persist-test-4', db.designName, 'default');
			// makes sure we return a .doc object		
			harness.assert('db-persist-test-5', typeof db.doc, 'function');
			
			newdoc.update(function(result) {
				harness.assert('save-succeeds', result.code, 201, result.reason());
				newdoc.retrieve(function(result) {
					harness.assert('retrieve-succeeds', result.code, 200, result.reason());
					newdoc.docinfo({ 'more-content': 'abcdefg'}).update(function(result) {
						harness.assert('newdoc-updated', result.code, 201, result.reason());
						newdoc.head(function(head) {
							harness.assert('newdoc-head', 200, head.code, head.reason());
							newdoc.remove(function(result) {
								harness.assert('newdoc-remove', 200, result.code, result.reason());								
							});								
						});
					});
				});
			});
			
			db.doc('docabc')
				.update({ 'extended-content': Date() }, function(response) {
					harness.assert('update-with-data', response.code, 201, response.reason());
				});

			newdoc1.save(function(response) {
				harness.assert('expect-save-fail', response.code, 409, response.reason());
				//console.log('save response:', newdoc1.docRev(), response.header.etag);
				newdoc1.update(function(update) {
					//console.log('update response', newdoc1.docRev(), update.header.etag, update.code);
					harness.assert('expect-update-succeed', 
						update.code, 201, update.request.method + ', ' + update.request.path);
					db.get('all_docs', function(couch) {
						harness.assert('all-docs-couch', couch.code, 200, couch.response.reason());
						db.get({ 'index': 'all_docs', 'server': 'node' }, function(node) {
							var found;
							node.each(function(d) {
								var found;
								couch.each(function(c) {
									found = c.id === d.id ? d.id : undefined;
								});
							});
							harness.assert('all-docs-node', typeof found, 'undefined', found);
						});
					});
				});
			});
			
			db.design.update(function(response) {
				harness.assert('design-saved', response.code, 201);
				db.design.retrieve(function(res) {
					var readBack = res.data
						, designKeys = _.keys(readBack.updates).concat(_.keys(readBack.views));
					harness.assert('design-read-back', 
						_.difference(designKeys, [ 'lib', 'in-place', 'Index']).length,0,designKeys);
					db.trigger('design-tests');
				});
			});		

			db.on('design-tests', function () {
				// What this does: gets a list of documents using the built-in 'Index' view. 
				// For each document, it gets the key.id and calls the server-side 'update' using 
				// a local update handler 'my-commit'. After the last completion, it asserts the test
				// and triggers the queue-test and a 'read-back-test' to exercise the 'Index' view 
				// running in node.js and not on the server.
				db.get({'index': 'Index'}, function(r) {
					db.get({ 'server': 'node' }, function(n) {
						harness.assert('view-tests', r.rows.length, n.rows.length);
						db.design.commit('base_test_suite', 'in-place', { 
							'random': bx.date().template()['time'] }, function(commit) {
							harness.assert('update-handler', commit.code, 201, commit.reason());
							db.trigger('bulk-tests');
						});					
					}); 
				});
			});
			
			db.on('bulk-tests', function() {
				// bulk tests
				bulk.save(function(result) {
					harness.assert('bulk-save', result.code, 201, result);
					bulk.remove(function(data) {
						//console.log(result);
						harness.assert('bulk-remove', data.data[0].ok, result.data[0].ok, data);
						db.trigger('my-design-tests');						
					});
				});
			});
						
			db.on('my-design-tests', function () {
				anotherdb.design.update(function(response) {
					harness.assert('my-design-update', response.code, 201, response.request.path);
					anotherdb.get('my-view', function (c) {
						anotherdb.get({'server': 'node'}, function(n) {							
							harness.assert('my-view-test', c.bulk().rows.length, n.total_rows, n.response.request.path);
						});
					});
				});
			});			
		});
		return that;
	};
	return Local;
}(bx));




