document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('netflix-video');
  const subtitleEn = document.getElementById('dual-subtitle-en');
  const subtitleKo = document.getElementById('dual-subtitle-ko');

  // Subtitle simulation
  const subtitles = [
    { start: 1, end: 4, en: "Welcome to Netflix Replica.", ko: "넷플릭스 복제본에 오신 것을 환영합니다." },
    { start: 5, end: 8, en: "This is the English Subtitle.", ko: "이것은 영어 자막입니다." },
    { start: 10, end: 14, en: "Enjoy testing your extension.", ko: "확장을 테스트하세요." },
  ];

  video.addEventListener('timeupdate', () => {
    const currentTime = video.currentTime;
    const currentSubtitle = subtitles.find(sub => currentTime >= sub.start && currentTime <= sub.end);

    if (currentSubtitle) {
      subtitleEn.textContent = currentSubtitle.en;
      subtitleKo.textContent = currentSubtitle.ko;
    } else {
      subtitleEn.textContent = "";
      subtitleKo.textContent = "";
    }
  });
});


  // Fetch subtitles dynamically and store them in localStorage
  async function preloadSubtitles() {
    const subtitles = [
      { key: 'subtitle-en', url: 'subtitles-en.vtt' },
      { key: 'subtitle-ko', url: 'subtitles-ko.vtt' },
    ];

    for (const { key, url } of subtitles) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.error(`Failed to fetch ${url}:`, response.statusText);
          continue;
        }
        const text = await response.text();
        localStorage.setItem(key, text);
        console.log(`Loaded ${key} into localStorage.`);
      } catch (error) {
        console.error(`Error fetching ${url}:`, error);
      }
    }
  }

  // Call the preload function on page load
  preloadSubtitles();


  // Mimic available languages
  localStorage.setItem(
    'availableLanguages',
    JSON.stringify([
      'en', 'ko', 'es', 'fr', 'de', 'it', 'pt-BR', 'ru', 'zh-Hans', 'zh-Hant'
    ])
  );

  console.debug('Available languages set in localStorage:', JSON.parse(localStorage.getItem('availableLanguages')));

