package generators

import (
	"fmt"
	"math/rand"
	"net/url"
	"strings"
	"time"
)

// SlugEngine builds long structured URL-safe slugs.
// Vars use slug* prefix to avoid collision with corruption.go declarations.

var slugInfraWords = []string{
	"relay", "cache", "packet", "frag", "sync", "node",
	"proxy", "shard", "edge", "buffer", "stream", "socket",
	"auth", "mirror", "bridge", "trunk", "route", "gateway",
	"cluster", "mesh", "vault", "beacon", "index", "origin",
}

var slugCorruptWords = []string{
	"shadow", "loss", "void", "echo", "null", "dead",
	"broken", "decay", "breach", "toxic", "ghost", "corrupt",
	"drain", "fault", "leak", "crash", "drop", "fail",
}

var slugMachineIDs = []string{
	"x77", "xr09", "882", "v0id", "nx4", "ff9",
	"r0t", "zz7", "ph4", "aa7", "3rr", "k3y",
	"rel4y", "c4che", "n0de", "fr4g", "s5nc", "pr0xy",
}

// slugCharMut is map[rune]string — single replacement, URL-safe only
var slugCharMut = map[rune]string{
	'o': "0", 'e': "3", 'l': "1", 'a': "4", 'i': "1",
}

type SlugEngine struct {
	rng *rand.Rand
}

func NewSlugEngine() *SlugEngine {
	return &SlugEngine{rng: rand.New(rand.NewSource(time.Now().UnixNano()))}
}

// GenerateSlug produces a long structured slug from the input URL.
func (e *SlugEngine) GenerateSlug(rawURL string, level int) (string, error) {
	host, err := slugExtractHost(rawURL)
	if err != nil {
		return "", err
	}
	domain := slugStripTLD(host)
	fragment := e.domainFragment(domain, level)
	return e.buildSlug(fragment, level), nil
}

func (e *SlugEngine) buildSlug(fragment string, level int) string {
	// 4 patterns — all produce 4–6 hyphen-separated structured segments
	// Feels like abandoned network infrastructure, not random noise
	var segments []string

	switch e.rng.Intn(4) {
	case 0:
		// relaycache-xr09-shadowfrag-g00gv0id
		segments = []string{
			e.slugInfra() + e.slugInfra(),
			e.slugID(level),
			e.slugCorrupt() + e.slugInfra(),
			e.slugMutate(fragment, level) + e.slugID(level),
		}
	case 1:
		// g00g-packetloss-xr09-nodecache-882
		segments = []string{
			e.slugMutate(fragment, level),
			e.slugInfra() + e.slugCorrupt(),
			e.slugID(level),
			e.slugInfra() + e.slugInfra(),
			e.slugID(level),
		}
	case 2:
		// shadowrelay-g00gnode-v0id-cachedecay
		segments = []string{
			e.slugCorrupt() + e.slugInfra(),
			e.slugMutate(fragment, level) + e.slugInfra(),
			e.slugID(level),
			e.slugInfra() + e.slugCorrupt(),
		}
	default:
		// relay-shadowfrag-g00g-xr09-nodedecay-882
		segments = []string{
			e.slugInfra(),
			e.slugCorrupt() + e.slugInfra(),
			e.slugMutate(fragment, level),
			e.slugID(level),
			e.slugInfra() + e.slugCorrupt(),
			e.slugID(level),
		}
	}

	return strings.Join(segments, "-")
}

func (e *SlugEngine) domainFragment(domain string, level int) string {
	if len(domain) == 0 {
		return "node"
	}
	maxLen := len(domain)
	switch level {
	case 2:
		maxLen = slugMax(len(domain)*3/4, 3)
	case 3:
		maxLen = slugMax(len(domain)/2, 3)
	case 4:
		maxLen = slugMax(len(domain)/3, 2)
	case 5:
		maxLen = slugMax(len(domain)/4, 1)
	}
	if maxLen > len(domain) {
		maxLen = len(domain)
	}
	return domain[:maxLen]
}

func (e *SlugEngine) slugMutate(s string, level int) string {
	if level == 1 {
		return s
	}
	rate := float64(level) * 0.2
	var b strings.Builder
	for _, ch := range strings.ToLower(s) {
		if m, ok := slugCharMut[ch]; ok && e.rng.Float64() < rate {
			b.WriteString(m) // m is string here — no type error
		} else {
			b.WriteRune(ch)
		}
	}
	return b.String()
}

func (e *SlugEngine) slugID(level int) string {
	id := e.slugPickFrom(slugMachineIDs)
	if level >= 4 && e.rng.Float64() < 0.4 {
		return id + e.slugPickFrom(slugMachineIDs)
	}
	return id
}

func (e *SlugEngine) slugInfra() string   { return e.slugPickFrom(slugInfraWords) }
func (e *SlugEngine) slugCorrupt() string { return e.slugPickFrom(slugCorruptWords) }

func (e *SlugEngine) slugPickFrom(items []string) string {
	return items[e.rng.Intn(len(items))]
}

func slugExtractHost(rawURL string) (string, error) {
	if !strings.HasPrefix(rawURL, "http://") && !strings.HasPrefix(rawURL, "https://") {
		rawURL = "https://" + rawURL
	}
	parsed, err := url.Parse(rawURL)
	if err != nil || parsed.Host == "" {
		return "", fmt.Errorf("invalid URL")
	}
	return strings.TrimPrefix(parsed.Hostname(), "www."), nil
}

func slugStripTLD(host string) string {
	parts := strings.Split(host, ".")
	if len(parts) > 1 {
		return parts[0]
	}
	return host
}

func slugMax(a, b int) int {
	if a > b {
		return a
	}
	return b
}