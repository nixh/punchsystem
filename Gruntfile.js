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
            files: [{
                expand: true,
                cwd: 'less',
                src: ['*.less'],
                dest: 'public/stylesheets/',
                ext: '.css'
            }]
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
            temp: {
                "public/stylesheets/userform.css": "less/userform.less"
            },
            files: [{
                expand: true,
                cwd: 'less',
                src: ['*.less'],
                dest: 'public/stylesheets/',
                ext: '.css'
            }]
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
