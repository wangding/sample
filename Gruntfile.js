module.exports = function (grunt) {
  grunt.initConfig({
    qiniu_qupload: {
      default_options: {
        options: {
          ak: 'QINIU_AK',
          sk: 'QINIU_SK',
          bucket: 'web-cdn-sample',
          assets: [{src: 'dist', prefix: ''}]
        }
      }
    }
  });

  grunt.loadNpmTasks('@wangding/grunt-qiniu-qupload');

  grunt.registerTask('upload', ['qiniu_qupload']);
};
