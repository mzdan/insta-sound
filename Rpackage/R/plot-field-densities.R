#' Plots some exploratory analysis of the data.
#' @param posts instagram posts including neighborhoods
#' @param path in which to store field density plots
#' @export
#' @examples
#' data(posts_sample)
#' temporary_path <- tempdir()
#' plot_field_densities(posts_sample, temporary_path)
plot_field_densities <- function(posts, path) {
    for(field in c('published', 'published_date', 'published_hour', 'latitude', 'longitude')) {
        image_path <- file.path(path, sprintf('%s.png', field))
        print(sprintf("Plotting %s", image_path))
        png(image_path)
        print(ggplot(posts, aes_string(x=field)) + geom_density())
        dev.off()
    }
}

