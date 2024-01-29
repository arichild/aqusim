export const popups = () => {
	return app.gulp.src(app.path.src.popups)
		.pipe(app.gulp.dest(app.path.build.popups));
}