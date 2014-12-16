ItemArt = {};

WidthDelimiter = 1170;
HeightDelimiter = 960;

ItemArt.configuration = '{\
    "options": {\
        "subway": {\
            "item": {\
                "cx": {"label": "Station X Coordinate", "tag": "input", "type": "number", "min": "0", "max": "' + WidthDelimiter + '"},\
                "cy": {"label": "Station Y Coordinate", "tag": "input", "type": "number", "min": "0", "max": "' + HeightDelimiter + '"},\
                "tcx": {"label": "Station\'s Name X Coordinate", "tag": "input", "type": "number", "max": "' + WidthDelimiter + '"},\
                "tcy": {"label": "Station\'s Name Y Coordinate", "tag": "input", "type": "number", "max": "' + HeightDelimiter + '"}\
            },\
            "category": {\
                "color": {"label": "Color", "tag": "input", "type": "color"},\
                "cx": {"label": "Line X Coordinate", "tag": "input", "type": "number", "min": "0", "max": "' + WidthDelimiter + '"},\
                "cy": {"label": "Line Y Coordinate", "tag": "input", "type": "number", "min": "0", "max": "' + HeightDelimiter + '"}\
            }\
        }\
    }\
}';
