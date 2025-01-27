// This script triggers JSON.parse with Netflix-like data.
(function() {
    const mockNetflixResponse = `{
      "result": {
        "movieId": "123456",
        "timedtexttracks": [
          {
            "language": "en",
            "languageDescription": "English",
            "ttDownloadables": {
              "imsc1.1": {
                "urls": [
                  {
                    "url": "someSubtitleFile_en.xml"
                  }
                ]
              }
            }
          },
          {
            "language": "ko",
            "languageDescription": "Korean",
            "ttDownloadables": {
              "imsc1.1": {
                "urls": [
                  {
                    "url": "someSubtitleFile_ko.xml"
                  }
                ]
              }
            }
          }
        ]
      }
    }`;
  
    // Force a parse so your extension sees the data
    JSON.parse(mockNetflixResponse);
  
    // If you need repeated tests, you could call JSON.parse(...) again
    // or do it on an interval, or after a small timeout, etc.
  })();
  