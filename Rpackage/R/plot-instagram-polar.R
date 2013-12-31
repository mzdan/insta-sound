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
            axis.ticks = element_blank(),
            axis.text.y = element_blank(),
            axis.title=element_blank()
            )

}

tod_formatter <- function(x) {
    x/60
}

#        theme(axis.line=element_blank(),
##              axis.text.x=element_blank(),
##              axis.text.y=element_blank(),
#              axis.ticks.y =element_blank(),
##              axis.title.x=element_blank(),
##              axis.title.y=element_blank(),
##              legend.position="none",
#              panel.background=element_blank(),
#              panel.border=element_blank(),
##              panel.grid.major=element_blank(),
##              panel.grid.minor=element_blank(),
#              plot.background=element_blank())

