#' Plots instagram.
#' @param posts instagram posts
#' @export
plot_tod_polar <- function(posts) {
    ggplot(posts, aes(published_tod)) +
        geom_histogram(binwidth=15) +
        coord_polar() +
        xlim(0, 60*24)
}
