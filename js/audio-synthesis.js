(function() {

    // Responsible for all of the audio synthesis logic.

    if(!window.instasound) {
        window.instasound = {};
    }

    var beatNote = Note.fromLatin('A3');  // base note for scale
    var beatScale = beatNote.scale('minor pentatonic');  // scale = array of notes
    var beatScaleFrequencies = beatScale.map(function(n) {return n.frequency();})


    function calculateFrequencies(roots, scale) {

        var frequencies = [];
        for(var i = 0; i < roots.length; i++) {
            var n = Note.fromLatin(roots[i]);  // base note for scale
            var s = n.scale(scale);  // scale = array of notes
            var scaleFrequencies = s.map(function(n) {return n.frequency();})
            frequencies = frequencies.concat(scaleFrequencies);
        }

        return frequencies;
    }
    var melodyScaleFrequencies = calculateFrequencies(["E3", "E4", "E5"], "major");
    console.log(melodyScaleFrequencies);

    /**
     * Stop all previous audio from running.
     */
    function stopAudio() {

        instasound.audio.clock.clearAll();

        if(instasound.audio.synth) {
            instasound.audio.synth.pause();
        }

        if(instasound.audio.beatSynth) {
            instasound.audio.beatSynth.pause();
        }

    }

    /**
     * For a given neighborhood's time-of-day instagram post histogram:
     * 1. Map values from the original scale to a human-audible frequency scale
     * 2. Schedule the notes to play over the course of PLAY_TIME_SECONDS
     * @param error d3.js error loading neighborhood histogram data
     * @param neighborhoodHistogram counts, density, and intervals of neighborhood instagram posts for each time-of-day
     */
    function playNeighborhoodHistogram(error, neighborhoodHistogram) {
        stopAudio();

        var neighborhoodCounts = neighborhoodHistogram.counts;

        var frequencyScale = d3.scale.quantize()
            .domain([d3.min(neighborhoodCounts),d3.max(neighborhoodCounts)])
            .range(melodyScaleFrequencies);

        var frequencies = neighborhoodCounts.map(frequencyScale);
        console.log(frequencies);
        var timeOfDayFrequencies = frequencies.map(function(frequency, i) {
            return beatScaleFrequencies[Math.floor(i/(frequencies.length/4))];
        });

        var noteTimeSeconds = instasound.audio.PLAY_TIME_SECONDS/frequencies.length;

        instasound.synth = flock.synth({
            nickName: "sin-synth",
            synthDef: {
                id: "carrier",
                ugen: "flock.ugen.sinOsc",
                freq: {
                    ugen: "flock.ugen.sequence",
                    freq: 1 / noteTimeSeconds,
                    list: frequencies
                },
                mul: {
                    ugen: "flock.ugen.line",
                    start: 0.5,
                    end: 0.5,
                    duration: 0.0
                }
            }
        });

        instasound.beatSynth = flock.synth({
            nickName: "beat-synth",
            synthDef: [{
                id: "carrier-left",
                ugen: "flock.ugen.sinOsc",
                freq: {
                    ugen: "flock.ugen.sequence",
                    freq: 1 / noteTimeSeconds,
                    list: timeOfDayFrequencies
                },
                mul: {
                    ugen: "flock.ugen.line",
                    start: 0.5,
                    end: 0.5,
                    duration: 0.0
                }
            }, {
                id: "carrier-right",
                ugen: "flock.ugen.sinOsc",
                freq: {
                    ugen: "flock.ugen.sequence",
                    freq: 1 / noteTimeSeconds,
                    list: timeOfDayFrequencies.map(function (f) {
                        return f + 4;
                    })
                },
                mul: {
                    ugen: "flock.ugen.line",
                    start: 0.5,
                    end: 0.5,
                    duration: 0.0
                }
            }]
        });

        function fadeOutAmp(synthName, atTime, startMul, endMul, duration, carriers) {
            var values = {};
            for (var i = 0; i < carriers.length; i++) {
                values[carriers[i] + ".mul.start"] = startMul;
                values[carriers[i] + ".mul.end"] = endMul;
                values[carriers[i] + ".mul.duration"] = duration;
            }
            return {
                interval: "once",
                time: atTime,
                change: {
                    synth: synthName,
                    values: values
                }
            };
        }

        var fadeOutTime = instasound.audio.PLAY_TIME_SECONDS;

        instasound.audio.clock.schedule([
            fadeOutAmp("sin-synth", fadeOutTime, 0.5, 0.0, 0.5, ['carrier']),
            fadeOutAmp("beat-synth", fadeOutTime, 0.5, 0.0, 0.5, ['carrier-left', 'carrier-right'])
        ]);

        flock.enviro.shared.play();

    }

    instasound.audio = {
        // Initialize Flocking.js clock and synth. We need these to be shared across plays so that we can
        // start/stop the synth.
        clock: flock.scheduler.async(),
        synth: undefined,
        beatSynth: undefined,
        PLAY_TIME_SECONDS : 12,
        MIN_FREQUENCY : 80,
        MAX_FREQUENCY : 800,
        playNeighborhoodHistogram: playNeighborhoodHistogram
    };

})();