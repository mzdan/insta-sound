\name{plot_base_map}
\alias{plot_base_map}
\title{Plot base map of the NYC area.}
\usage{
plot_base_map(posts, type = "mapbox")
}
\arguments{
  \item{posts}{instagram posts}

  \item{type}{type of tiles to use. See OpenStreetMap R
  package}
}
\description{
Plot base map of the NYC area.
}
\examples{
data(posts_sample)
plot_base_map(posts_sample)
}

