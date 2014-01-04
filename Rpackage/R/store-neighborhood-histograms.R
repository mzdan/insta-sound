#' Calculate the neighborhood statistics for use in sonification.
#' @param posts instagram posts with neighborhoods
#' @param path in which to store the neighborhood histograms
#' @export
#' @examples
#' data(posts_sample)
#' temporary_path <- tempdir()
#' store_neighborhood_histograms(posts_sample, temporary_path)
store_neighborhood_histograms <- function(posts, path) {

    d_ply(
        posts,
        .(neighborhood),
        function(d) {
            neighborhood = d[1, 'neighborhood']
            filename = sprintf('neighborhood_histogram_%s.json', neighborhood)
            print(sprintf("Saving: %s", filename))
            filepath = file.path(path, filename)
            neighborhood_hist <- hist(d$published_tod, plot=FALSE, breaks=seq(0,24 * 60,by=15))
            write(toJSON(neighborhood_hist), file=filepath)
        }
    )

}


