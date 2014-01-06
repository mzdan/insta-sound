#' Creates an empty theme.
#' @export
#' @examples
#' ggplot(data.frame(x=c(1,2,3), y=c(1,2,3)), aes(x,y)) + geom_point() + empty_theme()
empty_theme <- function() {
    theme(axis.line=element_blank(),
          axis.text.x=element_blank(),
          axis.text.y=element_blank(),
          axis.ticks=element_blank(),
          axis.title.x=element_blank(),
          axis.title.y=element_blank(),
          legend.position="none",
          panel.background=element_blank(),
          panel.border=element_blank(),
          panel.grid.major=element_blank(),
          panel.grid.minor=element_blank(),
          plot.background=element_blank())
}

#' Creates an empty theme, leaving the legend in.
#' @export
empty_theme_with_legend <- function() {
    theme(axis.line=element_blank(),
          axis.text.x=element_blank(),
          axis.text.y=element_blank(),
          axis.ticks=element_blank(),
          axis.title.x=element_blank(),
          axis.title.y=element_blank(),
          panel.background=element_blank(),
          panel.border=element_blank(),
          panel.grid.major=element_blank(),
          panel.grid.minor=element_blank(),
          plot.background=element_blank())
}

#' Creates a gradient color scale for time of day.
#' @param night the color to use for nighttime
#' @param day the color to use for daytime
#' @export
scale_color_tod <- function(night="navy", day="#FCD116") {
    scale_color_gradientn(colours=c(night, day, night), name="Time of Day")
}

