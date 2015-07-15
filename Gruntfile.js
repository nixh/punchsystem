var grunt = require('grunt');

grunt.config.init({

    less: {
        development: {
            options: {
                plugins: [
                    new(require('less-plugin-autoprefix'))({
                        browsers: ["last 3 versions"]
                    })
                ],
            },
            files: {
                "public/stylesheets/userform.css": "less/userform.less"
            }
        },
        production: {
            options: {
                plugins: [
                    new(require('less-plugin-autoprefix'))({
                        browsers: ["last 3 versions"]
                    }),
                    new(require('less-plugin-clean-css'))()
                ],
            },
            files: {
                "public/stylesheets/userform.css": "less/userform.less"
            }
        }

    },

    watch: {
        style: {
            files: ['less/*.less'],
            tasks: ['less:development'],
            options: {
                livereload: true
            }

        }
    }
});

grunt.loadNpmTasks('grunt-contrib-less');
grunt.loadNpmTasks('grunt-contrib-watch');
