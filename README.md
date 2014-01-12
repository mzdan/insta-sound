# Insta-Sound

During the first week of October 2013 there were about 310,000 Instagram posts in New York City, from over 100,000 users.
What did they sound like?

This project represents an exploration of one week's worth of Instagram data using visualization and sonification.


## One part R, one part Web

The root directory contains the web application used to explore the data. An early version of the web application
was also used to reverse-map each instagram post to a NYC neighborhood.

An R package is used to load, clean, and analyze the data, as well as generate all images and data sets
used by the web application.

## License

This work is provided under The MIT License (MIT). See LICENSE.

## Development Resources

### Travis Build
https://travis-ci.org/yoni/insta-sound


## Example exploratory images

![Posts by time of day and location](/images/nyc_instagram_posts_by_tod.png)
![Posts by time of day](/images/nyc/nyc_tod_polar.png)
![Most active users map with time of day](/images/top_users_tod_map.png)

