#' Stores the list of valid neighborhoods in a JSON file.
#' @param posts instagram posts
#' @param path in which to store the file
#' @export
#' @examples
#' data(posts_sample)
#' valid_neighborhoods(posts_sample, tempdir())
valid_neighborhoods <- function(posts, path) {
    neighborhoods <- unique(as.character(posts$neighborhood))
    filepath <- file.path(path, 'valid_neighborhoods.json')
    write(toJSON(neighborhoods), filepath)
}
