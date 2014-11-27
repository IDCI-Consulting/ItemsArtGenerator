ItemArt = {};

Delimiter = 1170;
ItemArt.configuration = '{\
    "options": {\
        "subway": {\
            "item": {\
                "cx": {"label": "Station X Coordinate", "tag": "input", "type": "number", "min": "0", "max": "' + Delimiter + '"},\
                "cy": {"label": "Station Y Coordinate", "tag": "input", "type": "number", "min": "0", "max": "' + Delimiter + '"},\
                "tcx": {"label": "Station\'s Name X Coordinate", "tag": "input", "type": "number", "min": "0", "max": "' + Delimiter + '"},\
                "tcy": {"label": "Station\'s Name Y Coordinate", "tag": "input", "type": "number", "min": "0", "max": "' + Delimiter + '"}\
            },\
            "category": {\
                "color": {"label": "Color", "tag": "input", "type": "color"},\
                "cx1": {"label": "Line X1 Coordinate", "tag": "input", "type": "number", "min": "0", "max": "' + Delimiter + '"},\
                "cy1": {"label": "Line Y1 Coordinate", "tag": "input", "type": "number", "min": "0", "max": "' + Delimiter + '"},\
                "cx2": {"label": "Line X2 Coordinate", "tag": "input", "type": "number", "min": "0", "max": "' + Delimiter + '"},\
                "cy2": {"label": "Line Y2 Coordinate", "tag": "input", "type": "number", "min": "0", "max": "' + Delimiter + '"}\
            }\
        }\
    }\
}';
