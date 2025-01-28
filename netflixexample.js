document.addEventListener('DOMContentLoaded', () => {
  // Video Element
  const video = document.getElementById('netflix-video');

  // Populate LocalStorage with Netflix-like Data
  function setupLocalStorage() {
    localStorage.setItem('currentMovieId', '123456');
    localStorage.setItem(
      'availableLanguages',
      JSON.stringify([
        { id: 'en', description: 'English' },
        { id: 'ko', description: 'Korean' },
      ])
    );

    const subtitles = [
      { key: 'subtitle-en', url: 'subtitles-en.xml' },
      { key: 'subtitle-ko', url: 'subtitles-ko.xml' },
    ];

    subtitles.forEach(async ({ key, url }) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.error(`Failed to fetch ${url}:`, response.statusText);
          return;
        }
        const text = await response.text();
        localStorage.setItem(key, text);
        console.log(`Loaded ${key} into localStorage.`);
      } catch (error) {
        console.error(`Error fetching ${url}:`, error);
      }
    });
  }

  setupLocalStorage();

  // Mock Netflix Metadata
  const mockNetflixMetadata = {
    "result": {
      "movieId": "123456",
      "timedtexttracks": [
        {
          "language": "en",
          "languageDescription": "English",
          "ttDownloadables": {
            "imsc1.1": {
              "urls": [
                { "url": "subtitles-en.xml" }
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
                { "url": "subtitles-ko.xml" }
              ]
            }
          }
        }
      ]
    }
  };

  localStorage.setItem('mockNetflixMetadata', JSON.stringify(mockNetflixMetadata));
  console.debug('[Debug] Netflix metadata stored in localStorage.');

  // Simulate Settings Dispatch
  window.addEventListener('getSettings', () => {
    const settings = { preferredLanguage: 'en' };
    window.dispatchEvent(new CustomEvent('settingsReceived', { detail: settings }));
    console.debug('[Debug] Mock settings sent:', settings);
  });
});
