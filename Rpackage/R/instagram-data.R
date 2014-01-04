# Several early-phase data loading and cleaning methods. Most of these should not be used directly, rather
# the package data should be used, instead.

#' Loads the source instagram data and constrains it to the fields we care about.
#' @param path the path to the instagram data
#' @importFrom stringr str_split_fixed
#' @export
load_instagram_data <- function(path) {
    read.table(path, sep="\t", stringsAsFactors=FALSE, header=TRUE, fill=TRUE)
}

#' Prepare data.
#' @param dat raw instagram data to transform
#' @export
prepare_instagram_data <- function(dat) {

    # Drop columns we're not using
    drops <- c(
        'category',
        'content',
        'link_alternate',
        'link_avatar',
        'link_self',
        'matching_rule',
        'rule',
        'title',
        'updated',
        'uri'
    )
    dat <- dat[,!(names(dat) %in% drops)]

    dat <- prepare_geographic(dat)
    dat <- constrain_to_nyc(dat)
    dat <- prepare_temporal(dat)

    dat

}

#' Prepares all of the geographic variables.
#' @param dat instagram_data e.g. loaded from raw CSV
#' @export
prepare_geographic <- function(dat) {
    # Prepare geographic variables
    coordinates <- str_split_fixed(dat$point, " ", 2)
    dat$latitude <- as.numeric(coordinates[,1])
    dat$longitude <- as.numeric(coordinates[,2])
    dat$point <- NULL
    dat <- dat[- which(is.na(dat$longitude)),]
    dat
}

#' Prepares all of the temporal variables.
#' @param dat instagram_data e.g. loaded from raw CSV
#' @export
prepare_temporal <- function(dat) {
    # Prepare temporal variables
    FOUR_HOURS <- 60 * 60 * 4 # correct for the difference between GMT and EDT
    dat$published <- as.POSIXct(dat$published) - FOUR_HOURS
    dat$published_hour <- as.numeric(format(dat$published, "%H"))
    dat$published_date <- as.Date(dat$published)
    dat$published_date_factor <- as.factor(dat$published_date)

    # Add time differences in seconds
    dat <- dat[with(dat, order(published)), ]
    dat$difference <- c(0, diff(dat$published))

    dat
}

#' Writes instagram data to a new TSV file.
#' @param instagram_data e.g. loaded using load_instagram_data
#' @param path in which to store the data
#' @export
write_instagram_data <- function(instagram_data, path) {
    instagram_data$published_date_factor <- NULL
    write.table(instagram_data, path, row.names=FALSE, sep="\t")
}


#' Constrains data to the New York City area (i.e. removes bad data).
#' @param dat data containing geographic coordinates
#' @export
constrain_to_nyc <- function(dat) {
    dat[which(dat$longitude < -50 & dat$latitude > 40),]
}


#' Loads posts, including neighborhoods, and adds some derived values.
#' @param path the path to the posts TSV file
#' @export
load_posts <- function(path) {
    posts <- read.delim(path, stringsAsFactors=FALSE)
    posts$published <- as.POSIXct(posts$published)
    posts$published_lt <- as.POSIXlt(posts$published)
    posts$published_tod <- posts$published_lt$hour * 60 + posts$published_lt$min
    posts$published_lt <- NULL
    posts
}


