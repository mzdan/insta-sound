#' Plots instagram.
#' @param posts instagram posts
#' @export
plot_tod_polar <- function(posts) {

    ggplot(posts, aes(published_tod)) +
        geom_histogram(binwidth=15) +
        coord_polar() +
        scale_x_continuous(
            label=tod_formatter,
            limits=c(0, 60*24),
            breaks=seq(0, 24*60 - 1, by = 6*60)
        ) +
        theme(
            text = element_text(size=20),
            axis.ticks = element_blank(),
            axis.text.y = element_blank(),
            axis.title=element_blank()
            )

}

tod_formatter <- function(x) {
    x/60
}

#' Generates a polar TOD plot for each neighborhood.
#' @param posts instagram posts with neighborhoods
#' @export
plot_neighborhood_tod_polar <- function(posts) {
    d_ply(
        posts,
        .(neighborhood),
        function(d) {
            neighborhood = d[1, 'neighborhood']
            filename = sprintf('tod_polar_%s.png', neighborhood)
            print(sprintf("Plotting: %s", filename))
            path = file.path('../images/', filename)
            p <- plot_tod_polar(d)
            ggsave(path, p, width=4, height=4)
        }
    )
}

