\name{store_neighborhood_stats}
\alias{store_neighborhood_stats}
\title{Stores neighborhood_stats in the given path.}
\usage{
store_neighborhood_stats(neighborhood_stats, path)
}
\arguments{
  \item{neighborhood_stats}{stats}

  \item{path}{in which to store the stats}
}
\description{
Stores neighborhood_stats in the given path.
}
\examples{
data(posts_sample)
neighborhood_stats <- calculate_neighborhood_stats(posts_sample)
store_neighborhood_stats(neighborhood_stats, tempdir())
}

