import insertCss from './insert-css';

export default (style) => {
  insertCss(style, {
    prepend: true,
  });
};
