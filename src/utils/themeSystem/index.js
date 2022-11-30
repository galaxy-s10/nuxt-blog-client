import insertCss from './insert-css';

export default (style) => {
  console.log(style, 'llllkjj');
  insertCss(style, {
    prepend: true,
  });
};
