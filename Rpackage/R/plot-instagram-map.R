#' Creates a plot of New York City, based on the five counties corresponding to the five boroughs.
#' @export
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
plot_instagram_map <- function(posts) {

    plot_ny_map() +
        geom_point(data=dat, aes(x=longitude, y=latitude, color=neighborhood), alpha=0.1, size=0.5)

}

#' Plots instagram map with no geographic map underneath.
#' @param posts instagram posts
#' @export
plot_instagram_points <- function(posts) {
    ggplot(posts, aes(x=longitude, y=latitude), alpha=0.5, size=0.0001) +
        geom_point() +
        coord_map()
}

#' Plots an instagram map with no geographic map underneath, and with the average location.
#' @param posts instagram posts
#' @export
plot_instagram_points_with_average <- function(posts) {
    avg_latitude = mean(posts$latitude)
    avg_longitude = mean(posts$longitude)
    plot_instagram_points(posts) +
        geom_point(x=avg_longitude, y=avg_latitude, size=8, color='red')
}
