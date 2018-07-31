module.exports = {
  plugins: [
    require('postcss-atrule-bem')({
      shortcuts: true,
    }),
    require('postcss-import'),
    require('postcss-nested'),
    require('postcss-mixins'),
    require('postcss-extend'),
    require('postcss-simple-vars'),
  ]
}
