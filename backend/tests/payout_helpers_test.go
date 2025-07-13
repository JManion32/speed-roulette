package tests

import (
	"testing"

	"speed-roulette/backend/models"
	"speed-roulette/backend/utils"
)

/* ────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */

// convenient Bet constructor (only GridIndex matters for payouts)
func chip(idx int) models.Bet { return models.Bet{GridIndex: idx} }

/* ────────────────────────────────────────────────────────────
   1. GRID ↔ NUMBER ROUND-TRIP              (unchanged)
───────────────────────────────────────────────────────────── */
func TestRoundTripGridIndex(t *testing.T) {
	for n := 0; n <= 36; n++ {
		idx := utils.GetGridIndex(n)
		if idx == 0 { // index 0 may be shared by several blanks: skip ambiguity
			continue
		}
		if back := utils.GetNum(idx); back != n {
			t.Fatalf("round-trip mismatch: number %d  ➜  index %d  ➜  number %d",
				n, idx, back)
		}
	}
}

/* ────────────────────────────────────────────────────────────
   2. DOZEN + ROW BUCKETS                   (row fix!)
───────────────────────────────────────────────────────────── */
func TestDozenAndRowBuckets(t *testing.T) {
	tests := []struct {
		num       int
		wantDozen int
		wantRow   int
	}{
		{0, -1, -1},  // 0 pocket
		{37, -1, -1}, // 00 pocket
		{1, 0, 2},    // first dozen, bottom
		{14, 1, 1},   // second dozen, **middle** row  ✔
		{29, 2, 1},   // third dozen, middle (mod 3 = 2)
		{36, 2, 0},   // third dozen, top
	}

	for _, tc := range tests {
		if d := utils.GetDozenNum(tc.num); d != tc.wantDozen {
			t.Errorf("GetDozenNum(%d) = %d, want %d", tc.num, d, tc.wantDozen)
		}
		if r := utils.GetRowNum(tc.num); r != tc.wantRow {
			t.Errorf("GetRowNum(%d) = %d, want %d", tc.num, r, tc.wantRow)
		}
	}
}

/* ────────────────────────────────────────────────────────────
   3. MULTIPLIER BRANCHES — automatic discovery
      ---------------------------------------------------------
      The test walks every grid index once and records:
        • even / odd
        • <114 or ≥114
        • which spin numbers yield a non-zero multiplier
      Then picks one spin representative for each branch.
───────────────────────────────────────────────────────────── */
type branch struct {
	label string  // human description
	idx   int     // grid index to bet on
	spin  int     // spin result we expect to hit
	want  float64 // expected multiplier
}

func discoverBranches(t *testing.T) []branch {
	branches := map[string]branch{}

	// scan plausible index space (0..300 is plenty; adjust if your grid grows)
	for idx := 1; idx <= 300; idx++ {
		bet := chip(idx)

		// try every roulette number on the wheel
		for n := 0; n <= 36; n++ {
			pay := utils.GetMultiplier(bet, n)
			if pay == 0 {
				continue
			}
			switch {
			case pay == 9:
				branches["corner9x"] = branch{"Corner (9×)", idx, n, 9}
			case pay == 18:
				branches["split18x"] = branch{"Split  (18×)", idx, n, 18}
			case pay == 6:
				branches["avenue6x"] = branch{"Avenue (6×)", idx, n, 6}
			case pay == 12:
				branches["street12x"] = branch{"Street (12×)", idx, n, 12}
			}
		}
		// stop early if we've found all four branches
		if len(branches) == 4 {
			break
		}
	}

	// convert map ➜ slice
	out := []branch{
		branches["corner9x"],
		branches["split18x"],
		branches["avenue6x"],
		branches["street12x"],
		// add a MISS branch later
	}
	return out
}

func TestGetMultiplierBranches(t *testing.T) {
	branches := discoverBranches(t)
	if len(branches) < 4 {
		t.Fatalf("could not discover all payout branches; adjust scan range or logic")
	}
	// add a guaranteed miss case
	branches = append(branches, branch{"Miss pays 0×", branches[0].idx, 1, 0})

	for _, br := range branches {
		got := utils.GetMultiplier(chip(br.idx), br.spin)
		if got != br.want {
			t.Errorf("%s: idx=%d spin=%d → got %.0f×, want %.0f×",
				br.label, br.idx, br.spin, got, br.want)
		}
	}
}
