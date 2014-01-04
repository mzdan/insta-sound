\name{plot_neighborhood_tod_polar}
\alias{plot_neighborhood_tod_polar}
\title{Generates a polar TOD plot for each neighborhood.}
\usage{
plot_neighborhood_tod_polar(posts, path)
}
\arguments{
  \item{posts}{instagram posts with neighborhoods}

  \item{path}{in which to store plots}
}
\description{
Generates a polar TOD plot for each neighborhood.
}
\examples{
data(posts_sample)
plot_neighborhood_tod_polar(posts_sample, tempdir())
}

