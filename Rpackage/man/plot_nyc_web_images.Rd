\name{plot_nyc_web_images}
\alias{plot_nyc_web_images}
\title{Generates nyc plots.}
\usage{
plot_nyc_web_images(posts, path)
}
\arguments{
  \item{posts}{instagram posts for all neighborhoods}

  \item{path}{path in which to store the plots}
}
\description{
Generates nyc plots.
}
\examples{
data(posts_sample)
plot_nyc_web_images(posts_sample, tempdir())
}

