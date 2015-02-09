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

/* global APP_SHUTDOWN, APP_STARTUP */
/* exported startup, shutdown, install, uninstall */

'use strict';

/******************************************************************************/

// Accessing the context of the background page:
// var win = Services.appShell.hiddenDOMWindow.document.querySelector('iframe[src*=ublock]').contentWindow;

const hostName = 'ublock';
const restartListener = {
    get messageManager() {
        return Components
            .classes['@mozilla.org/parentprocessmessagemanager;1']
            .getService(Components.interfaces.nsIMessageListenerManager);
    },

    receiveMessage: function() {
        shutdown();
        startup();
    }
};

/******************************************************************************/

function startup(data, reason) {
    Components.utils.import('chrome://' + hostName + '/content/main.js');
    restartListener.messageManager.addMessageListener(
        hostName + '-restart',
        restartListener
    );
}

/******************************************************************************/

function shutdown(data, reason) {
    if ( reason === APP_SHUTDOWN ) {
        return;
    }

    uBackground.unload();
    Components.utils.unload('chrome://' + hostName + '/content/main.js');

    if ( data === undefined ) {
        return;
    }

    // Remove the restartObserver only when the extension is being disabled
    restartListener.messageManager.removeMessageListener(
        hostName + '-restart',
        restartListener
    );
}

/******************************************************************************/

function install() {
    // https://bugzil.la/719376
    Components.classes['@mozilla.org/intl/stringbundle;1']
        .getService(Components.interfaces.nsIStringBundleService)
        .flushBundles();
}

/******************************************************************************/

function uninstall() {}

/******************************************************************************/
