#' Creates a plot of New York City, based on the five counties corresponding to the five boroughs.
#' @export
plot_ny_map <- function(counties=c('kings', 'queens', 'new york', 'bronx', 'richmond')) {

    county_df <- map_data('county')  #mappings of counties by state
    ny <- subset(county_df, region=="new york")   #subset just for NYS
    nyc <- ny[ny$county %in% counties,]

    nyc_map <- ggplot(nyc, aes(long, lat)) +
      geom_polygon(aes(group=group), colour='black', fill=NA) +
      coord_map()

}

#' Plot instagram map.
#' @param dat instagram data
#' @export
plot_instagram_map <- function(dat) {

    plot_ny_map() +
        geom_point(data=dat, aes(x=longitude, y=latitude, color=published_hour), alpha=0.1, size=0.5)

}


