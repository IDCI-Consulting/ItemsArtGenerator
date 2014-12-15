ItemArt = {};

Delimiter = 1170;
ItemArt.configuration = '{\
    "options": {\
        "subway": {\
            "item": {\
                "cx": {"label": "Station X Coordinate", "tag": "input", "type": "number", "min": "0", "max": "' + Delimiter + '"},\
                "cy": {"label": "Station Y Coordinate", "tag": "input", "type": "number", "min": "0", "max": "' + Delimiter + '"},\
                "tcx": {"label": "Station\'s Name X Coordinate", "tag": "input", "type": "number", "max": "' + Delimiter + '"},\
                "tcy": {"label": "Station\'s Name Y Coordinate", "tag": "input", "type": "number", "max": "' + Delimiter + '"}\
            },\
            "category": {\
                "color": {"label": "Color", "tag": "input", "type": "color"},\
                "cx": {"label": "Line X Coordinate", "tag": "input", "type": "number", "min": "0", "max": "' + Delimiter + '"},\
                "cy": {"label": "Line Y Coordinate", "tag": "input", "type": "number", "min": "0", "max": "' + Delimiter + '"}\
            }\
        }\
    }\
}';
