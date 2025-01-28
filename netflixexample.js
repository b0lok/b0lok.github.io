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

  // Add Subtitles to the Video
  const subtitleContainer = document.createElement('div');
  subtitleContainer.style.position = 'absolute';
  subtitleContainer.style.width = '100%';
  subtitleContainer.style.textAlign = 'center';
  subtitleContainer.style.color = 'white';
  subtitleContainer.style.textShadow = '1px 1px 1px black';
  subtitleContainer.style.fontSize = '2rem';
  subtitleContainer.style.bottom = '10%';
  subtitleContainer.style.zIndex = '1000';
  document.body.appendChild(subtitleContainer);

  async function loadSubtitles(language) {
    const ttmlString = localStorage.getItem(`subtitle-${language}`);
    if (!ttmlString) {
      console.error(`[Error] No subtitles found for language: ${language}`);
      return [];
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(ttmlString, 'text/xml');
    const paragraphs = xmlDoc.getElementsByTagName('p');
    const subtitles = [];

    for (const p of paragraphs) {
      const begin = p.getAttribute('begin');
      const end = p.getAttribute('end');
      const text = p.textContent.trim();

      subtitles.push({
        start: timeToSeconds(begin),
        end: timeToSeconds(end),
        text,
      });
    }

    return subtitles;
  }

  function timeToSeconds(timeString) {
    const timeParts = timeString.split(':');
    const hours = parseFloat(timeParts[0]) || 0;
    const minutes = parseFloat(timeParts[1]) || 0;
    const seconds = parseFloat(timeParts[2]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  }

  async function displaySubtitles() {
    const settings = { preferredLanguage: 'en' }; // Default to English subtitles
    const subtitles = await loadSubtitles(settings.preferredLanguage);

    if (!subtitles.length) {
      console.error('[Error] No subtitles available to display.');
      return;
    }

    video.addEventListener('timeupdate', () => {
      const currentTime = video.currentTime;
      const currentSubtitle = subtitles.find(
        (sub) => currentTime >= sub.start && currentTime <= sub.end
      );
      subtitleContainer.textContent = currentSubtitle ? currentSubtitle.text : '';
    });

    console.debug('[Debug] Subtitles attached to video playback.');
  }

  displaySubtitles();
});
