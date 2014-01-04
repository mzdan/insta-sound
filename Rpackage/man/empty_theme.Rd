\name{empty_theme}
\alias{empty_theme}
\title{Creates an empty theme.}
\usage{
empty_theme()
}
\description{
Creates an empty theme.
}
\examples{
ggplot(data.frame(x=c(1,2,3), y=c(1,2,3)), aes(x,y)) + geom_point() + empty_theme()
}

