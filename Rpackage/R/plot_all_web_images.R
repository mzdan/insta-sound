#' Generates all plots used for the web application.
#' @param posts instagram posts with neighborhoods
#' @param path path in which to store the plots
#' @export
#' @examples
#' data(posts_sample)
#' plot_all_web_images(posts_sample, tempdir())
plot_all_web_images <- function(posts, path) {
    subpath <- function(name) file.path(path, name)
    plot_nyc_web_images(posts, subpath('nyc'))
    plot_neighborhood_web_images(posts, subpath('neighborhoods'))
}

#' Generates nyc plots.
#' @param posts instagram posts for all neighborhoods
#' @param path path in which to store the plots
#' @export
#' @examples
#' data(posts_sample)
#' plot_nyc_web_images(posts_sample, tempdir())
plot_nyc_web_images <- function(posts, path) {
    dir.create(path)
    plot_field_densities(posts, path)

    save_plot <- function(filename, plot_to_save, height, width) {
        filepath <- file.path(path, sprintf("%s.png", filename))
        print(sprintf("Plotting: %s", filepath))
        ggsave(filepath, plot_to_save, height=height, width=width)
    }

    save_plot('nyc_posts_map', plot_instagram_points(posts), 8, 4)
    save_plot('nyc_posts_map_tod', plot_instagram_points_with_tod(posts), 8, 4)
    save_plot('nyc_tod_polar', plot_tod_polar(posts), 4, 4)

    neighborhood_stats <- calculate_neighborhood_stats(posts)
    save_plot('neighborhood_stats', plot_neighborhood_stats(neighborhood_stats), 10, 7)
    save_plot('neighborhood_stats_log_scale', plot_neighborhood_stats_log_scale(neighborhood_stats), 10, 7)

}

#' Generates individual neighborhood stats plots.
#' @param posts instagram posts for all neighborhoods
#' @param path path in which to store the plots
#' @export
#' @examples
#' data(posts_sample)
#' plot_neighborhood_web_images(posts_sample, tempdir())
plot_neighborhood_web_images <- function(posts, path) {

    d_ply(
        posts,
        .(neighborhood),
        function(d) {

            neighborhood_path <- file.path(path, d[1,'neighborhood'])
            dir.create(neighborhood_path, recursive=TRUE)
            print(sprintf("Plotting: %s", neighborhood_path))

            plot_field_densities(d, neighborhood_path)

            p <- plot_tod_polar(d)
            ggsave(file.path(neighborhood_path, 'tod_polar.png'), p, width=4, height=4)

        }
    )

}

