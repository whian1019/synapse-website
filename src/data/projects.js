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
    title: 'Dark Swarm',
    category: 'GAME',
    status: 'Concept',
    tagline: '어둠 속에서 움직이는 군집 지능을 다루는 신작 게임 프로젝트입니다.',
    oneLiner: '군집 지능을 테마로 한 신작 게임',
    description:
      'Dark Swarm은 SYNAPSE가 새롭게 준비하는 게임 프로젝트로, 어둠과 군집이라는 키워드를 중심으로 세계관을 만들어가고 있습니다. 아직 초기 개발 단계이며, 진행 상황에 따라 더 많은 내용이 공개될 예정입니다.',
    features: [
      '어둠을 소재로 한 분위기 있는 세계관',
      '군집으로 움직이는 지능형 개체 컨셉',
      '현재 세계관과 방향성을 구상하는 초기 단계',
    ],
    tech: [],
    progress: '현재 세계관과 방향성을 구상하는 초기 단계이며, 진행 상황에 따라 더 많은 내용이 공개될 예정입니다.',
    tags: ['Concept Stage', 'Swarm AI', 'Atmospheric'],
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
