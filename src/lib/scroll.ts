/** Smooth-scrolls to a page section by id ("work" or "#work"). Does nothing if it isn't on the page. */
export function scrollToSection(id: string) {
  document.getElementById(id.replace(/^#/, ''))?.scrollIntoView({ behavior: 'smooth' });
}
