var gulp = require('gulp');
var stylus = require('gulp-stylus');
var nib = require('nib');

gulp.task('desktop-default-base', function(){
    gulp.src('default/desktop/base.styl')
        .pipe(stylus({
            compress: true,
            use: [nib()]
        }))
        .pipe(gulp.dest('./default/desktop'));
});

gulp.task('desktop-default-client', function(){
    gulp.src('default/desktop/client.styl')
        .pipe(stylus({
            compress: true,
            use: [nib()]
        }))
        .pipe(gulp.dest('./default/desktop'));
});

gulp.task('watch:desktop-default', function(){
    gulp.watch('default/desktop/*.styl', ['desktop-default-base', 'desktop-default-client']);
});

/*gulp.task('desktop-default-grid', function(){
    gulp.src('themes/default/desktop/grid.styl')
        .pipe(stylus({
            use: [typographic(), nib()]
        }))
        .pipe(gulp.dest('./themes/default/desktop'));
});

gulp.task('desktop-default-sidebar', function(){
    gulp.src('themes/default/desktop/sidebar.styl')
        .pipe(stylus({
            use: [typographic(), nib()]
        }))
        .pipe(gulp.dest('./themes/default/desktop'));
});

gulp.task('desktop-default-menu', function(){
    gulp.src('themes/default/desktop/menu.styl')
        .pipe(stylus({
            use: [typographic(), nib()]
        }))
        .pipe(gulp.dest('./themes/default/desktop'));
});

gulp.task('desktop-default-breadcrumb', function(){
    gulp.src('themes/default/desktop/breadcrumb.styl')
        .pipe(stylus({
            use: [typographic(), nib()]
        }))
        .pipe(gulp.dest('./themes/default/desktop'));
});

gulp.task('desktop-default-form', function(){
    gulp.src('themes/default/desktop/form.styl')
        .pipe(stylus({
            use: [typographic(), nib()]
        }))
        .pipe(gulp.dest('./themes/default/desktop'));
});

gulp.task('desktop-default-button', function(){
    gulp.src('themes/default/desktop/button.styl')
        .pipe(stylus({
            use: [typographic(), nib()]
        }))
        .pipe(gulp.dest('./themes/default/desktop'));
});

gulp.task('desktop-default-modal', function(){
    gulp.src('themes/default/desktop/modal.styl')
        .pipe(stylus({
            use: [typographic(), nib()]
        }))
        .pipe(gulp.dest('./themes/default/desktop'));
});

gulp.task('desktop-default-dropdown', function(){
    gulp.src('themes/default/desktop/dropdown.styl')
        .pipe(stylus({
            use: [typographic(), nib()]
        }))
        .pipe(gulp.dest('./themes/default/desktop'));
});

gulp.task('desktop-default-checkbox', function(){
    gulp.src('themes/default/desktop/checkbox.styl')
        .pipe(stylus({
            use: [typographic(), nib()]
        }))
        .pipe(gulp.dest('./themes/default/desktop'));
});

gulp.task('watch:desktop-default', function(){
    gulp.watch('themes/default/desktop/*.styl', ['desktop-default-grid', 'desktop-default-sidebar', 'desktop-default-menu', 'desktop-default-breadcrumb', 'desktop-default-form','desktop-default-button','desktop-default-modal', 'desktop-default-dropdown', 'desktop-default-checkbox']);
});*/