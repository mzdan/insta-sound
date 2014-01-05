#' Creates a plot of New York City, based on the five counties corresponding to the five boroughs.
#' @param counties which NYC counties to include. Defaults to all five borough counties.
#' @export
#' @examples
#' plot_ny_map()
plot_ny_map <- function(counties=c('kings', 'queens', 'new york', 'bronx', 'richmond')) {

    county_df <- map_data('county')  #mappings of counties by state
    ny <- subset(county_df, region=="new york")   #subset just for NYS
    nyc <- ny[ny$subregion %in% counties,]

    ggplot(nyc, aes(long, lat)) +
      geom_polygon(aes(group=group), colour='black', fill=NA) +
      coord_map()

}

#' Plot instagram map.
#' @param posts instagram data
#' @export
#' @examples
#' data(posts_sample)
#' plot_instagram_map(posts_sample)
plot_instagram_map <- function(posts) {

    plot_ny_map() +
        geom_point(data=posts, aes(x=longitude, y=latitude, color=neighborhood), alpha=0.1, size=0.5)

}

#' Shared function for plotting instagram points. Uses in other plots.
#' @param posts instagram posts
plot_instagram_point_base <- function(posts) {
    ggplot(posts, aes(x=longitude, y=latitude)) +
        coord_map() +
        empty_theme()
}

#' Plots instagram map with no geographic map underneath.
#' @param posts instagram posts
#' @export
#' @examples
#' data(posts_sample)
#' plot_instagram_points(posts_sample)
plot_instagram_points <- function(posts) {
    plot_instagram_point_base(posts) +
        geom_point(size=0.3)
}

#' Plots instagram map with no geographic map underneath. Use color to represent the time of day.
#' @param posts instagram posts
#' @export
#' @examples
#' data(posts_sample)
#' plot_instagram_points_with_tod(posts_sample)
plot_instagram_points_with_tod <- function(posts) {
    plot_instagram_point_base(posts) +
        geom_point(aes(color=published_tod), size=0.3)
}

#' Plots an instagram map with no geographic map underneath, and with the average location.
#' @param posts instagram posts
#' @export
#' @examples
#' data(posts_sample)
#' plot_instagram_points_with_average(posts_sample)
plot_instagram_points_with_average <- function(posts) {
    avg_latitude = mean(posts$latitude)
    avg_longitude = mean(posts$longitude)
    plot_instagram_points(posts) +
        geom_point(x=avg_longitude, y=avg_latitude, size=8, color='red')
}
