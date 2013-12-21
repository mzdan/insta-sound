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

    # Prepare geographic variables
    coordinates <- str_split_fixed(dat$point, " ", 2)
    dat$latitude <- as.numeric(coordinates[,1])
    dat$longitude <- as.numeric(coordinates[,2])
    dat$point <- NULL
    dat <- dat[- which(is.na(dat$longitude)),]
    dat <- constrain_to_nyc(dat)

    # Prepare temporal variables
    FOUR_HOURS <- 60 * 60 * 4 # correct for the difference between GMT and EDT
    dat$published <- as.POSIXct(dat$published) - FOUR_HOURS
    dat$published_hour <- as.numeric(format(dat$published, "%H"))
    dat$published_date <- as.Date(dat$published)
    dat$published_date_factor <- as.factor(dat$published_date)

    dat

}

#' Writes instagram data to a new TSV file.
#' @param instagram_data e.g. loaded using load_instagram_data
#' @export
write_instagram_data <- function(instagram_data, path) {
    write.table(instagram_data, path, row.names=FALSE, sep="\t")
}


#' Constrains data to the New York City area (i.e. removes bad data).
#' @export
constrain_to_nyc <- function(dat) {
    dat[which(dat$longitude < -50 & dat$latitude > 40),]
}
