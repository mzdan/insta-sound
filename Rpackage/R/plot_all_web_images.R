#' Generates all plots used for the web application.
#' @param posts instagram posts with neighborhoods
#' @param path path in which to store the plots
#' @export
#' @examples
#' data(posts_sample)
#' plot_all_web_images(posts_sample, tempdir())
plot_all_web_images <- function(posts, path) {

    overall_path <- file.path(path, 'overall')
    dir.create(overall_path)
    plot_field_densities(posts, overall_path)

    save_overall_plot <- function(filename, plot_to_save, height=4, width=4) {
        filepath <- file.path(overall_path, sprintf("%s.png", filename))
        ggsave(filepath, p, height=height, width=width)
    }

    p <- plot_tod_polar(posts)
    save_overall_plot('nyc_tod_polar', p)

    # TODO: Include only posts which have a neighborhood
    d_ply(
        posts,
        .(neighborhood),
        function(d) {

            neighborhood_path <- file.path(path, 'neighborhoods', d[1,'neighborhood'])
            dir.create(neighborhood_path, recursive=TRUE)
            print(sprintf("Plotting: %s", neighborhood_path))

            plot_field_densities(d, neighborhood_path)

            p <- plot_tod_polar(d)
            ggsave(file.path(neighborhood_path, 'tod_polar.png'), p, width=4, height=4)

        }
    )

}

