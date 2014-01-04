\name{calculate_top_users}
\alias{calculate_top_users}
\title{Gets an ordered data frame of the top users}
\usage{
calculate_top_users(posts, limit)
}
\arguments{
  \item{posts}{instagram posts}

  \item{limit}{the number of top users to get}
}
\description{
Gets an ordered data frame of the top users
}
\examples{
data(posts_sample)
top_users <- calculate_top_users(posts_sample, 5)
}

