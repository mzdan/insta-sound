#' Plots some exploratory analysis of the data.
#' @param posts instagram posts including neighborhoods
#' @param path in which to store field density plots
#' @export
#' @examples
#' data(posts_sample)
#' temporary_path <- tempdir()
#' plot_field_densities(posts_sample, temporary_path)
plot_field_densities <- function(posts, path) {

    plot_field <- function(field_name, plot_to_save) {
        image_path <- file.path(path, sprintf('%s.png', field_name))
        print(sprintf("Plotting %s", image_path))
        ggsave(filename=image_path, plot=plot_to_save, height=6, width=6)
    }

    for(field in c('published', 'latitude', 'longitude')) {
        p <- ggplot(posts, aes_string(x=field)) +
            geom_density()

        plot_field(field, p)
    }

    p <- ggplot(posts, aes(x=published_tod/60)) +
        geom_density() +
        scale_x_tod() +
        xlab('time of day')

    plot_field('time_of_day', p)

}

