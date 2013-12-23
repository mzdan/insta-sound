#' Parses and flattens NYC neighborhood polygons.
#' @param path to the neighborhoods JSON
#' @export
nyc_neighborhoods <- function(path) {
    nyc_neighborhoods_geodata <- fromJSON(file=path)
    flatten_nyc_neighborhood_geodata(nyc_neighborhoods_geodata)
}

#' Flattens a single geojson feature.
#' @param feature e.g. neighborhood geojson
#' @export
feature_flattener <- function(feature) {
    properties <- data.frame(feature$properties)
    print(sprintf("Flattening feature: %s", properties$NTACode))
    #coordinates <- ldply(feature$geometry$coordinates[[1]], rbind)
    coordinates <- data.frame(coord_arrays=length(feature$geometry$coordinates))
#    names(coordinates) <- c('longitude', 'latitude')
    data.frame(cbind(properties, coordinates))
}

#' Flattens NYC neighborhood data.
#' @param nyc_neighborhoods_geodata geodata format of NYC neighborhoods
#' @export
flatten_nyc_neighborhood_geodata <- function(nyc_neighborhoods_geodata) {
    ldply(nyc_neighborhoods_geodata$features, feature_flattener)
}


