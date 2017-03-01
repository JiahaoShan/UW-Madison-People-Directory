window.addEvent("domready", function () {
    new FancySettings.initWithManifest(function (settings) {
         chrome.storage.sync.get(["mailProvider", "recordHistory"], function(items){
            if (items && items.mailProvider && items.mailProvider == 'Gmail') {
                settings.manifest.mailProvider.set("Gmail");         
            }
            else {
                settings.manifest.mailProvider.set("Outlook");
            }
            if (items && items.recordHistory == false) {
                settings.manifest.recordHistory.set(false);
            }
            else {
                settings.manifest.recordHistory.set(true);
            }
        });
        settings.manifest.mailProvider.addEvent("action", function () {
            chrome.storage.sync.set({
                mailProvider: settings.manifest.mailProvider.get(),
                  }, function() {
              });
        });
        settings.manifest.recordHistory.addEvent("action", function () {
            if (!settings.manifest.recordHistory.get()) {
                chrome.storage.sync.set({history: []}, null);
            }
            chrome.storage.sync.set({
                recordHistory: settings.manifest.recordHistory.get(),
                  }, function() {
              });
        });
        settings.manifest.clearButton.addEvent("action", function () {
            chrome.storage.sync.set({history: []}, function() {
                alert('History has been removed!');
            });
        });
    });
});
