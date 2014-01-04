#' Exploratory analysis of instagram data in NYC.
#'
#' Note that there are several early-phase data loading and cleaning methods. Most of these should not be used
#' directly. Package data should be used, instead.
#'
#' @name instasound
#' @docType package
NULL

#' Instagram Posts from October 2013, including geo-located neighborhoods
#'
#' @name posts
#' @docType data
#' @author Yoni Ben-Meshulam \email{yoni.bmesh@@gmail.com}
#' @keywords data
NULL

#' Sample of Instagram Posts from October 2013, including geo-located neighborhoods
#'
#' The sample includes three neighborhoods only.
#'
#' @name posts_sample
#' @docType data
#' @author Yoni Ben-Meshulam \email{yoni.bmesh@@gmail.com}
#' @keywords data
NULL

if(getRversion() >= "2.15.1")
    globalVariables(c(
        'group',
        'lat',
        'latitude',
        'long',
        'longitude',
        'mean_latitude',
        'mean_longitude',
        'name',
        'neighborhood',
        'published',
        'published_tod',
        'region',
        'user',
        'users'
      )
    )
