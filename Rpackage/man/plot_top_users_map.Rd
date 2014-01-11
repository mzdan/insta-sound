\name{plot_top_users_map}
\alias{plot_top_users_map}
\title{Plots top user posts geographically.}
\usage{
plot_top_users_map(top_user_posts)
}
\arguments{
  \item{posts}{instagram posts}
}
\description{
Plots top user posts geographically.
}
\examples{
data(posts_sample)
top_user_posts <- get_top_user_posts(posts_sample)
plot_top_users_map(top_user_posts)
}

