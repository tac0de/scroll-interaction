import { getResponsiveValue, EASING } from '../utils.js';
import { SectionAnimationBase, set, to, addLabel } from '../modules/SectionAnimationBase.js';

class FilmSection extends SectionAnimationBase {
  constructor() {
    super();
    this.$wrapper = document.querySelector('.video_wrap');
    this.bg = '.video_wrap .video_background';
    this.container = '.video_wrap .video_container';
    this.title = '.video_wrap .video_headline';
    this.line = '.video_wrap .video_separator_line';
    this.$btn = document.querySelector('.video_wrap .btn_video');
    this.WIDTH = getResponsiveValue('320px', '1200px');
    this.HEIGHT = getResponsiveValue('186px', '675px');
  }
  buildScenario() {
    const { $wrapper, bg, container, title, line, $btn, WIDTH, HEIGHT } = this;
    return [
      set([title, $btn], { opacity: 0, y: 20, scale: 0.95 }),
      set(line, { width: 0, height: '1px', opacity: 0.3 }),
      set(container, { opacity: 0, scale: 0.9, y: 30 }),
      set(bg, {
        width: getResponsiveValue(WIDTH, '110vw'),
        height: getResponsiveValue(HEIGHT, '110vh'),
        borderRadius: '5px',
        opacity: getResponsiveValue(0.7, 1),
        scale: getResponsiveValue(0.95, 1.1)
      }),
      addLabel('start'),
      to($wrapper, null, undefined, { autoAlpha: 1, scale: 1, y: 0, ...EASING }),
      to(bg, null, undefined, { width: getResponsiveValue('110vw', WIDTH), height: getResponsiveValue('110vh', HEIGHT), borderRadius: '20px', opacity: 1, scale: 1, ...EASING }),
      to(container, null, undefined, { opacity: 1, scale: 1, y: 0, ...EASING }),
      to([title, $btn], null, undefined, { opacity: 1, y: 0, scale: 1, stagger: 0, duration: 0.8, ...EASING }),
      to(line, null, '-=0.4', { width: '100%', duration: 0.4, ...EASING }),
      to({}, null, undefined, { duration: 0, onComplete: () => $btn.classList.add('active'), onReverseComplete: () => $btn.classList.remove('active') }),
      to({}, null, undefined, { duration: 2 })
    ];
  }
  get scrollTrigger() {
    return {
      trigger: '.video_wrap',
      pin: true,
      start: 'top top',
      end: '+=' + window.innerHeight * getResponsiveValue(6, 3.5),
      scrub: 1,
    };
  }
}

export function initFilmAnimation() {
  const film = new FilmSection();
  if (film.$wrapper) film.init();
} 