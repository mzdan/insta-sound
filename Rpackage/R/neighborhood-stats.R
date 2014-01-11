#' Calculate summary statistics about the neighborhoods.
#' @param posts instagram posts, including neighborhoods
#' @export
#' @examples
#' data(posts_sample)
#' neighborhood_stats <- calculate_neighborhood_stats(posts_sample)
calculate_neighborhood_stats <- function(posts) {

    neighborhood_stats <- ddply(
        posts[posts$neighborhood != '',],
        .(neighborhood),
        summarize,
        users=length(unique(name)),
        average_posts_per_user=length(name)/length(unique(name)),
        posts=length(published)
    )
    # Reorder the neighborhood factor by top posts
    neighborhood_stats <- neighborhood_stats[with(neighborhood_stats, order(-posts)), ]
    neighborhood_stats$neighborhood <- factor(neighborhood_stats$neighborhood,
                                              levels=rev(neighborhood_stats$neighborhood))

    neighborhood_stats

}

#' Stores neighborhood_stats in the given path.
#' @param neighborhood_stats stats
#' @param path in which to store the stats
#' @export
#' @examples
#' data(posts_sample)
#' neighborhood_stats <- calculate_neighborhood_stats(posts_sample)
#' store_neighborhood_stats(neighborhood_stats, tempdir())
store_neighborhood_stats <- function(neighborhood_stats, path) {
    write.csv(neighborhood_stats, file=file.path(path, "neighborhood_stats.csv"), quote=FALSE, row.names=FALSE)
}

#' Calculated neighborhood stats.
#' @param posts the instagram posts, including neighborhoods
#' @export
#' @examples
#' data(posts_sample)
#' data(posts_sample)
#' temporary_path <- tempdir()
#' calculate_neighborhood_histograms(posts_sample)
calculate_neighborhood_histograms <- function(posts) {

    dlply(
        posts,
        .(neighborhood),
        function(d) {
            neighborhood = d[1, 'neighborhood']
            filename = sprintf('neighborhood_histogram_%s.json', neighborhood)
            hist(d$published_tod, plot=FALSE, breaks=seq(0,24 * 60,by=15))
        }
    )

}

#' Melts neighborhood stats into a form that makes it easier to create some types of plots.
#' @param neighborhood_stats generated from posts
melt_neighborhood_stats <- function(neighborhood_stats) {
    neighborhood_stats_narrow <- melt(neighborhood_stats, c('neighborhood'))
    neighborhood_stats_narrow$variable <- factor(neighborhood_stats_narrow$variable,
                                                 levels=c('posts', 'users', 'average_posts_per_user'))
    neighborhood_stats_narrow
}

#' Plots neighborhood stats.
#' @param stats neighborhood stats
#' @export
#' @examples
#' data(posts_sample)
#' neighborhood_stats <- calculate_neighborhood_stats(posts_sample)
#' plot_neighborhood_stats(neighborhood_stats)
plot_neighborhood_stats <- function(stats) {
    ggplot(
        stats,
        aes(
            x=posts,
            y=neighborhood,
            size=average_posts_per_user,
            color=users
         )
    ) + geom_point()
}

#' Plots neighborhood stats.
#' @param stats neighborhood stats
#' @export
#' @examples
#' data(posts_sample)
#' neighborhood_stats <- calculate_neighborhood_stats(posts_sample)
#' plot_neighborhood_stats(neighborhood_stats)
plot_neighborhood_stats_log_scale <- function(stats) {
    ggplot(
        stats,
        aes(
            x=log(posts),
            y=neighborhood,
            size=average_posts_per_user,
            color=users
         )
    ) + geom_point()
}
