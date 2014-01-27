\name{tod_to_frame}
\alias{tod_to_frame}
\title{Scales times of day (0 to 1440) to the frame number.}
\usage{
tod_to_frame(tod, number_of_frames)
}
\description{
Scales times of day (0 to 1440) to the frame number.
}
\examples{
stopifnot(tod_to_frame(0, 24) == 0)
stopifnot(tod_to_frame(59, 24) == 0)
stopifnot(tod_to_frame(1439, 24) == 23)
stopifnot(tod_to_frame(seq(0, 23, 1) * 60, 24) == seq(0, 23, 1))
}

