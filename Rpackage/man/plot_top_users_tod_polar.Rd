\name{plot_top_users_tod_polar}
\alias{plot_top_users_tod_polar}
\title{Plots the polar histogram of TOD with user names as facets}
\usage{
plot_top_users_tod_polar(top_user_posts)
}
\description{
Plots the polar histogram of TOD with user names as facets
}
\examples{
data(posts_sample)
top_user_posts <- get_top_user_posts(posts_sample)
plot_top_users_tod_polar(top_user_posts)
}

