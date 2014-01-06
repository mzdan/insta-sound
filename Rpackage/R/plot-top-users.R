#' Plots top user posts geographically.
#' @param posts instagram posts
#' @export
#' @examples
#' data(posts_sample)
#' plot_top_users_map(posts_sample)
plot_top_users_map <- function(posts) {
    top_users <- calculate_top_users(posts, 9)
    top_user_posts <- posts[posts$name %in% top_users$name,]

    plot_base_map(posts) +
    top_users <- calculate_top_users(posts, 9)
    top_user_posts <- posts[posts$name %in% top_users$name,]

    plot_base_map(posts) +
        geom_point(data=top_user_posts, aes(x=longitude, y=latitude, color=published_tod/60)) +
        scale_color_gradientn(colours=c("navy", "#FCD116", "navy"), name="Time of Day") +
        facet_wrap(~name) +
        empty_theme_with_legend()

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

