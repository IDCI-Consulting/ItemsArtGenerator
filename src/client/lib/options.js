ItemArt = {};

// Hacking the login system provisional
UserId = localStorage.getItem("Meteor.userId");
Meteor.call('setUserId', UserId);

ItemArt.configuration = '{\
    "options": {\
        "subway": {\
            "item": {\
                "cx": {"label": "X Coordinate", "tag": "input", "type": "number", "min": "0"},\
                "cy": {"label": "Y Coordinate", "tag": "input", "type": "number", "min": "0"}\
            },\
            "category": {\
                "color": {"label": "Color", "tag": "input", "type": "color"}\
            }\
        }\
    }\
}';
