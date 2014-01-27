#' Plots top user posts geographically.
#' @param posts instagram posts
#' @export
#' @examples
#' data(posts_sample)
#' top_user_posts <- get_top_user_posts(posts_sample)
#' plot_top_users_map(top_user_posts)
plot_top_users_map <- function(top_user_posts) {

    plot_base_map(top_user_posts) +
        geom_point(data=top_user_posts, aes(x=longitude, y=latitude, color=published_tod/60)) +
        scale_color_tod() +
        facet_wrap(~name) +
        empty_theme_with_legend()

}

#' Plots the polar histogram of TOD with user names as facets
#' @export
#' @examples
#' data(posts_sample)
#' top_user_posts <- get_top_user_posts(posts_sample)
#' plot_top_users_tod_polar(top_user_posts)
plot_top_users_tod_polar <- function(top_user_posts) {
    plot_tod_polar(top_user_posts) + facet_wrap(~name)
}

#' Reduces posts to only thos of top users.
#' @export
get_top_user_posts <- function(posts, limit=9) {
    top_users <- calculate_top_users(posts, limit)
    top_user_posts <- posts[posts$name %in% top_users$name,]
    top_users <- calculate_top_users(posts, limit)
    posts[posts$name %in% top_users$name,]
}

#' Gets an ordered data frame of the top users
#' @param posts instagram posts
#' @param limit the number of top users to get
#' @export
#' @examples
#' data(posts_sample)
#' top_users <- calculate_top_users(posts_sample, 5)
calculate_top_users <- function(posts, limit) {
    user_freq <- count(posts, c('name'))
    user_freq[with(user_freq, order(-freq)),][1:limit,]
}

