#' Calculate summary statistics about the neighborhoods.
#' @param posts instagram posts, including neighborhoods
#' @export
#' @examples
#' data(posts_sample)
#' neighborhood_stats <- calculate_neighborhood_stats(posts_sample)
calculate_neighborhood_stats <- function(posts) {

    neighborhood_stats <- ddply(
        posts,
        .(neighborhood),
        summarize,
        users=length(unique(name)),
        average_posts_per_user=length(name)/length(unique(name)),
        posts=length(published)
    )

}

#' Plots neighborhood stats.
#' @param stats neighborhood stats
#' @export
#' @examples
#' data(posts_sample)
#' neighborhood_stats <- calculate_neighborhood_stats(posts_sample)
#' plot_neighborhood_stats(neighborhood_stats)
plot_neighborhood_stats <- function(stats) {
    ggplot(stats, aes(x=users, y=neighborhood)) + geom_bar()
}

