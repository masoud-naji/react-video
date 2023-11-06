// Utility function to convert SRT caption to WebVTT format
function convertSrtToVtt(srtText) {
    // Remove DOS newlines
    var srt = srtText.replace(/\r+/g, '');
    // Trim whitespace at the start and end
    srt = srt.replace(/^\s+|\s+$/g, '');
    // Get cues
    var cuelist = srt.split('\n\n');
    var result = "";
    if (cuelist.length > 0) {
      result += "WEBVTT\n\n";
      for (var i = 0; i < cuelist.length; i++) {
        result += convertSrtCue(cuelist[i]);
      }
    }
    return result;
  }
  
  // Utility function to convert a single SRT caption cue to WebVTT format
  function convertSrtCue(caption) {
    // Remove all HTML tags for security reasons
    // caption = caption.replace(/<[a-zA-Z\/][^>]*>/g, '');
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
    // Detect identifier
    if (!s[0].match(/\d+:\d+:\d+/) && s[1].match(/\d+:\d+:\d+/)) {
      cue += s[0].match(/\w+/) + "\n";
      line += 1;
    }
    // Get time strings
    if (s[line].match(/\d+:\d+:\d+/)) {
      // Convert time string
      var m = s[1].match(/(\d+):(\d+):(\d+)(?:,(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:,(\d+))?/);
      if (m) {
        cue += m[1] + ":" + m[2] + ":" + m[3] + "." + m[4] + " --> " + m[5] + ":" + m[6] + ":" + m[7] + "." + m[8] + "\n";
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
  
  export default convertSrtToVtt;
  