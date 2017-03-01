// SAMPLE
this.manifest = {
    "name": "UW-Madison Directory",
    "icon": "icon.png",
    "settings": [
        {
            "tab": i18n.get("Preference"),
            "group": i18n.get("Mail"),
            "name": "mailProvider",
            "type": "popupButton",
            "label": "Preferred email provider:",
            "options": {
                "values": [
                    ["Outlook"],
                    ["Gmail"]
                ],
            },
            "default": "Outlook"
        },
        {
            "tab": i18n.get("Preference"),
            "group": i18n.get("History"),
            "name": "recordHistory",
            "type": "checkbox",
            "label": i18n.get("Enable search history"),
            "default": true,
        },
        {
            "tab": i18n.get("Preference"),
            "group": i18n.get("History"),
            "name": "clearButton",
            "type": "button",
            "label": i18n.get("Clear history"),
            "text": i18n.get("Clear")
        },
    ],
};
