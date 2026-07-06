/* Project showcase data. Edit freely — pages render from this. */

export const PROJECTS = [
  {
    id: 'asl-tts',
    title: 'ASL-to-TTS Model',
    year: '2025',
    role: 'ML / Frontend',
    summary:
      'Real-time American Sign Language recognition pipeline that maps hand-pose sequences to text, then to natural speech.',
    detail:
      'Computer-vision landmark extraction feeding a sequence model, with a low-latency text-to-speech layer for live conversation.',
    stack: ['Python', 'MediaPipe', 'PyTorch', 'WebRTC'],
    links: [{ label: 'Case study', href: '#' }],
  },
  {
    id: 'nextplay',
    title: 'NextPlay — Kanban',
    year: '2025',
    role: 'Full-stack',
    summary:
      'A focused Kanban app for planning work in clear, drag-and-drop columns with keyboard-first flow.',
    detail:
      'Optimistic drag-and-drop, persistent boards, and a deliberately quiet UI that stays out of the way.',
    stack: ['React', 'TypeScript', 'Node', 'PostgreSQL'],
    links: [{ label: 'Live', href: '#' }, { label: 'Source', href: '#' }],
  },
]
