\name{plot_tod_animation_frames}
\alias{plot_tod_animation_frames}
\title{Plots a bunch of frames for use in animation.}
\usage{
plot_tod_animation_frames(posts, path, number_of_seconds = 5,
  frames_per_second = 24)
}
\arguments{
  \item{posts}{instagram posts}
}
\description{
Plots a bunch of frames for use in animation.
}
\examples{
data(posts_sample)
plot_tod_animation_frames(posts_sample, tempdir(), number_of_seconds=2, frames_per_second=1)
}

