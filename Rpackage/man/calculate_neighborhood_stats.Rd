\name{calculate_neighborhood_stats}
\alias{calculate_neighborhood_stats}
\title{Calculate summary statistics about the neighborhoods.}
\usage{
calculate_neighborhood_stats(posts)
}
\arguments{
  \item{posts}{instagram posts, including neighborhoods}
}
\description{
Calculate summary statistics about the neighborhoods.
}
\examples{
data(posts_sample)
neighborhood_stats <- calculate_neighborhood_stats(posts_sample)
}

