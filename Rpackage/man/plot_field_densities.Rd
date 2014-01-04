\name{plot_field_densities}
\alias{plot_field_densities}
\title{Plots some exploratory analysis of the data.}
\usage{
plot_field_densities(posts, path)
}
\arguments{
  \item{posts}{instagram posts including neighborhoods}

  \item{path}{in which to store field density plots}
}
\description{
Plots some exploratory analysis of the data.
}
\examples{
data(posts_sample)
temporary_path <- tempdir()
plot_field_densities(posts_sample, temporary_path)
}

