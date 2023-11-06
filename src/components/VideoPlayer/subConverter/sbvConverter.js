// Utility function to convert SBV caption to WebVTT format
function convertSbvToVtt(sbvText) {
    // Remove DOS newlines
    var sbv = sbvText.replace(/\r+/g, '');
    // Trim whitespace at the start and end
    sbv = sbv.replace(/^\s+|\s+$/g, '');
    // Get cues
    var cuelist = sbv.split('\n\n');
    var result = "";
    if (cuelist.length > 0) {
        result += "WEBVTT\n\n";
        for (var i = 0; i < cuelist.length; i++) {
            result += (i + 1) + "\n"; // Add cue number
            result += convertSbvCue(cuelist[i]);
        }
    }
    return result;
}

// Utility function to convert a single SBV caption cue to WebVTT format
function convertSbvCue(caption) {
    var cue = "";
    var s = caption.split(/\n/);
    // Concatenate multi-line string separated in the array into one
    while (s.length > 3) {
        for (var i = 3; i < s.length; i++) {
            s[2] += "\n" + s[i];
        }
        s.splice(3, s.length - 3);
    }
    var line = 0;
    // Get time strings
    if (s[line].match(/\d+:\d+.\d+,\d+:\d+.\d+/)) {
        // Convert time string (SBV format) to WebVTT format
        var m = s[0].match(/(\d+:\d+:\d+.\d+),(\d+:\d+:\d+.\d+)/);
        if (m) {
            var startTime =   m[1];
            var endTime =  m[2];
            cue += startTime + " --> " + endTime + "\n";
            line += 1;
        } else {
            // Unrecognized timestring
            return "";
        }
    } else {
        // File format error or comment lines
        return "";
    }
    // Get cue text
    if (s[line]) {
        cue += s[line] + "\n\n";
    }
    return cue;
}




export default convertSbvToVtt;
