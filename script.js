document.addEventListener('DOMContentLoaded', () => {
  const subtitle1 = document.getElementById('subtitle1');
  const subtitle2 = document.getElementById('subtitle2');

  // Example subtitles timeline
  const subtitles = [
    { time: 1, text1: 'Hello, welcome to Netflix!', text2: '안녕하세요, 넷플릭스에 오신 것을 환영합니다!' },
    { time: 5, text1: 'Enjoy learning languages.', text2: '언어 학습을 즐기세요.' },
    { time: 10, text1: '', text2: '' },
  ];

  const videoPlayer = document.getElementById('videoPlayer');

  videoPlayer.addEventListener('timeupdate', () => {
    const currentTime = Math.floor(videoPlayer.currentTime);
    const subtitle = subtitles.find((s) => s.time === currentTime);

    if (subtitle) {
      subtitle1.textContent = subtitle.text1;
      subtitle2.textContent = subtitle.text2;
    }
  });
});
