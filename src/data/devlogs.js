// Development log entries, shown on each project's detail page.
//
// Only real updates go here — nothing invented. The detail page shows an
// honest "no entries yet" message for projects without entries.
//
// Entry shape:
//   {
//     id: string,            // unique, e.g. 'neurolink-2026-01',
//     projectSlug: string,   // matches a project's `slug` in projects.js
//     date: string,          // 'YYYY-MM-DD'
//     title: string,
//     content: string,
//     media: { type: 'image' | 'video', src: string, alt: string } | null,
//   }

export const devlogs = [
  {
    id: 'dark-swarm-2026-11-26',
    projectSlug: 'dark-swarm',
    date: '2026-11-26',
    title: '블랙프라이데이 40% 할인',
    content:
      '11월 27일부터 12월 3일까지 itch.io에서 DARK SWARM을 40% 할인합니다. 챕터 1은 언제든 브라우저에서 무료로 해 볼 수 있습니다.',
    media: { type: 'image', src: '/projects/dark-swarm/shot_01_void_catastrophe.jpg', alt: 'VOID CATASTROPHE 대폭발 장면' },
  },
  {
    id: 'dark-swarm-2026-11-24',
    projectSlug: 'dark-swarm',
    date: '2026-11-24',
    title: '울타리 폭발 이펙트 교체',
    content:
      '울타리가 닫힐 때 터지는 폭발을 고해상도 16프레임으로 새로 바꿨습니다. 크게 확대해도 도트가 뭉개지지 않고, 빠르게 퍼진 뒤 잔광이 남도록 타이밍도 다시 잡았습니다.',
    media: { type: 'image', src: '/projects/dark-swarm/devlog_new_blast.jpg', alt: '새 울타리 폭발 이펙트' },
  },
  {
    id: 'dark-swarm-2026-11-23',
    projectSlug: 'dark-swarm',
    date: '2026-11-23',
    title: '움직임 다듬기',
    content:
      '몬스터가 발을 디딜 때 살짝 눌렸다 튀어 오르고, 맞으면 흔들리고, 등장할 때 톡 튀어나오도록 손맛을 더했습니다. 바닥은 한 단계 어둡게 눌러 캐릭터가 더 잘 보이게 했고, 로비에서 멈추면 마지막으로 걸은 방향을 보고 서 있습니다.',
    media: { type: 'image', src: '/projects/dark-swarm/devlog_vortex.jpg', alt: '울타리 안으로 빨려 드는 군세' },
  },
  {
    id: 'dark-swarm-2026-11-21',
    projectSlug: 'dark-swarm',
    date: '2026-11-21',
    title: '유튜브 쇼츠 시작',
    content:
      '게임 화면으로 만든 짧은 영상을 SYNAPSE 유튜브 채널에 올리기 시작했습니다. 뒤 챕터 보스는 직접 만나 볼 수 있도록 영상에서 가렸습니다.',
    media: { type: 'image', src: '/projects/dark-swarm/devlog_shorts.jpg', alt: 'DARK SWARM 영상 썸네일' },
  },
  {
    id: 'dark-swarm-2026-11-18',
    projectSlug: 'dark-swarm',
    date: '2026-11-18',
    title: 'itch.io 출시',
    content:
      'DARK SWARM을 itch.io에 출시했습니다. 6개 챕터, 18명의 보스, 한국어 · 영어를 지원하며 챕터 1은 브라우저에서 무료로 플레이할 수 있습니다.',
    media: null,
  },
];

export const getDevlogsByProject = (slug) =>
  devlogs
    .filter((log) => log.projectSlug === slug)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
