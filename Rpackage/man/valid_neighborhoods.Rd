\name{valid_neighborhoods}
\alias{valid_neighborhoods}
\title{Stores the list of valid neighborhoods in a JSON file.}
\usage{
valid_neighborhoods(posts, path)
}
\arguments{
  \item{posts}{instagram posts}

  \item{path}{in which to store the file}
}
\description{
Stores the list of valid neighborhoods in a JSON file.
}
\examples{
data(posts_sample)
valid_neighborhoods(posts_sample, tempdir())
}

