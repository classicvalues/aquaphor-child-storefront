function main() {
  const footer = document.querySelector('.footer');
  const wrapSubCategorys = footer.querySelectorAll('.footer__category-wrap_row');
  Object.keys(wrapSubCategorys).forEach((item) => {
    wrapSubCategorys[item].addEventListener('click', () => {
      wrapSubCategorys[item].parentNode.lastElementChild.classList.toggle(
        'footer__category-wrap_is-opened',
      );
      const svg = wrapSubCategorys[item].querySelector(
        'svg.footer__item-icon.footer__item-icon_rotating',
      );
      if (svg.style.transform === '') {
        svg.style.transform = 'rotate(180deg)';
      } else svg.style.transform = '';
    });
  });
}

main();
