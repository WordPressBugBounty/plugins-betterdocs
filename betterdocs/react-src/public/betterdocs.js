/**
 * macOS ships these alongside its real voices, and `getVoices()` returns them in
 * the same list with the same `lang`. They sing, whisper, or run the text through
 * a robot filter — none of them can read an article, and picking one is the single
 * worst thing this feature can do. "Albert" is the one that bites: it sorts near
 * the top of an `en-US` list and sounds like a cartoon.
 */
const BD_NOVELTY_VOICES = /^(albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|jester|organ|pipe organ|superstar|trinoids|whisper|wobble|zarvox)\b/i;

/**
 * The older compact macOS voices. Intelligible, unlike the novelty set, but flat
 * and buzzy next to anything modern — so they are pushed down the ranking rather
 * than excluded, and still get used on a machine that has nothing else.
 */
const BD_LEGACY_VOICES = /^(agnes|bruce|fred|junior|kathy|princess|ralph|vicki|victoria)\b/i;

/**
 * Voices that are known to be both decent and *local*, by platform.
 *
 * The local part is the point. A remote voice sounds better when it works, but
 * when it does not it is silent rather than loud about it — the fetch fails, the
 * engine fires `end`, and the reader watches a progress bar advance in silence.
 * There is no API that reports whether audio is actually coming out, so the only
 * defence is to prefer voices that cannot fail that way.
 */
const BD_GOOD_VOICES = /^(samantha|alex|ava|allison|susan|tom|karen|daniel|serena|moira|fiona|tessa|veena|rishi)\b|google|microsoft/i;

/**
 * Listen — one instance of the pill that morphs into an audio player.
 *
 * The voice is the browser's: `window.speechSynthesis`. There is no audio file,
 * no server round trip and no API key, which is what makes this shippable in
 * Free — and which dictates almost everything below, because the Web Speech API
 * gives you "start talking" and "stop talking" and nothing else:
 *
 *  - **No duration.** Nothing can be measured before playback, so the total is
 *    estimated from the doc's word count (rendered into `data-bd-total` by
 *    Core\Listen) and rescaled whenever the rate changes.
 *  - **No seeking.** The only way to move is to cancel and start speaking from
 *    somewhere else, so the text is split into chunks up front and a seek
 *    restarts the chunk containing the target offset.
 *  - **No rate change mid-utterance.** `SpeechSynthesisUtterance.rate` is fixed
 *    once `speak()` has been called, so the speed control also restarts the
 *    current chunk.
 *  - **Long utterances are unreliable.** Chrome stalls or truncates one that runs
 *    much past ~15 seconds. Chunking fixes that too, which is the main reason the
 *    text is chunked rather than spoken in one go.
 *
 * Position is tracked in seconds and corrected from `boundary` events wherever
 * the browser fires them (Chrome, Firefox and Safari 14+ all do, per word). The
 * 250ms timer is not a fallback for the display — it is what keeps the bar moving
 * smoothly *between* those events, and what keeps it moving at all on an engine
 * that fires none.
 */
class BetterDocsListen {
    /**
     * @param {HTMLElement} el     The `.betterdocs-listen` wrapper.
     * @param {Object}      config `betterdocsConfig.listen`.
     */
    constructor(el, config) {
        this.el = el;
        this.config = config || {};
        this.i18n = this.config.i18n || {};

        this.trigger = el.querySelector(".betterdocs-listen-trigger");
        this.player = el.querySelector(".betterdocs-listen-player");
        this.playButton = el.querySelector(".betterdocs-listen-play");
        this.seek = el.querySelector(".betterdocs-listen-seek");
        this.fill = el.querySelector(".betterdocs-listen-fill");
        this.thumb = el.querySelector(".betterdocs-listen-thumb");
        this.elapsedEl = el.querySelector(".betterdocs-listen-elapsed");
        this.totalEl = el.querySelector(".betterdocs-listen-total");
        this.speedButton = el.querySelector(".betterdocs-listen-speed");
        this.status = el.querySelector(".betterdocs-listen-status");

        const rates = Array.isArray(this.config.rates) && this.config.rates.length
            ? this.config.rates
            : [1, 1.25, 1.5, 2, 0.75];
        this.rates = rates.map(Number).filter((rate) => rate > 0);
        this.rateIndex = 0;

        // The estimate Core\Listen rendered, at rate 1. `duration` is this divided
        // by the current rate; `base` is kept so the division is never applied twice.
        this.base = parseFloat(el.getAttribute("data-bd-total")) || 0;
        this.duration = this.base;
        this.position = 0;

        this.text = null;
        this.pending = null;
        this.chunks = [];
        this.offsets = [];
        this.totalChars = 0;
        this.index = 0;

        this.active = false;
        this.playing = false;
        // Bumped on every cancel. Utterance callbacks carry the generation they were
        // created in and return early if it has moved on — `speechSynthesis.cancel()`
        // fires `end` and `error` on whatever was speaking, and without this a
        // cancelled chunk's `end` handler would queue the next one over the top of
        // the chunk the seek had just started.
        this.generation = 0;
        // Set when pause() turned out not to work (some Android builds), so resume()
        // knows to re-speak rather than call an API that will do nothing.
        this.pauseUnsupported = false;
        // Whether THIS pill is paused. Deliberately not read off
        // `speechSynthesis.paused`: there is one speech engine per browser, shared by
        // every pill on the page, so the global flag answers "is anything paused"
        // rather than "is this paused" — and it stays set after a cancel (see
        // cancel()). Reading it per-instance made a second pill report itself as
        // playing while resuming an empty queue, in silence.
        this.paused = false;

        // Resolved once per pill rather than per utterance: the pick scans every
        // installed voice, and a long doc is a few hundred utterances. Null until
        // resolved, and only ever memoized once it is truthy — `getVoices()` is
        // empty until Chrome has loaded the list, and a null cached then would
        // stick for the life of the page.
        this.voiceResolved = null;
        // Set when a chosen voice failed to speak, so the retry uses the engine's
        // own default instead of picking the same broken one again.
        this.voiceBlocked = false;
        // Fires if the engine accepts an utterance and then produces nothing at
        // all — see enqueue(). Cleared by the first sign of life.
        this.watchdog = null;
        // The utterance currently queued. Kept alive deliberately — see enqueue().
        this.utterance = null;
        // The fast-finish check below is worth making once per playback, on the
        // first chunk; a short trailing chunk legitimately ends quickly.
        this.silenceChecked = false;

        this.onTick = this.onTick.bind(this);
        this.reserveClockWidth();
        this.render();
    }

    get synth() {
        return window.speechSynthesis;
    }

    // ── Text ────────────────────────────────────────────────────────────────

    /**
     * The words to speak, resolved once and kept.
     *
     * The page the reader is already looking at comes first: it needs no request,
     * it cannot disagree with what is on screen, and it works with the Markdown
     * endpoint switched off. The `.md` address is the fallback for a placement
     * with no doc body around it — a shortcode in a sidebar, say.
     *
     * @return {Promise<string>}
     */
    resolveText() {
        if (this.text) {
            return Promise.resolve(this.text);
        }
        if (this.pending) {
            return this.pending;
        }

        // Only when this pill's doc is the page being viewed (Core\Listen decides,
        // see `data-bd-read-page`). A `[betterdocs_listen post_id=…]` placed on
        // any other page would otherwise read that page's content aloud instead.
        const fromPage = this.el.getAttribute("data-bd-read-page") === "1"
            ? this.textFromPage()
            : "";
        if (fromPage) {
            this.text = fromPage;
            return Promise.resolve(fromPage);
        }

        const url = this.el.getAttribute("data-bd-listen-url");
        if (!url) {
            return Promise.reject(new Error("No text to read"));
        }

        this.pending = fetch(url, {
            credentials: "same-origin",
            headers: { Accept: "text/markdown" },
        })
            .then((res) => {
                const type = res.headers.get("content-type") || "";
                // A 403 refusal or a themed HTML fallback must never be read aloud.
                if (!res.ok || type.indexOf("text/markdown") !== 0) {
                    throw new Error(`Unexpected response: ${res.status} ${type}`);
                }
                return res.text();
            })
            .then((markdown) => {
                this.text = BetterDocsListen.fromMarkdown(markdown);
                this.pending = null;

                if (!this.text) {
                    throw new Error("Nothing to read");
                }
                return this.text;
            })
            .catch((error) => {
                this.pending = null;
                throw error;
            });

        return this.pending;
    }

    /**
     * Spoken text lifted out of the rendered doc body.
     *
     * @return {string} "" when no configured container is on this page.
     */
    textFromPage() {
        const selectors = Array.isArray(this.config.read) ? this.config.read : [];

        for (let i = 0; i < selectors.length; i++) {
            const root = document.querySelector(selectors[i]);
            if (!root) {
                continue;
            }

            const text = this.extract(root);
            // A container that yielded almost nothing is the wrong container — an
            // empty `.entry-content` wrapper around the real one, most often — so
            // fall through to the next selector rather than reading two words.
            if (text.length > 120) {
                return text;
            }
        }

        return "";
    }

    /**
     * @param {HTMLElement} root
     * @return {string}
     */
    extract(root) {
        const clone = root.cloneNode(true);
        const skip = this.config.skip;

        if (skip) {
            // Code above all: a synthetic voice reading a shell snippet one
            // character at a time is unusable, and skipping the block is what a
            // person reading aloud would do too.
            clone.querySelectorAll(skip).forEach((node) => node.remove());
        }

        // Block boundaries become full stops. Without them the voice runs a heading
        // straight into the paragraph under it with no pause at all, which is the
        // single biggest thing that makes machine reading sound wrong.
        clone
            .querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,blockquote,tr,th,td,dt,dd,summary,figcaption,br,div")
            .forEach((node) => {
                node.insertAdjacentText("afterend", ". ");
            });

        // textContent, not innerText: the clone is detached, so innerText has no
        // layout to consult and degrades to textContent anyway — with a per-browser
        // difference in whether it bothers. The separators above do the job
        // innerText would have done.
        return BetterDocsListen.tidy(clone.textContent || "");
    }

    /**
     * Markdown reduced to speakable prose.
     *
     * Not a parser and not trying to be: every rule here removes syntax that would
     * otherwise be pronounced. The `copy` profile this fetches has no YAML front
     * matter, but it does carry a `Source:` line, and a voice reading a URL aloud
     * character by character is the worst thing this feature could do.
     *
     * @param {string} markdown
     * @return {string}
     */
    static fromMarkdown(markdown) {
        return BetterDocsListen.tidy(
            String(markdown || "")
                // YAML front matter, in case a filter put the `endpoint` profile here.
                .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "")
                // The `copy` profile puts a one-line summary under the title as a
                // blockquote. It is the opening of the doc again, flattened and cut
                // off with an ellipsis — table pipes and `##` included — so reading
                // it means hearing the first paragraph twice, the second time garbled.
                .replace(/^(#[^\n]*\r?\n(?:[ \t]*\r?\n)*)>[^\n]*\r?\n/, "$1")
                .replace(/^Source:\s*\S+\s*$/gm, "")
                .replace(/```[\s\S]*?```/g, " ")
                .replace(/~~~[\s\S]*?~~~/g, " ")
                .replace(/`([^`]*)`/g, "$1")
                .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
                .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
                .replace(/^[ \t]{0,3}>[ \t]?/gm, "")
                .replace(/^[ \t]{0,3}#{1,6}[ \t]+/gm, "")
                .replace(/^[ \t]{0,3}([-*_][ \t]*){3,}$/gm, " ")
                .replace(/^[ \t]{0,3}[-*+][ \t]+/gm, "")
                .replace(/^[ \t]{0,3}\d+\.[ \t]+/gm, "")
                .replace(/(\*\*|__)([\s\S]*?)\1/g, "$2")
                .replace(/(\*|_)([^*_\n]+?)\1/g, "$2")
                // Table rows. A voice reading pipes and dashes is noise, and a table
                // read cell-by-cell without its headers is worse than silence.
                .replace(/^[ \t]*\|.*$/gm, " ")
                .replace(/<[^>]+>/g, " ")
                // A blank line is a paragraph break, which should sound like one.
                .replace(/\r?\n[ \t]*\r?\n/g, ". ")
        );
    }

    /**
     * Collapse whitespace and the punctuation pile-ups the separators above leave
     * behind, so a heading that already ended in "?" is not followed by a stop.
     *
     * @param {string} text
     * @return {string}
     */
    static tidy(text) {
        return String(text || "")
            .replace(/\s+/g, " ")
            .replace(/\s+([.,!?;:…])/g, "$1")
            .replace(/([.!?…])(?:\s*\.)+/g, "$1")
            .replace(/(\.\s*){2,}/g, ". ")
            // The separators are appended *after* each block, so a container whose
            // first child is one leaves a stop with nothing in front of it.
            .replace(/^[\s.]+/, "")
            .trim();
    }

    /**
     * Split the text into utterance-sized pieces, on sentence boundaries where
     * there are any, and record where each one starts.
     *
     * The offsets are what make seeking possible: a fraction of the bar maps to a
     * character offset, which maps to the chunk that contains it.
     *
     * @param {string} text
     */
    prepare(text) {
        // A capturing match rather than a lookbehind split: lookbehind only reached
        // Safari in 16.4, and this has to work further back than that.
        const sentences = text.match(/[^.!?…]+[.!?…]*\s*/g) || [text];
        const max = 200;
        const chunks = [];
        let current = "";

        const flush = () => {
            const trimmed = current.trim();
            if (trimmed) {
                chunks.push(trimmed);
            }
            current = "";
        };

        sentences.forEach((sentence) => {
            // One sentence longer than a whole chunk — a list rendered as prose, or
            // text with no punctuation at all. Break it at spaces so a word is never
            // cut in half, which the voice would pronounce as two nonsense words.
            if (sentence.length > max) {
                flush();
                let rest = sentence;
                while (rest.length > max) {
                    let cut = rest.lastIndexOf(" ", max);
                    if (cut <= 0) {
                        cut = max;
                    }
                    chunks.push(rest.slice(0, cut).trim());
                    rest = rest.slice(cut);
                }
                current = rest;
                return;
            }

            if (current.length + sentence.length > max) {
                flush();
            }
            current += sentence;
        });
        flush();

        this.chunks = chunks.filter((chunk) => chunk.length > 0);
        this.offsets = [];
        this.totalChars = 0;

        this.chunks.forEach((chunk) => {
            this.offsets.push(this.totalChars);
            // +1 for the space the split dropped, so an offset never drifts behind
            // the real position as the chunk count grows.
            this.totalChars += chunk.length + 1;
        });

        // The word count Core\Listen rendered came from `post_content`, which on a
        // doc full of code blocks or shortcodes can be a long way from what is
        // actually being spoken. Once the real text is in hand, prefer it.
        const words = this.chunks.join(" ").split(/\s+/).filter(Boolean).length;
        const wpm = parseFloat(this.el.getAttribute("data-bd-wpm")) || 180;

        if (words > 0 && wpm > 0) {
            this.base = (words / wpm) * 60;
        }

        this.applyRate();
    }

    // ── Playback ────────────────────────────────────────────────────────────

    /**
     * Open the player and start speaking. The pill's own click.
     */
    activate() {
        this.open();

        if (this.chunks.length) {
            this.play();
            return;
        }

        this.el.classList.add("is-loading");
        this.announce(this.i18n.preparing);

        this.resolveText().then(
            (text) => {
                this.el.classList.remove("is-loading");

                // The reader can close the player while the text is still being
                // gathered — Escape, or the close button. Without this the article
                // started being read aloud into a pill that had already collapsed,
                // with no visible way to stop it.
                if (!this.active) {
                    return;
                }

                this.prepare(text);

                if (!this.chunks.length) {
                    this.fail();
                    return;
                }
                this.play();
            },
            () => {
                this.el.classList.remove("is-loading");

                if (!this.active) {
                    return;
                }
                this.fail();
            },
        );
    }

    /**
     * Pre-resolve the text on hover or focus, so the common case — the reader
     * moves the pointer to the pill and then clicks it — has nothing to wait for.
     * Failures are swallowed: this is speculative, and activate() will report the
     * same failure properly if the reader goes on to click.
     */
    prefetch() {
        this.resolveText().catch(() => {});
    }

    play() {
        if (!this.chunks.length) {
            return;
        }

        // Every pill on the page shares one `speechSynthesis`, so starting here has
        // to stop everywhere else — otherwise two players run at once, both showing
        // progress, one of them silent.
        BetterDocsListen.stopOthers(this);

        if (this.paused && !this.pauseUnsupported) {
            this.synth.resume();
            this.paused = false;
            this.setPlaying(true);
            return;
        }

        this.speakFrom(this.index);
    }

    pause() {
        if (!this.playing) {
            return;
        }

        this.synth.pause();
        this.paused = true;
        this.setPlaying(false);
        this.announce(this.i18n.paused);

        // Some Android builds accept pause() and carry on talking. Verified on the
        // next frame rather than immediately: `paused` is not guaranteed to have
        // flipped synchronously.
        window.setTimeout(() => {
            if (this.playing || this.synth.paused) {
                return;
            }
            this.pauseUnsupported = true;
            this.cancel();
        }, 60);
    }

    /**
     * Was this pill mid-playback — either speaking or paused part-way through?
     *
     * The question `speechSynthesis.speaking` cannot answer, because it is true
     * whenever ANY pill on the page is speaking.
     *
     * @return {boolean}
     */
    midPlayback() {
        return this.playing || this.paused;
    }

    toggle() {
        if (this.playing) {
            this.pause();
        } else {
            this.play();
        }
    }

    /**
     * Speak from a chunk index, cancelling whatever was in flight.
     *
     * @param {number} from
     */
    speakFrom(from) {
        this.cancel();

        this.index = Math.max(0, Math.min(from, this.chunks.length - 1));
        this.silenceChecked = false;
        // The bar belongs to the chunk about to be spoken, always. finish() leaves
        // the position at the end and the index at 0, so without this a replay ran
        // from the beginning with the bar pinned at 100% — corrected by the first
        // `boundary` event on engines that fire them, and never on the ones the
        // 250ms timer exists for.
        this.position = this.totalChars > 0
            ? (this.offsets[this.index] / this.totalChars) * this.duration
            : 0;
        this.render();

        this.setPlaying(true);
        this.announce(this.i18n.playing);

        // Deferred by a tick rather than called straight through. Chrome drops an
        // utterance queued in the same task as the `cancel()` that preceded it —
        // the speak is accepted, `speaking` goes true, and nothing is ever spoken.
        // Every path into here cancels first, so every path needs the gap.
        //
        // A generation check inside enqueue() makes a cancel arriving during the
        // gap a no-op, and sticky user activation is unaffected by the delay.
        const generation = this.generation;
        window.setTimeout(() => this.enqueue(generation), 60);
    }

    /**
     * @param {number} generation
     */
    enqueue(generation) {
        if (generation !== this.generation) {
            return;
        }

        if (this.index >= this.chunks.length) {
            this.finish();
            return;
        }

        const utterance = new SpeechSynthesisUtterance(this.chunks[this.index]);
        const chunk = this.index;

        utterance.rate = this.rate();
        utterance.lang = BetterDocsListen.lang();

        const voice = this.resolveVoice();
        if (voice) {
            utterance.voice = voice;
        }

        // `speechSynthesis` has no way to report "I am producing audio", and a
        // wedged engine is indistinguishable from a working one: `speaking` reads
        // true, the timer keeps the progress bar moving, and the reader hears
        // nothing. These two checks are the only signals available.
        const startedAt = Date.now();
        let alive = false;

        const sawLife = () => {
            alive = true;
            this.clearWatchdog();
        };

        utterance.onstart = () => {
            if (generation === this.generation) {
                sawLife();
            }
        };

        utterance.onboundary = (event) => {
            if (generation !== this.generation) {
                return;
            }
            sawLife();
            // The authoritative position. `charIndex` is an offset into this chunk,
            // so it has to be added to where the chunk starts.
            this.seekTo((this.offsets[chunk] + (event.charIndex || 0)) / this.totalChars, false);
        };

        utterance.onend = () => {
            if (generation !== this.generation) {
                return;
            }

            this.clearWatchdog();

            // Two hundred characters cannot be spoken in a quarter of a second at
            // any rate this offers. An `end` that fast means the engine took the
            // utterance and discarded it — which is what a remote voice does when
            // its fetch fails without raising an error. Only the first chunk of a
            // playback is judged: a short trailing chunk can legitimately be quick.
            if (!this.silenceChecked) {
                this.silenceChecked = true;

                if (Date.now() - startedAt < 250) {
                    this.recoverFromSilence(chunk);
                    return;
                }
            }

            this.index = chunk + 1;
            this.enqueue(generation);
        };

        utterance.onerror = (event) => {
            // `cancel()` reports itself as an error on whatever was speaking. That
            // is not a failure, and the generation check above usually catches it —
            // but not when cancel() runs before the generation is bumped.
            const error = event ? event.error : "";
            const benign = error === "interrupted" || error === "canceled";

            if (generation !== this.generation || benign) {
                return;
            }

            // The good voices are the remote ones, and a remote voice is a fetch
            // that can fail. Rather than killing the article over it, drop back to
            // whatever the engine picks for itself and replay the same chunk. Once
            // only — `voiceBlocked` makes a second failure a real one.
            if (!this.voiceBlocked && (error === "network" || error === "synthesis-failed")) {
                this.voiceBlocked = true;
                this.speakFrom(chunk);
                return;
            }

            this.fail();
        };

        // Held on the instance, and this is load-bearing rather than tidiness.
        // `speak()` does not keep a strong reference an engine can rely on: once
        // the only reference is Chrome's internal queue, the utterance can be
        // garbage-collected while it is still queued — at which point speech stops
        // dead and NO event ever fires, not `start`, not `end`, not `error`. It is
        // non-deterministic, which is why it presents as "it worked yesterday".
        this.utterance = utterance;

        this.synth.speak(utterance);
        this.startTicking();

        // …and the other direction: an engine that never reports anything at all.
        // Four seconds is comfortably longer than the gap to the first `start` on a
        // slow remote voice, and far shorter than a reader's patience with a
        // progress bar that is lying to them.
        const arm = () => {
            this.clearWatchdog();
            this.watchdog = window.setTimeout(() => {
                if (generation !== this.generation || alive) {
                    return;
                }

                // Chrome DEFERS speech in a hidden tab: the utterance sits queued
                // with `speaking` true and fires nothing at all until the tab is
                // shown again. That is not a wedged engine and must not be treated
                // as one — a reader who switches tabs mid-article would come back
                // to a pill that had given up. Wait instead of accusing.
                if (document.hidden) {
                    arm();
                    return;
                }

                this.recoverFromSilence(chunk);
            }, 4000);
        };

        arm();
    }

    clearWatchdog() {
        if (this.watchdog) {
            window.clearTimeout(this.watchdog);
            this.watchdog = null;
        }
    }

    /**
     * The engine accepted an utterance and said nothing.
     *
     * One retry on the engine's own default voice — the failure is nearly always
     * the chosen voice rather than the engine — and then an honest failure. Better
     * a pill that goes red and says it could not read the article than a player
     * that runs silently to the end.
     *
     * @param {number} chunk Where to resume from.
     */
    recoverFromSilence(chunk) {
        /* eslint-disable-next-line no-console */
        console.warn(
            "BetterDocs Listen: the speech engine accepted the text but produced no audio" +
                (this.voiceBlocked
                    ? " on the browser's default voice either. Giving up."
                    : ` using "${this.voiceResolved ? this.voiceResolved.name : "the default voice"}". Retrying on the browser's default.`) +
                " If this persists, quit and reopen the browser — Chrome's speech engine can wedge" +
                " browser-wide and a reload does not clear it.",
        );

        if (!this.voiceBlocked) {
            this.voiceBlocked = true;
            this.voiceResolved = null;
            this.speakFrom(chunk);
            return;
        }

        this.fail();
    }

    /**
     * Playback finished of its own accord.
     */
    finish() {
        this.stopTicking();
        this.setPlaying(false);
        this.position = this.duration;
        this.index = 0;
        this.render();
        this.announce(this.i18n.ended);
    }

    /**
     * Stop speaking, keep the player open and keep the position.
     */
    cancel() {
        this.generation += 1;
        this.stopTicking();
        this.clearWatchdog();
        this.paused = false;

        try {
            this.synth.cancel();

            // `cancel()` empties the queue but leaves `speechSynthesis.paused` set,
            // and a paused engine silently swallows every later `speak()`. So a
            // pause followed by a close — or by another pill starting — left the
            // next playback showing a ticking progress bar and making no sound.
            //
            // Guarded rather than called unconditionally: `resume()` on an engine
            // that was never paused is not a documented no-op everywhere, and this
            // runs on every single playback. Only clear the flag when it is set.
            if (this.synth.paused) {
                this.synth.resume();
            }
        } catch (e) {
            /* A cancel on a synth that never started throws in older Safari. */
        }
    }

    /**
     * Stop speaking and forget where we were.
     */
    stop() {
        this.cancel();
        this.setPlaying(false);
        this.index = 0;
        this.position = 0;
        this.paused = false;
        this.pauseUnsupported = false;
        // A network voice that failed once may well work on the next attempt, so
        // the downgrade lasts for one playback rather than for the page.
        this.voiceBlocked = false;
        this.render();
    }

    fail() {
        this.stop();
        this.el.classList.add("is-failed");
        this.announce(this.i18n.failed);
        this.collapse();
    }

    // ── Position ────────────────────────────────────────────────────────────

    /**
     * @param {number}  fraction 0-1.
     * @param {boolean} restart  Whether to start speaking from there. False for a
     *                           boundary event, which is only reporting where the
     *                           voice already is.
     */
    seekTo(fraction, restart) {
        const clamped = Math.max(0, Math.min(1, fraction || 0));

        this.position = clamped * this.duration;
        this.render();

        if (!restart || !this.chunks.length) {
            return;
        }

        const target = clamped * this.totalChars;
        let index = 0;

        // Linear rather than a binary search: a long doc is a few hundred chunks,
        // and this runs on a click.
        for (let i = 0; i < this.offsets.length; i++) {
            if (this.offsets[i] <= target) {
                index = i;
            } else {
                break;
            }
        }

        // Snap the readout to the chunk that will actually be spoken. The thumb
        // moves back by up to a sentence from where it was dropped, which is honest
        // — the voice cannot start mid-word — and is less confusing than a bar that
        // claims a position the audio does not match.
        this.position = (this.offsets[index] / this.totalChars) * this.duration;
        this.render();

        // `midPlayback()`, not `synth.speaking`: the engine is shared, so that would
        // start an idle pill speaking merely because a different one was.
        if (this.midPlayback()) {
            this.speakFrom(index);
        } else {
            this.index = index;
        }
    }

    startTicking() {
        this.stopTicking();
        // 250ms: four updates a second is smooth enough for a 4px bar, and cheap
        // enough to leave running for the length of an article.
        this.timer = window.setInterval(this.onTick, 250);
    }

    stopTicking() {
        if (this.timer) {
            window.clearInterval(this.timer);
            this.timer = null;
        }
    }

    onTick() {
        if (!this.playing) {
            return;
        }

        // Wall clock, not rate-scaled: `duration` already accounts for the rate, so
        // a second of real time is a second of the bar whatever speed it is set to.
        this.position = Math.min(this.duration, this.position + 0.25);
        this.render();
    }

    // ── Rate ────────────────────────────────────────────────────────────────

    rate() {
        return this.rates[this.rateIndex] || 1;
    }

    /**
     * Rescale the estimated duration for the current rate, keeping the position's
     * *fraction* rather than its seconds — half way through at 1× is still half way
     * through at 2×.
     */
    applyRate() {
        const fraction = this.duration > 0 ? this.position / this.duration : 0;

        this.duration = this.base / this.rate();
        this.position = fraction * this.duration;
        this.reserveClockWidth();
        this.render();
    }

    cycleRate() {
        this.rateIndex = (this.rateIndex + 1) % this.rates.length;

        if (this.speedButton) {
            const label = BetterDocsListen.rateLabel(this.rate());

            this.speedButton.textContent = label;
            this.speedButton.setAttribute("data-bd-rate", String(this.rate()));
            // The accessible name starts with what is on screen (WCAG 2.5.3), so a
            // voice-control user can say "click 1.5×".
            this.speedButton.setAttribute("aria-label", `${label} ${this.i18n.speed || "Playback speed"}`);
        }

        this.applyRate();
        // "1×" is two characters, "1.25×" is five. The pill is held at an explicit
        // pixel width measured when it opened, and it clips its contents — so
        // without this the extra characters push the close button under the clip
        // and it simply disappears.
        this.resize();

        // `SpeechSynthesisUtterance.rate` is fixed once speak() has been called, so
        // the only way to apply a new one is to start the current chunk again.
        if (this.playing) {
            this.speakFrom(this.index);
        }
    }

    /**
     * "1×", "1.25×". Matches views/templates/parts/listen.php, which formats the
     * rendered label the same way and for the same reason: a multiplier is a
     * technical value that reads identically in every locale, so it must not go
     * through a comma-decimal number formatter.
     *
     * @param {number} rate
     * @return {string}
     */
    static rateLabel(rate) {
        return `${String(Number(rate).toFixed(2)).replace(/\.?0+$/, "")}×`;
    }

    // ── Morph ───────────────────────────────────────────────────────────────

    open() {
        this.el.classList.remove("is-failed");

        // An editor placeholder renders the pill without a player (see
        // views/widgets/reading-time.php). The delegated handlers bind to
        // `button.…` and a placeholder's parts are spans, so this should be
        // unreachable — but a null here would throw out of a click handler, and a
        // pill that cannot open is a better outcome than a broken preview.
        if (!this.player || this.active) {
            return;
        }

        // Measured, not hard-coded: the pill is as wide as its label in whatever
        // language the site runs in, and the player is as wide as its own contents
        // at whatever font size the Customizer set.
        this.collapsedWidth = this.el.offsetWidth;
        this.el.style.width = `${this.collapsedWidth}px`;

        // Reflow, so the browser has the start width committed before the class
        // lands. Without it the two are batched into one style resolution and the
        // pill jumps to its target instead of growing into it.
        void this.el.offsetWidth;

        this.el.classList.add("is-active");
        this.el.style.width = `${Math.ceil(this.player.getBoundingClientRect().width)}px`;

        // Read before `inert` lands: making the focused trigger inert drops focus
        // to <body>, and a keyboard user would have to tab back in from the top of
        // the page to reach Pause.
        const hadFocus = document.activeElement === this.trigger;

        this.player.removeAttribute("inert");
        this.trigger.setAttribute("inert", "");
        this.active = true;

        if (hadFocus && this.playButton) {
            this.playButton.focus({ preventScroll: true });
        }
    }

    /**
     * Re-fit the open pill to whatever its player now measures.
     *
     * The speed chip is why this exists: "1×" is two characters and "1.25×" is
     * five, and the pill is held at an explicit pixel width measured when it
     * opened — so without this the extra characters go under the `overflow:
     * hidden` clip and the close button simply disappears.
     *
     * Measuring is the right mechanism here rather than reserving the widest label
     * up front: the rates are filterable, so the label set is not fixed, and a
     * reservation in `ch` cannot account for the chip's padding or for `×` being
     * narrower than a digit — it under-reserves, which is the failure that looks
     * like it works. The clock IS reserved (see reserveClockWidth) because it
     * changes width *during* playback, where re-fitting would animate the pill
     * mid-sentence.
     */
    resize() {
        if (!this.active || !this.player) {
            return;
        }

        this.el.style.width = `${Math.ceil(this.player.getBoundingClientRect().width)}px`;
    }

    /**
     * Hold the elapsed readout at the width its final value will need.
     *
     * The clock grows a character when playback passes ten minutes — "9:59" to
     * "10:00" — and on a doc that long the close button would vanish under the
     * clip exactly once, partway through, for no reason the reader could see.
     *
     * Reserving the space is better than resizing on the tick: the total is known
     * up front and the elapsed can never exceed it, so one `min-width` settles it
     * with no layout work while the voice is running. `ch` is the width of a
     * digit, and the readout is already `tabular-nums`, so every digit is exactly
     * that — the colon is narrower, which over-reserves by a hair and never clips.
     */
    reserveClockWidth() {
        if (!this.elapsedEl) {
            return;
        }

        this.elapsedEl.style.minWidth = `${BetterDocsListen.clock(this.duration).length}ch`;
    }

    /**
     * Back to a pill.
     *
     * @param {boolean} focusTrigger Hand focus back — correct after Escape or the
     *                               close button, wrong after a failure nobody
     *                               asked for.
     */
    collapse(focusTrigger) {
        if (!this.active) {
            return;
        }

        // Focus inside the player is about to be dropped by `inert` — after a
        // failure as much as after Escape — so it goes back to the pill. Focus
        // that was anywhere else on the page is left where it is.
        const hadFocus = this.player.contains(document.activeElement);

        this.active = false;
        this.el.classList.remove("is-active", "is-playing", "is-loading");
        this.player.setAttribute("inert", "");
        this.trigger.removeAttribute("inert");

        if (this.collapsedWidth) {
            this.el.style.width = `${this.collapsedWidth}px`;
        }

        // Back to `auto` once the pill has finished shrinking, so a later font-size
        // or label change still resizes it. A timer rather than `transitionend`
        // alone: under `prefers-reduced-motion` there is no transition and therefore
        // no event, and the width would stay pinned at a stale measurement forever.
        window.clearTimeout(this.widthReset);
        this.widthReset = window.setTimeout(() => {
            if (!this.active) {
                this.el.style.width = "";
            }
        }, 500);

        if (focusTrigger || hadFocus) {
            this.trigger.focus({ preventScroll: true });
        }
    }

    close() {
        this.stop();
        this.collapse(true);
    }

    // ── Output ──────────────────────────────────────────────────────────────

    setPlaying(playing) {
        this.playing = !!playing;
        this.el.classList.toggle("is-playing", this.playing);

        if (this.playButton) {
            this.playButton.setAttribute(
                "aria-label",
                this.playing ? this.i18n.pause || "Pause" : this.i18n.play || "Play",
            );
        }

        if (this.playing) {
            this.startTicking();
        } else {
            this.stopTicking();
        }
    }

    render() {
        const percent = this.duration > 0
            ? Math.max(0, Math.min(100, (this.position / this.duration) * 100))
            : 0;

        if (this.fill) {
            this.fill.style.width = `${percent}%`;
        }
        if (this.thumb) {
            // setProperty rather than the camelCase alias: `insetInlineStart` is
            // spelled inconsistently across older engines, and the string form is
            // what every one of them understands.
            this.thumb.style.setProperty("inset-inline-start", `${percent}%`);
        }
        if (this.seek) {
            this.seek.setAttribute("aria-valuenow", String(Math.round(percent)));
            this.seek.setAttribute("aria-valuetext", BetterDocsListen.clock(this.position));
        }
        if (this.elapsedEl) {
            this.elapsedEl.textContent = BetterDocsListen.clock(this.position);
        }
        if (this.totalEl) {
            this.totalEl.textContent = BetterDocsListen.clock(this.duration);
        }
    }

    /**
     * Write to the live region. Cleared first because most screen readers ignore a
     * repeated identical string, so a second pause would go unannounced.
     *
     * @param {string} message
     */
    announce(message) {
        if (!message || !this.status) {
            return;
        }

        this.status.textContent = "";
        window.setTimeout(() => {
            this.status.textContent = message;
        }, 50);
    }

    /**
     * @param {number} seconds
     * @return {string} m:ss
     */
    static clock(seconds) {
        const total = Math.max(0, Math.round(seconds || 0));

        return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
    }

    // ── Statics ─────────────────────────────────────────────────────────────

    /**
     * The voice this pill speaks with.
     *
     * @return {SpeechSynthesisVoice|null} Null hands the choice back to the engine.
     */
    resolveVoice() {
        if (this.voiceBlocked) {
            return null;
        }

        if (!this.voiceResolved) {
            this.voiceResolved = BetterDocsListen.voice(
                BetterDocsListen.lang(),
                this.config.voice,
            );
        }

        return this.voiceResolved || null;
    }

    /**
     * The document's language, for voice selection. `speechSynthesis` picks the
     * platform default when this is wrong, which on an English-default machine
     * means a French doc read in an English accent — so it is worth getting from
     * the page rather than from the browser.
     *
     * @return {string}
     */
    static lang() {
        const lang = document.documentElement.getAttribute("lang");

        return lang ? lang.replace("_", "-") : "";
    }

    /**
     * Best voice for a language tag.
     *
     * `getVoices()` is empty until the engine has loaded them in Chrome, which is
     * why nothing here caches a miss: a later call gets the real list.
     *
     * @param {string} lang
     * @return {SpeechSynthesisVoice|null}
     */
    static voice(lang, preferred) {
        const voices = window.speechSynthesis.getVoices() || [];

        if (!voices.length) {
            return null;
        }

        const tag = (voice) => String(voice.lang || "").toLowerCase().replace("_", "-");
        const wanted = String(lang || "").toLowerCase().replace("_", "-");
        const base = wanted.split("-")[0];

        // A site can pin one by name through `betterdocs_listen_voice`. Checked
        // first and deliberately not language-filtered: somebody who named a voice
        // has already made this decision.
        if (preferred) {
            const needle = String(preferred).toLowerCase();
            const pinned = voices.find(
                (voice) => String(voice.name || "").toLowerCase().indexOf(needle) !== -1,
            );

            if (pinned) {
                return pinned;
            }
        }

        if (!base) {
            return null;
        }

        const speakable = voices.filter((voice) => !BD_NOVELTY_VOICES.test(voice.name || ""));
        // The language match is the one hard filter. Reading English prose in a
        // Russian voice is not a degraded experience, it is gibberish — so a miss
        // here returns null and lets the engine fall back to its own default.
        const pool = (speakable.length ? speakable : voices).filter(
            (voice) => tag(voice).split("-")[0] === base,
        );

        if (!pool.length) {
            return null;
        }

        return pool
            .slice()
            .sort((a, b) => BetterDocsListen.rank(b, wanted) - BetterDocsListen.rank(a, wanted))[0];
    }

    /**
     * How good is this voice likely to sound?
     *
     * There is no quality field on `SpeechSynthesisVoice`, so this reads the two
     * signals that do exist — the name, and whether the voice is local — against
     * what each platform calls its good voices. It is a heuristic, but a stable
     * one: these naming conventions are how the vendors themselves distinguish
     * their neural voices from their old formant ones.
     *
     * @param {SpeechSynthesisVoice} voice
     * @param {string}               wanted Full language tag being matched.
     * @return {number}
     */
    static rank(voice, wanted) {
        const name = String(voice.name || "").toLowerCase();
        let score = 0;

        // One quality tier, by what each vendor calls its own good voices.
        if (/natural|neural/.test(name)) {
            // Microsoft's neural voices, in Edge and on Windows 11. The best thing
            // the Web Speech API can produce.
            score = 60;
        } else if (/\((enhanced|premium)\)/.test(name)) {
            // macOS downloads these on demand. Excellent, and local.
            score = 55;
        } else if (name.indexOf("siri") !== -1) {
            score = 45;
        } else if (BD_GOOD_VOICES.test(name)) {
            score = 40;
        }

        // A remote voice is penalised, not rewarded, and this is the one ranking
        // decision worth arguing about. Chrome's "Google …" voices genuinely sound
        // better than the macOS system voices — but they stream from a Google
        // endpoint, and when that call fails the utterance ends immediately with no
        // error and no sound. A voice that is merely good and always audible beats
        // one that is excellent and sometimes silent.
        //
        // The tiers above still outrank this, so a remote neural voice is chosen
        // where nothing local comes close, which is the situation on Windows.
        if (voice.localService === false) {
            score -= 25;
        }

        if (voice.default) {
            score += 5;
        }

        // Region is a tiebreaker, never a reason to take a worse voice: an en-GB
        // neural voice beats an en-US formant one, and the accent is the smaller
        // problem by a wide margin.
        if (String(voice.lang || "").toLowerCase().replace("_", "-") === wanted) {
            score += 10;
        }

        if (BD_LEGACY_VOICES.test(voice.name || "")) {
            score -= 30;
        }

        return score;
    }

    /**
     * Every live instance, so one player can silence the others and so a page
     * leaving the viewport can silence them all.
     *
     * @type {Set<BetterDocsListen>}
     */
    static get registry() {
        if (!BetterDocsListen._registry) {
            BetterDocsListen._registry = new Set();
        }
        return BetterDocsListen._registry;
    }

    /**
     * @param {BetterDocsListen} except
     */
    static stopOthers(except) {
        BetterDocsListen.registry.forEach((instance) => {
            if (instance !== except && instance.active) {
                instance.stop();
                instance.collapse(false);
            }
        });
    }

    static stopAll() {
        BetterDocsListen.registry.forEach((instance) => instance.stop());
    }

    /**
     * The instance for a wrapper, created on first use.
     *
     * Lazily, and stored on the element: the pill can arrive after this script ran
     * — the Elementor editor re-renders widgets over AJAX — so nothing may assume
     * a fixed set of them exists at boot.
     *
     * @param {HTMLElement} el
     * @param {Object}      config
     * @return {BetterDocsListen}
     */
    static for(el, config) {
        if (!el.betterdocsListen) {
            el.betterdocsListen = new BetterDocsListen(el, config);
            BetterDocsListen.registry.add(el.betterdocsListen);
        }

        return el.betterdocsListen;
    }
}

class BetterDocs {
    constructor(config) {
        this.config = config;
        this.initialize();
        this.init();
    }

    init() {
        // First, and guarded: init() runs eleven methods in sequence and several of
        // them dereference single-doc-only nodes without checking, so a throw further
        // down would otherwise leave the AI Actions button inert.
        try {
            this.aiActions();
        } catch (e) {
            /* eslint-disable-next-line no-console */
            console.error("BetterDocs AI Actions failed to initialise", e);
        }

        // Guarded separately rather than folded into the block above: the two
        // features are independent, and a throw in one must not leave the other
        // inert.
        try {
            this.listen();
        } catch (e) {
            /* eslint-disable-next-line no-console */
            console.error("BetterDocs Listen failed to initialise", e);
        }

        this.categoryListAccordion();
        this.feedbackForm();

        // Single Docs
        this.printToc();
        this.stickyTocContainer();
        this.tocClose();
        this.cloneTocContentToAfter();
        this.copyToClipboard();
        this.subCategoryExpand();

        this.tocSmallCollapisble();
        this.sidebarOpen();
        this.tocOpen();
        this.articleSummary();
    }

    tocSmallCollapisble() {
        $ = jQuery;
        var docTocTitle = $(".betterdocs-toc.collapsible-sm .toc-title");
        docTocTitle.each(function () {
            $(this).click(function (e) {
                e.preventDefault();
                $(this).children(".angle-icon").toggle();
                $(this).next(".toc-list").slideToggle();
            });
        });
    }

    initialize() {
        var $ = jQuery;

        this.body = $("body");

        this.catTitleList = $(
            ".betterdocs-sidebar-content .betterdocs-category-grid-wrapper .betterdocs-single-category-wrapper .betterdocs-category-header",
        );
        this.currentActiveCat = $(
            ".betterdocs-sidebar-content .betterdocs-category-grid-wrapper .betterdocs-single-category-wrapper.active",
        );
        this.listSidebarCatTitles = $(
            ".betterdocs-sidebar-content .betterdocs-sidebar-list-wrapper .betterdocs-sidebar-list .betterdocs-category-header",
        );
        this.listSidebarCurrentCat = $(
            ".betterdocs-sidebar-content .betterdocs-sidebar-list-wrapper .betterdocs-sidebar-list.active",
        );
        // single page feedback form selectors
        this.formLink = $("a[name=betterdocs-form-modal]");
        this.feedbackFormWrap = $("#betterdocs-feedback-form");
        this.feedbackFormFields = $(
            "#betterdocs-feedback-form input, #betterdocs-feedback-form textarea",
        );
    }

    categoryListAccordion() {
        let $parentThis = this;
        $parentThis.listSidebarCurrentCat
            .find(".betterdocs-body")
            .css("display", "block");
        $parentThis.listSidebarCurrentCat
            .siblings()
            .find(".betterdocs-body")
            .css("display", "none");
        this.listSidebarCatTitles.on("click", function (e) {
            e.preventDefault();
            let $parentCat = jQuery(e.target).closest(
                ".betterdocs-sidebar-list",
            );
            $parentCat.find(".betterdocs-body").slideToggle();
            $parentCat
                .toggleClass("active")
                .siblings()
                .removeClass("active")
                .find(".betterdocs-body")
                .slideUp();
        });
    }

    // function to add link active class on scroll
    onScroll() {
        var $ = jQuery;
		let getLastElementId;

		$(this).find('.betterdocs-content-heading')?.map((index, value) => {
			if(( value?.getBoundingClientRect()?.top - 140 ) < 0){
				getLastElementId = $(value)?.attr('id');
			}
		});

		if(getLastElementId != undefined){
			$(
				".sticky-toc-container .betterdocs-toc .toc-list a, .betterdocs-full-sidebar-right .betterdocs-toc .toc-list a, .wp-block-group.is-position-sticky .betterdocs-toc .toc-list a, .betterdocs-elementor .betterdocs-toc .toc-list a",
			).each(function () {
				var currLink = $(this);
				if($(currLink).attr('href') == '#'+getLastElementId ){
					$(".betterdocs-toc .toc-list a").removeClass("active");
					currLink.addClass("active");
				}
			});
		}
    }

    stickyTocContainer() {
        var $ = jQuery;
        let $parentThis = this;
        var betterdocsSidebar = $("#betterdocs-sidebar");
        var betterdocsToc = $(".betterdocs-toc");
        if (betterdocsToc.length > 0 && betterdocsSidebar.length) {
            // create an instance of TOC
            var stickyTocContent = $(".betterdocs-toc").clone();
            $(".sticky-toc-container").append(stickyTocContent);
        }

        $(window).on("scroll", function () {
            var tocSidebar = document.querySelector(
                ".betterdocs-sidebar-content",
            );
            var mainTocEligibleForScrolling = ( $('.sticky-toc-container .betterdocs-toc .toc-list li a')?.length > 0 ); // check if toc items exists, based on this return 'true' or 'false'
            if (tocSidebar === null) {
                return;
            }

            var stickyToc = $(".sticky-toc-container");
            var tocHeight = $(".betterdocs-sidebar-content").outerHeight();

            var tocSidebarRect = tocSidebar.getBoundingClientRect();
            var tocSidebarTop = Math.abs(tocSidebarRect?.top);
            if (tocSidebarRect?.top < 0 && tocHeight <= tocSidebarTop && mainTocEligibleForScrolling) {
                stickyToc.addClass("toc-sticky");
            } else {
                stickyToc.removeClass("toc-sticky");
            }
            //for elementor single doc template
            if (
                betterdocsSidebar.closest(".elementor-widget-wrap")?.length > 0
            ) {
                if (
                    $(window).scrollTop() >=
                    betterdocsSidebar
                        .closest(".elementor-widget-wrap")
                        .offset()?.top +
                    betterdocsSidebar
                        .closest(".elementor-widget-wrap")
                        .outerHeight() -
                    window.innerHeight &&
                    !betterdocsSidebar.hasClass("betterdocs-el-single-sidebar")
                ) {
                    stickyToc?.removeClass("toc-sticky");
                }
            } else if (
                betterdocsSidebar.closest(".wp-block-column")?.length > 0
            ) {
                //for blocks fse templates single doc
                if (
                    $(window).scrollTop() >=
                    betterdocsSidebar.closest(".wp-block-column").offset()
                        ?.top +
                    betterdocsSidebar
                        .closest(".wp-block-column")
                        .outerHeight() -
                    window.innerHeight &&
                    !betterdocsSidebar.hasClass("betterdocs-el-single-sidebar")
                ) {
                    stickyToc?.removeClass("toc-sticky");
                }
            } else if (
                //for normal template single doc rendered by betterdocs itself, betterdocs native single doc Sticky TOC template
                $(window).scrollTop() >=
                betterdocsSidebar.offset()?.top +
                betterdocsSidebar.outerHeight() -
                window.innerHeight &&
                !betterdocsSidebar.hasClass("betterdocs-el-single-sidebar")
            ) {
                stickyToc?.removeClass("toc-sticky");
            }
        });

        // Add smooth scrolling to links
        $(document).on("scroll", $parentThis?.onScroll);
        var toc_links = $(".betterdocs-toc .toc-list a");
        toc_links.on("click", function (e) {
            e.preventDefault();
            $(document).off("scroll");
            toc_links.each(function () {
                $(this).removeClass("active");
            });
            $(this).addClass("active");
            var target = decodeURIComponent(this.hash),
                $target = $(target);
            var scrollTopOffset = $target.offset()?.top;
            $("html, body")
                .stop()
                .animate(
                    {
                        scrollTop:
                            scrollTopOffset -
                            betterdocsConfig?.sticky_toc_offset,
                    },
                    "slow",
                    function () {
                        $(document).on("scroll", $parentThis?.onScroll);
                    },
                );
        });
    }

    tocClose() {
        var $ = jQuery;
        // close sticky toc
        $(".close-toc").on("click", function (event) {
            event.preventDefault();
            $(".sticky-toc-container").remove(".sticky-toc-container");
        });
    }

    sidebarOpen() {
        var $ = jQuery;
        if ($(window).width() <= 768) {
            // Click to open the left sidebar
            $('.betterdocs-sidebar-icon').on('click', function(e) {
                e.stopPropagation(); // Prevent click propagation to the document

                // Check if the wrapper doesn't already exist to avoid duplicates
                if (!$('.betterdocs-mobile-sidebar-wrapper').length) {
                    // Wrap sidebar elements with the wrapper div
                    $('#betterdocs-sidebar, #betterdocs-sidebar-left, #betterdocs-full-sidebar-left').wrap('<div class="betterdocs-mobile-sidebar-wrapper"></div>');
                }

                // Append the wrapper to the `.betterdocs-content-wrapper` instead of body
                if (!$('.betterdocs-mobile-sidebar-wrapper').parent().is('.betterdocs-content-wrapper')) {
                    $('.betterdocs-content-wrapper').append($('.betterdocs-mobile-sidebar-wrapper'));
                }

                // Slide in the sidebar by animating its left position
                $('.betterdocs-mobile-sidebar-wrapper').fadeIn();
                $('#betterdocs-sidebar, #betterdocs-sidebar-left, #betterdocs-full-sidebar-left').css({
                    'left': '-300px',
                    'display': 'block'
                }).animate({
                    left: '0'
                }, 300); // Adjust time for the sliding effect
            });

            // Close the left sidebar on click outside
            $(document).on('click.betterdocs-left-sidebar', function(e) {
                if (!$(e.target).closest('#betterdocs-sidebar, #betterdocs-sidebar-left, #betterdocs-full-sidebar-left, .betterdocs-sidebar-icon').length) {
                    $('#betterdocs-sidebar, #betterdocs-sidebar-left, #betterdocs-full-sidebar-left').animate({
                        left: '-300px'
                    }, 300, function() {
                        $('.betterdocs-mobile-sidebar-wrapper').fadeOut();
                    });
                }
            });

            // Prevent closing the left sidebar when clicked inside
            $('#betterdocs-sidebar, #betterdocs-sidebar-left, #betterdocs-full-sidebar-left').on('click', function(e) {
                e.stopPropagation(); // Prevent sidebar clicks from propagating to the document click handler
            });
        }
    }

    tocOpen() {
        var $ = jQuery;
        if ($(window).width() <= 768) {
            // Click to open the right sidebar
            $('.betterdocs-toc-icon').on('click', function(e) {
                e.stopPropagation(); // Prevent click propagation to the document

                // Check if the wrapper doesn't already exist to avoid duplicates
                if (!$('.betterdocs-mobile-toc-wrapper').length) {
                    // Wrap sidebar elements with the wrapper div
                    $('#betterdocs-sidebar-right').wrap('<div class="betterdocs-mobile-toc-wrapper"></div>');
                }

                // Append the wrapper to the `.betterdocs-content-wrapper` instead of body
                if (!$('.betterdocs-mobile-toc-wrapper').parent().is('.betterdocs-content-wrapper')) {
                    $('.betterdocs-content-wrapper').append($('.betterdocs-mobile-toc-wrapper'));
                }

                // Slide in the sidebar by animating its right position
                $('.betterdocs-mobile-toc-wrapper').fadeIn();
                $('#betterdocs-sidebar-right').css({
                    'right': '-300px',
                    'display': 'block'
                }).animate({
                    right: '0'
                }, 300); // Adjust time for the sliding effect
            });

            // Close the right sidebar on click outside
            $(document).on('click.betterdocs-right-sidebar', function(e) {
                if (!$(e.target).closest('#betterdocs-sidebar-right, .betterdocs-toc-icon').length) {
                    $('#betterdocs-sidebar-right').animate({
                        right: '-300px'
                    }, 300, function() {
                        $('.betterdocs-mobile-toc-wrapper').fadeOut();
                    });
                }
            });

            // Prevent closing the right sidebar when clicked inside
            $('#betterdocs-sidebar-right').on('click', function(e) {
                e.stopPropagation(); // Prevent sidebar clicks from propagating to the document click handler
            });
        }
    }

    delay(callback, time) {
        setTimeout(callback, time);
    }

    printToc() {
        this.reusablePrintFunction('.betterdocs-print-btn');
        this.reusablePrintFunction('.betterdocs-print-pdf-2');
    }

    cloneTocContentToAfter() {
        let $ = jQuery;
        let tocContent = $(
            ".betterdocs-single-layout-3 #betterdocs-sidebar-right .betterdocs-toc .toc-list a",
        );
        $.each(tocContent, function (index, item) {
            $(this).addClass(`toc-item-link-${index + 1}`);
            $(
                `<style>.toc-item-link-${index + 1}:after {height: ${
                    item.offsetHeight + 10
                }px}</style>`,
            ).appendTo("head");
        });
    }

    reusablePrintFunction(selector) {
        var $ = jQuery;
        // close sticky toc
        $("body").on("click", selector, function (event) {
            let entryTitle = "";
            if ($("#betterdocs-entry-title").length) {
                entryTitle = document.getElementById(
                    "betterdocs-entry-title",
                ).innerHTML;
            } else if( $('.wp-block-post-title').length) { //for blocks single doc title
                entryTitle = document.getElementsByClassName(
                    "wp-block-post-title",
                )[0]?.innerHTML;
            }

            // Clone the content to avoid modifying the original
            var contentElement = document.getElementById("betterdocs-single-content");
            var contentClone = contentElement.cloneNode(true);

            // Remove all glossary tooltip overlays from the cloned content
            var tooltipOverlays = contentClone.querySelectorAll('.glossary-tooltip-overlay');
            tooltipOverlays.forEach(function(overlay) {
                overlay.remove();
            });

            var printContents = contentClone.innerHTML;

            // Print template config (logo + footer) localised via betterdocsConfig.print.
            // Each part is gated by its Customizer toggle; an empty value renders nothing.
            var printConfig = (window.betterdocsConfig && betterdocsConfig.print) || {};
            var logoHeader = printConfig.logo
                ? '<div class="betterdocs-print-header"><img src="' + printConfig.logo + '" alt="" /></div>'
                : "";
            var body = logoHeader + "<h1>" + entryTitle + "</h1>" + " " + printContents;

            // A repeating footer has to reserve its own space on *every* printed
            // page, so it is emitted as a <tfoot> of a full-width layout table:
            // browsers repeat thead/tfoot on each page break and keep the flowing
            // content clear of them. A fixed-position footer would instead paint
            // over the last lines of every page but the final one, and any fixed
            // padding reserved for it would be wrong the moment the footer (which
            // accepts HTML) wraps to more than one line.
            var combined = document.createElement("div");
            combined.innerHTML = printConfig.footer
                ? '<table class="betterdocs-print-layout">'
                      + '<tfoot><tr><td><div class="betterdocs-print-footer">'
                      + printConfig.footer
                      + "</div></td></tr></tfoot>"
                      + "<tbody><tr><td>" + body + "</td></tr></tbody>"
                      + "</table>"
                : body;
            combined.id = "new-doc-print";

            // Title for the print window so the browser header shows the doc name
            // instead of "about:blank".
            var printTitle =
                (entryTitle || "").replace(/<[^>]*>/g, "").trim() || document.title;
            var pwidth = document.getElementById(
                "betterdocs-single-content",
            ).offsetWidth;
            var wheight = $(window).height();
            var winPrint = window.open(
                "",
                "",
                "left=50%,top=10%,width=" +
                pwidth +
                ",height=" +
                wheight +
                ",toolbar=0,scrollbars=0,status=0",
            );

            // Add the stylesheet to the new window
            var styles = Array.from(document.styleSheets).map(styleSheet => {
                try {
                    return Array.from(styleSheet.cssRules).map(rule => rule.cssText).join('');
                } catch (e) {
                    console.log('Access to stylesheet blocked by CORS policy:', styleSheet.href);
                    return '';
                }
            }).join('\n');

            // Print-template styles: page margins, centred logo header, and a
            // footer pinned to the bottom of every printed page.
            styles += '@page{margin:16mm 12mm}'
                + '.betterdocs-print-layout{width:100%;border-collapse:collapse}'
                + '.betterdocs-print-layout>tbody>tr>td,.betterdocs-print-layout>tfoot>tr>td{padding:0;border:0}'
                + '.betterdocs-print-layout>tfoot{display:table-footer-group}'
                + '.betterdocs-print-header{text-align:center;margin:0 0 16px;padding-bottom:12px;border-bottom:1px solid #e3e3e3}'
                + '.betterdocs-print-header img{max-height:72px;max-width:100%;width:auto;height:auto}'
                + '.betterdocs-print-footer{text-align:center;font-size:11px;line-height:1.4;color:#555;padding:6px 8px;margin-top:12px;border-top:1px solid #e3e3e3}';

            var styleElement = winPrint.document.createElement('style');
            styleElement.textContent = styles;

            winPrint.document.head.appendChild(styleElement);
            winPrint.document.body.innerHTML = combined.outerHTML;
            winPrint.document.close();
            winPrint.document.title = printTitle;

            // print() snapshots the window immediately, so any image still
            // loading (e.g. the logo, fetched fresh in this new window) prints
            // blank. Wait for every pending image, with a timeout so a broken
            // image can never block printing.
            var pendingImages = Array.prototype.filter
                .call(winPrint.document.images, function (img) {
                    return !img.complete;
                })
                .map(function (img) {
                    return new Promise(function (resolve) {
                        img.onload = img.onerror = resolve;
                    });
                });

            var openPrintDialog = function () {
                winPrint.focus();
                winPrint.print();

                // Delay the close action to avoid malfunction of the print button
                setTimeout(function() {
                    winPrint.close();
                }, 300);
            };

            if (pendingImages.length) {
                Promise.race([
                    Promise.all(pendingImages),
                    new Promise(function (resolve) {
                        setTimeout(resolve, 3000);
                    })
                ]).then(openPrintDialog);
            } else {
                openPrintDialog();
            }
        });
    }

    /**
     * AI Actions — the "Copy page" split button.
     *
     * Every handler is bound by delegation on <body> with no up-front element
     * check: the Elementor editor re-renders widgets over AJAX after
     * document.ready, so a `.length === 0` guard here would permanently disable the
     * dropdown in the editor preview (this is why printToc() delegates unguarded).
     *
     * Only `type: 'copy'` actions reach JavaScript at all. Every AI-assistant entry
     * is a plain <a target="_blank"> so middle-click, cmd-click and "open in new
     * tab" work, and so no popup blocker ever sees a programmatic window.open().
     */
    aiActions() {
        const $ = jQuery;
        const root = ".betterdocs-ai-actions";
        const i18n =
            (window.betterdocsConfig &&
                betterdocsConfig.ai_actions &&
                betterdocsConfig.ai_actions.i18n) ||
            {};

        // Public handler registry. BetterDocs Pro, a future MCP item or a PDF export
        // registers here; Free's own JavaScript never has to change.
        window.betterdocsAIActionHandlers =
            window.betterdocsAIActionHandlers || {};
        window.betterdocsAIActionHandlers["copy-markdown"] = (el) =>
            this.copyMarkdown(el);

        const closeAll = (except) => {
            $(root).each(function () {
                if (except && this === except) {
                    return;
                }
                $(this)
                    .find(".betterdocs-ai-actions-toggle")
                    .attr("aria-expanded", "false");
                $(this).find(".betterdocs-ai-actions-menu").prop("hidden", true);
            });
        };

        $("body").on("click.betterdocs-ai-actions", `${root}-toggle`, function (e) {
            e.preventDefault();
            const $toggle = $(this);
            const $wrap = $toggle.closest(root);
            const $menu = $wrap.find(".betterdocs-ai-actions-menu");
            const isOpen = $toggle.attr("aria-expanded") === "true";

            closeAll(isOpen ? null : $wrap[0]);
            $toggle.attr("aria-expanded", isOpen ? "false" : "true");
            $menu.prop("hidden", isOpen);

            // Keyboard only. A click event from Enter or Space carries
            // `detail: 0`, a real pointer click carries the click count, so this
            // gives keyboard users the entry point the disclosure pattern wants
            // without painting a focus ring on the first row every time somebody
            // opens the menu with a mouse — which reads as a rendering fault.
            if (!isOpen && e.detail === 0) {
                $menu.find(".betterdocs-ai-actions-item").first().trigger("focus");
            }
        });

        // Escape closes and hands focus back to the control that opened the menu.
        $("body").on("keydown.betterdocs-ai-actions", root, function (e) {
            if (e.key !== "Escape" && e.key !== "Esc") {
                return;
            }
            const $wrap = $(this);
            if ($wrap.find(".betterdocs-ai-actions-menu").prop("hidden")) {
                return;
            }
            e.stopPropagation();
            closeAll();
            $wrap.find(".betterdocs-ai-actions-toggle").trigger("focus");
        });

        $(document).on("click.betterdocs-ai-actions", (e) => {
            if (!$(e.target).closest(root).length) {
                closeAll();
            }
        });

        $("body").on(
            "click.betterdocs-ai-actions",
            "button.betterdocs-ai-actions-item, button.betterdocs-ai-actions-primary",
            function (e) {
                e.preventDefault();
                const handler =
                    window.betterdocsAIActionHandlers[$(this).data("bd-handler")];
                if (typeof handler === "function") {
                    handler(this);
                }
                if ($(this).hasClass("betterdocs-ai-actions-item")) {
                    const $wrap = $(this).closest(root);
                    closeAll();

                    // Keyboard only — the same `detail` test, for the same reason,
                    // as the open path above. Handing focus back to the toggle is
                    // correct for the disclosure pattern, but after a *mouse* click
                    // it is a programmatic focus, and Chrome counts programmatic
                    // focus as focus-visible. That lit the 2px focus ring on the
                    // toggle every time an item was picked with the mouse, which
                    // reads as a stuck button rather than a focus cue.
                    if (e.detail === 0) {
                        $wrap.find(".betterdocs-ai-actions-toggle").trigger("focus");
                    }
                }
            },
        );

        // A link click should close the menu it was opened from.
        $("body").on(
            "click.betterdocs-ai-actions",
            "a.betterdocs-ai-actions-item",
            () => closeAll(),
        );

        this.aiActionsI18n = i18n;
    }

    /**
     * Fetch the doc's Markdown and put it on the clipboard.
     */
    copyMarkdown(el) {
        const $ = jQuery;
        const $wrap = $(el).closest(".betterdocs-ai-actions");
        // The `copy` profile: no YAML front matter, a Source: line instead. What a
        // human wants when they paste this into a chat.
        const url = $wrap.data("bd-copy-url") || $wrap.data("bd-md-url");
        const i18n = this.aiActionsI18n || {};

        if (!url) {
            this.aiActionsFeedback($wrap, false);
            return;
        }

        this.aiActionsAnnounce($wrap, i18n.copying);

        const request = fetch(url, {
            credentials: "same-origin",
            headers: { Accept: "text/markdown" },
        }).then((res) => {
            const type = res.headers.get("content-type") || "";
            // A 403 refusal or a themed HTML fallback must never reach the clipboard.
            if (!res.ok || type.indexOf("text/markdown") !== 0) {
                throw new Error(`Unexpected response: ${res.status} ${type}`);
            }
            return res.text();
        });

        const done = () => this.aiActionsFeedback($wrap, true);
        const failed = () => this.aiActionsFeedback($wrap, false);

        // Safari drops user activation across an await, so writeText() after the
        // fetch resolves is rejected there. It does honour a ClipboardItem whose
        // value is a Promise, which keeps the write inside the original gesture.
        if (
            window.ClipboardItem &&
            navigator.clipboard &&
            navigator.clipboard.write
        ) {
            const blob = request.then(
                (text) => new Blob([text], { type: "text/plain" }),
            );
            navigator.clipboard
                .write([new ClipboardItem({ "text/plain": blob })])
                .then(done)
                .catch(() => request.then((t) => this.aiActionsWrite(t)).then(done, failed));
            return;
        }

        request.then((text) => this.aiActionsWrite(text)).then(done, failed);
    }

    /**
     * Clipboard write with a non-secure-context fallback: navigator.clipboard is
     * undefined on plain-HTTP sites, which is a real slice of self-hosted WordPress.
     */
    aiActionsWrite(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }

        if (typeof ClipboardJS !== "undefined" && ClipboardJS.copy) {
            return ClipboardJS.copy(text)
                ? Promise.resolve()
                : Promise.reject(new Error("ClipboardJS copy failed"));
        }

        const area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.top = "-9999px";
        document.body.appendChild(area);
        area.select();

        let ok = false;
        try {
            ok = document.execCommand("copy");
        } catch (e) {
            ok = false;
        }
        document.body.removeChild(area);

        return ok ? Promise.resolve() : Promise.reject(new Error("execCommand copy failed"));
    }

    /**
     * Swap the button label for a couple of seconds. The live region alone is not
     * feedback a sighted user can act on.
     */
    aiActionsFeedback($wrap, success) {
        const $ = jQuery;
        const i18n = this.aiActionsI18n || {};
        const $label = $wrap.find(".betterdocs-ai-actions-label");
        const original = $label.data("bd-original") || $label.text();

        $label.data("bd-original", original);
        $label.text(success ? i18n.copied : i18n.copy_failed);
        $wrap
            .removeClass("is-copied is-failed")
            .addClass(success ? "is-copied" : "is-failed");

        this.aiActionsAnnounce($wrap, success ? i18n.copied : i18n.copy_error);

        clearTimeout($wrap.data("bd-reset"));
        $wrap.data(
            "bd-reset",
            setTimeout(() => {
                $label.text(original);
                $wrap.removeClass("is-copied is-failed");
            }, 2000),
        );
    }

    /**
     * Write to the live region. Cleared first because most screen readers ignore a
     * repeated identical string, so a second copy would go unannounced.
     */
    aiActionsAnnounce($wrap, message) {
        if (!message) {
            return;
        }
        const $status = $wrap.find(".betterdocs-ai-actions-status");
        $status.text("");
        setTimeout(() => $status.text(message), 50);
    }


    /**
     * Listen — the pill that morphs in place into an audio player.
     *
     * Bound by delegation on <body> with no up-front element check, for the reason
     * aiActions() gives: the Elementor editor re-renders widgets over AJAX after
     * document.ready, so a `.length === 0` guard here would permanently disable
     * the player in the editor preview.
     *
     * All the state lives in BetterDocsListen, one instance per pill, created
     * lazily on first interaction — which is also what makes a pill that arrived
     * after this ran work without an observer watching for it.
     */
    listen() {
        const $ = jQuery;
        const root = ".betterdocs-listen";
        const config =
            (window.betterdocsConfig && betterdocsConfig.listen) || {};

        // No speech engine, no feature. The class goes on <html> rather than on
        // each pill so that a pill rendered later is covered by a decision already
        // made — see the gate in scss/template-parts/listen.scss.
        if (
            !("speechSynthesis" in window) ||
            typeof window.SpeechSynthesisUtterance !== "function"
        ) {
            document.documentElement.classList.add("betterdocs-no-speech");
            return;
        }

        const player = (el) =>
            BetterDocsListen.for($(el).closest(root)[0], config);

        // Every selector below names `button`, the way the AI Actions handlers name
        // `button.betterdocs-ai-actions-primary`. The editor placeholders render the
        // same classes on spans precisely so they stay inert — a placeholder has no
        // player to open, and a click on one would otherwise reach a real handler.
        $("body")
            .on("click.betterdocs-listen", `button${root}-trigger`, function (e) {
                e.preventDefault();
                player(this).activate();
            })
            // Speculative, so the common case — pointer travels to the pill, then
            // clicks it — has nothing left to wait for. `focusin` rather than
            // `focus` because only the former delegates.
            .on(
                "mouseenter.betterdocs-listen focusin.betterdocs-listen",
                `button${root}-trigger`,
                function () {
                    player(this).prefetch();
                },
            )
            .on("click.betterdocs-listen", `button${root}-play`, function (e) {
                e.preventDefault();
                player(this).toggle();
            })
            .on("click.betterdocs-listen", `button${root}-speed`, function (e) {
                e.preventDefault();
                player(this).cycleRate();
            })
            .on("click.betterdocs-listen", `button${root}-close`, function (e) {
                e.preventDefault();
                player(this).close();
            })
            .on("click.betterdocs-listen", `${root}-seek`, function (e) {
                const rect = this.getBoundingClientRect();

                if (!rect.width) {
                    return;
                }

                const offset = (e.clientX || 0) - rect.left;
                // The bar fills from the inline start, which on an RTL site is the
                // right edge — so the fraction has to be read from the other end.
                const rtl =
                    window.getComputedStyle(this).direction === "rtl";
                const fraction = rtl
                    ? 1 - offset / rect.width
                    : offset / rect.width;

                player(this).seekTo(fraction, true);
            })
            .on("keydown.betterdocs-listen", `${root}-seek`, function (e) {
                const instance = player(this);
                const current =
                    instance.duration > 0
                        ? instance.position / instance.duration
                        : 0;
                // Shift for a coarse jump, which on a 20-minute doc is the
                // difference between scrubbing and arriving.
                const step = e.shiftKey ? 0.1 : 0.02;
                let fraction = null;

                switch (e.key) {
                    case "ArrowRight":
                    case "Right":
                    case "ArrowUp":
                    case "Up":
                        fraction = current + step;
                        break;
                    case "ArrowLeft":
                    case "Left":
                    case "ArrowDown":
                    case "Down":
                        fraction = current - step;
                        break;
                    case "Home":
                        fraction = 0;
                        break;
                    case "End":
                        // Not 1: a seek to the very end has no chunk left to speak,
                        // and would read as the player refusing to move.
                        fraction = 0.99;
                        break;
                    case " ":
                    case "Spacebar":
                    case "Enter":
                        e.preventDefault();
                        instance.toggle();
                        return;
                    default:
                        return;
                }

                // Only now: the keys this does not handle — Tab above all — have to
                // reach the browser.
                e.preventDefault();
                instance.seekTo(fraction, true);
            })
            // Escape closes the player and hands focus back to the pill, matching
            // the AI Actions menu beside it.
            .on("keydown.betterdocs-listen", root, function (e) {
                if (e.key !== "Escape" && e.key !== "Esc") {
                    return;
                }

                const instance = player(this);

                if (!instance.active) {
                    return;
                }

                e.stopPropagation();
                instance.close();
            });

        // Chrome returns an empty list from `getVoices()` until the engine has
        // loaded it, which is usually after this runs. Any pill that resolved a
        // voice in that window got nothing, so let them look again — skipping the
        // ones mid-playback, which would otherwise change voice between sentences.
        if (typeof window.speechSynthesis.addEventListener === "function") {
            window.speechSynthesis.addEventListener("voiceschanged", () => {
                BetterDocsListen.registry.forEach((instance) => {
                    if (!instance.playing) {
                        instance.voiceResolved = null;
                    }
                });
            });
        }

        // Chrome keeps speaking after a navigation: `speechSynthesis` belongs to the
        // browser, not to the document, so nothing tears it down on its own.
        $(window).on("pagehide.betterdocs-listen", () =>
            BetterDocsListen.stopAll(),
        );
    }

    copyToClipboard() {
        let $ = jQuery;
        if ($(".batterdocs-anchor").length) {
            const getURLClipboard = function (e) {
                // Clipboard
                e.preventDefault();
                e.stopPropagation();


                let clipboardJS = new ClipboardJS(e.target);

                clipboardJS.on("success", function (e) {
                    $(document)
                        .find("div.tooltip-box")
                        .text(betterdocsConfig.copy_text);
                    e.clearSelection();
                    $(e.trigger).addClass("copied");
                    setTimeout(function () {
                        $(e.trigger).removeClass("copied");
                    }, 2000);

                    clipboardJS.destroy();
                });

                // Triggering the First Click Here. and also emitting the event to work above code.
                let text = ClipboardJS.copy(e.target.dataset.clipboardText);
                clipboardJS.emit(text ? 'success' : 'error', {
                    action: 'copy',
                    text,
                    trigger: e.target,
                    clearSelection() {
                        if (e.target) {
                            e.target.focus();
                        }
                        window.getSelection().removeAllRanges();
                    },
                });
            };

            // tooltips
            $('a.batterdocs-anchor[href*="#"]').hover(
                function () {
                    var title = $(this).attr("data-title");
                    $("<div/>", {
                        text: title,
                        class: "tooltip-box",
                    }).appendTo(this);
                },
                function () {
                    $(this).find("div.tooltip-box").remove();
                },
            ).on('click', getURLClipboard);


            (function () {
                if (
                    typeof self === "undefined" ||
                    !self.Prism ||
                    !self.document
                ) {
                    return;
                }

                if (!Prism.plugins.toolbar) {
                    console.warn(
                        "Copy to Clipboard plugin loaded before Toolbar plugin.",
                    );

                    return;
                }

                var ClipboardJS = window.ClipboardJS || undefined;

                if (!ClipboardJS && typeof require === "function") {
                    ClipboardJS = require("clipboard");
                }

                // ClipboardJS comes from the bundled `clipboard` handle, which the
                // `betterdocs` script depends on. Never load it from a CDN.
                var callbacks = [];

                Prism.plugins.toolbar.registerButton(
                    "copy-to-clipboard",
                    function (env) {
                        var linkCopy = document.createElement("button");
                        linkCopy.textContent = "Copy";

                        if (!ClipboardJS) {
                            callbacks.push(registerClipboard);
                        } else {
                            registerClipboard();
                        }

                        return linkCopy;

                        function registerClipboard() {
                            var clip = new ClipboardJS(linkCopy, {
                                text: function () {
                                    return env.code;
                                },
                            });

                            clip.on("success", function () {
                                linkCopy.textContent = "Copied!";

                                resetText();
                            });
                            clip.on("error", function () {
                                linkCopy.textContent = "Press Ctrl+C to copy";

                                resetText();
                            });
                        }

                        function resetText() {
                            setTimeout(function () {
                                linkCopy.textContent = "Copy";
                            }, 5000);
                        }
                    },
                );
            })();
        }
    }

    feedbackForm() {
        var $ = jQuery;
        var $this = this;
        let formModal = $("#betterdocs-form-modal");
        let formModalContent = $("#betterdocs-form-modal .modal-content");
        //select all the a tag with name equal to modal
        this.formLink.click(function (e) {
            e.preventDefault();
            formModal.fadeIn(500);
        });

        //if outside of modal content is clicked
        $(document).mouseup(function (e) {
            if (
                !formModalContent.is(e.target) &&
                formModalContent.has(e.target).length === 0
            ) {
                formModal.fadeOut();
            }
        });

        //if close button is clicked
        $(".betterdocs-modalwindow .close").click(function (e) {
            e.preventDefault();
            formModal.fadeOut(500);
        });

        this.feedbackFormFields.on("keyup", function () {
            $(this).removeClass("val-error");
            $(this).siblings(".error-message").remove();
        });

        this.feedbackFormWrap.on("submit", function (e) {
            e.preventDefault();
            var form = $(this);
            var message_name = $("#message_name");
            var message_email = $("#message_email");
            var message_subject = $("#message_subject");
            var message_text = $("#message_text");
            $this.betterdocsFeedbackFormSubmit(
                form,
                message_name,
                message_email,
                message_subject,
                message_text,
            );
        });

        this.betterdocsFeedbackFormSubmit = function (
            form,
            message_name,
            message_email,
            message_subject,
            message_text,
        ) {
            let request;
            if (request) {
                request.abort();
            }
            request = $.ajax({
                url: betterdocsSubmitFormConfig.ajax_url,
                type: "post",
                data: {
                    action: "betterdocs_feedback_form_submit",
                    form: form.serializeArray(),
                    postID: betterdocsSubmitFormConfig.post_id,
                    message_name: message_name.val(),
                    message_email: message_email.val(),
                    message_subject: message_subject.val(),
                    message_text: message_text.val(),
                    security: betterdocsSubmitFormConfig.nonce,
                },
                beforeSend: function () {
                },
                success: function (data) {
                    if (data.success) {
                        if (data.success == true) {
                            $(".response").html(
                                '<span class="success-message">' +
                                data.data.message +
                                "</span>",
                            );
                            form[0].reset();
                            $this.delay(function () {
                                $(".betterdocs-modalwindow").fadeOut(500);
                                $(".response .success-message").remove();
                            }, 3000);
                        } else {
                            $(".response").html(
                                '<span class="error-message">' +
                                data.sentMessage +
                                "</span>",
                            );
                        }
                    } else if (data.success == false) {
                        if (data.data.message.name) {
                            if (message_name.hasClass("val-error") == false) {
                                message_name.addClass("val-error");
                                $(".form-name").append(
                                    '<span class="error-message">' +
                                    data.data.message.name +
                                    "</span>",
                                );
                            }
                        }
                        if (data.data.message.email) {
                            if (message_email.hasClass("val-error") == false) {
                                message_email.addClass("val-error");
                                $(".form-email").append(
                                    '<span class="error-message">' +
                                    data.data.message.email +
                                    "</span>",
                                );
                            }
                        }
                        if (data.data.message.message) {
                            if (message_text.hasClass("val-error") == false) {
                                message_text.addClass("val-error");
                                $(".form-message").append(
                                    '<span class="error-message">' +
                                    data.data.message.message +
                                    "</span>",
                                );
                            }
                        }
                    }
                },
            });
        };
    }

    subCategoryExpand() {
        var $ = jQuery;
        let subCatActive = $(
            ".betterdocs-nested-category-list.betterdocs-current-category.active",
        );

        /**
         * Subcategory Expand On Load Including Nested Subcategories
         */
        if (subCatActive.length > 0) {
            subCatActive.each(function (index) {
                $(this).prev().children(".toggle-arrow").toggle();
            });
        }
    }

    articleSummary() {
        var $ = jQuery;
        var summaryContainer = $("#betterdocs-article-summary");
        var summaryToggle = $("#betterdocs-summary-toggle");
        var summaryContent = $("#betterdocs-summary-content");
        var summaryLoading = $("#betterdocs-summary-loading");
        var summaryText = $("#betterdocs-summary-text");
        var summaryLoaded = false;

        if (summaryContainer.length === 0) {
            return; // Exit if summary container is not found
        }

        function loadArticleSummary() {
            // Show loading state
            summaryLoading.show();
            summaryText.hide();

            // Get post data from DOM attributes
            var postId = parseInt(summaryContainer.data('post-id')) || 0;
            var postType = summaryContainer.data('post-type') || '';

            // Get post content for summary generation
            var postContent = $("#betterdocs-single-content").text() || $(".betterdocs-content").text() || "";
            var postTitle = $("#betterdocs-entry-title").text() || $(".betterdocs-entry-heading").text() || document.title;

            if (!postContent.trim()) {
                summaryLoading.hide();
                summaryText.html('<p>' + (betterdocsConfig.summary_error || 'Unable to generate summary for this article.') + '</p>').show();
                return;
            }

            // Validate post ID and post type
            if (postId <= 0) {
                summaryLoading.hide();
                summaryText.html('<p class="summary-error">Invalid post ID for summary generation.</p>').show();
                return;
            }

            if (postType !== 'docs') {
                summaryLoading.hide();
                summaryText.html('<p class="summary-error">Doc summary is only available for documentation posts.</p>').show();
                return;
            }

            // Make AJAX request to generate summary
            $.ajax({
                url: betterdocsConfig.ajax_url,
                type: "POST",
                data: {
                    action: "betterdocs_generate_article_summary",
                    post_id: postId,
                    post_title: postTitle,
                    post_content: postContent.substring(0, 4000), // Limit content length
                    nonce: betterdocsConfig.summary_nonce
                },
                success: function(response) {
                    summaryLoading.hide();

                    if (response.success && response.data) {
                        var contentHtml = '<div class="summary-content">' + response.data + '</div>';
                        summaryText.html(contentHtml);

                        // Apply custom styles if available (from blocks/elementor)
                        var customStyle = summaryText.data('style');
                        if (customStyle) {
                            summaryText.attr('style', customStyle + '; display: block;');
                        } else {
                            summaryText.show();
                        }

                        summaryLoaded = true;
                    } else {
                        var errorMsg = response.data || betterdocsConfig.summary_error || 'Failed to generate doc summary.';
                        summaryText.html('<p class="summary-error">' + errorMsg + '</p>').show();
                    }
                },
                error: function() {
                    summaryLoading.hide();
                    summaryText.html('<p class="summary-error">' + (betterdocsConfig.summary_error || 'Failed to generate doc summary.') + '</p>').show();
                }
            });
        }

        // If no toggle exists (title hidden), show content immediately and load summary
        if (summaryToggle.length === 0) {
            summaryContent.show();
            if (!summaryLoaded) {
                loadArticleSummary();
            }
            return;
        }

        // Handle toggle click when title is shown
        summaryToggle.on("click", function(e) {
            e.preventDefault();

            if (summaryContent.is(":visible")) {
                // Close summary
                summaryContent.slideUp();
                // Show angle-right, hide angle-down
                $(this).find(".angle-right").show();
                $(this).find(".angle-down").hide();
            } else {
                // Open summary
                summaryContent.slideDown();
                // Hide angle-right, show angle-down
                $(this).find(".angle-right").hide();
                $(this).find(".angle-down").show();

                // Load summary if not already loaded
                if (!summaryLoaded) {
                    loadArticleSummary();
                }
            }
        });
    }
}

(function ($) {
    "use strict";
    $(document).ready(function () {
        new BetterDocs(window?.betterdocsConfig);
    })
})(jQuery);
