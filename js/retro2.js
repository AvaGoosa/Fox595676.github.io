window.onload = () => {
  const svgNS = 'http://www.w3.org/2000/svg';

  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('style', 'position:absolute;width:0;height:0;visibility:hidden;');
  svg.setAttribute('aria-hidden', 'true');

  const filter = document.createElementNS(svgNS, 'filter');
  filter.setAttribute('id', 'posterize');
  filter.setAttribute('color-interpolation-filters', 'sRGB');

  const feCT = document.createElementNS(svgNS, 'feComponentTransfer');

  ['R', 'G', 'B'].forEach(channel => {
    const feFunc = document.createElementNS(svgNS, 'feFunc' + channel);
    feFunc.setAttribute('type', 'discrete');
    feFunc.setAttribute('tableValues', '0 0.33 0.66 1');
    feCT.appendChild(feFunc);
  });

  filter.appendChild(feCT);
  svg.appendChild(filter);
  document.body.appendChild(svg);

  const style = document.createElement('style');
  style.textContent = `
    html, body, * {
      filter: url(#posterize) !important;
    }
  `;
  document.head.appendChild(style);
};
