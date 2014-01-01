#' Stores the list of valid neighborhoods in a JSON file.
#' @param path in which to store the file
#' @export
valid_neighborhoods <- function(path='../data/valid_neighborhoods.json') {
    neighborhoods <- unique(as.character(posts$neighborhood))
    write(toJSON(neighborhoods), '../data/valid_neighborhoods.json')
}
