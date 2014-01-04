\name{store_neighborhood_histograms}
\alias{store_neighborhood_histograms}
\title{Calculate the neighborhood statistics for use in sonification.}
\usage{
store_neighborhood_histograms(posts, path)
}
\arguments{
  \item{posts}{instagram posts with neighborhoods}

  \item{path}{in which to store the neighborhood
  histograms}
}
\description{
Calculate the neighborhood statistics for use in
sonification.
}
\examples{
data(posts_sample)
temporary_path <- tempdir()
store_neighborhood_histograms(posts_sample, temporary_path)
}

