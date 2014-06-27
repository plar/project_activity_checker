//---- double load protection
if (!window.scmph) window.scmph = {count:0}; if (typeof window.scmph["scm"] === "undefined") { window.scmph["scm"] = window.scmph['count']++;

var Scm = (function() {

    function Scm(options) {
        this.optShowIcon = options.get('show-provider-icon');
        this.optShowLastCommitTime = options.get('show-provider-last-time-commit');
        this.optShowLastCommitTimeAsTitle = options.get('show-provider-last-time-commit-as-title');

        this.blackListSites = options.get('blacklist-sites');
    }

    Scm.prototype.isBlacklistSite = function() {
        return checkUrlForBlackListSites(window.location.href, this.blackListSites, false).length > 0;
    }

    Scm.prototype.highlightAll = function() {
        if (this.isBlacklistSite()) {
            this._updateBadgeBanned();
            return;
        }

        var lastTotal = -1;
        var total = 0;
        var self = this;

        var processedLinks = {};
        $('a').each(function() {
            var url = $(this).attr('href');
            // don't process the same url twice
            if (url in processedLinks) return;
            processedLinks[url] = true;

            // is is scm provider?
            var res = url && self.matchScm(url);
            if (!res) return; // no
            self.highlighScm(res);

            // update icon badge every 50 links
            if (++total % 50 == 0) {
                self._updateBadge(total);        
                lastTotal = total;
            }
        });

        if (total > 0 && lastTotal != total) {
            self._updateBadge(total);
        }
    }

    Scm.prototype.matchScm = function(url) {
        for (var pid in SCM_PROVIDERS) {
            var p = SCM_PROVIDERS[pid];
            for (var i = 0; i < p.rx_urls.length; i++) {
                var res = url.match(p.rx_urls[i]);
                if (res) {
                    return {
                        id: pid, 
                        provider: p, 
                        url: url,
                        results: res.slice(1)};
                }
            }
        }
        return null;
    }


    Scm.prototype.highlighScm = function(res) {
        var self = this;

        var project_url = res.provider.project_url.format.apply(res.provider.project_url, res.results);

        chrome.runtime.sendMessage({method: "checkScm", id: res.id, url: project_url}, function(response) {
            var anchor = $("a[href='" + res.url + "'")
            if (!anchor || $(anchor).data('scm-processed') === true) {
                return;
            }
            $(anchor).data('scm-processed', true);

            var t =  response.lastCommitTime ? moment(response.lastCommitTime, res.provider.momento_format).fromNow() : 'n/a';

            if (self.optShowIcon || self.optShowLastCommitTime) {
                $(anchor).after($.nano("<span class='scm-info {provider_id}'>{time}</span>", {
                    provider_id: self.optShowIcon ? 'scm-icon ' + response.id : '',
                    time: self.optShowLastCommitTime ? t : '',
                }));
            }

            if (self.optShowLastCommitTimeAsTitle) {
                $(anchor).attr('title', t);
            }
        });
    }

    Scm.prototype._updateBadge = function(total) {
        var text = total < 1000 ? "" + total : "999+";
        chrome.runtime.sendMessage({method: "updateBadge", text: text});
    }

    Scm.prototype._updateBadgeBanned = function() {
        chrome.runtime.sendMessage({method: "updateBadgeBanned"});
    }

    return Scm;
})();

} //-- double load protection
