\name{plot_all_web_images}
\alias{plot_all_web_images}
\title{Generates all plots used for the web application.}
\usage{
plot_all_web_images(posts, path)
}
\arguments{
  \item{posts}{instagram posts with neighborhoods}

  \item{path}{path in which to store the plots}
}
\description{
Generates all plots used for the web application.
}
\examples{
data(posts_sample)
plot_all_web_images(posts_sample, tempdir())
}

