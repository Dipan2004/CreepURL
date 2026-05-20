package generators

import (
	"fmt"
	"math/rand"
	"net/url"
	"strings"
	"time"
)

type CorruptionEngine struct {
	rng *rand.Rand
}

func NewCorruptionEngine() *CorruptionEngine {
	return &CorruptionEngine{
		rng: rand.New(rand.NewSource(time.Now().UnixNano())),
	}
}

var charMutations = map[rune][]string{
	'o': {"0", "0", "ø"},
	'e': {"3", "3", "€"},
	'l': {"1", "1", "!"},
	'a': {"4", "x", "@"},
	'i': {"1", "!", "¡"},
	's': {"5", "$", "z"},
	'g': {"9", "q", "6"},
}

var infraWords = []string{
	"relay", "cache", "packet", "frag", "sync", "node",
	"proxy", "shard", "edge", "buffer", "stream", "socket",
}

var corruptionWords = []string{
	"shadow", "loss", "void", "echo", "corrupt", "ghost",
	"null", "dead", "broken", "toxic", "decay", "breach",
}

var machineIDs = []string{
	"x77", "A9f", "xr09", "882", "v0id", "3rr", "nX4",
	"00F", "ph4", "zz7", "k3y", "r0t", "AA", "ff9",
}

var separators = []string{
	"__", "--", ".xr", "///", "~~", "-x-", "__x",
}

var fakeTLDs = []string{
	"packet", "echo", "sync", "void", "frag", "xr",
	"null", "relay", "ghost", "cache", "node", "breach",
}

var fakePaths = []string{
	"cacheloss", "packetloss", "nodevoid", "shadowfrag",
	"relaydown", "echofail", "syncerr", "bufferlost",
	"deadnode", "ghostpacket", "nullstream", "voidrelay",
}

func (e *CorruptionEngine) Generate(rawURL string, destructionLevel int) ([]string, error) {
	parsed, err := url.Parse(rawURL)
	if err != nil {
		return nil, fmt.Errorf("invalid URL: %w", err)
	}

	host := parsed.Hostname()
	if host == "" {
		host = rawURL
	}

	host = strings.TrimPrefix(host, "www.")
	domain := stripTLD(host)

	count := variantCount(destructionLevel)
	variants := make([]string, 0, count)
	seen := make(map[string]bool)

	for len(variants) < count {
		v := e.buildVariant(domain, destructionLevel)
		if !seen[v] {
			seen[v] = true
			variants = append(variants, v)
		}
	}

	return variants, nil
}

func (e *CorruptionEngine) buildVariant(domain string, level int) string {
	fragment := e.extractFragment(domain, level)
	mutated := e.mutateChars(fragment, level)
	withInfra := e.injectInfra(mutated, level)
	scheme := e.pickScheme()
	tld := e.pick(fakeTLDs)
	path := e.buildPath(level)

	switch e.rng.Intn(3) {
	case 0:
		sep := e.pick(separators)
		id := e.pick(machineIDs)
		return fmt.Sprintf("%s://%s%s%s.%s/%s", scheme, withInfra, sep, id, tld, path)
	case 1:
		infra := e.pick(infraWords)
		id := e.pick(machineIDs)
		return fmt.Sprintf("%s://%s-%s%s.%s/%s", scheme, withInfra, infra, id, tld, path)
	default:
		corrupt := e.pick(corruptionWords)
		sep := e.pick(separators)
		return fmt.Sprintf("%s://%s%s%s.%s/%s", scheme, withInfra, sep, corrupt, tld, path)
	}
}

func (e *CorruptionEngine) extractFragment(domain string, level int) string {
	if len(domain) == 0 {
		return "x"
	}

	maxLen := len(domain)
	switch level {
	case 1:
		maxLen = len(domain)
	case 2:
		maxLen = max(len(domain)*3/4, 2)
	case 3:
		maxLen = max(len(domain)/2, 2)
	case 4:
		maxLen = max(len(domain)/3, 1)
	case 5:
		maxLen = 1
	}

	return domain[:maxLen]
}

func (e *CorruptionEngine) mutateChars(s string, level int) string {
	if level == 1 {
		return s
	}

	var b strings.Builder
	mutationRate := float64(level) * 0.18

	for _, ch := range strings.ToLower(s) {
		if mutations, ok := charMutations[ch]; ok && e.rng.Float64() < mutationRate {
			b.WriteString(e.pick(mutations))
		} else {
			b.WriteRune(ch)
		}
	}

	return b.String()
}

func (e *CorruptionEngine) injectInfra(s string, level int) string {
	switch level {
	case 1:
		return s + "-" + e.pick(infraWords)[:3]
	case 2:
		return s + "-" + e.pick(infraWords)
	case 3:
		return e.pick(infraWords)[:2] + s + "-" + e.pick(corruptionWords)[:3]
	case 4:
		return e.pick(corruptionWords)[:2] + s + e.pick(separators) + e.pick(infraWords)
	case 5:
		return e.pick(corruptionWords)[:1] + "x" + s + e.pick(separators) + e.pick(infraWords)[:2] + e.pick(machineIDs)
	}
	return s
}

func (e *CorruptionEngine) buildPath(level int) string {
	base := e.pick(fakePaths)
	if level <= 2 {
		return base
	}
	if level == 3 {
		return e.pick(machineIDs) + "_" + base
	}
	if level == 4 {
		return e.pick(machineIDs) + "_" + base + e.pick(separators) + e.pick(corruptionWords)
	}
	return e.pick(machineIDs) + e.pick(separators) + base + e.pick(separators) + e.pick(corruptionWords) + e.pick(machineIDs)
}

func (e *CorruptionEngine) pickScheme() string {
	if e.rng.Float64() > 0.4 {
		return "https"
	}
	return "http"
}

func (e *CorruptionEngine) pick(items []string) string {
	return items[e.rng.Intn(len(items))]
}

func stripTLD(host string) string {
	parts := strings.Split(host, ".")
	if len(parts) > 1 {
		return parts[0]
	}
	return host
}

func variantCount(level int) int {
	switch level {
	case 1:
		return 3
	case 2:
		return 4
	case 3:
		return 5
	case 4:
		return 6
	case 5:
		return 7
	}
	return 4
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}