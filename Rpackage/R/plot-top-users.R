#' Plots top user posts geographically.
#' @param posts instagram posts
#' @export
plot_top_users_map <- function(posts) {
    # TODO: Base plot should be of all instagram posts.
    # TODO: Add points for top user's average lat/lon. Point size is number of posts.
    top_users <- get_top_users(posts, 10)
    top_user_posts <- posts[posts$name %in% top_users$name,]
    plot_instagram_points(posts) +
        geom_point(top_users, aes(x=mean_longitude, y=mean_latitude, size=count, color=user))

}

#' Gets an ordered data frame of the top users
#' @param posts instagram posts
#' @export
get_top_users <- function(posts, limit) {
    user_freq <- count(posts, c('name'))
    user_freq[with(user_freq, order(-freq)),][1:limit,]
}

