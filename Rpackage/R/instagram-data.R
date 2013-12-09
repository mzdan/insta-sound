#' Loads the source instagram data and constrains it to the fields we care about.
#' @param path the path to the instagram data
#' @importFrom stringr str_split_fixed
#' @export
load_instagram_data <- function(path) {
    dat <- read.delim(path, stringsAsFactors=FALSE, header=TRUE, allowEscapes=TRUE)
    dat <- dat[-nrow(dat),] # Drop the last line
    #dat <- dat[-which(dat$published == ""),] # Drop rows which are missing a published date
    dat$published
    dat <- dat[, !(names(dat) %in% c('content', 'matching_rule', 'rule', 'title', 'updated', 'category'))]
    coordinates <- str_split_fixed(dat$point, " ", 2)
    dat$latitude <- coordinates[,1]
    dat$longitude <- coordinates[,2]
    dat
}

#' Writes instagram data to a new TSV file.
#' @param instagram_data e.g. loaded using load_instagram_data
#' @export
write_instagram_data <- function(instagram_data, path) {
    write.table(instagram_data, path, row.names=FALSE, sep="\t")
}

