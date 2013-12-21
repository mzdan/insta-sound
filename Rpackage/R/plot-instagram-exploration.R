#' Plots some exploratory analysis of the data.
#' @param dat instagram data, assumed to be the result of prepare_instagram_data
#' @export
plot_instagram_exploration <- function(dat, path='.') {
    for(field in c('published', 'published_date', 'published_hour', 'latitude', 'longitude')) {
        image_path <- file.path(path, sprintf('%s.png', field))
        print(sprintf("Plotting %s", image_path))
        png(image_path)
        print(ggplot(dat, aes_string(x=field)) + geom_density())
        dev.off()
    }
}
