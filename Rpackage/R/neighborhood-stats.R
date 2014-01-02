#' Calculate summary statistics about the neighborhoods.
#' @export
neighborhood_stats <- function(posts) {

    neighborhood_stats <- ddply(
        posts,
        .(neighborhood),
        summarize,
        users=length(unique(user)),
        average_posts_per_user=length(user)/length(unique(user)),
        posts=length(published)
    )

}

#' Plots neighborhood stats.
#' @export
plot_neighborhood_stats <- function(stats) {
}

