#' Plots a bunch of frames for use in animation.
#' @param posts instagram posts
#' @export
#' @examples
#' data(posts_sample)
#' plot_tod_animation_frames(posts_sample, tempdir(), number_of_seconds=2, frames_per_second=1)
plot_tod_animation_frames <- function(posts, path, number_of_seconds=5, frames_per_second=24) {

    path_to_jpg <- tempfile(pattern='instasound')
    dir.create(path_to_jpg)

    number_of_frames <- frames_per_second * number_of_seconds
    posts$frame <- tod_to_frame(posts$published_tod, number_of_frames)

    message("Generating mpeg from instagram posts by time of day.")
    message("Number of frames: ", length(unique(posts$frame)))
    message("Plotting individual frames to: ", path_to_jpg)
    base_plot <- plot_base_map(posts, type="osm-bbike")

    d_ply(
        posts,
        .(frame),
        function(d) {
            min_time_of_day <- min(d$published_tod)
            max_time_of_day <- max(d$published_tod)
            frame <- unique(d$frame)[1]
            message("Generating plot for frame: ", frame)
            filename <- sprintf("%04d_instagram_posts_%s-%s.jpg", frame, min_time_of_day, max_time_of_day)
            filepath <- file.path(path_to_jpg, filename)

            title <-sprintf("%s:00", max_time_of_day %/% 60)

            base_plot +
                geom_point(data=d, aes(x=longitude, y=latitude), size=0.3) +
                ggtitle(title) +
                empty_theme()

            ggsave(filepath, height=6, width=4)
        }
    )

    delay <- 10 * number_of_frames/max(posts$frame)
    jpg_files <- file.path(path_to_jpg, "*.jpg")
    target_path <- file.path(path, 'nyc_instagram_by_tod.mpg')
    command <- sprintf("convert -delay %s %s %s", delay, jpg_files, target_path)

    message("Converting jpg files to mpg: ", target_path)
    system(command)

    message("Deleting intermediate frame jpg files")
    unlink(path_to_jpg)

}

#' Scales times of day (0 to 1440) to the frame number.
#' @export
#' @examples
#' stopifnot(tod_to_frame(0, 24) == 0)
#' stopifnot(tod_to_frame(59, 24) == 0)
#' stopifnot(tod_to_frame(1439, 24) == 23)
#' stopifnot(tod_to_frame(seq(0, 23, 1) * 60, 24) == seq(0, 23, 1))
tod_to_frame <- function(tod, number_of_frames) {
    (tod * number_of_frames) %/% 1440
}

