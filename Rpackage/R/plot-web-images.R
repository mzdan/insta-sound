#' Plots the overall NYC posts as points on a basic grid.
#' @export
plot_nyc_map <- function(posts) {

    ggplot(posts, aes(x=longitude, y=latitude), alpha=0.5, size=0.0001) +
        geom_point() +
        coord_map() +
        empty_theme()

}
