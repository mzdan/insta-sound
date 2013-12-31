#' Calculate the neighborhood statistics for use in sonification.
#' @param posts instagram posts with neighborhoods
#' @export
calculate_neighborhood_statistics <- function(posts) {

    d_ply(
        posts,
        .(neighborhood),
        function(d) {
            neighborhood = d[1, 'neighborhood']
            filename = sprintf('neighborhood_histogram_%s.json', neighborhood)
            print(sprintf("Saving: %s", filename))
            path = file.path('../data/neighborhood_histogram', filename)
            neighborhood_hist <- hist(d$published_tod, plot=FALSE, breaks=seq(0,24 * 60,by=15))
            write(toJSON(neighborhood_hist), file=path)
        }
    )

}


