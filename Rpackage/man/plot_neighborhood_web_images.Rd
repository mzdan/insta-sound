\name{plot_neighborhood_web_images}
\alias{plot_neighborhood_web_images}
\title{Generates individual neighborhood stats plots.}
\usage{
plot_neighborhood_web_images(posts, path)
}
\arguments{
  \item{posts}{instagram posts for all neighborhoods}

  \item{path}{path in which to store the plots}
}
\description{
Generates individual neighborhood stats plots.
}
\examples{
data(posts_sample)
plot_neighborhood_web_images(posts_sample, tempdir())
}

