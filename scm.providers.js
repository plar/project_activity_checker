//---- double load protection
if (!window.scmph) window.scmph = {count:0}; if (typeof window.scmph["scm.providers"] === "undefined") { window.scmph["scm.providers"] = window.scmph['count']++;

var SCM_PROVIDERS = {
    'github': {
        rx_urls: [
            /(http|https):\/\/github.com\/([^\/]+)\/([^\/]+)\/*$/i, // https://github.com/username/projectname
            /(http|https):\/\/(.*)\.github.com\/([^\/]+)\/*$/i // http://username.github.com/projectname/
        ],
        project_url: '{0}://github.com/{1}/{2}/commits',
        momento_format: 'MMM DD, YYYY',

        last_commit_time_handler: function(html) {
        	return $(
        		'#js-repo-pjax-container > div.js-navigation-container.js-active-navigation-container > ol:nth-child(2) > li > div > div.authorship > time:first', 
        		html).text();
        }
    },

    'bitbucket': {
        rx_urls: [
            /(http|https):\/\/bitbucket.org\/([^\/]+)\/([^\/]+)\/*$/i, // https://bitbucket.org/username/projectname
        ],
        project_url: '{0}://bitbucket.org/{1}/{2}/commits/all',
        momento_format: 'YYYY-MM-DDTHH:MM:ssZ',

        last_commit_time_handler: function(html) {
        	return $(
        		'#chg_1 > td.date > div > time', 
        		html).attr('datetime');
        }
    },

    'google': {
        rx_urls: [
            /(http|https):\/\/code.google.com\/p\/([^\/]+)\/*$/i
        ],
        project_url: '{0}://code.google.com/p/{1}/source/list',
        momento_format: 'ddd MMM DD HH:mm:ss YYYY', // Wed Jun 25 14:20:08 2014

        last_commit_time_handler: function(html) {
        	return $(
        		'#resultstable > tbody > tr:nth-child(2) > td:nth-child(5)',
        		html).attr('title');
        }
    },

    'sourceforge': {
        rx_urls: [
            /(http|https):\/\/sourceforge.net\/projects\/([^\/]+)\/*$/i,
            /(http|https):\/\/sourceforge.net\/p\/([^\/]+)\/*$/i,
        ],
        project_url: '{0}://sourceforge.net/projects/{1}/',
        momento_format: 'YYYY-MM-DD',

        last_commit_time_handler: function(html) {
        	return $(
        		'#last-updated > section > time',
        		html).attr('datetime');
        }
    }, 

    'launchpad': {
    	rx_urls: [
            /(http|https):\/\/launchpad.net\/([^\/]+)\/*$/i
    	],

    	project_url: '{0}://launchpad.net/{1}/+all-branches?field.lifecycle=ALL&field.lifecycle-empty-marker=1&field.sort_by=newest+first&field.sort_by-empty-marker=1',
    	momento_format: 'YYYY-MM-DD HH:mm:ss',

    	last_commit_time_handler: function(html) {
    		return $(
    			'#branchtable > tbody > tr:nth-child(1) > td:nth-child(4) > span:nth-child(2)',
    			html).attr('title');
    	}

    }
}

} //-- double load protection
