/*******************************************************************************

    µBlock - a browser extension to block requests.
    Copyright (C) 2014 The µBlock authors

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    Home: https://github.com/gorhill/uBlock
*/

'use strict';

this.EXPORTED_SYMBOLS = ['uBackground'];

let uBackground = {
    document: {
        body: {
            attrs: {},
            setAttribute: function(name, value) {
                this.attrs[name] = '' + value;
            },
            getAttribute: function(name) {
                var value = this.attrs[name];
                return typeof value === 'string' ? value : null;
            }
        }
    },
    setTimeout: function(callback, delay) {

    },
    clearTimeout: function(timerId) {
        if ( typeof timerId !== 'number' ) {
            return;
        }

    }
};

uBackground.window = uBackground;

let {classes: Cc, interfaces: Ci} = Components;
let {Services} = Components.utils.import(
    'resource://gre/modules/Services.jsm',
    null
);
/*let systemPrincipal = Cc['@mozilla.org/systemprincipal;1']
    .createInstance(Ci.nsIPrincipal);
let docShell = Cc['@mozilla.org/appshell/appShellService;1']
    .getService(Ci.nsIAppShellService)
    .createWindowlessBrowser()
    .QueryInterface(Ci.nsIInterfaceRequestor)
    .getInterface(Ci.nsIDocShell);

docShell.createAboutBlankContentViewer(systemPrincipal);

uBackground = docShell.contentViewer.DOMDocument.defaultView;*/
let URI = Services.io.newURI('chrome://ublock/content/background.html', null, null);

uBackground.location = {
    host: URI.host,
    hash: '#0.8.6.0'
}

let baseURI = __URI__.slice(0, __URI__.lastIndexOf('/') + 1);
let lss = Cc['@mozilla.org/moz/jssubscript-loader;1']
    .getService(Ci.mozIJSSubScriptLoader)
    .loadSubScript;
let scripts = [
    'lib/punycode.js',
    'lib/publicsuffixlist.js',
    'lib/yamd5.js',
    'js/vapi-common.js',
    'js/vapi-background.js',
    'js/background.js',
    'js/xal.js',
    'js/async.js',
    'js/liquid-dict.js',
    'js/utils.js',
    'js/uritools.js',
    'js/assets.js',
    'js/dynamic-net-filtering.js',
    'js/static-net-filtering.js',
    'js/cosmetic-filtering.js',
    'js/ublock.js',
    'js/messaging.js',
    'js/profiler.js',
    'js/storage.js',
    'js/pagestore.js',
    'js/tab.js',
    'js/traffic.js',
    'js/contextmenu.js',
    'js/mirrors.js',
    'js/start.js'
];

for ( let script of scripts ) {
    lss(baseURI + script, uBackground, 'UTF-8');
}
