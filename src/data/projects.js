// Central project data. Add new projects here — cards and detail pages
// render from this list automatically.
//
// status uses a fixed vocabulary so the site never shows an ad-hoc label:
//   'Concept' | 'Prototype' | 'In Development' | 'Early Access' | 'Released'
// Only mark a project with the status it is actually at — don't upgrade a
// concept-stage project to "In Development" for the sake of a fuller-looking
// page.
//
// tech / features describe real, already-established direction for each
// project, not invented specs. Leave `tech` as an empty array until a real
// stack is decided — the detail page hides that section when it's empty
// rather than showing a placeholder.

export const projects = [
  {
    id: '01',
    slug: 'neurolink',
    title: 'NEUROLINK',
    category: 'GAME',
    status: 'In Development',
    tagline: '인간과 기술, 디지털 세계의 연결을 탐구하는 미래적 게임 프로젝트입니다.',
    oneLiner: '사이버펑크 오픈월드 액션 RPG',
    description:
      'NEUROLINK는 SYNAPSE의 대표 게임 프로젝트로, Unity 기반의 사이버펑크 오픈월드 액션 RPG입니다. 정신과 기계가 직접 연결된 가까운 미래를 그리며, 그 연결이 치러야 할 대가를 묻습니다. 현재 활발히 개발이 진행되고 있습니다.',
    features: [
      '정신과 기계가 연결된 가까운 미래를 그리는 사이버펑크 세계관',
      '자유롭게 탐험할 수 있는 오픈월드 구조',
      '액션 RPG 기반의 전투와 성장 시스템',
    ],
    tech: ['Unity 6'],
    progress: '현재 활발히 개발이 진행되고 있습니다.',
    tags: ['Unity 6', 'Open World', 'Action RPG', 'Cyberpunk'],
    accent: '#5eead4',
  },
  {
    id: '02',
    slug: 'dark-swarm',
    title: 'DARK SWARM',
    category: 'GAME',
    status: 'Released',
    tagline: '한 마리씩 쏘지 마라. 가둬서 터뜨려라. 말뚝으로 울타리를 쳐 어둠의 군세를 한 번에 터뜨리는 픽셀 서바이벌 게임입니다.',
    oneLiner: '한 마리씩 쏘지 마라. 가둬서 터뜨려라.',
    description:
      'DARK SWARM은 SYNAPSE가 출시한 픽셀 서바이벌 게임입니다. 무너진 도시, 세상의 밑바닥에 봉인됐던 어둠이 여섯 경계를 뚫고 쏟아져 나옵니다. 기억을 잃은 기록관이 되어 공허의 말뚝을 박고, 사슬로 울타리를 닫아 안에 갇힌 적을 한꺼번에 터뜨리세요. 많이 가둘수록 더 큰 폭발과 연쇄 콤보가 이어집니다. 오염된 수호자들을 정화하며 여섯 경계를 하나씩 다시 봉인하는 것이 목표입니다. 챕터 1은 itch.io에서 브라우저로 무료 체험할 수 있습니다.',
    features: [
      '말뚝 · 울타리 · 폭발 — 군세를 가둬서 한 번에 터뜨리는 핵심 전투',
      '6개 챕터와 18명의 보스, 챕터마다 다른 기믹(눈보라 · 봄 방어 · 넋불 · 포격 · 균열)',
      '무기 5종과 진화, 전설 능력, 울타리 규칙을 바꾸는 규칙 카드',
      '말뚝 분기 5종(번개 · 균열 · 서리 · 피 · 가시)과 봉인 인장 보너스',
      '일일 도전, 상점 · 능력치 트리 · 유물 제단 등 로비 성장, 어둠 단계 8개',
      '게임패드 지원 · 키 변경 · 한국어 / 영어',
    ],
    tech: ['HTML5', 'Canvas 2D', 'JavaScript', 'Windows · Browser'],
    progress:
      '현재 itch.io에서 판매 중입니다(정가 $4.99). 챕터 1은 브라우저에서 무료로 플레이할 수 있습니다. 일부 그림과 영상 에셋은 AI 도구의 도움을 받아 만든 뒤 개발자가 직접 다듬었습니다.',
    link: { href: 'https://whian.itch.io/dark-swarm', label: 'itch.io에서 무료 체험 / 구매' },
    tags: ['Released', 'Survivor-like', 'Pixel Art', 'Dark Fantasy'],
    accent: '#ec4899',
  },
  {
    id: '03',
    slug: 'nova',
    title: 'NOVA',
    category: 'AI',
    status: 'In Development',
    tagline: '기술과 더 자연스럽게 상호작용하는 방법을 고민하는 AI 어시스턴트 프로젝트입니다.',
    oneLiner: '자연스러운 상호작용을 목표로 하는 AI 어시스턴트',
    description:
      'NOVA는 사람이 기술과 더 자연스럽고 대화하듯 함께 일할 수 있는 방법을 탐구하는 AI 어시스턴트 프로젝트입니다. 새로움 자체보다 인터랙션 설계와 반응성에 집중해, 진짜 협업자처럼 느껴지는 경험을 만드는 것이 목표입니다. 현재는 초기 단계로 개발이 진행 중입니다.',
    features: [
      '대화하듯 자연스러운 인터랙션 설계',
      '반응성과 사용성에 집중한 접근',
      '실제 협업자처럼 느껴지는 경험을 지향',
    ],
    tech: [],
    progress: '현재는 초기 단계로 개발이 진행 중입니다.',
    tags: ['AI Assistant', 'Natural Interaction', 'In Progress'],
    accent: '#60a5fa',
  },
];

export const getProjectBySlug = (slug) => projects.find((p) => p.slug === slug);
